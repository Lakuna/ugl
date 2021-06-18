// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

/*
Clearing buffers

Constants passed to WebGLRenderingContext.clear() to clear buffer masks.
*/
export const DEPTH_BUFFER_BIT = 0x00000100;
export const STENCIL_BUFFER_BIT = 0x00000400;
export const COLOR_BUFFER_BIT = 0x00004000;

/*
Rendering primitives

Constants passed to WebGLRenderingContext.drawElements() or WebGLRenderingContext.drawArrays() to specify what kind of primitive to
render.
*/
export const POINTS = 0x0000;
export const LINES = 0x0001;
export const LINE_LOOP = 0x0002;
export const LINE_STRIP = 0x0003;
export const TRIANGLES = 0x0004;
export const TRIANGLE_STRIP = 0x0005;
export const TRIANGLE_FAN = 0x0006;

/*
Blending modes

Constants passed to WebGLRenderingContext.blendFunc() or WebGLRenderingContext.blendFuncSeparate() to specify the blending mode (for
both, RBG and alpha, or separately).
*/
export const ZERO = 0;
export const ONE = 1;
export const SRC_COLOR = 0x0300;
export const ONE_MINUS_SRC_COLOR = 0x0301;
export const SRC_ALPHA = 0x0302;
export const ONE_MINUS_SRC_ALPHA = 0x0303;
export const DST_ALPHA = 0x0304;
export const ONE_MINUS_DST_ALPHA = 0x0305;
export const DST_COLOR = 0x0306;
export const ONE_MINUS_DST_COLOR = 0x0307;
export const SRC_ALPHA_SATURATE = 0x0308;
export const CONSTANT_COLOR = 0x8001;
export const ONE_MINUS_CONSTANT_COLOR = 0x8002;
export const CONSTANT_ALPHA = 0x8003;
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004;

/*
Blending equations

Constants passed to WebGLRenderingContext.blendEquation() or WebGLRenderingContext.blendEquationSeparate() to control how the blending
is calculated (for both, RBG and alpha, or separately).
*/
export const FUNC_ADD = 0x8006;
export const FUNC_SUBTRACT = 0x800a;
export const FUNC_REVERSE_SUBTRACT = 0x800b;

/*
Getting GL parameter information.

Constants passed to WebGLRenderingContext.getParameter() to specify what information to return.
*/
export const BLEND_EQUATION = 0x8009;
export const BLEND_EQUATION_RGB = 0x8009; // Same as BLEND_EQUATION.
export const BLEND_EQUATION_ALPHA = 0x883d;
export const BLEND_DST_RGB = 0x80c8;
export const BLEND_SRC_RGB = 0x80c9;
export const BLEND_DST_ALPHA = 0x80ca;
export const BLEND_SRC_ALPHA = 0x80cb;
export const BLEND_COLOR = 0x8005;
export const ARRAY_BUFFER_BINDING = 0x8894;
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;
export const LINE_WIDTH = 0x0b21;
export const ALIASED_POINT_SIZE_RANGE = 0x846d;
export const ALIASED_LINE_WIDTH_RANGE = 0x846e;
export const CULL_FACE_MODE = 0x0b45;
export const FRONT_FACE = 0x0b46;
export const DEPTH_RANGE = 0x0b70;
export const DEPTH_WRITEMASK = 0x0b72;
export const DEPTH_CLEAR_VALUE = 0x0b73;
export const DEPTH_FUNC = 0x0b74;
export const STENCIL_CLEAR_VALUE = 0x0b91;
export const STENCIL_FUNC = 0x0b92;
export const STENCIL_FAIL = 0x0b94;
export const STENCIL_PASS_DEPTH_FAIL = 0x0b95;
export const STENCIL_PASS_DEPTH_PASS = 0x0b96;
export const STENCIL_REF = 0x0b97;
export const STENCIL_VALUE_MASK = 0x0b93;
export const STENCIL_WRITEMASK = 0x0b98;
export const STENCIL_BACK_FUNC = 0x8800;
export const STENCIL_BACK_FAIL = 0x8801;
export const STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;
export const STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;
export const STENCIL_BACK_REF = 0x8ca3;
export const STENCIL_BACK_VALUE_MASK = 0x8ca4;
export const STENCIL_BACK_WRITEMASK = 0x8ca5;
export const VIEWPORT = 0x0ba2;
export const SCISSOR_BOX = 0x0c10;
export const COLOR_CLEAR_VALUE = 0x0c22;
export const COLOR_WRITEMASK = 0x0c23;
export const UNPACK_ALIGNMENT = 0x0cf5;
export const PACK_ALIGNMENT = 0x0d05;
export const MAX_TEXTURE_SIZE = 0x0d33;
export const MAX_VIEWPORT_DIMS = 0x0d3a;
export const SUBPIXEL_BITS = 0x0d50;
export const RED_BITS = 0x0d52;
export const GREEN_BITS = 0x0d53;
export const BLUE_BITS = 0x0d54;
export const ALPHA_BITS = 0x0d55;
export const DEPTH_BITS = 0x0d56;
export const STENCIL_BITS = 0x0d57;
export const POLYGON_OFFSET_UNITS = 0x2a00;
export const POLYGON_OFFSET_FACTOR = 0x8038;
export const TEXTURE_BINDING_2D = 0x8069;
export const SAMPLE_BUFFERS = 0x80a8;
export const SAMPLES = 0x80a9;
export const SAMPLE_COVERAGE_VALUE = 0x80aa;
export const SAMPLE_COVERAGE_INVERT = 0x80ab;
export const COMPRESSED_TEXTURE_FORMATS = 0x86a3;
export const VENDOR = 0x1f00;
export const RENDERER = 0x1f01;
export const VERSION = 0x1f02;
export const IMPLEMENTATION_COLOR_READ_TYPE = 0x8b9a;
export const IMPLEMENTATION_COLOR_READ_FORMAT = 0x8b9b;
export const BROWSER_DEFAULT_WEBGL = 0x9244;

