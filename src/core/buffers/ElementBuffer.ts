import BadValueError from "../../utility/BadValueError.js";
import Buffer from "./Buffer.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import Context from "../Context.js";
import { ELEMENT_ARRAY_BUFFER_BINDING } from "../../constants/constants.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import VertexArray from "../VertexArray.js";
import getSizeOfDataType from "../../utility/internal/getSizeOfDataType.js";
import getTypedArrayConstructorForDataType from "../../utility/internal/getTypedArrayConstructorForTextureDataType.js";

/**
 * An array of binary data to be used as an element buffer object. Must contain unsigned integers.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default class ElementBuffer extends Buffer<
	Uint8Array | Uint16Array | Uint32Array
> {
	/**
	 * The currently-bound element array buffer cache.
	 * @internal
	 */
	private static bindingsCache = new Map<
		WebGLVertexArrayObject | null,
		WebGLBuffer | null
	>();

	/**
	 * Get the currently-bound buffer for a VAO.
	 * @param context - The rendering context.
	 * @param vao - The VAO.
	 * @returns The buffer.
	 * @internal
	 */
	public static getBound(
		context: Context,
		vao: WebGLVertexArrayObject | null
	): WebGLBuffer | null {
		// Get the bound buffer.
		let boundBuffer = ElementBuffer.bindingsCache.get(vao);
		if (typeof boundBuffer === "undefined") {
			if (context.doPrefillCache) {
				boundBuffer = null;
			} else {
				VertexArray.bindGl(context, vao);
				boundBuffer = context.gl.getParameter(
					ELEMENT_ARRAY_BUFFER_BINDING
				) as WebGLBuffer | null;
			}

			ElementBuffer.bindingsCache.set(vao, boundBuffer);
		}

		return boundBuffer;
	}

	/**
	 * Bind an element array buffer to a VAO.
	 * @param context - The rendering context.
	 * @param vao - The VAO.
	 * @param buffer - The buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer | bindBuffer}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		vao: WebGLVertexArrayObject | null,
		buffer: WebGLBuffer | null
	): void {
		// Do nothing if the binding is already correct.
		if (ElementBuffer.getBound(context, vao) === buffer) {
			// Ensure that the EBO is actually the currently-bound EBO before returning.
			if (
				ElementBuffer.getBound(context, VertexArray.getBound(context)) !==
				buffer
			) {
				VertexArray.bindGl(context, vao);
			}

			return;
		}

		// Bind the VAO.
		VertexArray.bindGl(context, vao);

		// Bind the buffer to the target.
		context.gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, buffer);
		ElementBuffer.bindingsCache.set(vao, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given VAO.
	 * @param context - The rendering context.
	 * @param vao - The VAO.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		vao: WebGLVertexArrayObject | null,
		buffer?: WebGLBuffer
	): void {
		// Do nothing if the buffer is already unbound.
		if (buffer && ElementBuffer.getBound(context, vao) !== buffer) {
			return;
		}

		// Unbind the buffer.
		ElementBuffer.bindGl(context, vao, null);
	}

	/**
	 * Create a buffer to be used as an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the initial data at.
	 * @param length - The length of the initial data to read into the buffer.
	 * @throws {@link UnsupportedOperationError} if a buffer cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 */
	public constructor(
		context: Context,
		data?: Uint8Array | Uint16Array | Uint32Array | number,
		usage?: BufferUsage,
		offset?: number,
		length?: number
	) {
		// Ensure that the indices for a VAO aren't overwritten. Overwriting the indices of the default VAO is fine since μGL doesn't support using the default VAO anyway.
		VertexArray.unbindGl(context);

		super(
			context,
			data,
			usage,
			offset,
			length,
			false,
			BufferTarget.ELEMENT_ARRAY_BUFFER
		);
	}

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	public override get target(): BufferTarget.ELEMENT_ARRAY_BUFFER {
		if (super.target !== BufferTarget.ELEMENT_ARRAY_BUFFER) {
			throw new BadValueError(
				"The target binding point of an element buffer object can only be `ELEMENT_ARRAY_BUFFER`."
			);
		}

		return super.target;
	}

	/** @internal */
	public override set target(_) {
		void this;

		throw new BadValueError(
			"The target binding point of an element buffer object can only be `ELEMENT_ARRAY_BUFFER`."
		);
	}

	/**
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public get data(): Readonly<Uint8Array | Uint16Array | Uint32Array> {
		// Cache case.
		if (this.dataCache && this.isCacheValid) {
			return this.dataCache;
		}

		// Create a new typed array to store the data cache if it has been resized.
		if (!this.dataCache || this.dataCache.byteLength !== this.size) {
			this.dataCache = new (getTypedArrayConstructorForDataType(this.type))(
				this.size / getSizeOfDataType(this.type)
			) as unknown as Uint8Array | Uint16Array | Uint32Array;
		}

		// Element buffer objects can't be copied through vertex buffers.
		// TODO: Test if it works anyway.
		if (
			![
				BufferUsage.DYNAMIC_READ,
				BufferUsage.STATIC_READ,
				BufferUsage.STREAM_READ
			].includes(this.usage)
		) {
			throw new UnsupportedOperationError(
				"Reading from an element buffer object without a readable usage pattern can incur pipeline stalls."
			);
		}

		// Reading from a buffer without checking for previous command completion likely causes pipeline stalls.
		this.context.sync(); // TODO: `finish` works, `fenceSync` doesn't appear to.

		// Read the buffer data into a typed array.
		this.bind();
		this.gl.getBufferSubData(this.target, 0, this.dataCache);

		return this.dataCache;
	}

	public set data(value) {
		this.setData(value);
	}

	/**
	 * Bind this buffer to a VAO.
	 * @param vao - The new VAO to bind to, or `undefined` to bind to the default VAO.
	 * @internal
	 */
	public override bind(vao?: VertexArray | null): void {
		ElementBuffer.bindGl(this.context, vao?.internal ?? null, this.internal);
	}

	/**
	 * Unbind this buffer from a VAO.
	 * @param vao - The VAO to unbind from, or `undefined` to unbind from the default VAO.
	 * @internal
	 */
	public override unbind(vao?: VertexArray | null): void {
		ElementBuffer.unbindGl(this.context, vao?.internal ?? null, this.internal);
	}
}
