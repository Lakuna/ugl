import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type BufferTarget from "#BufferTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";

/**
 * An array of binary data.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default class Buffer extends ContextDependent {
	/**
	 * Unbinds the buffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 */
	public static unbind(context: Context, target: BufferTarget): void {
		// TODO: Do nothing if already unbound.
		(context as DangerousExposedContext).gl.bindBuffer(target, null);
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
		// TODO: Do nothing if already bound.
		// TODO: Ensure that the buffer does not already have a different target.
		// TODO: Ensure that the buffer is not marked for deletion.
		this.gl.bindBuffer(target, this.internal);
	}
}
