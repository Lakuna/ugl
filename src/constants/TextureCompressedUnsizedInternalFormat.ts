/**
 * Compressed unsized formats for the color components in a texture.
 * @public
 */
enum TextureCompressedUnsizedInternalFormat {
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
	COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = 0x8dbe
}

export default TextureCompressedUnsizedInternalFormat;
