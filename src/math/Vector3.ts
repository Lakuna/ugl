import { Matrix3 } from "./Matrix3.js";
import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";

const EPSILON = 0.000001;

/** A three-dimensional quantity with direction and magnitude. Immutable. */
export class Vector3 extends Float32Array {
	/**
	 * Generates a random vector with the given scale.
	 * @param s - The scale.
	 * @returns A random vector.
	 */
	static random(s = 1): Vector3 {
		const r: number = Math.random() * 2 * Math.PI;
		const z: number = Math.random() * 2 - 1;

		const zs: number = Math.sqrt(1 - z * z) * s;

		return new Vector3(
			Math.cos(r) * zs,
			Math.sin(r) * zs,
			z * s);
	}

	/** Creates an empty three-dimensional vector. */
	constructor();

	/**
	 * Creates a three-dimensional vector.
	 * @param x - The X coordinate of the vector.
	 * @param y - The Y coordinate of the vector.
	 * @param z - The Z coordinate of the vector.
	 */
	constructor(x: number, y: number, z: number);

	constructor(x = 0, y = 0, z = 0) {
		super([x, y, z]);
	}

	/** The X coordinate of this vector. */
	get x(): number {
		return this[0] as number;
	}

	/** The Y coordinate of this vector. */
	get y(): number {
		return this[1] as number;
	}

	/** The Z coordinate of this vector. */
	get z(): number {
		return this[2] as number;
	}

	/**
	 * Adds another vector to this vector.
	 * @param v - The other vector.
	 * @returns The sum of the vectors.
	 */
	add(v: Vector3): Vector3 {
		return new Vector3(
			(this[0] as number) + (v[0] as number),
			(this[1] as number) + (v[1] as number),
			(this[2] as number) + (v[2] as number));
	}

	/**
	 * Subtracts another vector from this vector.
	 * @param v - The other vector.
	 * @returns The difference between the vectors.
	 */
	subtract(v: Vector3): Vector3 {
		return new Vector3(
			(this[0] as number) - (v[0] as number),
			(this[1] as number) - (v[1] as number),
			(this[2] as number) - (v[2] as number));
	}

	/**
	 * Multiplies this vector by another vector.
	 * @param v - The other vector.
	 * @returns The product of the vectors.
	 */
	multiply(v: Vector3): Vector3 {
		return new Vector3(
			(this[0] as number) * (v[0] as number),
			(this[1] as number) * (v[1] as number),
			(this[2] as number) * (v[2] as number));
	}

	/**
	 * Divides this vector by another vector.
	 * @param v - The other vector.
	 * @returns The quotient of the vectors
	 */
	divide(v: Vector3): Vector3 {
		return new Vector3(
			(this[0] as number) / (v[0] as number),
			(this[1] as number) / (v[1] as number),
			(this[2] as number) / (v[2] as number));
	}

	/** Rounds up the components of this vector. */
	get ceil(): Vector3 {
		return new Vector3(
			Math.ceil(this[0] as number),
			Math.ceil(this[1] as number),
			Math.ceil(this[2] as number));
	}

	/** Rounds down the components of this vector. */
	get floor(): Vector3 {
		return new Vector3(
			Math.floor(this[0] as number),
			Math.floor(this[1] as number),
			Math.floor(this[2] as number));
	}

	/** Rounds the components of this vector. */
	get round(): Vector3 {
		return new Vector3(
			Math.round(this[0] as number),
			Math.round(this[1] as number),
			Math.round(this[2] as number));
	}

	/**
	 * Returns the minimums of this and another vector.
	 * @param v - The other vector.
	 * @returns The minimum vector.
	 */
	min(v: Vector3): Vector3 {
		return new Vector3(
			Math.min(this[0] as number, v[0] as number),
			Math.min(this[1] as number, v[1] as number),
			Math.min(this[2] as number, v[2] as number));
	}

	/**
	 * Returns the maximums of this and another vector.
	 * @param v - The other vector.
	 * @returns The maximum vector.
	 */
	max(v: Vector3): Vector3 {
		return new Vector3(
			Math.max(this[0] as number, v[0] as number),
			Math.max(this[1] as number, v[1] as number),
			Math.max(this[2] as number, v[2] as number));
	}

	/**
	 * Scales this vector by a scalar number.
	 * @param s - The scalar number.
	 * @returns The scaled vector.
	 */
	scale(s: number): Vector3 {
		return new Vector3(
			(this[0] as number) * s,
			(this[1] as number) * s,
			(this[2] as number) * s);
	}

	/**
	 * Scales a vector and then adds it to this vector.
	 * @param v - The other vector.
	 * @param s - The scalar to scale the other vector by.
	 * @returns The sum of the vectors.
	 */
	scaleAndAdd(v: Vector3, s: number): Vector3 {
		return new Vector3(
			(this[0] as number) + (v[0] as number) * s,
			(this[1] as number) + (v[1] as number) * s,
			(this[2] as number) + (v[2] as number) * s);
	}

