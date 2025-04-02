import DataType from "../../constants/DataType.js";

/**
 * Get a default buffer data type for the given typed array.
 * @param array - The typed array.
 * @param half - Whether or not the array contains 16-bit floating-point data if it contains floating-point data.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: ArrayBufferView,
	half = false
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
							: half // `Float32Array`.
								? DataType.HALF_FLOAT // Support for `Float16Array` is limited so `Float32Array` is used instead (two elements per index). TODO: Change code where necessary to support `Float16Array` now that it has reached stage 3.
								: DataType.FLOAT;
}
