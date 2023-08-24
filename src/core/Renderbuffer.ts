import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import { RENDERBUFFER } from "#constants";
import type { DangerousExposedContext } from "#DangerousExposedContext";

/**
 * An object that contains an image and is optimized as a rendering target.
 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
 */
export default class Renderbuffer extends ContextDependent {
	/**
	 * Unbinds the renderbuffer that is bound.
	 * @param context The rendering context.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 */
	public static unbind(context: Context): void {
		// TODO: Do nothing if already unbound.
		(context as DangerousExposedContext).gl.bindRenderbuffer(
			RENDERBUFFER,
			null
		);
	}

	/**
	 * Creates a renderbuffer.
	 * @param context The rendering context.
	 * @see [`createRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createRenderbuffer)
	 */
	public constructor(context: Context) {
		super(context);

		const renderbuffer: WebGLRenderbuffer | null = this.gl.createRenderbuffer();
		if (renderbuffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = renderbuffer;
	}

	/**
	 * The API interface of this renderbuffer.
	 * @internal
	 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
	 */
	protected readonly internal: WebGLRenderbuffer;

	/**
	 * Binds this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 */
	public bind(): void {
		// TODO: Do nothing if already bound.
		this.gl.bindRenderbuffer(RENDERBUFFER, this.internal);
	}
}
