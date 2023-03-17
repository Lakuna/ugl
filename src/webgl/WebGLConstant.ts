/** Types of shaders. */
export enum ShaderType {
	/** A fragment shader, which calculates a color for each pixel of a primitive. */
	FRAGMENT_SHADER = 0x8B30,

	/** A vertex shader, which calculates a position for each vertex of a primitive. */
	VERTEX_SHADER = 0x8B31
}

/** Modes for capturing transform feedback varyings. */
export enum TransformFeedbackBufferMode {
	INTERLEAVED_ATTRIBS = 0x8C8C,
	SEPARATE_ATTRIBS = 0x8C8D
}

/** Possible variable types for uniforms. */
export enum UniformType {
	/** A 32-bit signed floating-point value. */
	FLOAT = 0x1406,

	/** A two-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC2 = 0x8B50,

	/** A three-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC3 = 0x8B51,

	/** A four-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC4 = 0x8B52,

	SAMPLER_2D = 0x8B5E,

	SAMPLER_3D = 0x8B5F,

	SAMPLER_CUBE = 0x8B60,

	SAMPLER_2D_SHADOW = 0x8B62,

	SAMPLER_2D_ARRAY = 0x8DC1,

	SAMPLER_2D_ARRAY_SHADOW = 0x8DC4,

	SAMPLER_CUBE_SHADOW = 0x8DC5,

	INT_SAMPLER_2D = 0x8DCA,

	INT_SAMPLER_3D = 0x8DCB,

	INT_SAMPLER_CUBE = 0x8DCC,

	INT_SAMPLER_2D_ARRAY = 0x8DCF,

	/** A boolean value. */
	BOOL = 0x8B56,

	/** A 32-bit signed integer value. */
	INT = 0x1404,

	/** A two-dimensional vector of boolean values. */
	BOOL_VEC2 = 0x8B57,

	/** A two-dimensional vector of 32-bit signed integer values. */
	INT_VEC2 = 0x8B53,

	/** A three-dimensional vector of boolean values. */
	BOOL_VEC3 = 0x8B58,

	/** A three-dimensional vector of 32-bit signed integer values. */
	INT_VEC3 = 0x8B54,

	/** A four-dimensional vector of boolean values. */
	BOOL_VEC4 = 0x8B59,

	/** A four-dimensional vector of 32-bit signed integer values. */
	INT_VEC4 = 0x8B55,

	/** A 32-bit signed uninteger value. */
	UNSIGNED_INT = 0x1405,

	/** A two-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC2 = 0x8DC6,

	/** A three-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC3 = 0x8DC7,

	/** A four-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC4 = 0x8DC8,

	/** A matrix of 32-bit signed floating-point values with two rows and two columns. */
	FLOAT_MAT2 = 0x8B5A,

	/** A matrix of 32-bit signed floating-point values with three rows and three columns. */
	FLOAT_MAT3 = 0x8B5B,

	/** A matrix of 32-bit signed floating-point values with four rows and four columns. */
	FLOAT_MAT4 = 0x8B5C,

	/** A matrix of 32-bit signed floating-point values with two rows and three columns. */
	FLOAT_MAT2x3 = 0x8B65,

	/** A matrix of 32-bit signed floating-point values with two rows and four columns. */
	FLOAT_MAT2x4 = 0x8B66,

	/** A matrix of 32-bit signed floating-point values with three rows and two columns. */
	FLOAT_MAT3x2 = 0x8B67,

	/** A matrix of 32-bit signed floating-point values with three rows and four columns. */
	FLOAT_MAT3x4 = 0x8B68,

	/** A matrix of 32-bit signed floating-point values with four rows and two columns. */
	FLOAT_MAT4x2 = 0x8B69,

	/** A matrix of 32-bit signed floating-point values with four rows and three columns. */
	FLOAT_MAT4x3 = 0x8B6A
}

