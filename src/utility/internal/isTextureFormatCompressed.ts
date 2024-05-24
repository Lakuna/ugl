import TextureFormat from "#TextureFormat";

/**
 * Determines whether the given texture format is compressed.
 * @param format The texture format.
 * @returns Whether the given texture format is compressed.
 * @see [Compressed texture formats](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Compressed_texture_formats)
 * @internal
 */
export default function isTextureFormatCompressed(
	format: TextureFormat
): boolean {
	return (
		format == TextureFormat.COMPRESSED_RGB_S3TC_DXT1_EXT ||
		format == TextureFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT ||
		format == TextureFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT ||
		format == TextureFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT ||
		format == TextureFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT ||
		format == TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT ||
		format == TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT ||
		format == TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT ||
		format == TextureFormat.COMPRESSED_R11_EAC ||
		format == TextureFormat.COMPRESSED_SIGNED_R11_EAC ||
		format == TextureFormat.COMPRESSED_RG11_EAC ||
		format == TextureFormat.COMPRESSED_SIGNED_RG11_EAC ||
		format == TextureFormat.COMPRESSED_RGB8_ETC2 ||
		format == TextureFormat.COMPRESSED_RGBA8_ETC2_EAC ||
		format == TextureFormat.COMPRESSED_SRGB8_ETC2 ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC ||
		format == TextureFormat.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 ||
		format == TextureFormat.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 ||
		format == TextureFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG ||
		format == TextureFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG ||
		format == TextureFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG ||
		format == TextureFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_4x4_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_5x4_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_5x5_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_6x5_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_6x6_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_8x5_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_8x6_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_8x8_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_10x5_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_10x6_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_10x8_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_10x10_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_12x10_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_ASTC_12x12_KHR ||
		format == TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR ||
		format == TextureFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT ||
		format == TextureFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT ||
		format == TextureFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT ||
		format == TextureFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT ||
		format == TextureFormat.COMPRESSED_RED_RGTC1_EXT ||
		format == TextureFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT ||
		format == TextureFormat.COMPRESSED_RED_GREEN_RGTC2_EXT ||
		format == TextureFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
	);
}
