/**
 * The active texture unit.
 * @internal
 */
export const ACTIVE_TEXTURE = 0x84e0;

/**
 * The first texture unit.
 * @internal
 */
export const TEXTURE0 = 0x84c0;

/**
 * The compilation status of a shader.
 * @internal
 */
export const COMPILE_STATUS = 0x8b81;

/**
 * The linking status of a shader program.
 * @internal
 */
export const LINK_STATUS = 0x8b82;

/**
 * A renderbuffer.
 * @internal
 */
export const RENDERBUFFER = 0x8d41;

/**
 * The current blend color.
 * @internal
 */
export const BLEND_COLOR = 0x8005;

/**
 * The current RGB blend equation.
 * @internal
 */
export const BLEND_EQUATION_RGB = 0x8009;

/**
 * The current alpha blend equation.
 * @internal
 */
export const BLEND_EQUATION_ALPHA = 0x883d;

/**
 * The current source RGB blend function.
 * @internal
 */
export const BLEND_SRC_RGB = 0x80c9;

/**
 * The current destination RGB blend function.
 * @internal
 */
export const BLEND_DST_RGB = 0x80c8;

/**
 * The current source alpha blend function.
 * @internal
 */
export const BLEND_SRC_ALPHA = 0x80cb;

/**
 * The current destination alpha blend function.
 * @internal
 */
export const BLEND_DST_ALPHA = 0x80ca;

/**
 * The currently-bound array buffer.
 * @internal
 */
export const ARRAY_BUFFER_BINDING = 0x8894;

/**
 * The currently-bound element array buffer.
 * @internal
 */
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;

/**
 * The currently-bound copy read buffer.
 * @internal
 */
export const COPY_READ_BUFFER_BINDING = 0x8f36;

/**
 * The currently-bound copy write buffer.
 * @internal
 */
export const COPY_WRITE_BUFFER_BINDING = 0x8f37;

/**
 * The currently-bound transform feedback buffer.
 * @internal
 */
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8c8f;

/**
 * The currently-bound uniform buffer.
 * @internal
 */
export const UNIFORM_BUFFER_BINDING = 0x8a28;

/**
 * The currently-bound pixel pack buffer.
 * @internal
 */
export const PIXEL_PACK_BUFFER_BINDING = 0x88ed;

/**
 * The currently-bound pixel unpack buffer.
 * @internal
 */
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88ef;

/**
 * The currently-bound 2D texture.
 * @internal
 */
export const TEXTURE_BINDING_2D = 0x8069;

/**
 * The currently-bound cubemap texture.
 * @internal
 */
export const TEXTURE_BINDING_CUBE_MAP = 0x8514;

/**
 * The currently-bound 3D texture.
 * @internal
 */
export const TEXTURE_BINDING_3D = 0x806a;

/**
 * The currently-bound 2D array texture.
 * @internal
 */
export const TEXTURE_BINDING_2D_ARRAY = 0x8c1d;

/**
 * The currently-bound framebuffer.
 * @internal
 */
export const FRAMEBUFFER_BINDING = 0x8ca6;

/**
 * The currently-bound draw framebuffer.
 * @internal
 */
export const DRAW_FRAMEBUFFER_BINDING = 0x8ca6;

/**
 * The currently-bound read framebuffer.
 * @internal
 */
export const READ_FRAMEBUFFER_BINDING = 0x8caa;

/**
 * The currently-bound renderbuffer.
 * @internal
 */
export const RENDERBUFFER_BINDING = 0x8ca7;

/**
 * The current value to clear the color buffer to.
 * @internal
 */
export const COLOR_CLEAR_VALUE = 0x0c22;

/**
 * The current value to clear the depth buffer to.
 * @internal
 */
export const DEPTH_CLEAR_VALUE = 0x0b73;

/**
 * The current value to clear the stencil buffer to.
 * @internal
 */
export const STENCIL_CLEAR_VALUE = 0x0b91;

/**
 * Used to clear the color buffer.
 * @internal
 */
export const COLOR_BUFFER_BIT = 0x00004000;

/**
 * Used to clear the depth buffer.
 * @internal
 */
export const DEPTH_BUFFER_BIT = 0x00000100;

/**
 * Whether or not the depth write mask is enabled.
 * @internal
 */
export const DEPTH_WRITEMASK = 0x0b72;

/**
 * Used to clear the stencil buffer.
 * @internal
 */
