/**
 * Internal formats for the color components in a texture.
 * @see [`compressedTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D)
 * @see [`copyTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D)
 * @see [`texImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)
 * @see [`texImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D)
 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D)
 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
 */
enum TextureInternalFormat {
	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or
	 * `UNSIGNED_SHORT_5_6_5`. Color renderable and texture filterable.
	 */
	RGB = 0x1907,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`,
	 * `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. Color renderable
	 * and texture filterable.
	 */
	RGBA = 0x1908,

	/**
	 * `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`.
	 * Color renderable and texture filterable.
	 */
	LUMINANCE_ALPHA = 0x190a,

	/**
	 * `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. Color
	 * renderable and texture filterable.
	 */
	LUMINANCE = 0x1909,

	/**
	 * `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. Color
	 * renderable and texture filterable.
	 */
	ALPHA = 0x1906,

	/**
	 * `format` must be `RED`. `type` must be `UNSIGNED_BYTE`. Takes an 8-bit
	 * number for the red channel, normalized to `[0,1]`. Color renderable and
	 * texture filterable.
	 */
	R8 = 0x8229,

	/**
	 * `format` must be `RED`. `type` must be `BYTE`. Takes a signed 8-bit
	 * number for the red channel, normalized to `[-1,1]`. Texture filterable.
	 */
	R8_SNORM = 0x8f94,

	/**
	 * `format` must be `RED`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes a
	 * 16-bit floating-point number for the red channel. Texture filterable.
	 */
	R16F = 0x822d,

	/**
	 * `format` must be `RED`. `type` must be `FLOAT`. Takes a 32-bit
	 * floating-point number for the red channel.
	 */
	R32F = 0x822e,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes an
	 * 8-bit unsigned integer for the red channel. Color renderable.
	 */
	R8UI = 0x8232,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `BYTE`. Takes an 8-bit
	 * integer for the red channel. Color renderable.
	 */
	R8I = 0x8231,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes a
	 * 16-bit unsigned integer for the red channel. Color renderable.
	 */
	R16UI = 0x8234,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `SHORT`. Takes a 16-bit
	 * integer for the red channel. Color renderable.
	 */
	R16I = 0x8233,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_INT`. Takes a
	 * 32-bit unsigned integer for the red channel. Color renderable.
	 */
	R32UI = 0x8236,

	/**
	 * `format` must be `RED_INTEGER`. `type` must be `INT`. Takes a 32-bit
	 * integer for the red channel. Color renderable.
	 */
	R32I = 0x8235,

	/**
	 * `format` must be `RG`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit
	 * numbers for the red and green channels, normalized to `[0,1]`. Color
	 * renderable and texture filterable.
	 */
	RG8 = 0x822b,

	/**
	 * `format` must be `RG`. `type` must be `BYTE`. Takes signed 8-bit numbers
	 * for the red and green channels, normalized to `[-1,1]`. Texture
	 * filterable.
	 */
	RG8_SNORM = 0x8f95,

	/**
	 * `format` must be `RG`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes
	 * 16-bit floating-point numbers for the red and green channels. Texture
	 * filterable.
	 */
	RG16F = 0x822f,

	/**
	 * `format` must be `RG`. `type` must be `FLOAT`. Takes 32-bit
	 * floating-point numbers for the red and green channels.
	 */
	RG32F = 0x8230,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes
	 * 8-bit unsigned integers for the red and green channels. Color
	 * renderable.
	 */
	RG8UI = 0x8238,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `BYTE`. Takes 8-bit
	 * integers for the red and green channels. Color renderable.
	 */
	RG8I = 0x8237,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes
	 * 16-bit unsigned integers for the red and green channels. Color
	 * renderable.
	 */
	RG16UI = 0x823a,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `SHORT`. Takes 16-bit
	 * integers for the red and green channels. Color renderable.
	 */
	RG16I = 0x8239,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_INT`. Takes
	 * 32-bit unsigned integers for the red and green channels. Color
	 * renderable.
	 */
	RG32UI = 0x823c,

