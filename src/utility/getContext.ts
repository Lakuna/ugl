import Context from "../core/Context.js";

const canvasMap = new Map<HTMLCanvasElement | OffscreenCanvas, Context>();
const contextMap = new Map<WebGL2RenderingContext, Context>();

/**
 * Create a `Context` or get an existing `Context` if one already exists for the given rendering context. This is preferable to calling the `Context` constructor in cases where multiple `Context`s may be created for the same canvas (i.e. in a Next.js page).
 * @param gl - The rendering context.
 * @returns A rendering context.
 * @public
 */
export default function getContext(gl: WebGL2RenderingContext): Context;

/**
 * Create a `Context` or get an existing `Context` if one already exists for the given canvas. This is preferable to calling the `Context` constructor in cases where multiple `Context`s may be created for the same canvas (i.e. in a Next.js page).
 * @param canvas - The canvas of the rendering context.
 * @param options - The options to create the rendering context with if necessary.
 * @returns A rendering context.
 * @public
 */
export default function getContext(
	canvas: HTMLCanvasElement | OffscreenCanvas,
	options?: WebGLContextAttributes
): Context;

export default function getContext(
	source: HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext,
	options?: WebGLContextAttributes
): Context {
	const existingContext =
		source instanceof WebGL2RenderingContext
			? contextMap.get(source)
			: canvasMap.get(source);
	if (typeof existingContext !== "undefined") {
		return existingContext;
	}

	// Use `as` to cheat and reduce code size. Second argument is ignored if `source` is a `WebGL2RenderingContext`.
	const context = new Context(source as HTMLCanvasElement, options);
	canvasMap.set(context.canvas, context);
	contextMap.set(context.gl, context);
	return context;
}
