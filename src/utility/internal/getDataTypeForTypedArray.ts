import type { TypedArray } from "#TypedArray";
import BufferDataType from "#BufferDataType";

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Int8Array
): BufferDataType.BYTE;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Uint8Array | Uint8ClampedArray
): BufferDataType.UNSIGNED_BYTE;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Int16Array
): BufferDataType.SHORT;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Uint16Array
): BufferDataType.UNSIGNED_SHORT;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Int32Array
): BufferDataType.INT;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Uint32Array
): BufferDataType.UNSIGNED_INT;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: Float32Array | Float64Array | BigInt64Array | BigUint64Array
): BufferDataType.FLOAT;

/**
 * Returns a default buffer data type for the given typed array.
 * @param array The typed array.
 * @returns A default buffer data type for the given typed array.
 * @internal
 */
export default function getDataTypeForTypedArray(
	array: TypedArray
): BufferDataType;

export default function getDataTypeForTypedArray(
	array: TypedArray
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
		: BufferDataType.FLOAT; // `Float32Array`, `Float64Array`, `BigInt64Array`, and `BigUInt64Array.
}