/** Possible variable types for attributes. */
export enum AttributeType {
	/** A 32-bit signed floating-point value. */
	FLOAT = 0x1406,

	/** A two-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC2 = 0x8B50,

	/** A three-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC3 = 0x8B51,

	/** A four-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC4 = 0x8B52,

	/** A boolean value. */
	BOOL = 0x8B56,

	/** A 32-bit signed integer value. */
	INT = 0x1404,

	/** A two-dimensional vector of boolean values. */
	BOOL_VEC2 = 0x8B57,

	/** A two-dimensional vector of 32-bit signed integer values. */
	INT_VEC2 = 0x8B53,

	/** A three-dimensional vector of boolean values. */
	BOOL_VEC3 = 0x8B58,

	/** A three-dimensional vector of 32-bit signed integer values. */
	INT_VEC3 = 0x8B54,

	/** A four-dimensional vector of boolean values. */
	BOOL_VEC4 = 0x8B59,

	/** A four-dimensional vector of 32-bit signed integer values. */
	INT_VEC4 = 0x8B55,

	/** A 32-bit signed uninteger value. */
	UNSIGNED_INT = 0x1405,

	/** A two-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC2 = 0x8DC6,

	/** A three-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC3 = 0x8DC7,

	/** A four-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC4 = 0x8DC8,

	/** A matrix of 32-bit signed floating-point values with two rows and two columns. */
	FLOAT_MAT2 = 0x8B5A,

	/** A matrix of 32-bit signed floating-point values with three rows and three columns. */
	FLOAT_MAT3 = 0x8B5B,

	/** A matrix of 32-bit signed floating-point values with four rows and four columns. */
	FLOAT_MAT4 = 0x8B5C
}

/** Binding points for buffers. */
export enum BufferTarget {
	/** A buffer containing vertex attributes. */
	ARRAY_BUFFER = 0x8892,

	/** A buffer containing element indices. */
	ELEMENT_ARRAY_BUFFER = 0x8893,

	/** A buffer for copying from one buffer to another. */
	COPY_READ_BUFFER = 0x8F36,

	/** A buffer for copying from one buffer to another. */
	COPY_WRITE_BUFFER = 0x8F37,

	/** A buffer for transform feedback operations. */
	TRANSFORM_FEEDBACK_BUFFER = 0x8C8E,

	/** A buffer used for storing uniform blocks. */
	UNIFORM_BUFFER = 0x8A11,

	/** A buffer used for pixel transfer operations. */
	PIXEL_PACK_BUFFER = 0x88EB,

	/** A buffer used for pixel transfer operations. */
	PIXEL_UNPACK_BUFFER = 0x88EC
}

/** Usage patterns of a buffer's data store for optimization purposes. */
export enum BufferUsage {
	/** The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_DRAW = 0x88E4,

	/** The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_DRAW = 0x88E8,

	/** The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_DRAW = 0x88E0,

	/** The contents are intended to be specified once by reading data from WebGL, and queried many times by the application. */
	STATIC_READ = 0x88E5,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application. */
	DYNAMIC_READ = 0x88E9,

	/** The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application. */
	STREAM_READ = 0x88E1,

	/** The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_COPY = 0x88E6,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_COPY = 0x88EA,

	/** The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_COPY = 0x88E2
}

/** Types of data that can be stored as components in a buffer. */
export enum BufferDataType {
	/** An 8-bit signed integer. */
	BYTE = 0x1400,

	/** A 16-bit signed integer. */
	SHORT = 0x1402,

	/** An 8-bit unsigned integer. */
	UNSIGNED_BYTE = 0x1401,

	/** A 16-bit unsigned integer. */
	UNSIGNED_SHORT = 0x1403,

	/** A 32-bit signed floating-point number. */
	FLOAT = 0x1406,

	/** A 16-bit signed floating-point number. */
	HALF_FLOAT = 0x140B
}

/** Types of primitives that can be rasterized. */
export enum Primitive {
	/** Draws a dot at each vertex. */
	POINTS = 0x0000,

