/**
 * The active texture unit.
 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
 * @internal
 */
export const ACTIVE_TEXTURE = 0x84e0;

/**
 * The first texture unit.
 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
 * @internal
 */
export const TEXTURE0 = 0x84c0;

/**
 * The compilation status of a shader.
 * @see [`getShaderParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter)
 * @internal
 */
export const COMPILE_STATUS = 0x8b81;

/**
 * The linking status of a shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 * @internal
 */
export const LINK_STATUS = 0x8b82;

/**
 * A renderbuffer.
 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
 * @internal
 */
export const RENDERBUFFER = 0x8d41;

/**
 * The current blend color.
 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
 * @internal
 */
export const BLEND_COLOR = 0x8005;

/**
 * The current RGB blend equation.
 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
 * @internal
 */
export const BLEND_EQUATION_RGB = 0x8009;

/**
 * The current alpha blend equation.
 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
 * @internal
 */
export const BLEND_EQUATION_ALPHA = 0x883d;

/**
 * The current source RGB blend function.
 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
 * @internal
 */
export const BLEND_SRC_RGB = 0x80c9;

/**
 * The current destination RGB blend function.
 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
 * @internal
 */
export const BLEND_DST_RGB = 0x80c8;

/**
 * The current source alpha blend function.
 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
 * @internal
 */
export const BLEND_SRC_ALPHA = 0x80cb;

/**
 * The current destination alpha blend function.
 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
 * @internal
 */
export const BLEND_DST_ALPHA = 0x80ca;

/**
 * The currently-bound array buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const ARRAY_BUFFER_BINDING = 0x8894;

/**
 * The currently-bound element array buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;

/**
 * The currently-bound copy read buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const COPY_READ_BUFFER_BINDING = 0x8f36;

/**
 * The currently-bound copy write buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const COPY_WRITE_BUFFER_BINDING = 0x8f37;

/**
 * The currently-bound transform feedback buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8c8f;

/**
 * The currently-bound uniform buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const UNIFORM_BUFFER_BINDING = 0x8a28;

/**
 * The currently-bound pixel pack buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const PIXEL_PACK_BUFFER_BINDING = 0x88ed;

/**
 * The currently-bound pixel unpack buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88ef;

/**
 * The currently-bound 2D texture.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const TEXTURE_BINDING_2D = 0x8069;

/**
 * The currently-bound cubemap texture.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const TEXTURE_BINDING_CUBE_MAP = 0x8514;

/**
 * The currently-bound 3D texture.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const TEXTURE_BINDING_3D = 0x806a;

/**
 * The currently-bound 2D array texture.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const TEXTURE_BINDING_2D_ARRAY = 0x8c1d;

/**
 * The currently-bound framebuffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const FRAMEBUFFER_BINDING = 0x8ca6;

/**
 * The currently-bound draw framebuffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const DRAW_FRAMEBUFFER_BINDING = 0x8ca6;

/**
 * The currently-bound read framebuffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const READ_FRAMEBUFFER_BINDING = 0x8caa;

/**
 * The currently-bound renderbuffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const RENDERBUFFER_BINDING = 0x8ca7;

/**
 * The current value to clear the color buffer to.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const COLOR_CLEAR_VALUE = 0x0c22;

/**
 * The current value to clear the depth buffer to.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const DEPTH_CLEAR_VALUE = 0x0b73;

/**
 * The current value to clear the stencil buffer to.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const STENCIL_CLEAR_VALUE = 0x0b91;

/**
 * Used to clear the color buffer.
 * @see [`clear`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
 * @internal
 */
export const COLOR_BUFFER_BIT = 0x00004000;

/**
 * Used to clear the depth buffer.
 * @see [`clear`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
 * @internal
 */
export const DEPTH_BUFFER_BIT = 0x00000100;

/**
 * Used to clear the stencil buffer.
 * @see [`clear`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
 * @internal
 */
export const STENCIL_BUFFER_BIT = 0x00000400;
