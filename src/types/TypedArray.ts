/** Array-like objects that contain unsigned integers and provide a mechanism for reading and writing raw binary data in memory buffers. */
export type UintTypedArray =
	Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array
	| BigUint64Array;

/** Array-like objects that contain integers and provide a mechanism for reading and writing raw binary data in memory buffers. */
export type IntTypedArray =
	Int8Array
	| Int16Array
	| Int32Array
	| BigInt64Array;

/** Array-like objects that contain floating-point numbers and provide a mechanism for reading and writing raw binary data in memory buffers. */
export type FloatTypedArray =
	Float32Array
	| Float64Array;

/** Array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers. */
type TypedArray =
	UintTypedArray
	| IntTypedArray
	| FloatTypedArray;

export default TypedArray;
