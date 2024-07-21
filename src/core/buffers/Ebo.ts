import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import { ELEMENT_ARRAY_BUFFER_BINDING } from "../../constants/constants.js";
import GlBuffer from "./GlBuffer.js";
import Vao from "../Vao.js";

/**
 * An array of binary data to be used as an element buffer object. Must contain unsigned integers.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default class Ebo extends GlBuffer {
	/**
	 * The currently-bound element array buffer cache.
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGLVertexArrayObject | null,
		WebGLBuffer | null
	>;

	/**
	 * Get the element array buffer bindings cache.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Ebo.bindingsCache ??= new Map());
	}

	/**
	 * Get the currently-bound buffer for a VAO.
	 * @param gl - The rendering context.
	 * @param vao - The VAO.
	 * @returns The buffer.
	 * @internal
	 */
	public static getBound(
		gl: WebGL2RenderingContext,
		vao: WebGLVertexArrayObject | null
	) {
		// Get the buffer bindings cache.
		const bindingsCache = Ebo.getBindingsCache();

		// Get the bound buffer.
		let boundBuffer = bindingsCache.get(vao);
		if (typeof boundBuffer === "undefined") {
			Vao.bindGl(gl, vao);
			boundBuffer = gl.getParameter(
				ELEMENT_ARRAY_BUFFER_BINDING
			) as WebGLBuffer | null;
			bindingsCache.set(vao, boundBuffer);
		}
		return boundBuffer;
	}

	/**
	 * Bind an element array buffer to a VAO.
	 * @param gl - The rendering context.
	 * @param vao - The VAO.
	 * @param buffer - The buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer | bindBuffer}
	 * @internal
	 */
	public static bindGl(
		gl: WebGL2RenderingContext,
		vao: WebGLVertexArrayObject | null,
		buffer: WebGLBuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (Ebo.getBound(gl, vao) === buffer) {
			return;
		}

		// Bind the VAO.
		Vao.bindGl(gl, vao);

		// Bind the buffer to the target.
		gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, buffer);
		Ebo.getBindingsCache().set(vao, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given VAO.
	 * @param gl - The rendering context.
	 * @param vao - The VAO.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		vao: WebGLVertexArrayObject | null,
		buffer?: WebGLBuffer
	) {
		// Do nothing if the buffer is already unbound.
		if (typeof buffer !== "undefined" && Ebo.getBound(gl, vao) !== buffer) {
			return;
		}

		// Unbind the buffer.
		Ebo.bindGl(gl, vao, null);
	}

	/**
	 * Create a buffer to be used as an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the buffer at.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 */
	public constructor(
		context: Context,
		data: Uint8Array | Uint16Array | Uint32Array | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0
	) {
		// Ensure that the indices for a VAO aren't overwritten. Overwriting the indices of the default VAO is fine since μGL doesn't support using the default VAO anyway.
		Vao.unbindGl(context.gl);

		super(
			context,
			data,
			usage,
			offset,
			false,
			BufferTarget.ELEMENT_ARRAY_BUFFER
		);
	}

	/**
	 * Bind this buffer to a VAO.
	 * @param vao - The new VAO to bind to. or `undefined` to bind to the currently-bound VAO.
	 * @internal
	 */
	public override bind(vao?: Vao) {
		Ebo.bindGl(this.gl, vao?.internal ?? Vao.getBound(this.gl), this.internal);
	}

	/**
	 * Unbind this buffer from a VAO.
	 * @param vao - The VAO to unbind from, or `undefined` to unbind from the currently-bound VAO.
	 * @internal
	 */
	public override unbind(vao?: Vao) {
		Ebo.unbindGl(
			this.gl,
			vao?.internal ?? Vao.getBound(this.gl),
			this.internal
		);
	}
}