	/**
	 * Calculates the Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The Euclidian distance between the vectors.
	 */
	distance(v: Vector3): number {
		return Math.hypot(
			(v[0] as number) - (this[0] as number),
			(v[1] as number) - (this[1] as number),
			(v[2] as number) - (this[2] as number));
	}

	/**
	 * Calculates the squared Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The squared Euclidean distance between the vectors.
	 */
	squaredDistance(v: Vector3): number {
		const x: number = (v[0] as number) - (this[0] as number);
		const y: number = (v[1] as number) - (this[1] as number);
		const z: number = (v[2] as number) - (this[2] as number);

		return x * x + y * y + z * z;
	}

	/** Calculates the length of this vector. */
	override get length(): number {
		return Math.hypot(this[0] as number, this[1] as number, this[2] as number);
	}

	/** Calculates the squared length of this vector. */
	get squaredLength(): number {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		return x * x + y * y + z * z;
	}

	/** Negates the components of this vector. */
	get negate(): Vector3 {
		return new Vector3(
			-(this[0] as number),
			-(this[1] as number),
			-(this[2] as number));
	}

	/** Inverts the components of this vector. */
	get inverse(): Vector3 {
		return new Vector3(
			1 / (this[0] as number),
			1 / (this[1] as number),
			1 / (this[2] as number));
	}

	/** Normalizes this vector. */
	get normalize(): Vector3 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		let length: number = x * x + y * y + z * z;
		if (length > 0) { length = 1 / Math.sqrt(length); }

