/**
 * Array-like objects that contain unsigned integers and provide a mechanism
 * for reading and writing raw binary data in memory buffers. `BigUint64Array`
 * is excluded because it cannot be used with WebGL.
 */
export type UintTypedArray =
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array;
