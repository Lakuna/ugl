/**
 * Sized internal formats for the color components in a texture.
 * @public
 */
enum TextureUncompressedSizedInternalFormat {
	/** Takes an 8-bit number for the red channel, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RED`. `type` must be `UNSIGNED_BYTE`. */
	R8 = 0x8229,

	/** Takes a signed 8-bit number for the red channel, normalized to `[-1,1]`. Texture filterable. `format` must be `RED`. `type` must be `BYTE`. */
	R8_SNORM = 0x8f94,

	/** Takes a 16-bit floating-point number for the red channel. Texture filterable. `format` must be `RED`. `type` must be `HALF_FLOAT` or `FLOAT`. */
	R16F = 0x822d,

	/** Takes a 32-bit floating-point number for the red channel. `format` must be `RED`. `type` must be `FLOAT`. */
	R32F = 0x822e,

	/** Takes an 8-bit unsigned integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_BYTE`. */
	R8UI = 0x8232,

	/** Takes an 8-bit integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `BYTE`. */
	R8I = 0x8231,

	/** Takes a 16-bit unsigned integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_SHORT`. */
	R16UI = 0x8234,

	/** Takes a 16-bit integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `SHORT`. */
	R16I = 0x8233,

	/** Takes a 32-bit unsigned integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_INT`. */
	R32UI = 0x8236,

	/** Takes a 32-bit integer for the red channel. Color renderable. `format` must be `RED_INTEGER`. `type` must be `INT`. */
	R32I = 0x8235,

	/** Takes 8-bit numbers for the red and green channels, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RG`. `type` must be `UNSIGNED_BYTE`. */
	RG8 = 0x822b,

	/** Takes signed 8-bit numbers for the red and green channels, normalized to `[-1,1]`. Texture filterable. `format` must be `RG`. `type` must be `BYTE`. */
	RG8_SNORM = 0x8f95,

	/** Takes 16-bit floating-point numbers for the red and green channels. Texture filterable. `format` must be `RG`. `type` must be `HALF_FLOAT` or `FLOAT`. */
	RG16F = 0x822f,

	/** Takes 32-bit floating-point numbers for the red and green channels. `format` must be `RG`. `type` must be `FLOAT`. */
	RG32F = 0x8230,

	/** Takes 8-bit unsigned integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_BYTE`. */
	RG8UI = 0x8238,

	/** Takes 8-bit integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `BYTE`. */
	RG8I = 0x8237,

	/** Takes 16-bit unsigned integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_SHORT`. */
	RG16UI = 0x823a,

	/** Takes 16-bit integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `SHORT`. */
	RG16I = 0x8239,

	/** Takes 32-bit unsigned integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_INT`. */
	RG32UI = 0x823c,

	/** Takes 32-bit integers for the red and green channels. Color renderable. `format` must be `RG_INTEGER`. `type` must be `INT`. */
	RG32I = 0x823b,

	/** Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. */
	RGB8 = 0x8051,

	/** Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. */
	SRGB8 = 0x8c41,

	/** Takes 5-bit numbers for the red and blue channels and a 6-bit number for the green channel, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. */
	RGB565 = 0x8d62,

	/** Takes signed 8-bit numbers for the red, green, and blue channels, normalized to `[-1,1]`. Texture filterable. `format` must be `RGB`. `type` must be `BYTE`. */
	RGB8_SNORM = 0x8f96,

	/** Takes 11-bit floating-point numbers for the red and green channels, and a 10-bit floating-point number for the blue channel. Texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_INT_10F_11F_11F_REV`, `HALF_FLOAT`, or `FLOAT`. */
	R11F_G11F_B10F = 0x8c3a,

	/** Takes 9-bit numbers for the red, green, and blue channels, normalized to `[0,1]`, with 5 shared bits. Texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_INT_5_9_9_9_REV`, `HALF_FLOAT`, or `FLOAT`. */
	RGB9_E5 = 0x8c3d,

	/** Takes 16-bit floating-point numbers for the red, green, and blue channels. Texture filterable. `format` must be `RGB`. `type` must be `HALF_FLOAT` or `FLOAT`. */
	RGB16F = 0x881b,