		return new Vector3(
			x * length,
			y * length,
			z * length);
	}

	/**
	 * Calculates the dot product of this vector and another.
	 * @param v - The other vector.
	 * @returns The dot product of the vectors.
	 */
	dot(v: Vector3): number {
		return (this[0] as number) * (v[0] as number)
			+ (this[1] as number) * (v[1] as number)
			+ (this[2] as number) * (v[2] as number);
	}

	/**
	 * Calculates the cross product of this vector and another.
	 * @param v - The other vector.
	 * @returns The cross product of the vectors.
	 */
	cross(v: Vector3): Vector3 {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;
		const z1: number = this[2] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;
		const z2: number = v[2] as number;

		return new Vector3(
			y1 * z2 - z1 * y2,
			z1 * x2 - x1 * z2,
			x1 * y2 - y1 * x2);
	}

	/**
	 * Performs a linear interpolation between this vector and another.
	 * @param v - The other vector.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated vector.
	 */
	lerp(v: Vector3, t: number): Vector3 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		return new Vector3(
			x + t * ((v[0] as number) - x),
			y + t * ((v[1] as number) - y),
			z + t * ((v[2] as number) - z));
	}

	/**
	 * Performs a Hermite interpolation between this vector and another, with two control points.
	 * @param a - The first control point.
	 * @param b - The second control point.
	 * @param v - The other vector.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated vector.
	 */
	hermite(a: Vector3, b: Vector3, v: Vector3, t: number): Vector3 {
		const f: number = t * t;
		const f1: number = f * (2 * t - 3) + 1;
		const f2: number = f * (t - 2) + t;
		const f3: number = f * (t - 1);
		const f4: number = f * (3 - 2 * t);

		return new Vector3(
			(this[0] as number) * f1 + (a[0] as number) * f2 + (b[0] as number) * f3 + (v[0] as number) * f4,
			(this[1] as number) * f1 + (a[1] as number) * f2 + (b[1] as number) * f3 + (v[1] as number) * f4,
			(this[2] as number) * f1 + (a[2] as number) * f2 + (b[2] as number) * f3 + (v[2] as number) * f4);
	}

	/**
	 * Performs a Bézier interpolation between this vector and another, with two control points.
	 * @param a - The first control point.
	 * @param b - The second control point.
	 * @param v - The other vector.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated vector.
	 */
	bezier(a: Vector3, b: Vector3, v: Vector3, t: number): Vector3 {
		const i: number = 1 - t;
		const i2: number = i * i;

		const f: number = t * t;
		const f1: number = i2 * i;
		const f2: number = 3 * t * i2;
		const f3: number = 3 * f * i;
		const f4: number = f * t;

		return new Vector3(
			(this[0] as number) * f1 + (a[0] as number) * f2 + (b[0] as number) * f3 + (v[0] as number) * f4,
			(this[1] as number) * f1 + (a[1] as number) * f2 + (b[1] as number) * f3 + (v[1] as number) * f4,
			(this[2] as number) * f1 + (a[2] as number) * f2 + (b[2] as number) * f3 + (v[2] as number) * f4);
	}

	/**
	 * Transforms this vector by a three-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix3(m: Matrix3): Vector3 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		return new Vector3(
			x * (m[0] as number) + y * (m[3] as number) + z * (m[6] as number),
			x * (m[1] as number) + y * (m[4] as number) + z * (m[7] as number),
			x * (m[2] as number) + y * (m[5] as number) + z * (m[8] as number));
	}

	/**
	 * Transforms this vector by a four-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix4(m: Matrix4): Vector3 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number =
			((m[3] as number) * x
			+ (m[7] as number) * y
			+ (m[11] as number) * z
			+ (m[15] as number)) || 1;

		return new Vector3(
			((m[0] as number) * x + (m[4] as number) * y + (m[8] as number) * z + (m[12] as number)) / w,
			((m[1] as number) * x + (m[5] as number) * y + (m[9] as number) * z + (m[13] as number)) / w,
			((m[2] as number) * x + (m[6] as number) * y + (m[10] as number) * z + (m[14] as number)) / w);
	}

	/**
	 * Transforms this vector by a quaternion.
	 * @param q - The quaternion.
	 * @returns The transformed vector.
	 */
	transformQuaternion(q: Quaternion): Vector3 {
		const qx: number = q[0] as number;
		const qy: number = q[1] as number;
		const qz: number = q[2] as number;
		const qw: number = q[3] as number;

		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		let uvx: number = qy * z - qz * y;
		let uvy: number = qz * x - qx * z;
		let uvz: number = qx * y - qy * x;

		const uuvx: number = (qy * uvz - qz * uvy) * 2;
		const uuvy: number = (qz * uvx - qx * uvz) * 2;
		const uuvz: number = (qx * uvy - qy * uvx) * 2;

		const w2: number = qw * 2;
		uvx *= w2;
		uvy *= w2;
		uvz *= w2;

		return new Vector3(
			x + uvx + uuvx,
			y + uvy + uuvy,
			z + uvz + uuvz);
	}

	/**
	 * Rotates this vector about the X axis.
	 * @param origin - The origin of the rotation.
	 * @param r - The angle of the rotation in radians.
	 * @returns The rotated vector.
	 */
	rotateX(origin: Vector3, r: number): Vector3 {
		const o0: number = origin[0] as number;
		const o1: number = origin[1] as number;
		const o2: number = origin[2] as number;

		const p0: number = (this[0] as number) - o0;
		const p1: number = (this[1] as number) - o1;
		const p2: number = (this[2] as number) - o2;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const r0: number = p0;
		const r1: number = p1 * c - p2 * s;
		const r2: number = p1 * s + p2 * c;

		return new Vector3(
			r0 + o0,
			r1 + o1,
			r2 + o2);
	}

	/**
	 * Rotates this vector about the Y axis.
	 * @param origin - The origin of the rotation.
	 * @param radians - The angle of the rotation in radians.
	 * @returns The rotated vector.
	 */
	rotateY(origin: Vector3, r: number): Vector3 {
		const o0: number = origin[0] as number;
		const o1: number = origin[1] as number;
		const o2: number = origin[2] as number;

		const p0: number = (this[0] as number) - o0;
		const p1: number = (this[1] as number) - o1;
		const p2: number = (this[2] as number) - o2;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const r0: number = p2 * s + p0 * c;
		const r1: number = p1;
		const r2: number = p2 * c - p0 * s;

		return new Vector3(
			r0 + o0,
			r1 + o1,
			r2 + o2);
	}

	/**
	 * Rotates this vector about the Z axis.
	 * @param origin - The origin of the rotation.
	 * @param radians - The angle of the rotation in radians.
	 * @returns The rotated vector.
	 */
	rotateZ(origin: Vector3, r: number): Vector3 {
		const o0: number = origin[0] as number;
		const o1: number = origin[1] as number;
		const o2: number = origin[2] as number;

		const p0: number = (this[0] as number) - o0;
		const p1: number = (this[1] as number) - o1;
		const p2: number = (this[2] as number) - o2;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const r0: number = p0 * c - p1 * s;
		const r1: number = p0 * s + p1 * c;
		const r2: number = p2;

		return new Vector3(
			r0 + o0,
			r1 + o1,
			r2 + o2);
	}

	/**
	 * Calculates the angle between this vector and another.
	 * @param v - The other vector.
	 * @returns The angle between the vectors in radians.
	 */
	angle(v: Vector3): number {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;
		const z1: number = this[2] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;
		const z2: number = v[2] as number;

		const magnitudeProduct: number = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1) * Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);

		return Math.acos(Math.min(Math.max(magnitudeProduct && this.dot(v) / magnitudeProduct, -1), 1));
	}

	/**
	 * Returns a string representation of this vector.
	 * @returns A string representation of this vector.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]}, ${this[2]})`;
	}

	/**
	 * Returns whether or not this vector has exactly the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have exactly the same elements.
	 */
	exactEquals(v: Vector3): boolean {
		return this[0] === v[0]
			&& this[1] === v[1]
			&& this[2] === v[2];
	}

	/**
	 * Returns whether or not this vector has approximately the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have approximately the same elements.
	 */
	equals(v: Vector3): boolean {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;
		const z1: number = this[2] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;
		const z2: number = v[2] as number;

		return (Math.abs(x1 - x2) <= EPSILON * Math.max(1, Math.abs(x1), Math.abs(x2))
			&& Math.abs(y1 - y2) <= EPSILON * Math.max(1, Math.abs(y1), Math.abs(y2))
			&& Math.abs(z1 - z2) <= EPSILON * Math.max(1, Math.abs(z1), Math.abs(z2)));
	}
}