	/**
	 * `format` must be `RG_INTEGER`. `type` must be `INT`. Takes 32-bit
	 * integers for the red and green channels. Color renderable.
	 */
	RG32I = 0x823b,

	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit
	 * numbers for the red, green, and blue channels, normalized to `[0,1]`.
	 * Color renderable and texture filterable.
	 */
	RGB8 = 0x8051,

	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit
	 * numbers for the red, green, and blue channels, normalized to `[0,1]`.
	 * Texture filterable.
	 */
	SRGB8 = 0x8c41,

	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or
	 * `UNSIGNED_SHORT_5_6_5`. Takes 5-bit numbers for the red and blue
	 * channels and a 6-bit number for the green channel, normalized to
	 * `[0,1]`. Color renderable and texture filterable.
	 */
	RGB565 = 0x8d62,

	/**
	 * `format` must be `RGB`. `type` must be `BYTE`. Takes signed 8-bit
	 * numbers for the red, green, and blue channels, normalized to `[-1,1]`.
	 * Texture filterable.
	 */
	RGB8_SNORM = 0x8f96,

	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_INT_10F_11F_11F_REV`,
	 * `HALF_FLOAT`, or `FLOAT`. Takes 11-bit floating-point numbers for the
	 * red and green channels, and a 10-bit floating-point number for the blue
	 * channel. Texture filterable.
	 */
	R11F_G11F_B10F = 0x8c3a,

	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_INT_5_9_9_9_REV`,
	 * `HALF_FLOAT`, or `FLOAT`. Takes 9-bit numbers for the red, green, and
	 * blue channels, normalized to `[0,1]`, with 5 shared bits. Texture
	 * filterable.
	 */
	RGB9_E5 = 0x8c3d,

	/**
	 * `format` must be `RGB`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes
	 * 16-bit floating-point numbers for the red, green, and blue channels.
	 * Texture filterable.
	 */
	RGB16F = 0x881b,

	/**
	 * `format` must be `RGB`. `type` must be `FLOAT`. Takes 32-bit
	 * floating-point numbers for the red, green, and blue channels.
	 */
	RGB32F = 0x8815,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes
	 * 8-bit unsigned integers for the red, green, and blue channels.
	 */
	RGB8UI = 0x8d7d,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `BYTE`. Takes 8-bit
	 * integers for the red, green, and blue channels.
	 */
	RGB8I = 0x8d8f,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes
	 * 16-bit unsigned integers for the red, green, and blue channels.
	 */
	RGB16UI = 0x8d77,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `SHORT`. Takes 16-bit
	 * integers for the red, green, and blue channels.
	 */
	RGB16I = 0x8d89,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_INT`. Takes
	 * 32-bit unsigned integers for the red, green, and blue channels.
	 */
	RGB32UI = 0x8d71,

	/**
	 * `format` must be `RGB_INTEGER`. `type` must be `INT`. Takes 32-bit
	 * integers for the red, green, and blue channels.
	 */
	RGB32I = 0x8d83,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit
	 * numbers for the red, green, blue, and alpha channels, normalized to
	 * `[0,1]`. Color renderable and texture filterable.
	 */
	RGBA8 = 0x8058,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit
	 * numbers for the red, green, blue, and alpha channels, normalized to
	 * `[0,1]`. Color renderable and texture filterable.
	 */
	SRGB8_ALPHA8 = 0x8c43,

	/**
	 * `format` must be `RGBA`. `type` must be `BYTE`. Takes signed 8-bit
	 * numbers for the red, green, blue, and alpha channels, normalized to
	 * `[-1,1]`. Texture filterable.
	 */
	RGBA8_SNORM = 0x8f97,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`,
	 * `UNSIGNED_SHORT_5_5_5_1`, or `UNSIGNED_INT_2_10_10_10_REV`. Takes 5-bit
	 * numbers for the red, green, and blue channels and a 1-bit number for the
	 * alpha channel, normalized to `[0,1]`. Color renderable and texture
	 * filterable.
	 */
	RGB5_A1 = 0x8057,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE` or
	 * `UNSIGNED_SHORT_4_4_4_4`. Takes 4-bit numbers for the red, green, blue,
	 * and alpha channels, normalized to `[0,1]`. Color renderable and texture
	 * filterable.
	 */
	RGBA4 = 0x8056,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`.
	 * Takes 10-bit numbers for the red, green, and blue channels and a 2-bit
	 * number for the alpha channel, normalized to `[0,1]`. Color renderable
	 * and texture filterable.
	 */
	RGB10_A2 = 0x8059,

