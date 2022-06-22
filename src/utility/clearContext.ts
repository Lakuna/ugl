import { Color } from "./Color.js";

const COLOR_BUFFER_BIT = 0x00004000;
const DEPTH_BUFFER_BIT = 0x00000100;
const STENCIL_BUFFER_BIT = 0x00000400;

/**
 * Clears the specified buffers to the specified values.
 * @param gl The rendering context to clear.
 * @param color The color to clear the color buffer to, if any.
 * @param depth The value to clear the depth buffer to, if any.
 * @param stencil The value to clear the stencil buffer to, if any.
 */
export function clearContext(gl: WebGL2RenderingContext, color: Color | undefined, depth: number | undefined, stencil: number | undefined): void {
  let colorBit = 0;
  if (color) {
    gl.clearColor(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 0);
    colorBit = COLOR_BUFFER_BIT;
  }

  let depthBit = 0;
  if (typeof depth == "number") {
    gl.clearDepth(depth);
    depthBit = DEPTH_BUFFER_BIT;
  }

  let stencilBit = 0;
  if (typeof stencil == "number") {
    gl.clearStencil(stencil);
    stencilBit = STENCIL_BUFFER_BIT
  }

  gl.clear(colorBit | depthBit | stencilBit);
}