	/** Draws a line between each vertex. */
	LINE_STRIP = 0x0003,

	/** Draws a line between each vertex, then draws a line between the first and last vertices. */
	LINE_LOOP = 0x0002,

	/** Draws lines between each pair of vertices. */
	LINES = 0x0001,

	/** Draws triangles from each vertex and the previous two, starting at the third vertex. */
	TRIANGLE_STRIP = 0x0005,

	/** Draws triangles from each vertex, the previous vertex, and the first vertex, starting at the third vertex. */
	TRIANGLE_FAN = 0x0006,

	/** Draws triangles between every three vertices. */
	TRIANGLES = 0x0004
}

/** Binding points for textures. */
export enum TextureTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0DE1,

	/** A cube-mapped texture. */
	TEXTURE_CUBE_MAP = 0x8513,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806F,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8C1A,

	/** The positive X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,

	/** The negative X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,

	/** The positive Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,

	/** The negative Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,

	/** The positive Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,

	/** The negative Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A

}

/** Formats for the color components in a texture. */
export enum TextureFormat {
	/** Reads the red, green, and blue components from the color buffer. */
	RGBA = 0x1908,

	/** Discards the alpha component and reads the red, green, and blue components. */
	RGB = 0x1907,

	/** Each component is a luminance/alpha component. */
	LUMINANCE_ALPHA = 0x190A,

	/** Each color component is a luminance component, and alpha is one. */
	LUMINANCE = 0x1909,

	/** Discards the red, green, and blue components and reads the alpha component. */
	ALPHA = 0x1906,
	R8 = 0x8229,
	R8_SNORM = 0x8F94,
	RG8 = 0x822B,
	RG8_SNORM = 0x8F95,
	RGB8 = 0x8051,
	RGB8_SNORM = 0x8F96,
	RGB565 = 0x8D62,
	RGBA4 = 0x8056,
	RGB5_A1 = 0x8057,
	RGBA8 = 0x8058,
	RGBA8_SNORM = 0x8F97,
	RGB10_A2 = 0x8059,
	RGB10_A2UI = 0x906F,
	SRGB8 = 0x8C41,
	SRGB8_ALPHA8 = 0x8C43,
	R16F = 0x822D,
	RG16F = 0x822F,
	RGB16F = 0x881B,
	RGBA16F = 0x881A,
	R32F = 0x822E,
	RG32F = 0x8230,
	RGB32F = 0x8815,
	RGBA32F = 0x8814,
	R11F_G11F_B10F = 0x8C3A,
	RGB9_E5 = 0x8C3D,
	R8I = 0x8231,
	R8UI = 0x8232,
	R16I = 0x8233,
	R16UI = 0x8234,
	R32I = 0x8235,
	R32UI = 0x8236,
	RG8I = 0x8237,
	RG8UI = 0x8238,
	RG16I = 0x8239,
	RG16UI = 0x823A,
	RG32I = 0x823B,
	RG32UI = 0x823C,
	RGB8I = 0x8D8F,
	RGB8UI = 0x8D7D,
	RGB16I = 0x8D89,
	RGB16UI = 0x8D77,
	RGB32I = 0x8D83,
	RGB32UI = 0x8D71,
	RGBA8I = 0x8D8E,
	RGBA8UI = 0x8D7C,
	RGBA16I = 0x8D88,
	RGBA16UI = 0x8D76,
	RGBA32I = 0x8D82,
	RGBA32UI = 0x8D70,