	/**
	 * `format` must be `RGBA`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes
	 * 16-bit floating-point numbers for the red, green, blue, and alpha
	 * channels. Texture filterable.
	 */
	RGBA16F = 0x881a,

	/**
	 * `format` must be `RGBA`. `type` must be `FLOAT`. Takes 32-bit
	 * floating-point numbers for the red, green, blue, and alpha channels.
	 */
	RGBA32F = 0x8814,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes
	 * 8-bit unsigned integers for the red, green, blue, and alpha channels.
	 * Color renderable.
	 */
	RGBA8UI = 0x8d7c,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `BYTE`. Takes 8-bit
	 * integers for the red, green, blue, and alpha channels. Color renderable.
	 */
	RGBA8I = 0x8d8e,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be
	 * `UNSIGNED_INT_2_10_10_10_REV`. Takes unsigned 10-bit integers for the
	 * red, green, and blue channels and a 2-bit unsigned integer for the alpha
	 * channel. Color renderable.
	 */
	RGB10_A2UI = 0x906f,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes
	 * 16-bit unsigned integers for the red, green, blue, and alpha channels.
	 * Color renderable.
	 */
	RGBA16UI = 0x8d76,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `SHORT`. Takes 16-bit
	 * integers for the red, green, blue, and alpha channels. Color renderable.
	 */
	RGBA16I = 0x8d88,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `INT`. Takes 32-bit
	 * integers for the red, green, blue, and alpha channels. Color renderable.
	 */
	RGBA32I = 0x8d82,

	/**
	 * `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT`. Takes
	 * 32-bit unsigned integers for the red, green, blue, and alpha channels.
	 * Color renderable.
	 */
	RGBA32UI = 0x8d70,

	/**
	 * `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_SHORT` or
	 * `UNSIGNED_INT`. Takes a 32-bit unsigned integer for the depth channel.
	 */
	DEPTH_COMPONENT16 = 0x81a5,

	/**
	 * `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_INT`. Takes
	 * a 24-bit unsigned integer for the depth channel.
	 */
	DEPTH_COMPONENT24 = 0x81a6,

	/**
	 * `format` must be `DEPTH_COMPONENT`. `type` must be `FLOAT`. Takes a
	 * 32-bit floating-point value for the depth channel.
	 */
	DEPTH_COMPONENT32F = 0x8cac,

	/**
	 * `format` must be `DEPTH_STENCIL`. `type` must be `UNSIGNED_INT_24_8`.
	 * Takes a 24-bit unsigned integer for the depth channel and an 8-bit
	 * unsigned integer for the stencil channel.
	 */
	DEPTH24_STENCIL8 = 0x88f0,

	/**
	 * `format` must be `DEPTH_STENCIL`. `type` must be
	 * `FLOAT_32_UNSIGNED_INT_24_8_REV`. Takes a 32-bit floating-point value
	 * for the depth channel and an 8-bit unsigned integer for the stencil
	 * channel.
	 */
	DEPTH32F_STENCIL8 = 0x8cad,

	/**
	 * Unsized sRGB format that leaves the precision up to the driver.
	 * @see [`EXT_sRGB`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 */
	SRGB = 0x8c40,

	/**
	 * Unsized sRGB format with an unsized alpha component.
	 * @see [`EXT_sRGB`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 */
	SRGB_ALPHA = 0x8c42,