/*
Buffers

Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or
WebGLRenderingContext.getBufferParameter().
*/
export const STATIC_DRAW = 0x88e4;
export const STREAM_DRAW = 0x88e0;
export const DYNAMIC_DRAW = 0x88e8;
export const ARRAY_BUFFER = 0x8892;
export const ELEMENT_ARRAY_BUFFER = 0x8893;
export const BUFFER_SIZE = 0x8764;
export const BUFFER_USAGE = 0x8765;

/*
Vertex attributes

Constants passed to WebGLRenderingContext.getVertexAttrib().
*/
export const CURRENT_VERTEX_ATTRIB = 0x8626;
export const VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;
export const VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;
export const VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;
export const VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;
export const VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886a;
export const VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;
export const VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889f;

/*
Culling

Constants passed to WebGLRenderingContext.cullFace().
*/
export const CULL_FACE = 0x0b44;
export const FRONT = 0x0404;
export const BACK = 0x0405;
export const FRONT_AND_BACK = 0x0408;

/*
Enabling and disabling

Constants passed to WebGLRenderingContext.enable() or WebGLRenderingContext.disable().
*/
export const BLEND = 0x0be2;
export const DEPTH_TEST = 0x0b71;
export const DITHER = 0x0bd0;
export const POLYGON_OFFSET_FILL = 0x8037;
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809e;
export const SAMPLE_COVERAGE = 0x80a0;
export const SCISSOR_TEST = 0x0c11;
export const STENCIL_TEST = 0x0b90;

/*
Errors

Constants returned from WebGLRenderingContext.getError().
*/
export const NO_ERROR = 0;
export const INVALID_ENUM = 0x0500;
export const INVALID_VALUE = 0x0501;
export const INVALID_OPERATION = 0x0502;
export const OUT_OF_MEMORY = 0x0505;
export const CONTEXT_LOST_WEBGL = 0x9242;

/*
Front face directions

Constants passed to WebGLRenderingContext.frontFace().
*/
export const CW = 0x0900;
export const CCW = 0x0901;

/*
Hints

Constants passed to WebGLRenderingContext.hint().
*/
export const DONT_CARE = 0x1100;
export const FASTEST = 0x1101;
export const NICEST = 0x1102;
export const GENERATE_MIPMAP_HINT = 0x8192;