	/** Takes 32-bit floating-point numbers for the red, green, and blue channels. `format` must be `RGB`. `type` must be `FLOAT`. */
	RGB32F = 0x8815,

	/** Takes 8-bit unsigned integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_BYTE`. */
	RGB8UI = 0x8d7d,

	/** Takes 8-bit integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `BYTE`. */
	RGB8I = 0x8d8f,

	/** Takes 16-bit unsigned integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_SHORT`. */
	RGB16UI = 0x8d77,

	/** Takes 16-bit integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `SHORT`. */
	RGB16I = 0x8d89,

	/** Takes 32-bit unsigned integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_INT`. */
	RGB32UI = 0x8d71,

	/** Takes 32-bit integers for the red, green, and blue channels. `format` must be `RGB_INTEGER`. `type` must be `INT`. */
	RGB32I = 0x8d83,

	/** Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. */
	RGBA8 = 0x8058,

	/** Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. */
	SRGB8_ALPHA8 = 0x8c43,

	/** Takes signed 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[-1,1]`. Texture filterable. `format` must be `RGBA`. `type` must be `BYTE`. */
	RGBA8_SNORM = 0x8f97,

	/** Takes 5-bit numbers for the red, green, and blue channels and a 1-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_5_5_5_1`, or `UNSIGNED_INT_2_10_10_10_REV`. */
	RGB5_A1 = 0x8057,

	/** Takes 4-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_4_4_4_4`. */
	RGBA4 = 0x8056,

	/** Takes 10-bit numbers for the red, green, and blue channels and a 2-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. */
	RGB10_A2 = 0x8059,

	/** Takes 16-bit floating-point numbers for the red, green, blue, and alpha channels. Texture filterable. `format` must be `RGBA`. `type` must be `HALF_FLOAT` or `FLOAT`. */
	RGBA16F = 0x881a,

	/** Takes 32-bit floating-point numbers for the red, green, blue, and alpha channels. `format` must be `RGBA`. `type` must be `FLOAT`. */
	RGBA32F = 0x8814,

	/** Takes 8-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_BYTE`. */
	RGBA8UI = 0x8d7c,

	/** Takes 8-bit integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `BYTE`. */
	RGBA8I = 0x8d8e,

	/** Takes unsigned 10-bit integers for the red, green, and blue channels and a 2-bit unsigned integer for the alpha channel. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. */
	RGB10_A2UI = 0x906f,

	/** Takes 16-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_SHORT`. */
	RGBA16UI = 0x8d76,

	/** Takes 16-bit integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `SHORT`. */
	RGBA16I = 0x8d88,

	/** Takes 32-bit integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `INT`. */
	RGBA32I = 0x8d82,

	/** Takes 32-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT`. */
	RGBA32UI = 0x8d70,

	/** Takes a 32-bit unsigned integer for the depth channel. `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_SHORT` or `UNSIGNED_INT`. */
	DEPTH_COMPONENT16 = 0x81a5,

	/** Takes a 24-bit unsigned integer for the depth channel. `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_INT`. */
	DEPTH_COMPONENT24 = 0x81a6,

	/** Takes a 32-bit floating-point value for the depth channel. `format` must be `DEPTH_COMPONENT`. `type` must be `FLOAT`. */
	DEPTH_COMPONENT32F = 0x8cac,

	/** Takes a 24-bit unsigned integer for the depth channel and an 8-bit unsigned integer for the stencil channel. `format` must be `DEPTH_STENCIL`. `type` must be `UNSIGNED_INT_24_8`. */
	DEPTH24_STENCIL8 = 0x88f0,

	/**
	 * Takes a 32-bit floating-point value for the depth channel and an 8-bit unsigned integer for the stencil channel. `format` must be `DEPTH_STENCIL`. `type` must be `FLOAT_32_UNSIGNED_INT_24_8_REV`.
	 * @deprecated The `FLOAT_32_UNSIGNED_INT_24_8_REV` data type is unusable in WebGL.
	 */
	DEPTH32F_STENCIL8 = 0x8cad
}

export default TextureUncompressedSizedInternalFormat;
