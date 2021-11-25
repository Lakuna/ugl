import { Vector3 } from "./Vector3.js";
import { Matrix2 } from "./Matrix2.js";
import { Matrix3 } from "./Matrix3.js";
import { Matrix4 } from "./Matrix4.js";

const EPSILON = 0.000001;

/** A two-dimensional quantity with direction and magnitude. Immutable. */
export class Vector2 extends Float32Array {
	/**
	 * Generates a random vector with the given scale.
	 * @param s - The scale.
	 * @returns A random vector.
	 */
	static random(s = 1): Vector2 {
		const r: number = Math.random() * 2 * Math.PI;

		return new Vector2(
			Math.cos(r) * s,
			Math.sin(r) * s);
	}

	/** Creates an empty two-dimensional vector. */
	constructor();

	/**
	 * Creates a two-dimensional vector.
	 * @param x - The X coordinate of the vector.
	 * @param y - The Y coordinate of the vector.
	 */
	constructor(x: number, y: number);

	constructor(x = 0, y = 0) {
		super([x, y]);
	}

	/** The X coordinate of this vector. */
	get x(): number {
		return this[0] as number;
	}

	/** The Y coordinate of this vector. */
	get y(): number {
		return this[1] as number;
	}

	/**
	 * Adds another vector to this vector.
	 * @param v - The other vector.
	 * @returns The sum of the vectors.
	 */
	add(v: Vector2): Vector2 {
		return new Vector2(
			(this[0] as number) + (v[0] as number),
			(this[1] as number) + (v[1] as number));
	}

	/**
	 * Subtracts another vector from this vector.
	 * @param v - The other vector.
	 * @returns The difference between the vectors.
	 */
	subtract(v: Vector2): Vector2 {
		return new Vector2(
			(this[0] as number) - (v[0] as number),
			(this[1] as number) - (v[1] as number));
	}

	/**
	 * Multiplies this vector by another vector.
	 * @param v - The other vector.
	 * @returns The product of the vectors.
	 */
	multiply(v: Vector2): Vector2 {
		return new Vector2(
			(this[0] as number) * (v[0] as number),
			(this[1] as number) * (v[1] as number));
	}

	/**
	 * Divides this vector by another vector.
	 * @param v - The other vector.
	 * @returns The quotient of the vectors
	 */
	divide(v: Vector2): Vector2 {
		return new Vector2(
			(this[0] as number) / (v[0] as number),
			(this[1] as number) / (v[1] as number));
	}

	/** Rounds up the components of this vector. */
	get ceil(): Vector2 {
		return new Vector2(
			Math.ceil(this[0] as number),
			Math.ceil(this[1] as number));
	}

	/** Rounds down the components of this vector. */
	get floor(): Vector2 {
		return new Vector2(
			Math.floor(this[0] as number),
			Math.floor(this[1] as number));
	}

	/** Rounds the components of this vector. */
	get round(): Vector2 {
		return new Vector2(
			Math.round(this[0] as number),
			Math.round(this[1] as number));
	}

	/**
	 * Returns the minimums of this and another vector.
	 * @param v - The other vector.
	 * @returns The minimum vector.
	 */
	min(v: Vector2): Vector2 {
		return new Vector2(
			Math.min(this[0] as number, v[0] as number),
			Math.min(this[1] as number, v[1] as number));
	}

	/**
	 * Returns the maximums of this and another vector.
	 * @param v - The other vector.
	 * @returns The maximum vector.
	 */
	max(v: Vector2): Vector2 {
		return new Vector2(
			Math.max(this[0] as number, v[0] as number),
			Math.max(this[1] as number, v[1] as number));
	}

	/**
	 * Scales this vector by a scalar number.
	 * @param s - The scalar number.
	 * @returns The scaled vector.
	 */
	scale(s: number): Vector2 {
		return new Vector2(
			(this[0] as number) * s,
			(this[1] as number) * s);
	}

	/**
	 * Scales a vector and then adds it to this vector.
	 * @param v - The other vector.
	 * @param s - The scalar to scale the other vector by.
	 * @returns The sum of the vectors.
	 */
	scaleAndAdd(v: Vector2, s: number): Vector2 {
		return new Vector2(
			(this[0] as number) + (v[0] as number) * s,
			(this[1] as number) + (v[1] as number) * s);
	}

	/**
	 * Calculates the Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The Euclidian distance between the vectors.
	 */
	distance(v: Vector2): number {
		return Math.hypot(
			(v[0] as number) - (this[0] as number),
			(v[1] as number) - (this[1] as number));
	}

