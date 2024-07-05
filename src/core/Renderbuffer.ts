import { RENDERBUFFER, RENDERBUFFER_BINDING } from "#constants";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * An object that contains an image and is optimized as a rendering target.
 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
 */
export default class Renderbuffer extends ContextDependent {
	/**
	 * The currently-bound renderbuffer cache.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		WebGLRenderbuffer | null
	>;

	/**
	 * Get the renderbuffer bindings cache.
	 * @returns The renderbuffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Renderbuffer.bindingsCache ??= new Map());
	}

	/**
	 * Get the currently-bound renderbuffer.
	 * @param context - The rendering context.
	 * @returns The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public static getBound(context: Context) {
		// Get the full bindings cache.
		const bindingsCache = Renderbuffer.getBindingsCache();

		// Get the bound renderbuffer.
		let boundRenderbuffer = bindingsCache.get(context.gl);
		if (typeof boundRenderbuffer === "undefined") {
			boundRenderbuffer = context.gl.getParameter(
				RENDERBUFFER_BINDING
			) as WebGLRenderbuffer | null;
			bindingsCache.set(context.gl, boundRenderbuffer);
		}
		return boundRenderbuffer;
	}

	/**
	 * Bind a renderbuffer.
	 * @param context - The rendering context.
	 * @param renderbuffer - The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public static bindGl(
		context: Context,
		renderbuffer: WebGLRenderbuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (Renderbuffer.getBound(context) === renderbuffer) {
			return;
		}

		// Bind the renderbuffer to the target.
		context.gl.bindRenderbuffer(RENDERBUFFER, renderbuffer);
		Renderbuffer.getBindingsCache().set(context.gl, renderbuffer);
	}

	/**
	 * Unbind the renderbuffer that is bound.
	 * @param context - The rendering context.
	 * @param renderbuffer - The renderbuffer to unbind, or `undefined` to unbind any renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public static unbindGl(context: Context, renderbuffer?: WebGLRenderbuffer) {
		// Do nothing if the renderbuffer is already unbound.
		if (
			typeof renderbuffer !== "undefined" &&
			Renderbuffer.getBound(context) !== renderbuffer
		) {
			return;
		}

		// Unbind the renderbuffer.
		Renderbuffer.bindGl(context, null);
	}

	/**
	 * Create a renderbuffer.
	 * @param context - The rendering context.
	 * @see [`createRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createRenderbuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context) {
		super(context);

		const renderbuffer = this.gl.createRenderbuffer();
		if (renderbuffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = renderbuffer;
	}

	/**
	 * The API interface of this renderbuffer.
	 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
	 * @internal
	 */
	public readonly internal;

	/**
	 * Delete this renderbuffer.
	 * @see [`deleteRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteRenderbuffer)
	 */
	public delete() {
		this.gl.deleteRenderbuffer(this.internal);
	}

	/**
	 * Bind this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public bind() {
		Renderbuffer.bindGl(this.context, this.internal);
	}

	/**
	 * Unbind this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public unbind() {
		Renderbuffer.unbindGl(this.context, this.internal);
	}
}
