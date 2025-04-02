import DataType from "../../constants/DataType.js";
import TextureDataType from "../../constants/TextureDataType.js";

/**
 * Get the constructor for the typed array corresponding to the given data type.
 * @param dataType - The data type.
 * @returns A typed array constructor.
 * @internal
 */
export default function getTypedArrayConstructorForDataType(
	dataType: TextureDataType | DataType
):
	| Int8ArrayConstructor
	| Int16ArrayConstructor
	| Int32ArrayConstructor
	| Uint8ArrayConstructor
	| Uint16ArrayConstructor
	| Uint32ArrayConstructor
	| Float16ArrayConstructor
	| Float32ArrayConstructor {
	switch (dataType) {
		case DataType.BYTE:
			return Int8Array;
		case DataType.SHORT:
			return Int16Array;
		case DataType.INT:
		case DataType.INT_2_10_10_10_REV:
			return Int32Array;
		case DataType.UNSIGNED_SHORT:
		case TextureDataType.UNSIGNED_SHORT_4_4_4_4:
		case TextureDataType.UNSIGNED_SHORT_5_5_5_1:
		case TextureDataType.UNSIGNED_SHORT_5_6_5:
			return Uint16Array;
		case DataType.UNSIGNED_INT:
		case DataType.UNSIGNED_INT_2_10_10_10_REV:
		case TextureDataType.UNSIGNED_INT_10F_11F_11F_REV:
		case TextureDataType.UNSIGNED_INT_24_8:
		case TextureDataType.UNSIGNED_INT_5_9_9_9_REV:
			return Uint32Array;
		case DataType.HALF_FLOAT:
		case TextureDataType.HALF_FLOAT_OES:
			return Float16Array;
		case DataType.FLOAT:
		case TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV:
			return Float32Array;
		case DataType.UNSIGNED_BYTE:
		default: // Not possible if TypeScript is obeyed.
			return Uint8Array;
	}
}