	// Below here is not for internal use.
	RED = 0x1903,
	RED_INTEGER = 0x8D94,
	RG = 0x8227,
	RG_INTEGER = 0x8228,
	RGB_INTEGER = 0x8D98,
	RGBA_INTEGER = 0x8D99
}

/** Data types for texel data. */
export enum TextureDataType {
	UNSIGNED_BYTE = 0x1401,
	UNSIGNED_SHORT_5_6_5 = 0x8363,
	UNSIGNED_SHORT_4_4_4_4 = 0x8033,
	UNSIGNED_SHORT_5_5_5_1 = 0x8034,
	UNSIGNED_SHORT = 0x1403,
	UNSIGNED_INT = 0x1405,
	UNSIGNED_INT_24_8_WEBGL = 0x84FA,
	FLOAT = 0x1406,
	HALF_FLOAT_OES = 0x8D61,
	BYTE = 0x1400,
	SHORT = 0x1402,
	INT = 0x1404,
	HALF_FLOAT = 0x140B,
	UNSIGNED_INT_2_10_10_10_REV = 0x8368,
	UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B,
	UNSIGNED_INT_5_9_9_9_REV = 0x8C3E,
	UNSIGNED_INT_24_8 = 0x84FA,
	FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD
}

/** Magnification and minification filters for textures. */
export enum TextureFilter {
	NEAREST = 0x2600,
	LINEAR = 0x2601,
	NEAREST_MIPMAP_NEAREST = 0x2700,
	LINEAR_MIPMAP_NEAREST = 0x2701,
	NEAREST_MIPMAP_LINEAR = 0x2702,
	LINEAR_MIPMAP_LINEAR = 0x2703
}

/** Wrapping functions for textures. */
export enum TextureWrapFunction {
	REPEAT = 0x2901,
	CLAMP_TO_EDGE = 0x812F,
	MIRRORED_REPEAT = 0x8370
}

/** Formats for a renderbuffer. */
export enum RenderbufferFormat {
	RGBA4 = 0x8056,
	RGB565 = 0x8D62,
	RGB5_A1 = 0x8057,
	DEPTH_COMPONENT16 = 0x81A5,
	STENCIL_INDEX8 = 0x8D48,
	DEPTH_STENCIL = 0x84F9,
	R8 = 0x8229,
	R8UI = 0x8232,
	R8I = 0x8231,
	R16UI = 0x8234,
	R16I = 0x8233,
	R32UI = 0x8236,
	R32I = 0x8235,
	RG8 = 0x822B,
	RG8UI = 0x8238,
	RG8I = 0x8237,
	RG16UI = 0x823A,
	RG16I = 0x8239,
	RG32I = 0x823B,
	RGB8 = 0x8051,
	RGBA8 = 0x8058,
	SRGB8_ALPHA8 = 0x8C43,
	RGB10_A2 = 0x8059,
	RGBA8UI = 0x8D7C,
	RGBA8I = 0x8D8E,
	RGB10_A2UI = 0x906F,
	RGBA16UI = 0x8D76,
	RGBA16I = 0x8D88,
	RGBA32I = 0x8D82,
	RGBA32UI = 0x8D70,
	DEPTH_COMPONENT24 = 0x81A6,
	DEPTH_COMPONENT32F = 0x8CAC,
	DEPTH24_STENCIL8 = 0x88F0,
	DEPTH32F_STENCIL8 = 0x8CAD,
	RGBA32F_EXT = 0x8814,
	RGB32F_EXT = 0x8815,
	SRGB8_ALPHA8_EXT = 0x8C43,
	R16F = 0x822D,
	RG16F = 0x822F,
	RGBA16F = 0x881A,
	R32F = 0x822E,
	RG32F = 0x8230,
	RGBA32F = 0x8814,
	R11F_G11F_B10F = 0x8C3A
}

/** Binding points for framebuffers. */
export enum FramebufferTarget {
	/** A collection buffer data storage of color, alpha, depth, and stencil buffers used to render an image. */
	FRAMEBUFFER = 0x8D40,

	/** Used as a destination for drawing, rendering, clearing, and writing operations. */
	DRAW_FRAMEBUFFER = 0x8CA9,