	/**
	 * Calculates the squared Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The squared Euclidean distance between the vectors.
	 */
	squaredDistance(v: Vector2): number {
		const x: number = (v[0] as number) - (this[0] as number);
		const y: number = (v[1] as number) - (this[1] as number);

		return x * x + y * y;
	}

	/** Calculates the length of this vector. */
	override get length(): number {
		return Math.hypot(
			this[0] as number,
			this[1] as number);
	}

	/** Calculates the squared length of this vector. */
	get squaredLength(): number {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		return x * x + y * y;
	}

	/** Negates the components of this vector. */
	get negate(): Vector2 {
		return new Vector2(
			-(this[0] as number),
			-(this[1] as number));
	}

	/** Inverts the components of this vector. */
	get inverse(): Vector2 {
		return new Vector2(
			1 / (this[0] as number),
			1 / (this[1] as number));
	}

	/** Normalizes this vector. */
	get normalize(): Vector2 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		let length: number = x * x + y * y;
		if (length > 0) { length = 1 / Math.sqrt(length); }

		return new Vector2(
			x * length,
			y * length);
	}

	/**
	 * Calculates the dot product of this vector and another.
	 * @param v - The other vector.
	 * @returns The dot product of the vectors.
	 */
	dot(v: Vector2): number {
		return (this[0] as number) * (v[0] as number)
			+ (this[1] as number) * (v[1] as number);
	}

	/**
	 * Calculates the cross product of this vector and another.
	 * @param v - The other vector.
	 * @returns The cross product of the vectors.
	 */
	cross(v: Vector2): Vector3 {
		return new Vector3(0, 0, (this[0] as number) * (v[1] as number) - (this[1] as number) * (v[0] as number));
	}

	/**
	 * Performs a linear interpolation between this vector and another.
	 * @param v - The other vector.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated vector.
	 */
	lerp(v: Vector2, t: number): Vector2 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		return new Vector2(
			x + t * ((v[0] as number) - x),
			y + t * ((v[1] as number) - y));
	}

	/**
	 * Transforms this vector by a two-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix2(m: Matrix2): Vector2 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		return new Vector2(
			(m[0] as number) * x + (m[2] as number) * y,
			(m[1] as number) * x + (m[3] as number) * y);
	}

	/**
	 * Transforms this vector by a three-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix3(m: Matrix3): Vector2 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		return new Vector2(
			(m[0] as number) * x + (m[3] as number) * y + (m[6] as number),
			(m[1] as number) * x + (m[4] as number) * y + (m[7] as number));
	}

	/**
	 * Transforms this vector by a four-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix4(m: Matrix4): Vector2 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;

		return new Vector2(
			(m[0] as number) * x + (m[4] as number) * y + (m[12] as number),
			(m[1] as number) * x + (m[5] as number) * y + (m[13] as number));
	}

	/**
	 * Rotates this vector.
	 * @param origin - The origin of the rotation.
	 * @param r - The angle of rotation in radians.
	 * @returns The rotated vector.
	 */
	rotate(origin: Vector2, r: number): Vector2 {
		const x: number = origin[0] as number;
		const y: number = origin[1] as number;

		const p0: number = (this[0] as number) - x;
		const p1: number = (this[1] as number) - y;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Vector2(
			p0 * c - p1 * s + x,
			p0 * s + p1 * c + y);
	}

	/**
	 * Calculates the angle between this vector and another.
	 * @param v - The other vector.
	 * @returns The angle between the vectors in radians.
	 */
	angle(v: Vector2): number {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;

		const magnitudeProduct: number = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);

		return Math.acos(Math.min(Math.max(magnitudeProduct && (x1 * x2 + y1 * y2) / magnitudeProduct, -1), 1));
	}

	/**
	 * Returns a string representation of this vector.
	 * @returns A string representation of this vector.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]})`;
	}

	/**
	 * Returns whether or not this vector has exactly the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have exactly the same elements.
	 */
	exactEquals(v: Vector2): boolean {
		return this[0] === v[0]
			&& this[1] === v[1];
	}

	/**
	 * Returns whether or not this vector has approximately the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have approximately the same elements.
	 */
	equals(v: Vector2): boolean {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;

		return (Math.abs(x1 - x2) <= EPSILON * Math.max(1, Math.abs(x1), Math.abs(x2))
			&& Math.abs(y1 - y2) <= EPSILON * Math.max(1, Math.abs(y1), Math.abs(y2)));
	}
}