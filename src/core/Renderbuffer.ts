import type RenderbufferFormat from "../constants/RenderbufferFormat.js";
import type Context from "./Context.js";

import { RENDERBUFFER, RENDERBUFFER_BINDING } from "../constants/constants.js";
import getExtensionForRenderbufferFormat from "../utility/internal/getExtensionForRenderbufferFormat.js";
import ContextDependent from "./internal/ContextDependent.js";

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
	private static readonly bindingsCache = new Map<
		WebGL2RenderingContext,
		null | WebGLRenderbuffer
	>();

	/** The format of this renderbuffer. */
	public readonly format: RenderbufferFormat;

	/** The height of this renderbuffer. */
	public readonly height: number;

	/**
	 * The API interface of this renderbuffer.
	 * @internal
	 */
	public readonly internal: WebGLRenderbuffer;

	/** The width of this renderbuffer. */
	public readonly width: number;

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
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
	 * Bind a renderbuffer.
	 * @param context - The rendering context.
	 * @param renderbuffer - The renderbuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer | bindRenderbuffer}
	 * @internal
	 */
	public static bindGl(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		context: Context,
		renderbuffer: null | WebGLRenderbuffer
	): void {
		// Do nothing if the binding is already correct.
		if (Renderbuffer.getBound(context) === renderbuffer) {
			return;
		}

		// Bind the renderbuffer to the target.
		context.gl.bindRenderbuffer(RENDERBUFFER, renderbuffer);
		Renderbuffer.bindingsCache.set(context.gl, renderbuffer);
	}

	/**
	 * Get the currently-bound renderbuffer.
	 * @param context - The rendering context.
	 * @returns The renderbuffer.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public static getBound(context: Context): null | WebGLRenderbuffer {
		return Renderbuffer.bindingsCache.getOrInsertComputed(context.gl, () => {
			const value: unknown =
				context.doPrefillCache ? null : (
					context.gl.getParameter(RENDERBUFFER_BINDING)
				);
			if (value !== null && !(value instanceof WebGLRenderbuffer)) {
				throw new Error(
					"An incorrectly-typed value was returned for `RENDERBUFFER_BINDING`."
				);
			}

			return value;
		});
	}

	/**
	 * Unbind the renderbuffer that is bound.
	 * @param context - The rendering context.
	 * @param renderbuffer - The renderbuffer to unbind, or `undefined` to unbind any renderbuffer.
	 * @internal
	 */
	public static unbindGl(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
	 * Bind this renderbuffer.
	 * @internal
	 */
	public bind(): void {
		Renderbuffer.bindGl(this.context, this.internal);
	}

	/**
	 * Delete this renderbuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteRenderbuffer | deleteRenderbuffer}
	 */
	public delete(): void {
		this.gl.deleteRenderbuffer(this.internal);
	}

	/**
	 * Unbind this renderbuffer.
	 * @internal
	 */
	public unbind(): void {
		Renderbuffer.unbindGl(this.context, this.internal);
	}
}
