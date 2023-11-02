import TextureInternalFormat from "#TextureInternalFormat";
import Extension from "#Extension";

/**
 * Gets the extension that is associated with the given texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format: TextureInternalFormat
): Extension | null {
	switch (format) {
		case TextureInternalFormat.SRGB:
		case TextureInternalFormat.SRGB_ALPHA:
			return Extension.Srgb;
		case TextureInternalFormat.COMPRESSED_RGB_S3TC_DXT1_EXT:
		case TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT:
		case TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT:
		case TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT:
			return Extension.CompressedTextureS3tc;
		case TextureInternalFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT:
		case TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
		case TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
		case TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
			return Extension.CompressedTextureS3tcSrgb;
		case TextureInternalFormat.COMPRESSED_R11_EAC:
		case TextureInternalFormat.COMPRESSED_SIGNED_R11_EAC:
		case TextureInternalFormat.COMPRESSED_RG11_EAC:
		case TextureInternalFormat.COMPRESSED_SIGNED_RG11_EAC:
		case TextureInternalFormat.COMPRESSED_RGB8_ETC2:
		case TextureInternalFormat.COMPRESSED_RGBA8_ETC2_EAC:
		case TextureInternalFormat.COMPRESSED_SRGB8_ETC2:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:
		case TextureInternalFormat.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:
		case TextureInternalFormat.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:
			return Extension.CompressedTextureEtc;
		case TextureInternalFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
		case TextureInternalFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
		case TextureInternalFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
		case TextureInternalFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
			return Extension.CompressedTexturePvrtc;
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_4x4_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_5x4_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_5x5_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_6x5_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_6x6_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x5_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x6_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x8_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x5_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x6_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x8_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x10_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_12x10_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:
		case TextureInternalFormat.COMPRESSED_RGBA_ASTC_12x12_KHR:
		case TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:
			return Extension.CompressedTextureAstc;
		case TextureInternalFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT:
		case TextureInternalFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:
		case TextureInternalFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT:
		case TextureInternalFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT:
			return Extension.TextureCompressionBptc;
		case TextureInternalFormat.COMPRESSED_RED_RGTC1_EXT:
		case TextureInternalFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT:
		case TextureInternalFormat.COMPRESSED_RED_GREEN_RGTC2_EXT:
		case TextureInternalFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
			return Extension.TextureCompressionRgtc;
		default:
			return null;
	}
}
