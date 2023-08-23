/** The currently-bound 2D texture. */
export const TEXTURE_BINDING_2D = 0x8069;

/** The currently-bound cubemap texture. */
export const TEXTURE_BINDING_CUBE_MAP = 0x8514;

/** The currently-bound 3D texture. */
export const TEXTURE_BINDING_3D = 0x806a;

/** The currently-bound 2D array texture. */
export const TEXTURE_BINDING_2D_ARRAY = 0x8c1d;

/** The first texture unit. */
export const TEXTURE0 = 0x84c0;

/** The magnification filter for a texture. */
export const TEXTURE_MAG_FILTER = 0x2800;

/** The minification filter for a texture. */
export const TEXTURE_MIN_FILTER = 0x2801;

/** The wrapping mode for a texture on the S axis. */
export const TEXTURE_WRAP_S = 0x2802;

/** The wrapping mode for a texture on the T axis. */
export const TEXTURE_WRAP_T = 0x2803;

/** The number of texels to unpack at a time in each row of a texture. */
export const UNPACK_ALIGNMENT = 0x0cf5;

/** The currently-bound array buffer. */
export const ARRAY_BUFFER_BINDING = 0x8894;

/** The currently-bound element array buffer. */
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;

/** The currently-bound copy read buffer. */
export const COPY_READ_BUFFER_BINDING = 0x8f36;

/** The currently-bound copy write buffer. */
export const COPY_WRITE_BUFFER_BINDING = 0x8f37;

/** The currently-bound transform feedback buffer. */
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8c8f;

/** The currently-bound uniform buffer. */
export const UNIFORM_BUFFER_BINDING = 0x8a28;

/** The currently-bound pixel pack buffer. */
export const PIXEL_PACK_BUFFER_BINDING = 0x88ed;

/** The currently-bound pixel unpack buffer. */
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88ef;

/** The bit mask for the color buffer. */
export const COLOR_BUFFER_BIT = 0x00004000;

/** The bit mask for the depth buffer. */
export const DEPTH_BUFFER_BIT = 0x00000100;

/** The bit mask for the stencil buffer. */
export const STENCIL_BUFFER_BIT = 0x00000400;

/** The depth test. */
export const DEPTH_TEST = 0x0b71;

/** The stencil test. */
export const STENCIL_TEST = 0x0b90;

/** The scissor test. */
export const SCISSOR_TEST = 0x0c11;

/** Whether blending of the computed fragment color values is enabled. */
export const BLEND = 0x0be2;

/** Whether polygons are culled. */
export const CULL_FACE = 0x0b44;

/**
 * Whether color components are dithered before they get written to the color
 * buffer.
 */
export const DITHER = 0x0bd0;

/** Whether an offset is added to depth values of polygons' fragments. */
export const POLYGON_OFFSET_FILL = 0x8037;

/**
 * Whether a temporary coverage value determined by the alpha value is
 * generated.
 */
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809e;

/**
 * Whether fragments' coverages are combined with the temporary coverage value.
 */
export const SAMPLE_COVERAGE = 0x80a0;

/**
 * Whether primitives are discarded immediately before the rasterization stage.
 */
export const RASTERIZER_DISCARD = 0x8c89;

/** The blend function for source RGB values. */
export const BLEND_SRC_RGB = 0x80c9;

/** The blend function for source alpha values. */
export const BLEND_SRC_ALPHA = 0x80cb;

/** The blend function for destination RGB values. */
export const BLEND_DST_RGB = 0x80c8;

/** The blend function for destination alpha values. */
export const BLEND_DST_ALPHA = 0x80ca;

/** The face direction that polygons will be culled in. */
export const CULL_FACE_MODE = 0x0b45;

/** The depth comparison function in use. */
export const DEPTH_FUNC = 0x0b74;

/** The polygon offset units. */
export const POLYGON_OFFSET_UNITS = 0x2a00;

/** The polygon offset factor. */
export const POLYGON_OFFSET_FACTOR = 0x8038;

/** The sample coverage value. */
export const SAMPLE_COVERAGE_VALUE = 0x80aa;

/** Whether the sample coverage is inverted. */
export const SAMPLE_COVERAGE_INVERT = 0x80ab;

/** The scissor box. */
export const SCISSOR_BOX = 0x0c10;

/** The front stencil function. */
export const STENCIL_FUNC = 0x0b92;

/** The front stencil reference value. */
export const STENCIL_REF = 0x0b97;

/** The front stencil mask. */
export const STENCIL_VALUE_MASK = 0x0b93;

/** The back stencil function. */
export const STENCIL_BACK_FUNC = 0x8800;

/** The back stencil reference value. */
export const STENCIL_BACK_REF = 0x8ca3;

/** The back stencil mask. */
export const STENCIL_BACK_VALUE_MASK = 0x8ca4;

/** The winding orientation that is considered the front face of a polygon. */
export const FRONT_FACE = 0x0b46;

/** The viewport box. */
export const VIEWPORT = 0x0ba2;

/** The currently-bound framebuffer. */
export const FRAMEBUFFER_BINDING = 0x8ca6;

/** The currently-bound draw framebuffer. */
export const DRAW_FRAMEBUFFER_BINDING = 0x8ca6;

/** The currently-bound read framebuffer. */
export const READ_FRAMEBUFFER_BINDING = 0x8caa;

/** The first color attachment. */
export const COLOR_ATTACHMENT0 = 0x8ce0;

/** The depth attachment. */
export const DEPTH_ATTACHMENT = 0x8d00;

/** The stencil attachment. */
export const STENCIL_ATTACHMENT = 0x8d20;

/** The depth and stencil attachment. */
export const DEPTH_STENCIL_ATTACHMENT = 0x821a;

/** Indicates that the back framebuffer (canvas) should be drawn to. */
export const BACK = 0x0405;

/** Indicates that no framebuffers should be drawn to. */
export const NONE = 0;

/** The linking status of a shader program. */
export const LINK_STATUS = 0x8b82;

/** The validation status of a shader program. */
export const VALIDATE_STATUS = 0x8b83;

/** The number of active attributes in a shader program. */
export const ACTIVE_ATTRIBUTES = 0x8b89;

/** The number of active uniforms in a shader program. */
export const ACTIVE_UNIFORMS = 0x8b86;

/**
 * The number of active varyings that are used for transform feedback in a
 * shader program.
 */
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8c83;

/** A renderbuffer. */
export const RENDERBUFFER = 0x8d41;

/** The currently-bound renderbuffer. */
export const RENDERBUFFER_BINDING = 0x8ca7;

/** The deletion status of a shader or shader program. */
export const DELETE_STATUS = 0x8b80;

/** The compilation status of a shader. */
export const COMPILE_STATUS = 0x8b81;

/** The currently-bound vertex array object. */
export const VERTEX_ARRAY_BINDING = 0x85b5;
