import TextureFormat from "#TextureFormat";
import Extension from "#Extension";

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_RGB_S3TC_DXT1_EXT
		| TextureFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT
		| TextureFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT
		| TextureFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT
): Extension.CompressedTextureS3tc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT
		| TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT
		| TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT
		| TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
): Extension.CompressedTextureS3tcSrgb;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_R11_EAC
		| TextureFormat.COMPRESSED_SIGNED_R11_EAC
		| TextureFormat.COMPRESSED_RG11_EAC
		| TextureFormat.COMPRESSED_SIGNED_RG11_EAC
		| TextureFormat.COMPRESSED_RGB8_ETC2
		| TextureFormat.COMPRESSED_RGBA8_ETC2_EAC
		| TextureFormat.COMPRESSED_SRGB8_ETC2
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
		| TextureFormat.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2
		| TextureFormat.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2
): Extension.CompressedTextureEtc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
		| TextureFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
		| TextureFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
		| TextureFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
): Extension.CompressedTexturePvrtc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_RGBA_ASTC_4x4_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_5x4_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_5x5_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_6x5_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_6x6_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_8x5_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_8x6_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_8x8_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_10x5_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_10x6_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_10x8_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_10x10_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_12x10_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
		| TextureFormat.COMPRESSED_RGBA_ASTC_12x12_KHR
		| TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
): Extension.CompressedTextureAstc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT
		| TextureFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
		| TextureFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT
		| TextureFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
): Extension.TextureCompressionBptc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.COMPRESSED_RED_RGTC1_EXT
		| TextureFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT
		| TextureFormat.COMPRESSED_RED_GREEN_RGTC2_EXT
		| TextureFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
): Extension.TextureCompressionRgtc;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format:
		| TextureFormat.RGB
		| TextureFormat.RGBA
		| TextureFormat.LUMINANCE_ALPHA
		| TextureFormat.LUMINANCE
		| TextureFormat.ALPHA
		| TextureFormat.RED
		| TextureFormat.RED_INTEGER
		| TextureFormat.RG
		| TextureFormat.RG_INTEGER
		| TextureFormat.RGB_INTEGER
		| TextureFormat.RGBA_INTEGER
		| TextureFormat.DEPTH_COMPONENT
		| TextureFormat.DEPTH_STENCIL
		| TextureFormat.SRGB
		| TextureFormat.SRGB_ALPHA
): null;

/**
 * Gets the extension that is associated with the given texture format.
 * @param format The texture format.
 * @returns The extension that is associated with the texture format.
 * @internal
 */
export default function getExtensionForTextureFormat(
	format: TextureFormat
): Extension | null;

export default function getExtensionForTextureFormat(
	format: TextureFormat
): Extension | null {
	switch (format) {
		case TextureFormat.COMPRESSED_RGB_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT:
		case TextureFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT:
			return Extension.CompressedTextureS3tc;
		case TextureFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
			return Extension.CompressedTextureS3tcSrgb;
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
			return Extension.CompressedTextureEtc;
		case TextureFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
		case TextureFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
			return Extension.CompressedTexturePvrtc;
		case TextureFormat.COMPRESSED_RGBA_ASTC_4x4_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_5x4_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_5x5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_6x5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_6x6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8x5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8x6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_8x8_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10x5_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10x6_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10x8_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_10x10_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_12x10_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:
		case TextureFormat.COMPRESSED_RGBA_ASTC_12x12_KHR:
		case TextureFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:
			return Extension.CompressedTextureAstc;
		case TextureFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT:
		case TextureFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:
		case TextureFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT:
		case TextureFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT:
		case TextureFormat.COMPRESSED_RED_RGTC1_EXT:
		case TextureFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT:
		case TextureFormat.COMPRESSED_RED_GREEN_RGTC2_EXT:
		case TextureFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
			return Extension.TextureCompressionRgtc;
		default:
			return null;
	}
}
