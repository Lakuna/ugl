import TextureInternalFormat from "#TextureInternalFormat";
import Extension from "#Extension";

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_RGB_S3TC_DXT1_EXT
		| TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT1_EXT
		| TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT3_EXT
		| TextureInternalFormat.COMPRESSED_RGBA_S3TC_DXT5_EXT
): Extension.CompressedTextureS3tc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_SRGB_S3TC_DXT1_EXT
		| TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT
		| TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT
		| TextureInternalFormat.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
): Extension.CompressedTextureS3tcSrgb;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_R11_EAC
		| TextureInternalFormat.COMPRESSED_SIGNED_R11_EAC
		| TextureInternalFormat.COMPRESSED_RG11_EAC
		| TextureInternalFormat.COMPRESSED_SIGNED_RG11_EAC
		| TextureInternalFormat.COMPRESSED_RGB8_ETC2
		| TextureInternalFormat.COMPRESSED_RGBA8_ETC2_EAC
		| TextureInternalFormat.COMPRESSED_SRGB8_ETC2
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
		| TextureInternalFormat.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2
		| TextureInternalFormat.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2
): Extension.CompressedTextureEtc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
		| TextureInternalFormat.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
		| TextureInternalFormat.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
		| TextureInternalFormat.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
): Extension.CompressedTexturePvrtc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_4x4_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_5x4_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_5x5_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_6x5_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_6x6_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x5_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x6_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_8x8_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x5_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x6_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x8_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_10x10_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_12x10_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
		| TextureInternalFormat.COMPRESSED_RGBA_ASTC_12x12_KHR
		| TextureInternalFormat.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
): Extension.CompressedTextureAstc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_RGBA_BPTC_UNORM_EXT
		| TextureInternalFormat.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
		| TextureInternalFormat.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT
		| TextureInternalFormat.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
): Extension.TextureCompressionBptc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.COMPRESSED_RED_RGTC1_EXT
		| TextureInternalFormat.COMPRESSED_SIGNED_RED_RGTC1_EXT
		| TextureInternalFormat.COMPRESSED_RED_GREEN_RGTC2_EXT
		| TextureInternalFormat.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
): Extension.TextureCompressionRgtc;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format:
		| TextureInternalFormat.RGB
		| TextureInternalFormat.RGBA
		| TextureInternalFormat.LUMINANCE_ALPHA
		| TextureInternalFormat.LUMINANCE
		| TextureInternalFormat.ALPHA
		| TextureInternalFormat.R8
		| TextureInternalFormat.R8_SNORM
		| TextureInternalFormat.R16F
		| TextureInternalFormat.R32F
		| TextureInternalFormat.R8UI
		| TextureInternalFormat.R8I
		| TextureInternalFormat.R16UI
		| TextureInternalFormat.R16I
		| TextureInternalFormat.R32UI
		| TextureInternalFormat.R32I
		| TextureInternalFormat.RG8
		| TextureInternalFormat.RG8_SNORM
		| TextureInternalFormat.RG16F
		| TextureInternalFormat.RG32F
		| TextureInternalFormat.RG8UI
		| TextureInternalFormat.RG8I
		| TextureInternalFormat.RG16UI
		| TextureInternalFormat.RG16I
		| TextureInternalFormat.RG32UI
		| TextureInternalFormat.RG32I
		| TextureInternalFormat.RGB8
		| TextureInternalFormat.SRGB8
		| TextureInternalFormat.RGB565
		| TextureInternalFormat.RGB8_SNORM
		| TextureInternalFormat.R11F_G11F_B10F
		| TextureInternalFormat.RGB9_E5
		| TextureInternalFormat.RGB16F
		| TextureInternalFormat.RGB32F
		| TextureInternalFormat.RGB8UI
		| TextureInternalFormat.RGB8I
		| TextureInternalFormat.RGB16UI
		| TextureInternalFormat.RGB16I
		| TextureInternalFormat.RGB32UI
		| TextureInternalFormat.RGB32I
		| TextureInternalFormat.RGBA8
		| TextureInternalFormat.SRGB8_ALPHA8
		| TextureInternalFormat.RGBA8_SNORM
		| TextureInternalFormat.RGB5_A1
		| TextureInternalFormat.RGBA4
		| TextureInternalFormat.RGB10_A2
		| TextureInternalFormat.RGBA16F
		| TextureInternalFormat.RGBA32F
		| TextureInternalFormat.RGBA8UI
		| TextureInternalFormat.RGBA8I
		| TextureInternalFormat.RGB10_A2UI
		| TextureInternalFormat.RGBA16UI
		| TextureInternalFormat.RGBA16I
		| TextureInternalFormat.RGBA32I
		| TextureInternalFormat.RGBA32UI
		| TextureInternalFormat.DEPTH_COMPONENT16
		| TextureInternalFormat.DEPTH_COMPONENT24
		| TextureInternalFormat.DEPTH_COMPONENT32F
		| TextureInternalFormat.DEPTH24_STENCIL8
		| TextureInternalFormat.DEPTH32F_STENCIL8
		| TextureInternalFormat.SRGB
		| TextureInternalFormat.SRGB_ALPHA
): null;

/**
 * Gets the extension that is associated with the given texture internal format.
 * @param format The texture internal format.
 * @returns The extension that is associated with the texture internal format.
 * @internal
 */
export default function getExtensionForTextureInternalFormat(
	format: TextureInternalFormat
): Extension | null;

export default function getExtensionForTextureInternalFormat(
	format: TextureInternalFormat
): Extension | null {
	switch (format) {
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
