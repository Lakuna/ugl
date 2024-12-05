import TextureDataType from "../../constants/TextureDataType.js";
import TextureFormat from "../../constants/TextureFormat.js";

/**
 * Get a list of data types that can be supplied to the given texture internal format.
 * @param internalFormat - The texture internal format.
 * @returns A list of data types. The first data type in the list is a sensible default.
 * @internal
 */
export default function getTextureDataTypesForTextureFormat(
	internalFormat: TextureFormat
): TextureDataType[] {
	switch (internalFormat) {
		case TextureFormat.RGB:
		case TextureFormat.RGB565:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_5_6_5
			];
		case TextureFormat.RGBA:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_4_4_4_4,
				TextureDataType.UNSIGNED_SHORT_5_5_5_1
			];
		case TextureFormat.LUMINANCE_ALPHA:
		case TextureFormat.LUMINANCE:
		case TextureFormat.ALPHA:
		case TextureFormat.R8:
		case TextureFormat.R8UI:
		case TextureFormat.RG8:
		case TextureFormat.RG8UI:
		case TextureFormat.RGB8:
		case TextureFormat.SRGB8:
		case TextureFormat.RGB8UI:
		case TextureFormat.RGBA8:
		case TextureFormat.SRGB8_ALPHA8:
		case TextureFormat.RGBA8UI:
			return [TextureDataType.UNSIGNED_BYTE];
		case TextureFormat.R8_SNORM:
		case TextureFormat.R8I:
		case TextureFormat.RG8_SNORM:
		case TextureFormat.RG8I:
		case TextureFormat.RGB8_SNORM:
		case TextureFormat.RGB8I:
		case TextureFormat.RGBA8_SNORM:
		case TextureFormat.RGBA8I:
			return [TextureDataType.BYTE];
		case TextureFormat.R16F:
		case TextureFormat.RG16F:
		case TextureFormat.RGB16F:
		case TextureFormat.RGBA16F:
			return [TextureDataType.FLOAT, TextureDataType.HALF_FLOAT];
		case TextureFormat.R32F:
		case TextureFormat.RG32F:
		case TextureFormat.RGB32F:
		case TextureFormat.RGBA32F:
		case TextureFormat.DEPTH_COMPONENT32F:
			return [TextureDataType.FLOAT];
		case TextureFormat.R16UI:
		case TextureFormat.RG16UI:
		case TextureFormat.RGB16UI:
		case TextureFormat.RGBA16UI:
			return [TextureDataType.UNSIGNED_SHORT];
		case TextureFormat.R16I:
		case TextureFormat.RG16I:
		case TextureFormat.RGB16I:
		case TextureFormat.RGBA16I:
			return [TextureDataType.SHORT];
		case TextureFormat.R32UI:
		case TextureFormat.RG32UI:
		case TextureFormat.RGB32UI:
		case TextureFormat.RGBA32UI:
		case TextureFormat.DEPTH_COMPONENT24:
			return [TextureDataType.UNSIGNED_INT];
		case TextureFormat.R32I:
		case TextureFormat.RG32I:
		case TextureFormat.RGB32I:
		case TextureFormat.RGBA32I:
			return [TextureDataType.INT];
		case TextureFormat.R11F_G11F_B10F:
			return [
				TextureDataType.FLOAT,
				TextureDataType.UNSIGNED_INT_10F_11F_11F_REV,
				TextureDataType.HALF_FLOAT
			];
		case TextureFormat.RGB9_E5:
			return [
				TextureDataType.FLOAT,
				TextureDataType.UNSIGNED_INT_5_9_9_9_REV,
				TextureDataType.HALF_FLOAT
			];
		case TextureFormat.RGB5_A1:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_5_5_5_1,
				TextureDataType.UNSIGNED_INT_2_10_10_10_REV
			];
		case TextureFormat.RGBA4:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_4_4_4_4
			];
		case TextureFormat.RGB10_A2:
		case TextureFormat.RGB10_A2UI:
			return [TextureDataType.UNSIGNED_INT_2_10_10_10_REV];
		case TextureFormat.DEPTH_COMPONENT16:
			return [TextureDataType.UNSIGNED_SHORT, TextureDataType.UNSIGNED_INT];
		case TextureFormat.DEPTH24_STENCIL8:
			return [TextureDataType.UNSIGNED_INT_24_8];
		case TextureFormat.DEPTH32F_STENCIL8:
			return [TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV];
		default:
			return [];
	}
}
