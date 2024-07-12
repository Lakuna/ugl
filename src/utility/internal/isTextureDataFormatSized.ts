import TextureFormat from "../../constants/TextureFormat.js";

/**
 * Determine whether or not the given texture format is sized.
 * @param format - The texture format.
 * @returns Whether or not the given texture format is sized.
 * @internal
 */
export default function isTextureFormatSized(format: TextureFormat) {
	switch (format) {
		case TextureFormat.R8:
		case TextureFormat.R8_SNORM:
		case TextureFormat.R16F:
		case TextureFormat.R32F:
		case TextureFormat.R8UI:
		case TextureFormat.R8I:
		case TextureFormat.R16UI:
		case TextureFormat.R16I:
		case TextureFormat.R32UI:
		case TextureFormat.R32I:
		case TextureFormat.RG8:
		case TextureFormat.RG8_SNORM:
		case TextureFormat.RG16F:
		case TextureFormat.RG32F:
		case TextureFormat.RG8UI:
		case TextureFormat.RG8I:
		case TextureFormat.RG16UI:
		case TextureFormat.RG16I:
		case TextureFormat.RG32UI:
		case TextureFormat.RG32I:
		case TextureFormat.RGB8:
		case TextureFormat.SRGB8:
		case TextureFormat.RGB565:
		case TextureFormat.RGB8_SNORM:
		case TextureFormat.R11F_G11F_B10F:
		case TextureFormat.RGB9_E5:
		case TextureFormat.RGB16F:
		case TextureFormat.RGB32F:
		case TextureFormat.RGB8UI:
		case TextureFormat.RGB8I:
		case TextureFormat.RGB16UI:
		case TextureFormat.RGB16I:
		case TextureFormat.RGB32UI:
		case TextureFormat.RGB32I:
		case TextureFormat.RGBA8:
		case TextureFormat.SRGB8_ALPHA8:
		case TextureFormat.RGBA8_SNORM:
		case TextureFormat.RGB5_A1:
		case TextureFormat.RGBA4:
		case TextureFormat.RGB10_A2:
		case TextureFormat.RGBA16F:
		case TextureFormat.RGBA32F:
		case TextureFormat.RGBA8UI:
		case TextureFormat.RGBA8I:
		case TextureFormat.RGB10_A2UI:
		case TextureFormat.RGBA16UI:
		case TextureFormat.RGBA16I:
		case TextureFormat.RGBA32I:
		case TextureFormat.RGBA32UI:
		case TextureFormat.DEPTH_COMPONENT16:
		case TextureFormat.DEPTH_COMPONENT24:
		case TextureFormat.DEPTH_COMPONENT32F:
		case TextureFormat.DEPTH24_STENCIL8:
		case TextureFormat.DEPTH32F_STENCIL8:
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
			return true;
		default:
			return false;
	}
}
