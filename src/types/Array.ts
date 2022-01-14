import { Matrix2 } from "../math/matrix/Matrix2.js";
import { Matrix3 } from "../math/matrix/Matrix3.js";
import { Matrix4 } from "../math/matrix/Matrix4.js";
import { Vector2 } from "../math/vector/Vector2.js";
import { Vector3 } from "../math/vector/Vector3.js";
import { Vector4 } from "../math/vector/Vector4.js";
import { Quaternion } from "../math/Quaternion.js";
import { Rectangle } from "./Rectangle.js";

/** Array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers. */
export type TypedArray =
	Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/** A single row of 2 numbers. */
export type Numbers1x2 = Vector2 | [number, number];

/** A single row of 3 numbers. */
export type Numbers1x3 = Vector3 | [number, number, number];

/** A single row of 4 numbers. */
export type Numbers1x4 = Vector4 | Quaternion | Rectangle | [number, number, number, number];

/** Numbers arranged in two rows and two columns. */
export type Numbers2x2 = Matrix2 | [
	number, number,
	number, number
];

/** Numbers arranged in three rows and three columns. */
export type Numbers3x3 = Matrix3 | [
	number, number, number,
	number, number, number,
	number, number, number
];

/** Numbers arranged in four rows and four columns. */
export type Numbers4x4 = Matrix4 | [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number
];
