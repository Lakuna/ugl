import DataType from "../../constants/DataType.js";

/**
 * Get a default buffer data type for the given typed array.
 * @param array - The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: ArrayBufferView
): DataType {
	return array instanceof Int8Array
		? DataType.BYTE
		: array instanceof Uint8Array || array instanceof Uint8ClampedArray
			? DataType.UNSIGNED_BYTE
			: array instanceof Int16Array
				? DataType.SHORT
				: array instanceof Uint16Array
					? DataType.UNSIGNED_SHORT
					: array instanceof Int32Array
						? DataType.INT
						: array instanceof Uint32Array
							? DataType.UNSIGNED_INT
							: array instanceof Float16Array
								? DataType.HALF_FLOAT
								: DataType.FLOAT; // `Float32Array`.
}
