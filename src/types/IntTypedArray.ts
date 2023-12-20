/**
 * Array-like objects that contain signed integers and provide a mechanism for
 * reading and writing raw binary data in memory buffers. `BigInt64Array` is
 * excluded because it cannot be used with WebGL.
 */
export type IntTypedArray = Int8Array | Int16Array | Int32Array;