	/** Used as a source for reading operations. */
	READ_FRAMEBUFFER = 0x8CA8
}

/** Attachment points for framebuffer attachments. */
export enum FramebufferAttachmentPoint {
	/** The first color buffer. */
	COLOR_ATTACHMENT0 = 0x8CE0,

	/** The second color buffer. */
	COLOR_ATTACHMENT1 = 0x8CE1,

	/** The third color buffer. */
	COLOR_ATTACHMENT2 = 0x8CE2,

	/** The fourth color buffer. */
	COLOR_ATTACHMENT3 = 0x8CE3,

	/** The fifth color buffer. */
	COLOR_ATTACHMENT4 = 0x8CE4,

	/** The sixth color buffer. */
	COLOR_ATTACHMENT5 = 0x8CE5,

	/** The seventh color buffer. */
	COLOR_ATTACHMENT6 = 0x8CE6,

	/** The eighth color buffer. */
	COLOR_ATTACHMENT7 = 0x8CE7,

	/** The ninth color buffer. */
	COLOR_ATTACHMENT8 = 0x8CE8,

	/** The tenth color buffer. */
	COLOR_ATTACHMENT9 = 0x8CE9,

	/** The eleventh color buffer. */
	COLOR_ATTACHMENT10 = 0x8CEA,

	/** The twelfth color buffer. */
	COLOR_ATTACHMENT11 = 0x8CEB,

	/** The thirteenth color buffer. */
	COLOR_ATTACHMENT12 = 0x8CEC,

	/** The fourteenth color buffer. */
	COLOR_ATTACHMENT13 = 0x8CED,

	/** The fifteenth color buffer. */
	COLOR_ATTACHMENT14 = 0x8CEE,

	/** The sixteenth color buffer. */
	COLOR_ATTACHMENT15 = 0x8CEF,

	/** The depth buffer. */
	DEPTH_ATTACHMENT = 0x8D00,

	/** The stencil buffer. */
	STENCIL_ATTACHMENT = 0x8D20,

	/** The depth and stencil buffer. */
	DEPTH_STENCIL_ATTACHMENT = 0x821A
}

/** A renderbuffer. */
export const RENDERBUFFER = 0x8D41;

/** The deletion status of a shader or shader program. */
export const DELETE_STATUS = 0x8B80;

/** The linking status of a shader program. */
export const LINK_STATUS = 0x8B82;

/** The validation status of a shader program. */
export const VALIDATE_STATUS = 0x8B83;

/** The number of active attributes in a shader program. */
export const ACTIVE_ATTRIBUTES = 0x8B89;

/** The number of active uniforms in a shader program. */
export const ACTIVE_UNIFORMS = 0x8B86;

/** The number of active varyings that are used for transform feedback in a shader program. */
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8C83;

/** The compilation status of a shader. */
export const COMPILE_STATUS = 0x8B81;

/** The first texture unit. */
export const TEXTURE0 = 0x84C0;

/** The magnification filter for a texture. */
export const TEXTURE_MAG_FILTER = 0x2800;

/** The minification filter for a texture. */
export const TEXTURE_MIN_FILTER = 0x2801;

/** The wrapping mode for a texture on the S axis. */
export const TEXTURE_WRAP_S = 0x2802;

/** The wrapping mode for a texture on the T axis. */
export const TEXTURE_WRAP_T = 0x2803;

/** The number of texels to unpack at a time in each row of a texture. */
export const UNPACK_ALIGNMENT = 0x0CF5;

/** The bit mask for the color buffer. */
export const COLOR_BUFFER_BIT = 0x00004000;

/** The bit mask for the depth buffer. */
export const DEPTH_BUFFER_BIT = 0x00000100;

/** The bit mask for the stencil buffer. */
export const STENCIL_BUFFER_BIT = 0x00000400;

/** The depth test. */
export const DEPTH_TEST = 0x0B71;

/** The stencil test. */
export const STENCIL_TEST = 0x0B90

/** The scissor test. */
export const SCISSOR_TEST = 0x0C11;
