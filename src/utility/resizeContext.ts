import { SCISSOR_TEST } from "../webgl/WebGLConstant.js";

/**
 * Resizes a canvas' drawing buffer to match its physical size.
 * @param canvas The canvas.
 * @returns Whether the drawing buffer was resized.
 */
export function resizeCanvasBuffer(canvas: HTMLCanvasElement): boolean {
	// Physical size.
	const displayWidth: number = canvas.clientWidth;
	const displayHeight: number = canvas.clientHeight;

	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		canvas.width = displayWidth;
		canvas.height = displayHeight;

		return true;
	}

	return false;
}

/**
 * Resizes a viewport to match the size of its current drawing buffer.
 * @param gl The rendering context of the viewport and drawing buffer.
 */
export function resizeViewport(gl: WebGL2RenderingContext): void;

/**
 * Resizes a viewport to match the given size.
 * @param gl The rendering context of the viewport.
 * @param x The horizontal offset of the viewport.
 * @param y The vertical offset of the viewport.
 * @param width The horizontal size of the viewport.
 * @param height The vertical size of the viewport.
 */
export function resizeViewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;

export function resizeViewport(gl: WebGL2RenderingContext, x?: number, y?: number, width?: number, height?: number): void {
	if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
		gl.viewport(x, y, width, height);
	} else {
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}
}

/**
 * Disables the scissor test.
 * @param gl The rendering context of the scissor box and drawing buffer.
 */
export function resizeScissor(gl: WebGL2RenderingContext): void;

/**
 * Resizes a scissor box to match the given size and enables the scissor test.
 * @param gl The rendering context of the scissor box.
 * @param x The horizontal offset of the scissor box.
 * @param y The vertical offset of the scissor box.
 * @param width The horizontal size of the scissor box.
 * @param height The vertical size of the scissor box.
 */
export function resizeScissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;

export function resizeScissor(gl: WebGL2RenderingContext, x?: number, y?: number, width?: number, height?: number): void {
	if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
		gl.enable(SCISSOR_TEST);
		gl.scissor(x, y, width, height);
	} else {
		gl.disable(SCISSOR_TEST);
	}
}

/**
 * Resizes a canvas' drawing buffer to match its physical size, a viewport to match the drawing buffer, and disables the scissor test.
 * @param gl The rendering context of the canvas, viewport, and scissor box.
 * @returns Whether the drawing buffer was resized.
 */
function resizeContext(gl: WebGL2RenderingContext): boolean;

/**
 * Resizes a context's canvas' drawing buffer to match its physical size, the context's viewport and scissor box to match the given size, and enables the scissor test.
 * @param gl The rendering context of the canvas, viewport, and scissor box.
 * @param x The horizontal offset of the viewport and scissor box.
 * @param y The vertical offset of the viewport and scissor box.
 * @param width The horizontal size of the viewport and scissor box.
 * @param height The vertical size of the viewport and scissor box.
 * @returns Whether the drawing buffer was resized.
 */
function resizeContext(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): boolean;

function resizeContext(gl: WebGL2RenderingContext, x?: number, y?: number, width?: number, height?: number): boolean {
	const out: boolean = resizeCanvasBuffer(gl.canvas);

	if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
		resizeViewport(gl, x, y, width, height);
		resizeScissor(gl, x, y, width, height);
	} else {
		resizeViewport(gl);
		resizeScissor(gl);
	}

	return out;
}

export default resizeContext;
