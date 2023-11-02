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

/**
 * The mask that specifies which components to enable or disable when
 * rendering to a framebuffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 * @internal
 */
export const COLOR_WRITEMASK = 0x0c23;

/**
 * The magnification filter for a texture.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const TEXTURE_MAG_FILTER = 0x2800;

/**
 * The minification filter for a texture.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const TEXTURE_MIN_FILTER = 0x2801;

/**
 * The wrapping mode for a texture on the S-axis.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const TEXTURE_WRAP_S = 0x2802;

/**
 * The wrapping mode for a texture on the T-axis.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const TEXTURE_WRAP_T = 0x2803;

/**
 * The number of texels to unpack at a time in each row of a texture.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const UNPACK_ALIGNMENT = 0x0cf5;

/**
 * The depth test.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const DEPTH_TEST = 0x0b71;

/**
 * The stencil test.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_TEST = 0x0b90;

/**
 * The scissor test.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SCISSOR_TEST = 0x0c11;

/**
 * Whether blending of the computed fragment color values is enabled.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const BLEND = 0x0be2;

/**
 * Whether polygons culling is enabled.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const CULL_FACE = 0x0b44;

/**
 * Whether color components are dithered before they get written to the color
 * buffer.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const DITHER = 0x0bd0;

/**
 * Whether an offset is added to depth values of polygons' fragments.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const POLYGON_OFFSET_FILL = 0x8037;

/**
 * Whether a temporary coverage value determined by the alpha value is
 * generated.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809e;

/**
 * Whether fragments' coverages are combined with the temporary coverage value.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SAMPLE_COVERAGE = 0x80a0;

/**
 * Whether primitives are discarded immediately before the rasterization stage.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const RASTERIZER_DISCARD = 0x8c89;

/**
 * The face direction that polygons will be culled in.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const CULL_FACE_MODE = 0x0b45;

/**
 * The depth comparison function in use.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const DEPTH_FUNC = 0x0b74;

/**
 * The polygon offset units.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const POLYGON_OFFSET_UNITS = 0x2a00;

/**
 * The polygon offset factor.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const POLYGON_OFFSET_FACTOR = 0x8038;

/**
 * The sample coverage value.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SAMPLE_COVERAGE_VALUE = 0x80aa;

/**
 * Whether the sample coverage is inverted.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SAMPLE_COVERAGE_INVERT = 0x80ab;

/**
 * The scissor box.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const SCISSOR_BOX = 0x0c10;

/**
 * The front stencil function.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_FUNC = 0x0b92;

/**
 * The front stencil reference value.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_REF = 0x0b97;

/**
 * The front stencil mask.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_VALUE_MASK = 0x0b93;

/**
 * The back stencil function.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_BACK_FUNC = 0x8800;

/**
 * The back stencil reference value.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_BACK_REF = 0x8ca3;

/**
 * The back stencil mask.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const STENCIL_BACK_VALUE_MASK = 0x8ca4;

/**
 * The winding orientation that is considered the front face of a polygon.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const FRONT_FACE = 0x0b46;

/**
 * The viewport box.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const VIEWPORT = 0x0ba2;

/**
 * The first color attachment.
 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
 */
export const COLOR_ATTACHMENT0 = 0x8ce0;

/**
 * The depth attachment.
 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
 */
export const DEPTH_ATTACHMENT = 0x8d00;

/**
 * The stencil attachment.
 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
 */
export const STENCIL_ATTACHMENT = 0x8d20;

/**
 * The depth and stencil attachment.
 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
 */
export const DEPTH_STENCIL_ATTACHMENT = 0x821a;

/**
 * Indicates that the back framebuffer (canvas) should be drawn to.
 * @see [`drawBuffers`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers)
 */
export const BACK = 0x0405;

/**
 * Indicates that no framebuffers should be drawn to.
 * @see [`drawBuffers`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers)
 */
export const NONE = 0;

/**
 * The validation status of a shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 */
export const VALIDATE_STATUS = 0x8b83;

/**
 * The number of active attributes in a shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 */
export const ACTIVE_ATTRIBUTES = 0x8b89;

/**
 * The number of active uniforms in a shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 */
export const ACTIVE_UNIFORMS = 0x8b86;

/**
 * The number of active varyings that are used for transform feedback in a
 * shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 */
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8c83;

/**
 * The deletion status of a shader or shader program.
 * @see [`getProgramParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter)
 * @see [`getShaderParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter)
 */
export const DELETE_STATUS = 0x8b80;

/**
 * The currently-bound vertex array object.
 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
 */
export const VERTEX_ARRAY_BINDING = 0x85b5;

/**
 * The desired maximum anisotropy of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @see [`EXT_texture_filter_anisotropic`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic)
 * @internal
 */
export const TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe;

/**
 * The maximum maximum anisotropy of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @see [`EXT_texture_filter_anisotropic`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic)
 * @internal
 */
export const MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff;

/**
 * The base mipmap level of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_BASE_LEVEL = 0x813c;

/**
 * The comparison function of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_COMPARE_FUNC = 0x884d;

/**
 * The comparison mode of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_COMPARE_MODE = 0x884c;

/**
 * The maximum mipmap level of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_MAX_LEVEL = 0x813d;

/**
 * The maximum level of detail of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_MAX_LOD = 0x813b;

/**
 * The minimum level of detail of a texture.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 * @internal
 */
export const TEXTURE_MIN_LOD = 0x813a;

/**
 * The wrapping mode for a texture on the R-axis.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
export const TEXTURE_WRAP_R = 0x8072;
