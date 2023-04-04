import type Color from "../utility/Color.js";

/** A canvas. */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/** The bit mask for the color buffer. */
export const COLOR_BUFFER_BIT = 0x00004000;

/** The bit mask for the depth buffer. */
export const DEPTH_BUFFER_BIT = 0x00000100;

/** The bit mask for the stencil buffer. */
export const STENCIL_BUFFER_BIT = 0x00000400;

/** The depth test. */
export const DEPTH_TEST = 0x0B71;

/** The stencil test. */
export const STENCIL_TEST = 0x0B90

/** The scissor test. */
export const SCISSOR_TEST = 0x0C11;

// For internal use for making a fullscreen canvas.
function recursiveFullscreen(element: HTMLElement): void {
	element.style.width = "100%";
	element.style.height = "100%";
	element.style.margin = "0px";
	element.style.padding = "0px";
	element.style.display = "block";

	if (element.parentElement) {
		recursiveFullscreen(element.parentElement);
	}
}

/** A WebGL2 rendering context. */
export default class Context {
	/**
	 * Creates a fullscreen rendering context. Destroys all other content in the DOM.
	 * @returns A fullscreen rendering context.
	 */
	public static makeFullscreen(): Context {
		if (typeof document == "undefined") {
			throw new Error("Cannot create a canvas in a headless environment.");
		}

		const canvas: HTMLCanvasElement = document.createElement("canvas");
		canvas.style.touchAction = "none";

		document.body = document.createElement("body");
		document.body.appendChild(canvas);

		recursiveFullscreen(canvas);

		return new Context(canvas);
	}

	/**
	 * Creates a rendering context.
	 * @param gl The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Creates a rendering context.
	 * @param canvas The canvas of the rendering context.
	 */
	public constructor(canvas: Canvas);

	public constructor(src: WebGL2RenderingContext | Canvas) {
		if (src instanceof WebGL2RenderingContext) {
			this.gl = src;
		} else {
			const gl: WebGL2RenderingContext | null = (src as HTMLCanvasElement).getContext("webgl2");
			if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
			this.gl = gl;
		}
	}

	/** This rendering context. */
	public readonly gl: WebGL2RenderingContext;

	/** The canvas of this rendering context. */
	public get canvas(): Canvas {
		return this.gl.canvas;
	}

	/**
	 * Clears the specified buffers to the specified values.
	 * @param gl The rendering context to clear.
	 * @param color The color to clear the color buffer to, if any.
	 * @param depth The value to clear the depth buffer to, if any.
	 * @param stencil The value to clear the stencil buffer to, if any.
	 */
	public clear(color?: Color | undefined, depth?: number | undefined, stencil?: number | undefined): void {
		let colorBit = 0;
		if (color) {
			this.gl.clearColor(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 0);
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = 0;
		if (typeof depth == "number") {
			this.gl.enable(DEPTH_TEST);
			this.gl.clearDepth(depth);
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = 0;
		if (typeof stencil == "number") {
			this.gl.enable(STENCIL_TEST);
			this.gl.clearStencil(stencil);
			stencilBit = STENCIL_BUFFER_BIT
		}

		this.gl.clear(colorBit | depthBit | stencilBit);
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size.
	 * @returns Whether the drawing buffer was resized.
	 */
	public fitBuffer(): boolean {
		if (this.canvas instanceof OffscreenCanvas) {
			return false;
		}

		// Physical size.
		const displayWidth: number = this.canvas.clientWidth;
		const displayHeight: number = this.canvas.clientHeight;

		if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;

			return true;
		}

		return false;
	}

	/** Resizes this context's viewport to match the size of its current drawing buffer. */
	public resizeViewport(): void;

	/**
	 * Resizes this context's viewport to match the given size.
	 * @param x The horizontal offset of the viewport.
	 * @param y The vertical offset of the viewport.
	 * @param width The horizontal size of the viewport.
	 * @param height The vertical size of the viewport.
	 */
	public resizeViewport(x: number, y: number, width: number, height: number): void;

	public resizeViewport(x?: number, y?: number, width?: number, height?: number): void {
		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.gl.viewport(x, y, width, height);
		} else {
			this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		}
	}

	/** * Disables the scissor test. */
	public resizeScissor(): void;

	/**
	 * Resizes this context's scissor box to match the given size and enables the scissor test.
	 * @param x The horizontal offset of the scissor box.
	 * @param y The vertical offset of the scissor box.
	 * @param width The horizontal size of the scissor box.
	 * @param height The vertical size of the scissor box.
	 */
	public resizeScissor(x: number, y: number, width: number, height: number): void;

	public resizeScissor(x?: number, y?: number, width?: number, height?: number): void {
		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.gl.enable(SCISSOR_TEST);
			this.gl.scissor(x, y, width, height);
		} else {
			this.gl.disable(SCISSOR_TEST);
		}
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, a viewport to match the drawing buffer, and disables the scissor test.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resizeContext(): boolean;

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, the context's viewport and scissor box to match the given size, and enables the scissor test.
	 * @param x The horizontal offset of the viewport and scissor box.
	 * @param y The vertical offset of the viewport and scissor box.
	 * @param width The horizontal size of the viewport and scissor box.
	 * @param height The vertical size of the viewport and scissor box.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resizeContext(x: number, y: number, width: number, height: number): boolean;

	public resizeContext(x?: number, y?: number, width?: number, height?: number): boolean {
		if (this.gl.canvas instanceof OffscreenCanvas) {
			throw new Error("Cannot resize an offscreen context.");
		}

		const out: boolean = this.fitBuffer();

		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.resizeViewport(x, y, width, height);
			this.resizeScissor(x, y, width, height);
		} else {
			this.resizeViewport();
			this.resizeScissor();
		}

		return out;
	}
}
