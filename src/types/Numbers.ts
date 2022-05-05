import { Vector2 } from "../math/Vector2.js";
import { Vector3 } from "../math/Vector3.js";
import { Vector4 } from "../math/Vector4.js";
import { Matrix2 } from "../math/Matrix2.js";
import { Matrix3 } from "../math/Matrix3.js";
import { Matrix4 } from "../math/Matrix4.js";

/** Numbers arranged in one column and two rows. */
export type Numbers1x2 = Vector2 | [number, number];

/** Numbers arranged in one column and three rows. */
export type Numbers1x3 = Vector3 | [number, number, number];

/** Numbers arranged in one column and four rows. */
export type Numbers1x4 = Vector4 | [number, number, number, number];

/** Numbers arranged in two columns and two rows. */
export type Numbers2x2 = Matrix2 | [
	number, number,
	number, number
];

/** Numbers arranged in three columns and three rows. */
export type Numbers3x3 = Matrix3 | [
	number, number, number,
	number, number, number,
	number, number, number
];

/** Numbers arranged in four columns and four rows. */
export type Numbers4x4 = Matrix4 | [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number
];
