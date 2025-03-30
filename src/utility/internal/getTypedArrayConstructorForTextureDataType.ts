import TextureDataType from "../../constants/TextureDataType.js";

/**
 * Get the constructor for the typed array corresponding to the given data type.
 * @param dataType - The data type.
 * @returns A typed array constructor.
 * @internal
 */
export default function getTypedArrayConstructorForTextureDataType(
	dataType: TextureDataType
):
	| Int8ArrayConstructor
	| Uint8ArrayConstructor
	| Float32ArrayConstructor
	| Int32ArrayConstructor
	| Int16ArrayConstructor
	| Uint32ArrayConstructor
	| Uint16ArrayConstructor {
	switch (dataType) {
		case TextureDataType.BYTE:
			return Int8Array;
		case TextureDataType.FLOAT:
		case TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV:
			return Float32Array;
		case TextureDataType.INT:
			return Int32Array;
		case TextureDataType.SHORT:
			return Int16Array;
		case TextureDataType.UNSIGNED_BYTE:
			return Uint8Array;
		case TextureDataType.UNSIGNED_INT:
		case TextureDataType.UNSIGNED_INT_2_10_10_10_REV:
		case TextureDataType.UNSIGNED_INT_10F_11F_11F_REV:
		case TextureDataType.UNSIGNED_INT_24_8:
		case TextureDataType.UNSIGNED_INT_5_9_9_9_REV:
			return Uint32Array;
		case TextureDataType.UNSIGNED_SHORT:
		case TextureDataType.HALF_FLOAT_OES:
		case TextureDataType.HALF_FLOAT:
		case TextureDataType.UNSIGNED_SHORT_4_4_4_4:
		case TextureDataType.UNSIGNED_SHORT_5_5_5_1:
		case TextureDataType.UNSIGNED_SHORT_5_6_5:
			return Uint16Array;
		default:
			return dataType;
	}
}
