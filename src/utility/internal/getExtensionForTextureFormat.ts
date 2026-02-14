import Extension from "../../constants/Extension.js";
import TextureFormat from "../../constants/TextureFormat.js";

/**
 * Get the extension that is associated with the given texture internal format.
 * @param format - The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format: TextureFormat
): Extension | null {
	switch (format) {
		case TextureFormat.COMPRESSED_RGB_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT:
			return Extension.COMPRESSED_TEXTURE_S3TC;
		case TextureFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
			return Extension.COMPRESSED_TEXTURE_S3TC_SRGB;
		case TextureFormat.COMPRESSED_R11_EAC:
		case TextureFormat.COMPRESSED_SIGNED_R11_EAC:
		case TextureFormat.COMPRESSED_RG11_EAC:
		case TextureFormat.COMPRESSED_SIGNED_RG11_EAC:
		case TextureFormat.COMPRESSED_RGB8_ETC2:
		case TextureFormat.COMPRESSED_RGBA8_ETC2_EAC:
		case TextureFormat.COMPRESSED_SRGB8_ETC2:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:
		case TextureFormat.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:
		case TextureFormat.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:
			return Extension.COMPRESSED_TEXTURE_ETC;
		case TextureFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
			return Extension.COMPRESSED_TEXTURE_PVRTC;
		case TextureFormat.COMPRESSED_RGBA_ASTC_4X4_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_5X4_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_5X5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_6X5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_6X6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8X5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8X6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8X8_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10X5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10X6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10X8_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10X10_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_12X10_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_12X12_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR:
			return Extension.COMPRESSED_TEXTURE_ASTC;
		case TextureFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:
		case TextureFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT:
		case TextureFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT:
			return Extension.TEXTURE_COMPRESSION_BPTC;
		case TextureFormat.COMPRESSED_RED_RGTC1_EXT:
		case TextureFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT:
		case TextureFormat.COMPRESSED_RED_GREEN_RGTC2_EXT:
		case TextureFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
			return Extension.TEXTURE_COMPRESSION_RGTC;
		default:
			return null;
	}
}
