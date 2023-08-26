import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type BufferTarget from "#BufferTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";
import getParameterForBufferTarget from "#getParameterForBufferTarget";

/**
 * An array of binary data.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default class Buffer extends ContextDependent {
	/**
	 * The currently-bound buffer cache.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private static boundBuffersCache?: Map<
		Context,
		Map<BufferTarget, WebGLBuffer | null>
	>;

	/**
	 * Gets the currently-bound buffer for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @returns The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private static getBoundBuffer(
		context: Context,
		target: BufferTarget
	): WebGLBuffer | null {
		if (typeof this.boundBuffersCache == "undefined") {
			this.boundBuffersCache = new Map();
		}
		if (!this.boundBuffersCache.has(context)) {
			this.boundBuffersCache.set(context, new Map());
		}
		const contextMap: Map<BufferTarget, WebGLBuffer | null> =
			this.boundBuffersCache.get(context)!;
		if (!contextMap.has(target)) {
			contextMap.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForBufferTarget(target)
				)
			);
		}
		return contextMap.get(target)!;
	}

	/**
	 * Unbinds the buffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 */
	public static unbind(context: Context, target: BufferTarget): void {
		if (Buffer.getBoundBuffer(context, target) == null) {
			return;
		}
		(context as DangerousExposedContext).gl.bindBuffer(target, null);
		context.throwIfError();
		Buffer.boundBuffersCache!.get(context)!.set(target, null);
	}

	/**
	 * Creates a buffer.
	 * @param context The rendering context.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 */
	public constructor(context: Context) {
		super(context);

		const buffer: WebGLBuffer | null = this.gl.createBuffer();
		if (buffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = buffer;
	}

	/**
	 * The API interface of this buffer.
	 * @internal
	 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
	 */
	protected readonly internal: WebGLBuffer;

	/**
	 * Binds this buffer to the given binding point.
	 * @param target The binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 */
	public bind(target: BufferTarget): void {
		if (Buffer.getBoundBuffer(this.context, target) == this.internal) {
			return;
		}
		this.gl.bindBuffer(target, this.internal);
		this.context.throwIfError();
		Buffer.boundBuffersCache!.get(this.context)!.set(target, this.internal);
	}
}