// Data types
export const BYTE = 0x1400;
export const UNSIGNED_BYTE = 0x1401;
export const SHORT = 0x1402;
export const UNSIGNED_SHORT = 0x1403;
export const INT = 0x1404;
export const UNSIGNED_INT = 0x1405;
export const FLOAT = 0x1406;

// Pixel formats
export const DEPTH_COMPONENT = 0x1902;
export const ALPHA = 0x1906;
export const RGB = 0x1907;
export const RGBA = 0x1908;
export const LUMINANCE = 0x1909;
export const LUMINANCE_ALPHA = 0x190a;

// Pixel types
// export const UNSIGNED_BYTE = 0x1401; // Declared above.
export const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
export const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
export const UNSIGNED_SHORT_5_6_5 = 0x8363;

/*
Shaders

Constants passed to WebGLRenderingContext.createShader() or WebGLRenderingContext.getShaderParameter().
*/
export const FRAGMENT_SHADER = 0x8b30;
export const VERTEX_SHADER = 0x8b31;
export const COMPILE_STATUS = 0x8b81;
export const DELETE_STATUS = 0x8b80;
export const LINK_STATUS = 0x8b82;
export const VALIDATE_STATUS = 0x8b83;
export const ATTACHED_SHADERS = 0x8b85;
export const ACTIVE_ATTRIBUTES = 0x8b89;
export const ACTIVE_UNIFORMS = 0x8b86;
export const MAX_VERTEX_ATTRIBS = 0x8869;
export const MAX_VERTEX_UNIFORM_VECTORS = 0x8dfb;
export const MAX_VARYING_VECTORS = 0x8dfc;
export const MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d;
export const MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8b4c;
export const MAX_TEXTURE_IMAGE_UNITS = 0x8872;
export const MAX_FRAGMENT_UNIFORM_VECTORS = 0x8dfd;
export const SHADER_TYPE = 0x8b4f;
export const SHADING_LANGUAGE_VERSION = 0x8b8c;
export const CURRENT_PROGRAM = 0x8b8d;

/*
Depth or stencil tests

Constants passed to WebGLRenderingContext.depthFunc() or WebGLRenderingContext.stencilFunc().
*/
export const NEVER = 0x0200;
export const LESS = 0x0201;
export const EQUAL = 0x0202;
export const LEQUAL = 0x0203;
export const GREATER = 0x0204;
export const NOTEQUAL = 0x0205;
export const GEQUAL = 0x0206;
export const ALWAYS = 0x0207;

/*
Stencil actions

Constants passed to WebGLRenderingContext.stencilOp().
*/
export const KEEP = 0x1e00;
export const REPLACE = 0x1e01;
export const INCR = 0x1e02;
export const DECR = 0x1e03;
export const INVERT = 0x150a;
export const INCR_WRAP = 0x8507;
export const DECR_WRAP = 0x8508;

/*
Textures

Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(),
WebGLRenderingContext.texImage2D(), and others.
*/
export const NEAREST = 0x2600;
export const LINEAR = 0x2601;
export const NEAREST_MIPMAP_NEAREST = 0x2700;
export const LINEAR_MIPMAP_NEAREST = 0x2701;
export const NEAREST_MIPMAP_LINEAR = 0x2702;
export const LINEAR_MIPMAP_LINEAR = 0x2703;
export const TEXTURE_MAG_FILTER = 0x2800;
export const TEXTURE_MIN_FILTER = 0x2801;
export const TEXTURE_WRAP_S = 0x2802;
export const TEXTURE_WRAP_T = 0x2803;
export const TEXTURE_2D = 0x0de1;
export const TEXTURE = 0x1702;
export const TEXTURE_CUBE_MAP = 0x8513;
export const TEXTURE_BINDING_CUBE_MAP = 0x8514;
export const TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
export const TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
export const TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
export const TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
export const TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
export const TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a;
export const MAX_CUBE_MAP_TEXTURE_SIZE = 0x851c;
export const TEXTURE0 = 0x84c0; // Range through TEXTURE31 = 0x84DF.
export const ACTIVE_TEXTURE = 0x84e0;
export const REPEAT = 0x2901;
export const CLAMP_TO_EDGE = 0x812f;
export const MIRRORED_REPEAT = 0x8370;

