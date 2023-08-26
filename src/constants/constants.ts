/**
 * The active texture unit.
 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
 */
export const ACTIVE_TEXTURE = 0x84e0;

/**
 * The first texture unit.
 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
 */
export const TEXTURE0 = 0x84c0;

/**
 * The compilation status of a shader.
 * @see [`getShaderParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter)
 */
export const COMPILE_STATUS = 0x8b81;

/**
 * The linking status of a shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 */
export const LINK_STATUS = 0x8b82;

/**
 * A renderbuffer.
 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
 */
export const RENDERBUFFER = 0x8d41;

/**
 * The current blend color.
 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
 */
export const BLEND_COLOR = 0x8005;

/** The current RGB blend equation. */
export const BLEND_EQUATION_RGB = 0x8009;

/** The current alpha blend equation. */
export const BLEND_EQUATION_ALPHA = 0x883d;

/** The current source RGB blend function */
export const BLEND_SRC_RGB = 0x80c9;

/** The current destination RGB blend function */
export const BLEND_DST_RGB = 0x80c8;

/** The current source alpha blend function */
export const BLEND_SRC_ALPHA = 0x80cb;

/** The current destination alpha blend function */
export const BLEND_DST_ALPHA = 0x80ca;
