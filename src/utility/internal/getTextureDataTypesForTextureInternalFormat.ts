import TextureDataType from "../../constants/TextureDataType.js";
import type { TextureInternalFormat } from "../../types/TextureInternalFormat.js";
import TextureUncompressedSizedInternalFormat from "../../constants/TextureUncompressedSizedInternalFormat.js";
import TextureUncompressedUnsizedInternalFormat from "../../constants/TextureUncompressedUnsizedInternalFormat.js";

/**
 * Get a list of data types that can be supplied to the given texture internal format.
 * @param internalFormat - The texture internal format.
 * @returns A list of data types. If the return value is not null, it is guaranteed to contain at least one data type. The first data type in the list is a sensible default.
 * @internal
 */
export default function getTextureDataTypesForTextureInternalFormat(
	internalFormat: TextureInternalFormat
) {
	switch (internalFormat) {
		case TextureUncompressedUnsizedInternalFormat.RGB:
		case TextureUncompressedSizedInternalFormat.RGB565:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_5_6_5
			];
		case TextureUncompressedUnsizedInternalFormat.RGBA:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_4_4_4_4,
				TextureDataType.UNSIGNED_SHORT_5_5_5_1
			];
		case TextureUncompressedUnsizedInternalFormat.LUMINANCE_ALPHA:
		case TextureUncompressedUnsizedInternalFormat.LUMINANCE:
		case TextureUncompressedUnsizedInternalFormat.ALPHA:
		case TextureUncompressedSizedInternalFormat.R8:
		case TextureUncompressedSizedInternalFormat.R8UI:
		case TextureUncompressedSizedInternalFormat.RG8:
		case TextureUncompressedSizedInternalFormat.RG8UI:
		case TextureUncompressedSizedInternalFormat.RGB8:
		case TextureUncompressedSizedInternalFormat.SRGB8:
		case TextureUncompressedSizedInternalFormat.RGB8UI:
		case TextureUncompressedSizedInternalFormat.RGBA8:
		case TextureUncompressedSizedInternalFormat.SRGB8_ALPHA8:
		case TextureUncompressedSizedInternalFormat.RGBA8UI:
			return [TextureDataType.UNSIGNED_BYTE];
		case TextureUncompressedSizedInternalFormat.R8_SNORM:
		case TextureUncompressedSizedInternalFormat.R8I:
		case TextureUncompressedSizedInternalFormat.RG8_SNORM:
		case TextureUncompressedSizedInternalFormat.RG8I:
		case TextureUncompressedSizedInternalFormat.RGB8_SNORM:
		case TextureUncompressedSizedInternalFormat.RGB8I:
		case TextureUncompressedSizedInternalFormat.RGBA8_SNORM:
		case TextureUncompressedSizedInternalFormat.RGBA8I:
			return [TextureDataType.BYTE];
		case TextureUncompressedSizedInternalFormat.R16F:
		case TextureUncompressedSizedInternalFormat.RG16F:
		case TextureUncompressedSizedInternalFormat.RGB16F:
		case TextureUncompressedSizedInternalFormat.RGBA16F:
			return [TextureDataType.FLOAT, TextureDataType.HALF_FLOAT];
		case TextureUncompressedSizedInternalFormat.R32F:
		case TextureUncompressedSizedInternalFormat.RG32F:
		case TextureUncompressedSizedInternalFormat.RGB32F:
		case TextureUncompressedSizedInternalFormat.RGBA32F:
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT32F:
			return [TextureDataType.FLOAT];
		case TextureUncompressedSizedInternalFormat.R16UI:
		case TextureUncompressedSizedInternalFormat.RG16UI:
		case TextureUncompressedSizedInternalFormat.RGB16UI:
		case TextureUncompressedSizedInternalFormat.RGBA16UI:
			return [TextureDataType.UNSIGNED_SHORT];
		case TextureUncompressedSizedInternalFormat.R16I:
		case TextureUncompressedSizedInternalFormat.RG16I:
		case TextureUncompressedSizedInternalFormat.RGB16I:
		case TextureUncompressedSizedInternalFormat.RGBA16I:
			return [TextureDataType.SHORT];
		case TextureUncompressedSizedInternalFormat.R32UI:
		case TextureUncompressedSizedInternalFormat.RG32UI:
		case TextureUncompressedSizedInternalFormat.RGB32UI:
		case TextureUncompressedSizedInternalFormat.RGBA32UI:
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT24:
			return [TextureDataType.UNSIGNED_INT];
		case TextureUncompressedSizedInternalFormat.R32I:
		case TextureUncompressedSizedInternalFormat.RG32I:
		case TextureUncompressedSizedInternalFormat.RGB32I:
		case TextureUncompressedSizedInternalFormat.RGBA32I:
			return [TextureDataType.INT];
		case TextureUncompressedSizedInternalFormat.R11F_G11F_B10F:
			return [
				TextureDataType.FLOAT,
				TextureDataType.UNSIGNED_INT_10F_11F_11F_REV,
				TextureDataType.HALF_FLOAT
			];
		case TextureUncompressedSizedInternalFormat.RGB9_E5:
			return [
				TextureDataType.FLOAT,
				TextureDataType.UNSIGNED_INT_5_9_9_9_REV,
				TextureDataType.HALF_FLOAT
			];
		case TextureUncompressedSizedInternalFormat.RGB5_A1:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_5_5_5_1,
				TextureDataType.UNSIGNED_INT_2_10_10_10_REV
			];
		case TextureUncompressedSizedInternalFormat.RGBA4:
			return [
				TextureDataType.UNSIGNED_BYTE,
				TextureDataType.UNSIGNED_SHORT_4_4_4_4
			];
		case TextureUncompressedSizedInternalFormat.RGB10_A2:
		case TextureUncompressedSizedInternalFormat.RGB10_A2UI:
			return [TextureDataType.UNSIGNED_INT_2_10_10_10_REV];
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT16:
			return [TextureDataType.UNSIGNED_SHORT, TextureDataType.UNSIGNED_INT];
		case TextureUncompressedSizedInternalFormat.DEPTH24_STENCIL8:
			return [TextureDataType.UNSIGNED_INT_24_8];
		case TextureUncompressedSizedInternalFormat.DEPTH32F_STENCIL8:
			return [TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV];
		default:
			return null;
	}
}