export const STENCIL_BUFFER_BIT = 0x00000400;

/**
 * The mask that specifies which components to enable or disable when rendering to a framebuffer.
 * @internal
 */
export const COLOR_WRITEMASK = 0x0c23;

/**
 * The magnification filter for a texture.
 * @internal
 */
export const TEXTURE_MAG_FILTER = 0x2800;

/**
 * The minification filter for a texture.
 * @internal
 */
export const TEXTURE_MIN_FILTER = 0x2801;

/**
 * The wrapping mode for a texture on the S-axis.
 * @internal
 */
export const TEXTURE_WRAP_S = 0x2802;

/**
 * The wrapping mode for a texture on the T-axis.
 * @internal
 */
export const TEXTURE_WRAP_T = 0x2803;

/**
 * The number of texels to unpack at a time in each row of a texture.
 * @internal
 */
export const UNPACK_ALIGNMENT = 0x0cf5;

/**
 * The number of texels to pack at a time in each row of a texture.
 * @internal
 */
export const PACK_ALIGNMENT = 0x0d05;

/**
 * The depth test.
 * @internal
 */
export const DEPTH_TEST = 0x0b71;

/**
 * The stencil test.
 * @internal
 */
export const STENCIL_TEST = 0x0b90;

/**
 * The scissor test.
 * @internal
 */
export const SCISSOR_TEST = 0x0c11;

/**
 * Whether or not blending of the computed fragment color values is enabled.
 * @internal
 */
export const BLEND = 0x0be2;

/**
 * Whether or not polygon culling is enabled.
 * @internal
 */
export const CULL_FACE = 0x0b44;

/**
 * Whether or not color components are dithered before they get written to the color buffer.
 * @internal
 */
export const DITHER = 0x0bd0;

/**
 * Whether or not an offset is added to depth values of polygons' fragments.
 * @internal
 */
export const POLYGON_OFFSET_FILL = 0x8037;

/**
 * Whether or not a temporary coverage value determined by the alpha value is generated.
 * @internal
 */
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809e;

/**
 * Whether or not fragments' coverages are combined with the temporary coverage value.
 * @internal
 */
export const SAMPLE_COVERAGE = 0x80a0;

/**
 * Whether or not primitives are discarded immediately before the rasterization stage.
 * @internal
 */
export const RASTERIZER_DISCARD = 0x8c89;

/**
 * The face direction that polygons will be culled in.
 * @internal
 */
export const CULL_FACE_MODE = 0x0b45;

/**
 * The depth comparison function in use.
 * @internal
 */
export const DEPTH_FUNC = 0x0b74;

/**
 * The current depth range.
 * @internal
 */
export const DEPTH_RANGE = 0x0b70;

/**
 * The polygon offset units.
 * @internal
 */
export const POLYGON_OFFSET_UNITS = 0x2a00;

/**
 * The polygon offset factor.
 * @internal
 */
export const POLYGON_OFFSET_FACTOR = 0x8038;

/**
 * The sample coverage value.
 * @internal
 */
export const SAMPLE_COVERAGE_VALUE = 0x80aa;

/**
 * Whether or not the sample coverage is inverted.
 * @internal
 */
export const SAMPLE_COVERAGE_INVERT = 0x80ab;

/**
 * The scissor box.
 * @internal
 */
export const SCISSOR_BOX = 0x0c10;

/**
 * The front stencil function.
 * @internal
 */
export const STENCIL_FUNC = 0x0b92;

/**
 * The front stencil reference value.
 * @internal
 */
export const STENCIL_REF = 0x0b97;

/**
 * The front stencil mask.
 * @internal
 */
export const STENCIL_VALUE_MASK = 0x0b93;

/**
 * The back stencil function.
 * @internal
 */
export const STENCIL_BACK_FUNC = 0x8800;

/**
 * The back stencil reference value.
 * @internal
 */
export const STENCIL_BACK_REF = 0x8ca3;

/**
 * The back stencil mask.
 * @internal
 */
export const STENCIL_BACK_VALUE_MASK = 0x8ca4;

/**
 * The rotational orientation that is considered the front face of a polygon.
 * @internal
 */
export const FRONT_FACE = 0x0b46;

/**
 * The viewport box.
 * @internal
 */
export const VIEWPORT = 0x0ba2;

/**
 * The first color attachment.
 * @internal
 */
