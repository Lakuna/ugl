/**
 * Internal formats for textures. In the WebGL API, these are typically passed to functions with the parameter name `internalFormat`.
 * @public
 */
enum TextureFormat {
	// Uncompressed, unsized internal formats.

	/** Color renderable and texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. */
	RGB = 0x1907,

	/** Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. */
	RGBA = 0x1908,

	/** Color renderable and texture filterable. `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`. */
	LUMINANCE_ALPHA = 0x190a,

	/** Color renderable and texture filterable. `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. */
	LUMINANCE = 0x1909,

	/** Color renderable and texture filterable. `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. */
	ALPHA = 0x1906,

	/** Unsized sRGB format that leaves the precision up to the driver. */
	SRGB = 0x8c40,

	/** Unsized sRGB format with an unsized alpha component. */
	SRGB_ALPHA = 0x8c42,

	// Uncompressed, sized internal formats.

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
	DEPTH32F_STENCIL8 = 0x8cad,

	// Compressed, unsized internal formats.

	/** A DXT1-compressed image in an RGB image format. */
	COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0,

	/** A DXT1-compressed image in an RGB image format with a boolean alpha value. */
	COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1,

	/** A DXT3-compressed image in an RGBA image format. */
	COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83f2,

	/** A DXT5-compressed image in an RGBA image format. */
	COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83f3,

	/** A DXT1-compressed image in an sRGB image format. */
	COMPRESSED_SRGB_S3TC_DXT1_EXT = 0x8c4c,

	/** A DXT1-compressed image in an sRGB image format with a boolean alpha value. */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 0x8c4d,

	/** A DXT3-compressed image in an sRGBA image format. */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 0x8c4e,

	/** A DXT5-compressed image in an sRGBA image format. */
	COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 0x8c4f,

	/**
	 * RGB compression in 4-bit mode, with one block for every four-by-four block of pixels.
	 * @deprecated Typically only available on mobile devices with PowerVR chipsets.
	 */
	COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00,

	/**
	 * RGBA compression in 4-bit mode, with one block for every four-by-four block of pixels.
	 * @deprecated Typically only available on mobile devices with PowerVR chipsets.
	 */
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02,

	/**
	 * RGB compression in 2-bit mode, with one block for every eight-by-four block of pixels.
	 * @deprecated Typically only available on mobile devices with PowerVR chipsets.
	 */
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01,

	/**
	 * RGBA compression in 2-bit mode, with one block for every eight-by-four block of pixels.
	 * @deprecated Typically only available on mobile devices with PowerVR chipsets.
	 */
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03,

