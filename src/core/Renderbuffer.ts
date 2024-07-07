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
	 * @param gl - The rendering context.
	 * @returns The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public static getBound(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = Renderbuffer.getBindingsCache();

		// Get the bound renderbuffer.
		let boundRenderbuffer = bindingsCache.get(gl);
		if (typeof boundRenderbuffer === "undefined") {
			boundRenderbuffer = gl.getParameter(
				RENDERBUFFER_BINDING
			) as WebGLRenderbuffer | null;
			bindingsCache.set(gl, boundRenderbuffer);
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
		gl: WebGL2RenderingContext,
		renderbuffer: WebGLRenderbuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (Renderbuffer.getBound(gl) === renderbuffer) {
			return;
		}

		// Bind the renderbuffer to the target.
		gl.bindRenderbuffer(RENDERBUFFER, renderbuffer);
		Renderbuffer.getBindingsCache().set(gl, renderbuffer);
	}

	/**
	 * Unbind the renderbuffer that is bound.
	 * @param gl - The rendering context.
	 * @param renderbuffer - The renderbuffer to unbind, or `undefined` to unbind any renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		renderbuffer?: WebGLRenderbuffer
	) {
		// Do nothing if the renderbuffer is already unbound.
		if (
			typeof renderbuffer !== "undefined" &&
			Renderbuffer.getBound(gl) !== renderbuffer
		) {
			return;
		}

		// Unbind the renderbuffer.
		Renderbuffer.bindGl(gl, null);
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
		Renderbuffer.bindGl(this.gl, this.internal);
	}

	/**
	 * Unbind this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	public unbind() {
		Renderbuffer.unbindGl(this.gl, this.internal);
	}
}
