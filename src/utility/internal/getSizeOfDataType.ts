import DataType from "../../constants/DataType.js";

/**
 * Get the size of a data type in bytes.
 * @param type - The data type.
 * @returns The size of the data type in bytes.
 * @internal
 */
export default function getSizeOfDataType(type: DataType) {
	switch (type) {
		case DataType.BYTE:
		case DataType.UNSIGNED_BYTE:
			return 1;
		case DataType.HALF_FLOAT:
		case DataType.SHORT:
		case DataType.UNSIGNED_SHORT:
			return 2;
		case DataType.FLOAT:
		case DataType.INT:
		case DataType.INT_2_10_10_10_REV:
		case DataType.UNSIGNED_INT:
		case DataType.UNSIGNED_INT_2_10_10_10_REV:
		default:
			return 4;
	}
}
