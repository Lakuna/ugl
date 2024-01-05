/**
 * Formats for the color components in a texture.
 * @see [`compressedTexSubImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D)
 * @see [`texImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)
 * @see [`texSubImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D)
 * @see [`compressedTexSubImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D)
 * @see [`texImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D)
 * @see [`texSubImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texSubImage3D)
 */
enum TextureFormat {
	/**
	 * Each element is a red/green/blue triple. Fixed-point normalized
	 * components are converted to floating-point, clamped to `[0,1]`, and
	 * assembled into an RGBA element by using `1` for alpha.
	 */
	RGB = 0x1907,

	/** Each element contains all four components. */
	RGBA = 0x1908,

	/**
	 * Each element is a luminance/alpha double. Components are converted to
	 * floating-point, clamped to `[0,1]`, and assembled into an RGBA element
	 * by using the luminance value for red, green, and blue.
	 */
	LUMINANCE_ALPHA = 0x190a,

	/**
	 * Each element is a single luminance component. Components are converted
	 * to floating-point, clamped to `[0,1]`, and assembled into an RGBA
	 * element by using the luminance value for red, green, and blue and `1`
	 * for alpha.
	 */
	LUMINANCE = 0x1909,

	/**
	 * Each element is a single alpha component. Components are converted to
	 * floating-point, clamped to `[0,1]`, and assembled into an RGBA element
	 * by using `0` for red, green, and blue.
	 */
	ALPHA = 0x1906,

	/**
	 * Each element is a single red component. Fixed-point normalized
	 * components are converted to floating-point, clamped to `[0,1]`, and
	 * assembled into an RGBA element by using `0` for green and blue and `1`
	 * for alpha.
	 */
	RED = 0x1903,

	/**
	 * Each element is a single red component. Components are assembled into an
	 * RGBA element by using `0` for green and blue and `1` for alpha.
	 */
	RED_INTEGER = 0x8d94,

	/**
	 * Each element is a red/green double. Fixed-point normalized components
	 * are converted to floating-point, clamped to `[0,1]`, and assembled into
	 * an RGBA element by using `0` for blue and `1` for alpha.
	 */
	RG = 0x8227,

	/**
	 * Each element is a red/green double. Components are assembled into an
	 * RGBA element by using `0` for blue and `1` for alpha.
	 */
	RG_INTEGER = 0x8228,

	/** Each element contains all four components. */
	RGB_INTEGER = 0x8d98,

	/**
	 * Indicates that a texture uses the red, green, blue, and alpha channels
	 * and stores integers.
	 */
	RGBA_INTEGER = 0x8d99,

	/**
	 * Each element contains a single depth value. Components are converted to
	 * floating-point and clamped to `[0,1]`.
	 */
	DEPTH_COMPONENT = 0x1902,

	/**
	 * Each element is a pair of depth and stencil values. The depth component
	 * is interpreted as with `DEPTH_COMPONENT`. The stencil component is
	 * interpreted based on the internal format.
	 */
	DEPTH_STENCIL = 0x84f9,

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

export default TextureFormat;