// Uniform types
export const FLOAT_VEC2 = 0x8b50;
export const FLOAT_VEC3 = 0x8b51;
export const FLOAT_VEC4 = 0x8b52;
export const INT_VEC2 = 0x8b53;
export const INT_VEC3 = 0x8b54;
export const INT_VEC4 = 0x8b55;
export const BOOL = 0x8b56;
export const BOOL_VEC2 = 0x8b57;
export const BOOL_VEC3 = 0x8b58;
export const BOOL_VEC4 = 0x8b59;
export const FLOAT_MAT2 = 0x8b5a;
export const FLOAT_MAT3 = 0x8b5b;
export const FLOAT_MAT4 = 0x8b5c;
export const SAMPLER_2D = 0x8b5e;
export const SAMPLER_CUBE = 0x8b60;

// Shader precision-specified types
export const LOW_FLOAT = 0x8df0;
export const MEDIUM_FLOAT = 0x8df1;
export const HIGH_FLOAT = 0x8df2;
export const LOW_INT = 0x8df3;
export const MEDIUM_INT = 0x8df4;
export const HIGH_INT = 0x8df5;

// Framebuffers and renderbuffers
export const FRAMEBUFFER = 0x8d40;
export const RENDERBUFFER = 0x8d41;
export const RGBA4 = 0x8056;
export const RGB5_A1 = 0x8057;
export const RGB565 = 0x8d62;
export const DEPTH_COMPONENT16 = 0x81a5;
export const STENCIL_INDEX8 = 0x8d48;
export const DEPTH_STENCIL = 0x84f9;
export const RENDERBUFFER_WIDTH = 0x8d42;
export const RENDERBUFFER_HEIGHT = 0x8d43;
export const RENDERBUFFER_INTERNAL_FORMAT = 0x8d44;
export const RENDERBUFFER_RED_SIZE = 0x8d50;
export const RENDERBUFFER_GREEN_SIZE = 0x8d51;
export const RENDERBUFFER_BLUE_SIZE = 0x8d52;
export const RENDERBUFFER_ALPHA_SIZE = 0x8d53;
export const RENDERBUFFER_DEPTH_SIZE = 0x8d54;
export const RENDERBUFFER_STENCIL_SIZE = 0x8d55;
export const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8cd0;
export const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8cd1;
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8cd2;
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8cd3;
export const COLOR_ATTACHMENT0 = 0x8ce0;
export const DEPTH_ATTACHMENT = 0x8d00;
export const STENCIL_ATTACHMENT = 0x8d20;
export const DEPTH_STENCIL_ATTACHMENT = 0x821a;
export const NONE = 0;
export const FRAMEBUFFER_COMPLETE = 0x8cd5;
export const FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8cd6;
export const FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8cd7;
export const FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8cd9;
export const FRAMEBUFFER_UNSUPPORTED = 0x8cdd;
export const FRAMEBUFFER_BINDING = 0x8ca6;
export const RENDERBUFFER_BINDING = 0x8ca7;
export const MAX_RENDERBUFFER_SIZE = 0x84e8;
export const INVALID_FRAMEBUFFER_OPERATION = 0x0506;

/*
Pixel storage modes

Constants passed to WebGLRenderingContext.pixelStorei().
*/
export const UNPACK_FLIP_Y_WEBGL = 0x9240;
export const UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
export const UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

