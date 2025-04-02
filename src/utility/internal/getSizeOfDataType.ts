import DataType from "../../constants/DataType.js";
import TextureDataType from "../../constants/TextureDataType.js";

/**
 * Get the size of a data type in bytes.
 * @param type - The data type.
 * @returns The size of the data type in bytes.
 * @internal
 */
export default function getSizeOfDataType(
	type: DataType | TextureDataType
): number {
	switch (type) {
		case DataType.HALF_FLOAT:
		case DataType.SHORT:
		case DataType.UNSIGNED_SHORT:
		case TextureDataType.HALF_FLOAT_OES:
		case TextureDataType.UNSIGNED_SHORT_4_4_4_4:
		case TextureDataType.UNSIGNED_SHORT_5_5_5_1:
		case TextureDataType.UNSIGNED_SHORT_5_6_5:
			return 2;
		case DataType.FLOAT:
		case DataType.INT:
		case DataType.INT_2_10_10_10_REV:
		case DataType.UNSIGNED_INT:
		case DataType.UNSIGNED_INT_2_10_10_10_REV:
		case TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV:
		case TextureDataType.UNSIGNED_INT_10F_11F_11F_REV:
		case TextureDataType.UNSIGNED_INT_24_8:
		case TextureDataType.UNSIGNED_INT_5_9_9_9_REV:
			return 4;
		case DataType.BYTE:
		case DataType.UNSIGNED_BYTE:
		default: // Not possible if TypeScript is obeyed.
			return 1;
	}
}
