import BufferParent from "./BufferParent.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import getParameterForBufferTarget from "../../utility/internal/getParameterForBufferTarget.js";

/**
 * An array of binary data to be used as anything other than an element array buffer.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default class Buffer extends BufferParent {
	/**
	 * The currently-bound buffer cache.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<BufferTarget, WebGLBuffer | null>
	>;

	/**
	 * Get the buffer bindings cache.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Buffer.bindingsCache ??= new Map());
	}

	/**
	 * Get the buffer bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = Buffer.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache = bindingsCache.get(gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = new Map();
			bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the currently-bound buffer for a binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @returns The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static getBound(gl: WebGL2RenderingContext, target: BufferTarget) {
		// Get the context bindings cache.
		const contextBindingsCache = Buffer.getContextBindingsCache(gl);

		// Get the bound buffer.
		let boundBuffer = contextBindingsCache.get(target);
		if (typeof boundBuffer === "undefined") {
			boundBuffer = gl.getParameter(
				getParameterForBufferTarget(target)
			) as WebGLBuffer | null;
			contextBindingsCache.set(target, boundBuffer);
		}
		return boundBuffer;
	}

	/**
	 * Bind a buffer to a binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static bindGl(
		gl: WebGL2RenderingContext,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (Buffer.getBound(gl, target) === buffer) {
			return;
		}

		// Get the context bindings cache.
		const contextBindingsCache = Buffer.getContextBindingsCache(gl);

		// Unbind the buffer from all other targets.
		if (buffer !== null) {
			for (const [otherTarget, otherBuffer] of contextBindingsCache) {
				if (target === otherTarget || buffer !== otherBuffer) {
					continue;
				}

				gl.bindBuffer(otherTarget, null);
				contextBindingsCache.set(otherTarget, null);
			}
		}

		// Bind the buffer to the target.
		gl.bindBuffer(target, buffer);
		contextBindingsCache.set(target, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		target: BufferTarget,
		buffer?: WebGLBuffer
	) {
		// Do nothing if the buffer is already unbound.
		if (
			typeof buffer !== "undefined" &&
			Buffer.getBound(gl, target) !== buffer
		) {
			return;
		}

		// Unbind the buffer.
		Buffer.bindGl(gl, target, null);
	}

	/**
	 * Create a buffer to be used as anything other than an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the buffer at.
	 * @param isHalf - Whether or not the data contains half floats if it contains floats.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		data: ArrayBufferView | number,
		usage = BufferUsage.STATIC_DRAW,
		offset = 0,
		isHalf = false
	) {
		super(context, data, usage, offset, isHalf, BufferTarget.ARRAY_BUFFER);
	}

	/**
	 * Bind this buffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public override bind(target?: BufferTarget) {
		if (typeof target !== "undefined") {
			this.target = target;
		}

		Buffer.bindGl(this.gl, this.target, this.internal);
	}

	/**
	 * Unbind this buffer from its binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public override unbind() {
		Buffer.unbindGl(this.gl, this.target, this.internal);
	}
}