/*
Getting GL parameter information (WebGL2)

Constants passed to WebGLRenderingContext.getParameter() to specify what information to return.
*/
export const READ_BUFFER = 0x0c02;
export const UNPACK_ROW_LENGTH = 0x0cf2;
export const UNPACK_SKIP_ROWS = 0x0cf3;
export const UNPACK_SKIP_PIXELS = 0x0cf4;
export const PACK_ROW_LENGTH = 0x0d02;
export const PACK_SKIP_ROWS = 0x0d03;
export const PACK_SKIP_PIXELS = 0x0d04;
export const TEXTURE_BINDING_3D = 0x806a;
export const UNPACK_SKIP_IMAGES = 0x806d;
export const UNPACK_IMAGE_HEIGHT = 0x806e;
export const MAX_3D_TEXTURE_SIZE = 0x8073;
export const MAX_ELEMENTS_VERTICES = 0x80e8;
export const MAX_ELEMENTS_INDICES = 0x80e9;
export const MAX_TEXTURE_LOD_BIAS = 0x84fd;
export const MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8b49;
export const MAX_VERTEX_UNIFORM_COMPONENTS = 0x8b4a;
export const MAX_ARRAY_TEXTURE_LAYERS = 0x88ff;
export const MIN_PROGRAM_TEXEL_OFFSET = 0x8904;
export const MAX_PROGRAM_TEXEL_OFFSET = 0x8905;
export const MAX_VARYING_COMPONENTS = 0x8b4b;
export const FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8b8b;
export const RASTERIZER_DISCARD = 0x8c89;
export const VERTEX_ARRAY_BINDING = 0x85b5;
export const MAX_VERTEX_OUTPUT_COMPONENTS = 0x9122;
export const MAX_FRAGMENT_INPUT_COMPONENTS = 0x9125;
export const MAX_SERVER_WAIT_TIMEOUT = 0x9111;
export const MAX_ELEMENT_INDEX = 0x8d6b;

/*
Textures (WebGL2)

Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(),
WebGLRenderingContext.texImage2D(), and others.
*/
export const RED = 0x1903;
export const RGB8 = 0x8051;
export const RGBA8 = 0x8058;
export const RGB10_A2 = 0x8059;
export const TEXTURE_3D = 0x806f;
export const TEXTURE_WRAP_R = 0x8072;
export const TEXTURE_MIN_LOD = 0x813a;
export const TEXTURE_MAX_LOD = 0x813b;
export const TEXTURE_BASE_LEVEL = 0x813c;
export const TEXTURE_MAX_LEVEL = 0x813d;
export const TEXTURE_COMPARE_MODE = 0x884c;
export const TEXTURE_COMPARE_FUNC = 0x884d;
export const SRGB = 0x8c40;
export const SRGB8 = 0x8c41;
export const SRGB8_ALPHA8 = 0x8c43;
export const COMPARE_REF_TO_TEXTURE = 0x884e;
export const RGBA32F = 0x8814;
export const RGB32F = 0x8815;
export const RGBA16F = 0x881a;
export const RGB16F = 0x881b;
export const TEXTURE_2D_ARRAY = 0x8c1a;
export const TEXTURE_BINDING_2D_ARRAY = 0x8c1d;
export const R11F_G11F_B10F = 0x8c3a;
export const RGB9_E5 = 0x8c3d;
export const RGBA32UI = 0x8d70;
export const RGB32UI = 0x8d71;
export const RGBA16UI = 0x8d76;
export const RGB16UI = 0x8d77;
export const RGBA8UI = 0x8d7c;
export const RGB8UI = 0x8d7d;
export const RGBA32I = 0x8d82;
export const RGB32I = 0x8d83;
export const RGBA16I = 0x8d88;
export const RGB16I = 0x8d89;
export const RGBA8I = 0x8d8e;
export const RGB8I = 0x8d8f;
export const RED_INTEGER = 0x8d94;
export const RGB_INTEGER = 0x8d98;
export const RGBA_INTEGER = 0x8d99;
export const R8 = 0x8229;
export const RG8 = 0x822b;
export const R16F = 0x822d;
export const R32F = 0x822e;
export const RG16F = 0x822f;
export const RG32F = 0x8230;
export const R8I = 0x8231;
export const R8UI = 0x8232;
export const R16I = 0x8233;
export const R16UI = 0x8234;
export const R32I = 0x8235;
export const R32UI = 0x8236;
export const RG8I = 0x8237;
export const RG8UI = 0x8238;
export const RG16I = 0x8239;
export const RG16UI = 0x823a;
export const RG32I = 0x823b;
export const RG32UI = 0x823c;
export const R8_SNORM = 0x8f94;
export const RG8_SNORM = 0x8f95;
export const RGB8_SNORM = 0x8f96;
export const RGBA8_SNORM = 0x8f97;
export const RGB10_A2UI = 0x906f;
export const TEXTURE_IMMUTABLE_FORMAT = 0x912f;
export const TEXTURE_IMMUTABLE_LEVELS = 0x82df;

