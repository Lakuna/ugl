import { RENDERBUFFER, RENDERBUFFER_BINDING } from "../constants/constants.js";
import Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import type RenderbufferFormat from "../constants/RenderbufferFormat.js";
import getExtensionForRenderbufferFormat from "../utility/internal/getExtensionForRenderbufferFormat.js";

/**
 * An object that contains an image and is optimized as a rendering target.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer | WebGLRenderbuffer}
 * @public
 */
export default class Renderbuffer extends ContextDependent {
	/**
	 * The currently-bound renderbuffer cache.
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
	 * @internal
	 */
	public static getBound(context: Context): WebGLRenderbuffer | null {
		// Get the full bindings cache.
		const bindingsCache = Renderbuffer.getBindingsCache();

		// Get the bound renderbuffer.
		let boundRenderbuffer = bindingsCache.get(context.gl);
		if (typeof boundRenderbuffer === "undefined") {
			boundRenderbuffer = context.doPrefillCache
				? null
				: (context.gl.getParameter(
						RENDERBUFFER_BINDING
					) as WebGLRenderbuffer | null);
			bindingsCache.set(context.gl, boundRenderbuffer);
		}

		return boundRenderbuffer;
	}

	/**
	 * Bind a renderbuffer.
	 * @param context - The rendering context.
	 * @param renderbuffer - The renderbuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer | bindRenderbuffer}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		renderbuffer: WebGLRenderbuffer | null
	): void {
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
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		renderbuffer?: WebGLRenderbuffer
	): void {
		// Do nothing if the renderbuffer is already unbound.
		if (renderbuffer && Renderbuffer.getBound(context) !== renderbuffer) {
			return;
		}

		// Unbind the renderbuffer.
		Renderbuffer.bindGl(context, null);
	}

	/**
	 * Create a renderbuffer.
	 * @param context - The rendering context.
	 * @param format - The format of the renderbuffer.
	 * @param width - The width of the renderbuffer.
	 * @param height - The height of the renderbuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createRenderbuffer | createRenderbuffer}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage | renderbufferStorage}
	 */
	public constructor(
		context: Context,
		format: RenderbufferFormat,
		width: number,
		height: number
	) {
		super(context);

		this.internal = this.gl.createRenderbuffer();

		// Enable the extension that is required for the given format, if any.
		const extension = getExtensionForRenderbufferFormat(format);
		if (extension) {
			this.context.enableExtension(extension);
		}

		this.bind();
		this.gl.renderbufferStorage(RENDERBUFFER, format, width, height);
		this.format = format;
		this.width = width;
		this.height = height;
	}

	/**
	 * The API interface of this renderbuffer.
	 * @internal
	 */
	public readonly internal: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	public readonly format: RenderbufferFormat;

	/** The width of this renderbuffer. */
	public readonly width: number;

	/** The height of this renderbuffer. */
	public readonly height: number;

	/**
	 * Delete this renderbuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteRenderbuffer | deleteRenderbuffer}
	 */
	public delete(): void {
		this.gl.deleteRenderbuffer(this.internal);
	}

	/**
	 * Bind this renderbuffer.
	 * @internal
	 */
	public bind(): void {
		Renderbuffer.bindGl(this.context, this.internal);
	}

	/**
	 * Unbind this renderbuffer.
	 * @internal
	 */
	public unbind(): void {
		Renderbuffer.unbindGl(this.context, this.internal);
	}
}