	/**
	 * An ASTC-compressed texture format with four-by-four blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93b0,

	/**
	 * An ASTC-compressed texture format with four-by-four blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 0x93d0,

	/**
	 * An ASTC-compressed texture format with five-by-four blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_5x4_KHR = 0x93b1,

	/**
	 * An ASTC-compressed texture format with five-by-four blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 0x93d1,

	/**
	 * An ASTC-compressed texture format with five-by-five blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_5x5_KHR = 0x93b2,

	/**
	 * An ASTC-compressed texture format with five-by-five blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 0x93d2,

	/**
	 * An ASTC-compressed texture format with six-by-five blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_6x5_KHR = 0x93b3,

	/**
	 * An ASTC-compressed texture format with six-by-five blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 0x93d3,

	/**
	 * An ASTC-compressed texture format with six-by-six blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_6x6_KHR = 0x93b4,

	/**
	 * An ASTC-compressed texture format with six-by-six blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 0x93d4,

	/**
	 * An ASTC-compressed texture format with eight-by-five blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_8x5_KHR = 0x93b5,

	/**
	 * An ASTC-compressed texture format with eight-by-five blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 0x93d5,

	/**
	 * An ASTC-compressed texture format with eight-by-six blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_8x6_KHR = 0x93b6,

	/**
	 * An ASTC-compressed texture format with eight-by-six blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 0x93d6,

	/**
	 * An ASTC-compressed texture format with eight-by-eight blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93b7,

	/**
	 * An ASTC-compressed texture format with eight-by-eight blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 0x93d7,

	/**
	 * An ASTC-compressed texture format with ten-by-five blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_10x5_KHR = 0x93b8,

	/**
	 * An ASTC-compressed texture format with ten-by-five blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 0x93d8,

	/**
	 * An ASTC-compressed texture format with ten-by-six blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_10x6_KHR = 0x93b9,

	/**
	 * An ASTC-compressed texture format with ten-by-six blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 0x93d9,

	/**
	 * An ASTC-compressed texture format with ten-by-eight blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_10x8_KHR = 0x93ba,

	/**
	 * An ASTC-compressed texture format with ten-by-eight blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 0x93da,

	/**
	 * An ASTC-compressed texture format with ten-by-ten blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_10x10_KHR = 0x93bb,

	/**
	 * An ASTC-compressed texture format with ten-by-ten blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 0x93db,

	/**
	 * An ASTC-compressed texture format with twelve-by-ten blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_12x10_KHR = 0x93bc,

	/**
	 * An ASTC-compressed texture format with twelve-by-ten blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 0x93dc,

	/**
	 * An ASTC-compressed texture format with twelve-by-twelve blocks for RGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_RGBA_ASTC_12x12_KHR = 0x93bd,

	/**
	 * An ASTC-compressed texture format with twelve-by-twelve blocks for sRGBA data.
	 * @deprecated Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 */
	COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 0x93dd,

	/**
	 * Compressed 8-bit fixed-point data in which each four-by-four block of texels consists of 128 bits of RGBA data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_RGBA_BPTC_UNORM_EXT = 0x8e8c,

	/**
	 * Compressed 8-bit fixed-point data in which each four-by-four block of texels consists of 128 bits of sRGBA data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 0x8e8d,

	/**
	 * Compressed high dynamic range signed floating-point values in which each four-by-four block of texels consists of 128 bits of RGB data and the returned alpha value is one.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 0x8e8e,

	/**
	 * Compressed high dynamic range unsigned floating-point values in which each four-by-four block of texels consists of 128 bits of RGB data and the returned alpha value is one.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 0x8e8f,

	/**
	 * Each four-by-four block of texels consists of 64 bits of unsigned red image data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_RED_RGTC1_EXT = 0x8dbb,

	/**
	 * Each four-by-four block of texels consists of 64 bits of signed red image data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_SIGNED_RED_RGTC1_EXT = 0x8dbc,

	/**
	 * Each four-by-four block of texels consists of 64 bits of unsigned red image data followed by 64 bits of unsigned green image data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_RED_GREEN_RGTC2_EXT = 0x8dbd,

	/**
	 * Each four-by-four block of texels consists of 64 bits of signed red image data followed by 64 bits of signed green image data.
	 * @deprecated Support depends on the system's graphics driver. Not supported by Windows.
	 */
	COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = 0x8dbe,

	// Compressed, sized internal formats.

	/** One-channel unsigned format compression. */
	COMPRESSED_R11_EAC = 0x9270,

	/** One-channel signed format compression. */
	COMPRESSED_SIGNED_R11_EAC = 0x9271,

	/** Two-channel unsigned format compression. */
	COMPRESSED_RG11_EAC = 0x9272,

	/** Two-channel signed format compression. */
	COMPRESSED_SIGNED_RG11_EAC = 0x9273,

	/** Compressed RGB8 data with no alpha channel. */
	COMPRESSED_RGB8_ETC2 = 0x9274,

	/** Compressed RGB8 data. */
	COMPRESSED_RGBA8_ETC2_EAC = 0x9275,

	/** Compressed sRGB8 data with no alpha channel. */
	COMPRESSED_SRGB8_ETC2 = 0x9276,

	/** Compressed sRGB8 data with no alpha channel. */
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277,

	/** Compressed RGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent). */
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278,

	/** Compressed sRGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent). */
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279
}

export default TextureFormat;