// Pixel types (WebGL2)
export const UNSIGNED_INT_2_10_10_10_REV = 0x8368;
export const UNSIGNED_INT_10F_11F_11F_REV = 0x8c3b;
export const UNSIGNED_INT_5_9_9_9_REV = 0x8c3e;
export const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8dad;
export const UNSIGNED_INT_24_8 = 0x84fa;
export const HALF_FLOAT = 0x140b;
export const RG = 0x8227;
export const RG_INTEGER = 0x8228;
export const INT_2_10_10_10_REV = 0x8d9f;

// Queries (WebGL2)
export const CURRENT_QUERY = 0x8865;
export const QUERY_RESULT = 0x8866;
export const QUERY_RESULT_AVAILABLE = 0x8867;
export const ANY_SAMPLES_PASSED = 0x8c2f;
export const ANY_SAMPLES_PASSED_CONSERVATIVE = 0x8d6a;

// Draw buffers (WebGL2)
export const MAX_DRAW_BUFFERS = 0x8824;
export const DRAW_BUFFER0 = 0x8825; // Range through DRAW_BUFFER15 = 0x8834.
export const MAX_COLOR_ATTACHMENTS = 0x8cdf;
export const COLOR_ATTACHMENT1 = 0x8ce1; // Range through COLOR_ATTACHMENT15 = 0x8CEF.

// Samplers (WebGL2)
export const SAMPLER_3D = 0x8b5f;
export const SAMPLER_2D_SHADOW = 0x8b62;
export const SAMPLER_2D_ARRAY = 0x8dc1;
export const SAMPLER_2D_ARRAY_SHADOW = 0x8dc4;
export const SAMPLER_CUBE_SHADOW = 0x8dc5;
export const INT_SAMPLER_2D = 0x8dca;
export const INT_SAMPLER_3D = 0x8dcb;
export const INT_SAMPLER_CUBE = 0x8dcc;
export const INT_SAMPLER_2D_ARRAY = 0x8dcf;
export const UNSIGNED_INT_SAMPLER_2D = 0x8dd2;
export const UNSIGNED_INT_SAMPLER_3D = 0x8dd3;
export const UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4;
export const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7;
export const MAX_SAMPLES = 0x8d57;
export const SAMPLER_BINDING = 0x8919;

// Buffers (WebGL2)
export const PIXEL_PACK_BUFFER = 0x88eb;
export const PIXEL_UNPACK_BUFFER = 0x88ec;
export const PIXEL_PACK_BUFFER_BINDING = 0x88ed;
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88ef;
export const COPY_READ_BUFFER = 0x8f36;
export const COPY_WRITE_BUFFER = 0x8f37;
export const COPY_READ_BUFFER_BINDING = 0x8f36;
export const COPY_WRITE_BUFFER_BINDING = 0x8f37;

// Data types (WebGL2)
export const FLOAT_MAT2x3 = 0x8b65;
export const FLOAT_MAT2x4 = 0x8b66;
export const FLOAT_MAT3x2 = 0x8b67;
export const FLOAT_MAT3x4 = 0x8b68;
export const FLOAT_MAT4x2 = 0x8b69;
export const FLOAT_MAT4x3 = 0x8b6a;
export const UNSIGNED_INT_VEC2 = 0x8dc6;
export const UNSIGNED_INT_VEC3 = 0x8dc7;
export const UNSIGNED_INT_VEC4 = 0x8dc8;
export const UNSIGNED_NORMALIZED = 0x8c17;
export const SIGNED_NORMALIZED = 0x8f9c;

// Vertex attributes (WebGL2)
export const VERTEX_ATTRIB_ARRAY_INTEGER = 0x88fd;
export const VERTEX_ATTRIB_ARRAY_DIVISOR = 0x88fe;

