/** Array-like objects that contain unsigned integers and provide a mechanism for reading and writing raw binary data in memory buffers. */
export type UintTypedArray =
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array
	| BigUint64Array;
