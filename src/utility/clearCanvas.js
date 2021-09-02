import { Color } from "./Color.js";
import { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT, STENCIL_BUFFER_BIT } from "../webgl/constants.js";

/**
 * Clears the canvas to a color.
 * @param {WebGLRenderingContext} gl - The rendering context to clear.
 * @param {Color} [color=new Color([0, 0, 0, 0])] - The color to clear the screen to.
 * @param {boolean} [clearColor=true] - Whether to clear the color buffer.
 * @param {boolean} [clearDepth=true] - Whether to clear the depth buffer.
 * @param {boolean} [clearStencil=true] - Whether to clear the stencil buffer.
 */
export const clearCanvas = (gl, color = new Color([0, 0, 0, 0]), clearColor = true, clearDepth = true, clearStencil = true) => {
	gl.clearColor(...color);
	gl.clear((clearColor ? COLOR_BUFFER_BIT : 0)
		| (clearDepth ? DEPTH_BUFFER_BIT : 0)
		| (clearStencil ? STENCIL_BUFFER_BIT : 0));
};