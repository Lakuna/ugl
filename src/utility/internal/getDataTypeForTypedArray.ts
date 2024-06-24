import BufferDataType from "#BufferDataType";
import type { TypedArray } from "#TypedArray";

/**
 * Returns a default buffer data type for the given typed array.
 * @param array - The typed array.
 * @param half - Whether the array contains 16-bit floating-point data if it
 * contains floating-point data.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: TypedArray,
	half = false
): BufferDataType {
	return array instanceof Int8Array
		? BufferDataType.BYTE
		: array instanceof Uint8Array || array instanceof Uint8ClampedArray
			? BufferDataType.UNSIGNED_BYTE
			: array instanceof Int16Array
				? BufferDataType.SHORT
				: array instanceof Uint16Array
					? BufferDataType.UNSIGNED_SHORT
					: array instanceof Int32Array
						? BufferDataType.INT
						: array instanceof Uint32Array
							? BufferDataType.UNSIGNED_INT
							: half // `Float32Array`.
								? BufferDataType.HALF_FLOAT
								: BufferDataType.FLOAT;
}