// Transform feedback (WebGL2)
export const TRANSFORM_FEEDBACK_BUFFER_MODE = 0x8c7f;
export const MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 0x8c80;
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8c83;
export const TRANSFORM_FEEDBACK_BUFFER_START = 0x8c84;
export const TRANSFORM_FEEDBACK_BUFFER_SIZE = 0x8c85;
export const TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 0x8c88;
export const MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 0x8c8a;
export const MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 0x8c8b;
export const INTERLEAVED_ATTRIBS = 0x8c8c;
export const SEPARATE_ATTRIBS = 0x8c8d;
export const TRANSFORM_FEEDBACK_BUFFER = 0x8c8e;
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8c8f;
export const TRANSFORM_FEEDBACK = 0x8e22;
export const TRANSFORM_FEEDBACK_PAUSED = 0x8e23;
export const TRANSFORM_FEEDBACK_ACTIVE = 0x8e24;
export const TRANSFORM_FEEDBACK_BINDING = 0x8e25;

// Framebuffers and renderbuffers (WebGL2)
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 0x8210;
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 0x8211;
export const FRAMEBUFFER_ATTACHMENT_RED_SIZE = 0x8212;
export const FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 0x8213;
export const FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 0x8214;
export const FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 0x8215;
export const FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 0x8216;
export const FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 0x8217;
export const FRAMEBUFFER_DEFAULT = 0x8218;
// export const DEPTH_STENCIL_ATTACHMENT = 0x821a; // Declared above.
// export const DEPTH_STENCIL = 0x84f9; // Declared above.
export const DEPTH24_STENCIL8 = 0x88f0;
export const DRAW_FRAMEBUFFER_BINDING = 0x8ca6;
export const READ_FRAMEBUFFER = 0x8ca8;
export const DRAW_FRAMEBUFFER = 0x8ca9;
export const READ_FRAMEBUFFER_BINDING = 0x8caa;
export const RENDERBUFFER_SAMPLES = 0x8cab;
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0x8cd4;
export const FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8d56;

// Uniforms (WebGL2)
export const UNIFORM_BUFFER = 0x8a11;
export const UNIFORM_BUFFER_BINDING = 0x8a28;
export const UNIFORM_BUFFER_START = 0x8a29;
export const UNIFORM_BUFFER_SIZE = 0x8a2a;
export const MAX_VERTEX_UNIFORM_BLOCKS = 0x8a2b;
export const MAX_FRAGMENT_UNIFORM_BLOCKS = 0x8a2d;
export const MAX_COMBINED_UNIFORM_BLOCKS = 0x8a2e;
export const MAX_UNIFORM_BUFFER_BINDINGS = 0x8a2f;
export const MAX_UNIFORM_BLOCK_SIZE = 0x8a30;
export const MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 0x8a31;
export const MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 0x8a33;
export const UNIFORM_BUFFER_OFFSET_ALIGNMENT = 0x8a34;
export const ACTIVE_UNIFORM_BLOCKS = 0x8a36;
export const UNIFORM_TYPE = 0x8a37;
export const UNIFORM_SIZE = 0x8a38;
export const UNIFORM_BLOCK_INDEX = 0x8a3a;
export const UNIFORM_OFFSET = 0x8a3b;
export const UNIFORM_ARRAY_STRIDE = 0x8a3c;
export const UNIFORM_MATRIX_STRIDE = 0x8a3d;
export const UNIFORM_IS_ROW_MAJOR = 0x8a3e;
export const UNIFORM_BLOCK_BINDING = 0x8a3f;
export const UNIFORM_BLOCK_DATA_SIZE = 0x8a40;
export const UNIFORM_BLOCK_ACTIVE_UNIFORMS = 0x8a42;
export const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43;
export const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44;
export const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46;

// Sync objects (WebGL2)
export const OBJECT_TYPE = 0x9112;
export const SYNC_CONDITION = 0x9113;
export const SYNC_STATUS = 0x9114;
export const SYNC_FLAGS = 0x9115;
export const SYNC_FENCE = 0x9116;
export const SYNC_GPU_COMMANDS_COMPLETE = 0x9117;
export const UNSIGNALED = 0x9118;
export const SIGNALED = 0x9119;
export const ALREADY_SIGNALED = 0x911a;
export const TIMEOUT_EXPIRED = 0x911b;
export const CONDITION_SATISFIED = 0x911c;
export const WAIT_FAILED = 0x911d;
export const SYNC_FLUSH_COMMANDS_BIT = 0x00000001;

