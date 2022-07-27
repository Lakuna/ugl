import { SCISSOR_TEST } from "../webgl/WebGLConstant.js";

/**
 * Resizes a canvas' drawing buffer to match its physical size.
 * @param canvas The canvas.
 * @returns Whether the drawing buffer was resized.
 */
export function resizeCanvasDisplay(canvas: HTMLCanvasElement): boolean {
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
 * Resizes a canvas' drawing buffer to match its physical size.
 * @param gl The rendering context to resize.
 * @returns Whether the drawing buffer was resized.
 */
function resizeContext(gl: WebGL2RenderingContext): boolean;

/**
 * Resizes a canvas' drawing buffer to match the given size, and sets the scissor box and viewport to the given area.
 * @param gl The rendering context to resize.
 * @param x The horizontal offset of the scissor box and viewport.
 * @param y The vertical offset of the scissor box and viewport.
 * @param width The horizontal size of the scissor box and viewport.
 * @param height The vertical size of the scissor box and viewport.
 */
function resizeContext(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): boolean;

function resizeContext(gl: WebGL2RenderingContext, x?: number, y?: number, width?: number, height?: number): boolean {
	const output: boolean = resizeCanvasDisplay(gl.canvas);

	if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
		gl.enable(SCISSOR_TEST);
		gl.viewport(x, y, width, height);
		gl.scissor(x, y, width, height);
	} else {
		gl.disable(SCISSOR_TEST);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}

	return output;
}

export default resizeContext;