export const COLOR_ATTACHMENT0 = 0x8ce0;

/**
 * The depth attachment.
 * @internal
 */
export const DEPTH_ATTACHMENT = 0x8d00;

/**
 * The stencil attachment.
 * @internal
 */
export const STENCIL_ATTACHMENT = 0x8d20;

/**
 * The depth and stencil attachment.
 * @internal
 */
export const DEPTH_STENCIL_ATTACHMENT = 0x821a;

/**
 * Indicates which color buffer should be read from.
 * @internal
 */
export const READ_BUFFER = 0x0c02;

/**
 * Indicates the first color buffer that should be written to.
 * @internal
 */
export const DRAW_BUFFER0 = 0x8825;

/**
 * Indicates the maximum usable number of draw buffers.
 * @internal
 */
export const MAX_DRAW_BUFFERS = 0x8824;

/**
 * The maximum allowed time in nanoseconds for a sync object to wait on the client.
 * @internal
 */
export const MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 0x9247;

/**
 * Indicates that the back framebuffer (canvas) should be drawn to.
 * @internal
 */
export const BACK = 0x0405;

/**
 * Indicates that no framebuffers should be drawn to.
 * @internal
 */
export const NONE = 0;

/**
 * The validation status of a shader program.
 * @internal
 */
export const VALIDATE_STATUS = 0x8b83;

/**
 * The number of active attributes in a shader program.
 * @internal
 */
export const ACTIVE_ATTRIBUTES = 0x8b89;

/**
 * The number of active uniforms in a shader program.
 * @internal
 */
export const ACTIVE_UNIFORMS = 0x8b86;

/**
 * The number of active varyings that are used for transform feedback in a shader program.
 * @internal
 */
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8c83;

/**
 * The deletion status of a shader or shader program.
 * @internal
 */
export const DELETE_STATUS = 0x8b80;

/**
 * The currently-bound vertex array object.
 * @internal
 */
export const VERTEX_ARRAY_BINDING = 0x85b5;

/**
 * Transform feedback.
 * @internal
 */
export const TRANSFORM_FEEDBACK = 0x8e22;

/**
 * The currently-bound transform feedback.
 * @internal
 */
export const TRANSFORM_FEEDBACK_BINDING = 0x8e25;

/**
 * The currently-bound program.
 * @internal
 */
export const CURRENT_PROGRAM = 0x8b8d;

/**
 * The desired maximum anisotropy of a texture.
 * @internal
 */
export const TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe;

/**
 * The maximum maximum anisotropy of a texture.
 * @internal
 */
export const MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff;

/**
 * The base mipmap level of a texture.
 * @internal
 */
export const TEXTURE_BASE_LEVEL = 0x813c;

/**
 * The comparison function of a texture.
 * @internal
 */
export const TEXTURE_COMPARE_FUNC = 0x884d;

/**
 * The comparison mode of a texture.
 * @internal
 */
export const TEXTURE_COMPARE_MODE = 0x884c;

/**
 * The maximum mipmap level of a texture.
 * @internal
 */
export const TEXTURE_MAX_LEVEL = 0x813d;

/**
 * The maximum level of detail of a texture.
 * @internal
 */
export const TEXTURE_MAX_LOD = 0x813b;

/**
 * The minimum level of detail of a texture.
 * @internal
 */
export const TEXTURE_MIN_LOD = 0x813a;

/**
 * The wrapping mode for a texture on the R-axis.
 * @internal
 */
export const TEXTURE_WRAP_R = 0x8072;

/**
 * The maximum number of texture units that can be used.
 * @internal
 */
export const MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d;

/**
 * The maximum dimensions of the viewport.
 * @internal
 */
export const MAX_VIEWPORT_DIMS = 0x0d3a;

/**
 * The type of a shader.
 * @internal
 */
export const SHADER_TYPE = 0x8b4f;

/**
 * The number of shaders that are attached to a shader program.
 * @internal
 */
export const ATTACHED_SHADERS = 0x8b85;

/**
 * The usage of a buffer.
 * @internal
 */
export const BUFFER_USAGE = 0x8765;

/**
 * The size of a buffer.
 * @internal
 */
export const BUFFER_SIZE = 0x8764;

/**
 * The texture data format to use for reading pixel data.
 * @internal
 */
export const IMPLEMENTATION_COLOR_READ_FORMAT = 0x8b9b;