// Miscellaneous constants (WebGL2)
export const COLOR = 0x1800;
export const DEPTH = 0x1801;
export const STENCIL = 0x1802;
export const MIN = 0x8007;
export const MAX = 0x8008;
export const DEPTH_COMPONENT24 = 0x81a6;
export const STREAM_READ = 0x88e1;
export const STREAM_COPY = 0x88e2;
export const STATIC_READ = 0x88e5;
export const STATIC_COPY = 0x88e6;
export const DYNAMIC_READ = 0x88e9;
export const DYNAMIC_COPY = 0x88ea;
export const DEPTH_COMPONENT32F = 0x8cac;
export const DEPTH32F_STENCIL8 = 0x8cad;
export const INVALID_INDEX = 0xffffffff;
export const TIMEOUT_IGNORED = -1;
export const MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 0x9247;

// ANGLE_instanced_arrays
export const VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = 0x88fe;

// WEBGL_debug_renderer_inf
export const UNMASKED_VENDOR_WEBGL = 0x9245;
export const UNMASKED_RENDERER_WEBGL = 0x9246;

// EXT_texture_filter_anisotropic
export const MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff;
export const TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe;

// WEBGL_compressed_texture_s3tc
export const COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0;
export const COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1;
export const COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83f2;
export const COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83f3;

// WEBGL_compressed_texture_etc
export const COMPRESSED_R11_EAC = 0x9270;
export const COMPRESSED_SIGNED_R11_EAC = 0x9271;
export const COMPRESSED_RG11_EAC = 0x9272;
export const COMPRESSED_SIGNED_RG11_EAC = 0x9273;
export const COMPRESSED_RGB8_ETC2 = 0x9274;
export const COMPRESSED_RGBA8_ETC2_EAC = 0x9275;
export const COMPRESSED_SRGB8_ETC2 = 0x9276;
export const COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277;
export const COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278;
export const COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279;

// WEBGL_compressed_texture_pvrtc
export const COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00;
export const COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02;
export const COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01;
export const COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03;

// WEBGL_compressed_texture_etc1
export const COMPRESSED_RGB_ETC1_WEBGL = 0x8d64;

// WEBGL_compressed_texture_atc
export const COMPRESSED_RGB_ATC_WEBGL = 0x8c92;
export const COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8c92;
export const COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87ee;

// WEBGL_depth_texture
export const UNSIGNED_INT_24_8_WEBGL = 0x84fa;

// OES_texture_half_float
export const HALF_FLOAT_OES = 0x8d61;

// WEBGL_color_buffer_float
export const RGBA32F_EXT = 0x8814;
export const RGB32F_EXT = 0x8815;
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211;
export const UNSIGNED_NORMALIZED_EXT = 0x8c17;

// EXT_blend_minmax
export const MIN_EXT = 0x8007;
export const MAX_EXT = 0x8008;

// EXT_sRGB
export const SRGB_EXT = 0x8c40;
export const SRGB_ALPHA_EXT = 0x8c42;
export const SRGB8_ALPHA8_EXT = 0x8c43;
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 0x8210;

// OES_standard_derivatives
export const FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8b8b;

// WEBGL_draw_buffers
export const COLOR_ATTACHMENT0_WEBGL = 0x8ce0; // Range through COLOR_ATTACHMENT15_WEBGL = 0x8CEF.
export const DRAW_BUFFER0_WEBGL = 0x8825; // Range through DRAW_BUFFER15_WEBGL = 0x8834.
export const MAX_COLOR_ATTACHMENTS_WEBGL = 0x8cdf;
export const MAX_DRAW_BUFFERS_WEBGL = 0x8824;

// OES_vertex_array_object
export const VERTEX_ARRAY_BINDING_OES = 0x85b5;

// EXT_disjoint_timer_query
export const QUERY_COUNTER_BITS_EXT = 0x8864;
export const CURRENT_QUERY_EXT = 0x8865;
export const QUERY_RESULT_EXT = 0x8866;
export const QUERY_RESULT_AVAILABLE_EXT = 0x8867;
export const TIME_ELAPSED_EXT = 0x88bf;
export const TIMESTAMP_EXT = 0x8e28;
export const GPU_DISJOINT_EXT = 0x8fbb;