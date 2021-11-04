import { Color, WebGLConstant } from "../index";

/**
 * Clears a rendering context to a color.
 * @param color - The color to clear the canvas to.
 * @param clearColor - Whether to clear the color buffer.
 * @param clearDepth - Whether to clear the depth buffer.
 * @param clearStencil - Whether to clear the stencil buffer.
 */
export function clearContext(
	gl: WebGL2RenderingContext,
	color: Color = new Color([0, 0, 0, 0]),
	clearColor = true,
	clearDepth = true,
	clearStencil = true): void {
	gl.clearColor(color.r, color.g, color.b, color.a);
	gl.clear(
		(clearColor ? WebGLConstant.COLOR_BUFFER_BIT : 0)
		| (clearDepth ? WebGLConstant.DEPTH_BUFFER_BIT : 0)
		| (clearStencil ? WebGLConstant.STENCIL_BUFFER_BIT : 0));
}