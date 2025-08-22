import Buffer from "./Buffer.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import Context from "../Context.js";
import DataType from "../../constants/DataType.js";
import { ELEMENT_ARRAY_BUFFER_BINDING } from "../../constants/constants.js";
import Sync from "../Sync.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import VertexArray from "../VertexArray.js";
import getDataTypeForTypedArray from "../../utility/internal/getDataTypeForTypedArray.js";
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
		data: Uint8Array | Uint16Array | Uint32Array | number = 0,
		usage?: BufferUsage,
		offset?: number,
		length?: number
	) {
		// Ensure that the indices for a VAO aren't overwritten. Overwriting the indices of the default VAO is fine since μGL doesn't support using the default VAO anyway.
		VertexArray.unbindGl(context);
		super(context);
		this.setData(data, usage, offset, length);
	}

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	// eslint-disable-next-line class-methods-use-this
	public override get target(): BufferTarget.ELEMENT_ARRAY_BUFFER {
		return BufferTarget.ELEMENT_ARRAY_BUFFER;
	}

	/**
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public get data(): Uint8Array | Uint16Array | Uint32Array {
		// Cache case.
		if (this.dataCache && this.isCacheValid) {
			return this.dataCache;
		}

		// Create a new typed array to store the data cache if it has been resized.
		if (!this.dataCache || this.dataCache.byteLength !== this.size) {
			this.dataCache = new (getTypedArrayConstructorForDataType(this.type))(
				this.size / getSizeOfDataType(this.type)
			) as Uint8Array | Uint16Array | Uint32Array;
		}

		// Element buffer objects can't be copied through vertex buffers.
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
		this.context.finish(); // Use `finish` rather than `fenceSync` to make this synchronous. In general, it's better to use the asynchronous version.

		// Read the buffer data into a typed array.
		this.bind();
		this.gl.getBufferSubData(this.target, 0, this.dataCache);

		return this.dataCache;
	}

	public set data(value: Uint8Array | Uint16Array | Uint32Array) {
		this.setData(value);
	}

	/**
	 * Get the data contained in this buffer.
	 * @returns The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public async getData(): Promise<Uint8Array | Uint16Array | Uint32Array> {
		// Cache case.
		if (this.dataCache && this.isCacheValid) {
			return this.dataCache;
		}

		// Create a new typed array to store the data cache if it has been resized.
		if (!this.dataCache || this.dataCache.byteLength !== this.size) {
			this.dataCache = new (getTypedArrayConstructorForDataType(this.type))(
				this.size / getSizeOfDataType(this.type)
			) as Uint8Array | Uint16Array | Uint32Array;
		}

		// Element buffer objects can't be copied through vertex buffers.
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
		const sync = new Sync(this.context);
		await sync.clientWaitUntil();
		sync.delete();

		// Read the buffer data into a typed array.
		this.bind();
		this.gl.getBufferSubData(this.target, 0, this.dataCache);

		return this.dataCache;
	}

	public override setData(
		data: number | Uint8Array | Uint16Array | Uint32Array,
		usage?: BufferUsage,
		srcOffset?: number,
		length?: number,
		dstOffset?: number
	): void {
		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		const realUsage = usage ?? this.usage;
		this.bind();

		// Set size of buffer (empty data).
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, realUsage);
			this.dataCache = new Uint8Array(data) as Uint8Array;
			this.typeCache = DataType.UNSIGNED_BYTE;
			this.sizeCache = data;
			this.usageCache = realUsage;
			this.isCacheValid = true;
			return;
		}

		// Update a portion of the buffer.
		if (typeof dstOffset === "number") {
			this.gl.bufferSubData(
				this.target,
				dstOffset,
				data,
				srcOffset ?? 0,
				length
			);
			this.isCacheValid = false;
			return;
		}

		// Replace the data in the buffer.
		this.gl.bufferData(this.target, data, realUsage, srcOffset ?? 0, length);
		this.isCacheValid = false; // Don't save a reference to the given array buffer in case the user modifies it for other reasons.
		this.typeCache = getDataTypeForTypedArray(data);
		this.sizeCache = data.byteLength;
		this.usageCache = realUsage;
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
