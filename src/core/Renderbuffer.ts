import { RENDERBUFFER, RENDERBUFFER_BINDING } from "../constants/constants.js";
import type Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import type RenderbufferFormat from "../constants/RenderbufferFormat.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";

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
	 * @param format - The format of the renderbuffer.
	 * @param width - The width of the renderbuffer.
	 * @param height - The height of the renderbuffer.
	 * @see [`createRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createRenderbuffer)
	 * @see [`renderbufferStorage`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		format: RenderbufferFormat,
		width: number,
		height: number
	) {
		super(context);

		const renderbuffer = this.gl.createRenderbuffer();
		if (renderbuffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = renderbuffer;

		this.bind();
		this.gl.renderbufferStorage(RENDERBUFFER, format, width, height);
		this.format = format;
		this.width = width;
		this.height = height;
	}

	/**
	 * The API interface of this renderbuffer.
	 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
	 * @internal
	 */
	public readonly internal;

	/**
	 * The format of this renderbuffer.
	 * @see [`renderbufferStorage`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage)
	 */
	public readonly format;

	/** The width of this renderbuffer. */
	public readonly width;

	/** The height of this renderbuffer. */
	public readonly height;

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