/**
 * The texture data type to use for reading pixel data.
 * @internal
 */
export const IMPLEMENTATION_COLOR_READ_TYPE = 0x8b9a;

/**
 * Wait until GPU commands are synced.
 * @internal
 */
export const SYNC_GPU_COMMANDS_COMPLETE = 0x9117;

/**
 * Whether or not to flush commands while client waiting for a sync object.
 * @internal
 */
export const SYNC_FLUSH_COMMANDS_BIT = 0x00000001;

/**
 * Ignore a sync object's timeout.
 * @internal
 */
export const TIMEOUT_IGNORED = -1;

/**
 * The type of a sync object.
 * @internal
 */
export const OBJECT_TYPE = 0x9112;

/**
 * The condition of a sync object.
 * @internal
 */
export const SYNC_CONDITION = 0x9113;

/**
 * The status of a sync object.
 * @internal
 */
export const SYNC_STATUS = 0x9114;

/**
 * The flags of a sync object.
 * @internal
 */
export const SYNC_FLAGS = 0x9115;

/**
 * A fence sync object.
 * @internal
 */
export const SYNC_FENCE = 0x9116;

/**
 * Default color space conversion or no color space conversion.
 * @internal
 */
export const UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

/**
 * The object type of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8cd0;

/**
 * The object of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8cd1;

/**
 * The mipmap level of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8cd2;

/**
 * The cubemap face of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8cd3;

/**
 * The number of bits in the alpha component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 0x8215;

/**
 * The number of bits in the blue component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 0x8214;

/**
 * The encoding of components of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 0x8210;

/**
 * The format of components of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 0x8211;

/**
 * The number of bits in the depth component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 0x8216;

/**
 * The number of bits in the green component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 0x8213;

/**
 * The number of bits in the red component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_RED_SIZE = 0x8212;

/**
 * The number of bits in the stencil component of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 0x8217;

/**
 * The number of the texture layer which contains the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0x8cd4;

/**
 * The framebuffer color encoding of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 0x8210;

/**
 * The number of views of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR = 0x9630;

/**
 * The base view index of the framebuffer attachment.
 * @internal
 */
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR = 0x9632;

/**
 * The maximum number of views. Most VR headsets have two views, but some have 4 (which is currently the maximum number of views supported by multiview).
 * @internal
 */
export const MAX_VIEWS_OVR = 0x9631;

/**
 * Get the compressed texture formats.
 * @internal
 */
export const COMPRESSED_TEXTURE_FORMATS = 0x86a3;

/**
 * Hint for the quality of filtering when generating mipmap images.
 * @internal
 */
export const GENERATE_MIPMAP_HINT = 0x8192;

/**
 * Stencil back fail.
 * @internal
 */
export const STENCIL_BACK_FAIL = 0x8801;

/**
 * Stencil back pass depth fail.
 * @internal
 */
export const STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;

/**
 * Stencil back pass depth pass.
 * @internal
 */
export const STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;

/**
 * Get the current stencil fail function.
 * @internal
 */
export const STENCIL_FAIL = 0x0b94;

/**
 * Get the current stencil fail function should the depth buffer test fail.
 * @internal
 */
export const STENCIL_PASS_DEPTH_FAIL = 0x0b95;

/**
 * Get the current stencil fail function should the depth buffer test pass.
 * @internal
 */
export const STENCIL_PASS_DEPTH_PASS = 0x0b96;

/**
 * The accuracy of the derivative calculation for the GLSL built-in functions `dFdx`, `dFdy`, and `fwidth`.
 * @internal
 */
export const FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8b8b;

/**
 * The buffer mode when transform feedback is active.
 * @internal
 */
export const TRANSFORM_FEEDBACK_BUFFER_MODE = 0x8c7f;

/**
 * The internal format of the currently-bound renderbuffer.
 * @internal
 */
export const RENDERBUFFER_INTERNAL_FORMAT = 0x8d44;

/**
 * Vertex attribute array type.
 * @internal
 */
export const VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;

/**
 * Uniform type.
 * @internal
 */
export const UNIFORM_TYPE = 0x8a37;

/**
 * All of the varyings will be written to the same buffer, interleaved in the specified order.
 * @public
 */
export const INTERLEAVED_ATTRIBS = 0x8c8c;

/**
 * Each varying will be written to a different buffer.
 * @public
 */
export const SEPARATE_ATTRIBS = 0x8c8d;
