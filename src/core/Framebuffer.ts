import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type FramebufferTarget from "#FramebufferTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";

/**
 * A portion of contiguous memory that can be thought of as a collection of
 * attachments (buffers with purposes).
 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
 */
export default class Framebuffer extends ContextDependent {
	/**
	 * Unbinds the framebuffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 */
	public static unbind(context: Context, target: FramebufferTarget): void {
		// TODO: Do nothing if already unbound.
		(context as DangerousExposedContext).gl.bindFramebuffer(target, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param context The rendering context.
	 * @see [`createFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer)
	 */
	public constructor(context: Context) {
		super(context);

		const framebuffer: WebGLFramebuffer | null = this.gl.createFramebuffer();
		if (framebuffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = framebuffer;
	}

	/**
	 * The API interface of this framebuffer.
	 * @internal
	 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
	 */
	protected readonly internal: WebGLFramebuffer;

	/**
	 * Binds this framebuffer to the given binding point.
	 * @param target The binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 */
	public bind(target: FramebufferTarget): void {
		// TODO: Do nothing if already bound.
		this.gl.bindFramebuffer(target, this.internal);
	}
}