	/**
	 * A DXT1-compressed image in an RGB image format.
	 * @see [`WEBGL_compressed_texture_s3tc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0,

	/**
	 * A DXT1-compressed image in an RGB image format with a boolean alpha
	 * value.
	 * @see [`WEBGL_compressed_texture_s3tc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1,

	/**
	 * A DXT3-compressed image in an RGBA image format.
	 * @see [`WEBGL_compressed_texture_s3tc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83f2,

	/**
	 * A DXT5-compressed image in an RGBA image format.
	 * @see [`WEBGL_compressed_texture_s3tc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83f3,

	/**
	 * A DXT1-compressed image in an sRGB image format.
	 * @see [`WEBGL_compressed_texture_s3tc_srgb`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	COMPRESSED_SRGB_S3TC_DXT1_EXT = 0x8c4c,

	/**
	 * A DXT1-compressed image in an sRGB image format with a boolean alpha
	 * value.
	 * @see [`WEBGL_compressed_texture_s3tc_srgb`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 0x8c4d,

	/**
	 * A DXT3-compressed image in an sRGBA image format.
	 * @see [`WEBGL_compressed_texture_s3tc_srgb`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 0x8c4e,

	/**
	 * A DXT5-compressed image in an sRGBA image format.
	 * @see [`WEBGL_compressed_texture_s3tc_srgb`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 0x8c4f,

	/**
	 * One-channel unsigned format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_R11_EAC = 0x9270,

	/**
	 * One-channel signed format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SIGNED_R11_EAC = 0x9271,

	/**
	 * Two-channel unsigned format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RG11_EAC = 0x9272,

	/**
	 * Two-channel signed format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SIGNED_RG11_EAC = 0x9273,

	/**
	 * Compressed RGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGB8_ETC2 = 0x9274,

	/**
	 * Compressed RGB8 data.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGBA8_ETC2_EAC = 0x9275,

	/**
	 * Compressed sRGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_ETC2 = 0x9276,

	/**
	 * Compressed sRGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277,

	/**
	 * Compressed RGB8 data with the ability to punch through the alpha channel
	 * (make it completely opaque or transparent).
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278,

	/**
	 * Compressed sRGB8 data with the ability to punch through the alpha channel
	 * (make it completely opaque or transparent).
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279,

	/**
	 * RGB compression in 4-bit mode, with one block for every four-by-four
	 * block of pixels.
	 * @see [`WEBGL_compressed_texture_pvrtc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00,

	/**
	 * RGBA compression in 4-bit mode, with one block for every four-by-four
	 * block of pixels.
	 * @see [`WEBGL_compressed_texture_pvrtc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02,

	/**
	 * RGB compression in 2-bit mode, with one block for every eight-by-four
	 * block of pixels.
	 * @see [`WEBGL_compressed_texture_pvrtc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01,

	/**
	 * RGBA compression in 2-bit mode, with one block for every eight-by-four
	 * block of pixels.
	 * @see [`WEBGL_compressed_texture_pvrtc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03,

	/**
	 * An ASTC-compressed texture format with four-by-four blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93b0,

	/**
	 * An ASTC-compressed texture format with four-by-four blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 0x93d0,

	/**
	 * An ASTC-compressed texture format with five-by-four blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_5x4_KHR = 0x93b1,

	/**
	 * An ASTC-compressed texture format with five-by-four blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 0x93d1,

	/**
	 * An ASTC-compressed texture format with five-by-five blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_5x5_KHR = 0x93b2,

	/**
	 * An ASTC-compressed texture format with five-by-five blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 0x93d2,

	/**
	 * An ASTC-compressed texture format with six-by-five blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_6x5_KHR = 0x93b3,

	/**
	 * An ASTC-compressed texture format with six-by-five blocks for sRGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 0x93d3,

	/**
	 * An ASTC-compressed texture format with six-by-six blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_6x6_KHR = 0x93b4,

	/**
	 * An ASTC-compressed texture format with six-by-six blocks for sRGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 0x93d4,

	/**
	 * An ASTC-compressed texture format with eight-by-five blocks for RGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_8x5_KHR = 0x93b5,

	/**
	 * An ASTC-compressed texture format with eight-by-five blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 0x93d5,

	/**
	 * An ASTC-compressed texture format with eight-by-six blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_8x6_KHR = 0x93b6,

	/**
	 * An ASTC-compressed texture format with eight-by-six blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 0x93d6,

	/**
	 * An ASTC-compressed texture format with eight-by-eight blocks for RGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93b7,

	/**
	 * An ASTC-compressed texture format with eight-by-eight blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 0x93d7,

	/**
	 * An ASTC-compressed texture format with ten-by-five blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_10x5_KHR = 0x93b8,

	/**
	 * An ASTC-compressed texture format with ten-by-five blocks for sRGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 0x93d8,

	/**
	 * An ASTC-compressed texture format with ten-by-six blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_10x6_KHR = 0x93b9,

	/**
	 * An ASTC-compressed texture format with ten-by-six blocks for sRGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 0x93d9,

	/**
	 * An ASTC-compressed texture format with ten-by-eight blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_10x8_KHR = 0x93ba,

	/**
	 * An ASTC-compressed texture format with ten-by-eight blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 0x93da,

	/**
	 * An ASTC-compressed texture format with ten-by-ten blocks for RGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_10x10_KHR = 0x93bb,

	/**
	 * An ASTC-compressed texture format with ten-by-ten blocks for sRGBA data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 0x93db,

	/**
	 * An ASTC-compressed texture format with twelve-by-ten blocks for RGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_12x10_KHR = 0x93bc,

	/**
	 * An ASTC-compressed texture format with twelve-by-ten blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 0x93dc,

	/**
	 * An ASTC-compressed texture format with twelve-by-twelve blocks for RGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_RGBA_ASTC_12x12_KHR = 0x93bd,

	/**
	 * An ASTC-compressed texture format with twelve-by-twelve blocks for sRGBA
	 * data.
	 * @see [`WEBGL_compressed_texture_astc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 0x93dd,

	/**
	 * Compressed 8-bit fixed-point data in which each four-by-four block of
	 * texels consists of 128 bits of RGBA data.
	 * @see [`EXT_texture_compression_bptc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	COMPRESSED_RGBA_BPTC_UNORM_EXT = 0x8e8c,

	/**
	 * Compressed 8-bit fixed-point data in which each four-by-four block of
	 * texels consists of 128 bits of sRGBA data.
	 * @see [`EXT_texture_compression_bptc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 0x8e8d,

	/**
	 * Compressed high dynamic range signed floating-point values in which each
	 * four-by-four block of texels consists of 128 bits of RGB data and the
	 * returned alpha value is one.
	 * @see [`EXT_texture_compression_bptc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 0x8e8e,

	/**
	 * Compressed high dynamic range unsigned floating-point values in which
	 * each four-by-four block of texels consists of 128 bits of RGB data and
	 * the returned alpha value is one.
	 * @see [`EXT_texture_compression_bptc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 0x8e8f,

	/**
	 * Each four-by-four block of texels consists of 64 bits of unsigned red
	 * image data.
	 * @see [`EXT_texture_compression_rgtc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	COMPRESSED_RED_RGTC1_EXT = 0x8dbb,

	/**
	 * Each four-by-four block of texels consists of 64 bits of signed red
	 * image data.
	 * @see [`EXT_texture_compression_rgtc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	COMPRESSED_SIGNED_RED_RGTC1_EXT = 0x8dbc,

	/**
	 * Each four-by-four block of texels consists of 64 bits of unsigned red
	 * image data followed by 64 bits of unsigned green image data.
	 * @see [`EXT_texture_compression_rgtc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	COMPRESSED_RED_GREEN_RGTC2_EXT = 0x8dbd,

	/**
	 * Each four-by-four block of texels consists of 64 bits of signed red
	 * image data followed by 64 bits of signed green image data.
	 * @see [`EXT_texture_compression_rgtc`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = 0x8dbe
}

export default TextureInternalFormat;
