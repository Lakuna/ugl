import Buffer from "./Buffer.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import Context from "../Context.js";
import getParameterForBufferTarget from "../../utility/internal/getParameterForBufferTarget.js";

/**
 * An array of binary data to be used as a vertex buffer object. Must contain unsigned integers.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default class VertexBuffer extends Buffer<ArrayBufferView> {
	/**
	 * The currently-bound buffer cache.
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
		return (VertexBuffer.bindingsCache ??= new Map());
	}

	/**
	 * Get the buffer bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = VertexBuffer.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache = bindingsCache.get(gl);
		if (!contextBindingsCache) {
			contextBindingsCache = new Map();
			bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the currently-bound buffer for a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @returns The buffer.
	 * @internal
	 */
	public static getBound(context: Context, target: BufferTarget) {
		// Get the context bindings cache.
		const contextBindingsCache = VertexBuffer.getContextBindingsCache(
			context.gl
		);

		// Get the bound buffer.
		let boundBuffer = contextBindingsCache.get(target);
		if (typeof boundBuffer === "undefined") {
			boundBuffer = context.doPrefillCache
				? null
				: (context.gl.getParameter(
						getParameterForBufferTarget(target)
					) as WebGLBuffer | null);
			contextBindingsCache.set(target, boundBuffer);
		}

		return boundBuffer;
	}

	/**
	 * Bind a buffer to a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer | bindBuffer}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (VertexBuffer.getBound(context, target) === buffer) {
			return;
		}

		// Get the context bindings cache.
		const contextBindingsCache = VertexBuffer.getContextBindingsCache(
			context.gl
		);

		// Unbind the buffer from all other targets.
		if (buffer) {
			for (const [otherTarget, otherBuffer] of contextBindingsCache) {
				if (target === otherTarget || buffer !== otherBuffer) {
					continue;
				}

				context.gl.bindBuffer(otherTarget, null);
				contextBindingsCache.set(otherTarget, null);
			}
		}

		// Bind the buffer to the target.
		context.gl.bindBuffer(target, buffer);
		contextBindingsCache.set(target, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		target: BufferTarget,
		buffer?: WebGLBuffer
	) {
		// Do nothing if the buffer is already unbound.
		if (buffer && VertexBuffer.getBound(context, target) !== buffer) {
			return;
		}

		// Unbind the buffer.
		VertexBuffer.bindGl(context, target, null);
	}

	/**
	 * Create a buffer to be used as anything other than an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the initial data at.
	 * @param length - The length of the initial data to read into the buffer.
	 * @param isHalf - Whether or not the data contains half floats if it contains floats.
	 * @throws {@link UnsupportedOperationError} if a buffer cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 */
	public constructor(
		context: Context,
		data: ArrayBufferView | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset: number | undefined = void 0,
		length: number | undefined = void 0,
		isHalf = false
	) {
		super(
			context,
			data,
			usage,
			offset,
			length,
			isHalf,
			BufferTarget.ARRAY_BUFFER
		);
	}

	/**
	 * Bind this buffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @internal
	 */
	public override bind(target?: BufferTarget) {
		if (target) {
			this.target = target;
		}

		VertexBuffer.bindGl(this.context, this.target, this.internal);
	}

	/**
	 * Unbind this buffer from its binding point.
	 * @internal
	 */
	public override unbind() {
		VertexBuffer.unbindGl(this.context, this.target, this.internal);
	}
}
