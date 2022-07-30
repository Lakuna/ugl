import type Color from "./Color.js";
import { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT, STENCIL_BUFFER_BIT, DEPTH_TEST, STENCIL_TEST } from "../webgl/WebGLConstant.js";

/**
 * Clears the specified buffers to the specified values.
 * @param gl The rendering context to clear.
 * @param color The color to clear the color buffer to, if any.
 * @param depth The value to clear the depth buffer to, if any.
 * @param stencil The value to clear the stencil buffer to, if any.
 */
function clearContext(gl: WebGL2RenderingContext, color: Color | undefined, depth: number | undefined, stencil: number | undefined): void {
	let colorBit = 0;
	if (color) {
		gl.clearColor(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 0);
		colorBit = COLOR_BUFFER_BIT;
	}

	let depthBit = 0;
	if (typeof depth == "number") {
		gl.enable(DEPTH_TEST);
		gl.clearDepth(depth);
		depthBit = DEPTH_BUFFER_BIT;
	}

	let stencilBit = 0;
	if (typeof stencil == "number") {
		gl.enable(STENCIL_TEST);
		gl.clearStencil(stencil);
		stencilBit = STENCIL_BUFFER_BIT
	}

	gl.clear(colorBit | depthBit | stencilBit);
}

export default clearContext;
