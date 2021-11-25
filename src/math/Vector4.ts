import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";

const EPSILON = 0.000001;

/** A four-dimensional quantity with direction and magnitude. Immutable. */
export class Vector4 extends Float32Array {
	/**
	 * Generates a random vector with the given scale.
	 * @param s - The scale.
	 * @returns A random vector.
	 */
	static random(s = 1): Vector4 {
		let v1;
		let v2;
		let s1;
		do {
			v1 = Math.random() * 2 - 1;
			v2 = Math.random() * 2 - 1;
			s1 = v1 * v1 + v2 * v2;
		} while (s1 >= 1);

		let v3;
		let v4;
		let s2;
		do {
			v3 = Math.random() * 2 - 1;
			v4 = Math.random() * 2 - 1;
			s2 = v3 * v3 + v4 * v4;
		} while (s2 >= 1);

		const d = Math.sqrt((1 - s1) / s2);

		return new Vector4(
			s * v1,
			s * v2,
			s * v3 * d,
			s * v4 * d);
	}

	/** Creates an empty four-dimensional vector. */
	constructor();

	/**
	 * Creates a four-dimensional vector.
	 * @param x - The X coordinate of the vector.
	 * @param y - The Y coordinate of the vector.
	 * @param z - The Z coordinate of the vector.
	 * @param w - The W coordinate of the vector.
	 */
	constructor(x: number, y: number, z: number, w: number);

	constructor(x = 0, y = 0, z = 0, w = 0) {
		super([x, y, z, w]);
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

	/** The W coordinate of this vector. */
	get w(): number {
		return this[3] as number;
	}

	/**
	 * Adds another vector to this vector.
	 * @param v - The other vector.
	 * @returns The sum of the vectors.
	 */
	add(v: Vector4): Vector4 {
		return new Vector4(
			(this[0] as number) + (v[0] as number),
			(this[1] as number) + (v[1] as number),
			(this[2] as number) + (v[2] as number),
			(this[3] as number) + (v[3] as number));
	}

	/**
	 * Subtracts another vector from this vector.
	 * @param v - The other vector.
	 * @returns The difference between the vectors.
	 */
	subtract(v: Vector4): Vector4 {
		return new Vector4(
			(this[0] as number) - (v[0] as number),
			(this[1] as number) - (v[1] as number),
			(this[2] as number) - (v[2] as number),
			(this[3] as number) - (v[3] as number));
	}

	/**
	 * Multiplies this vector by another vector.
	 * @param v - The other vector.
	 * @returns The product of the vectors.
	 */
	multiply(v: Vector4): Vector4 {
		return new Vector4(
			(this[0] as number) * (v[0] as number),
			(this[1] as number) * (v[1] as number),
			(this[2] as number) * (v[2] as number),
			(this[3] as number) * (v[3] as number));
	}

	/**
	 * Divides this vector by another vector.
	 * @param v - The other vector.
	 * @returns The quotient of the vectors
	 */
	divide(v: Vector4): Vector4 {
		return new Vector4(
			(this[0] as number) / (v[0] as number),
			(this[1] as number) / (v[1] as number),
			(this[2] as number) / (v[2] as number),
			(this[3] as number) / (v[3] as number));
	}

	/** Rounds up the components of this vector. */
	get ceil(): Vector4 {
		return new Vector4(
			Math.ceil(this[0] as number),
			Math.ceil(this[1] as number),
			Math.ceil(this[2] as number),
			Math.ceil(this[3] as number));
	}

	/** Rounds down the components of this vector. */
	get floor(): Vector4 {
		return new Vector4(
			Math.floor(this[0] as number),
			Math.floor(this[1] as number),
			Math.floor(this[2] as number),
			Math.floor(this[3] as number));
	}

	/** Rounds the components of this vector. */
	get round(): Vector4 {
		return new Vector4(
			Math.round(this[0] as number),
			Math.round(this[1] as number),
			Math.round(this[2] as number),
			Math.round(this[3] as number));
	}

	/**
	 * Returns the minimums of this and another vector.
	 * @param v - The other vector.
	 * @returns The minimum vector.
	 */
	min(v: Vector4): Vector4 {
		return new Vector4(
			Math.min(this[0] as number, v[0] as number),
			Math.min(this[1] as number, v[1] as number),
			Math.min(this[2] as number, v[2] as number),
			Math.min(this[3] as number, v[3] as number));
	}

	/**
	 * Returns the maximums of this and another vector.
	 * @param v - The other vector.
	 * @returns The maximum vector.
	 */
	max(v: Vector4): Vector4 {
		return new Vector4(
			Math.max(this[0] as number, v[0] as number),
			Math.max(this[1] as number, v[1] as number),
			Math.max(this[2] as number, v[2] as number),
			Math.max(this[3] as number, v[3] as number));
	}

	/**
	 * Scales this vector by a scalar number.
	 * @param s - The scalar number.
	 * @returns The scaled vector.
	 */
	scale(s: number): Vector4 {
		return new Vector4(
			(this[0] as number) * s,
			(this[1] as number) * s,
			(this[2] as number) * s,
			(this[3] as number) * s);
	}

	/**
	 * Scales a vector and then adds it to this vector.
	 * @param v - The other vector.
	 * @param s - The scalar to scale the other vector by.
	 * @returns The sum of the vectors.
	 */
	scaleAndAdd(v: Vector4, s: number): Vector4 {
		return new Vector4(
			(this[0] as number) + (v[0] as number) * s,
			(this[1] as number) + (v[1] as number) * s,
			(this[2] as number) + (v[2] as number) * s,
			(this[3] as number) + (v[3] as number) * s);
	}

	/**
	 * Calculates the Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The Euclidian distance between the vectors.
	 */
	distance(v: Vector4): number {
		return Math.hypot(
			(v[0] as number) - (this[0] as number),
			(v[1] as number) - (this[1] as number),
			(v[2] as number) - (this[2] as number),
			(v[3] as number) - (this[3] as number));
	}

	/**
	 * Calculates the squared Euclidean distance between this vector and another.
	 * @param v - The other vector.
	 * @returns The squared Euclidean distance between the vectors.
	 */
	squaredDistance(v: Vector4): number {
		const x: number = (v[0] as number) - (this[0] as number);
		const y: number = (v[1] as number) - (this[1] as number);
		const z: number = (v[2] as number) - (this[2] as number);
		const w: number = (v[3] as number) - (this[3] as number);

		return x * x + y * y + z * z + w * w;
	}

	/** Calculates the length of this vector. */
	override get length(): number {
		return Math.hypot(
			this[0] as number,
			this[1] as number,
			this[2] as number,
			this[3] as number);
	}

	/** Calculates the squared length of this vector. */
	get squaredLength(): number {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		return x * x + y * y + z * z + w * w;
	}

	/** Negates the components of this vector. */
	get negate(): Vector4 {
		return new Vector4(
			-(this[0] as number),
			-(this[1] as number),
			-(this[2] as number),
			-(this[3] as number));
	}

	/** Inverts the components of this vector. */
	get inverse(): Vector4 {
		return new Vector4(
			1 / (this[0] as number),
			1 / (this[1] as number),
			1 / (this[2] as number),
			1 / (this[3] as number));
	}

	/** Normalizes this vector. */
	get normalize(): Vector4 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		let length: number = x * x + y * y + z * z + w * w;
		if (length > 0) { length = 1 / Math.sqrt(length); }

		return new Vector4(
			x * length,
			y * length,
			z * length,
			w * length);
	}

	/**
	 * Calculates the dot product of this vector and another.
	 * @param v - The other vector.
	 * @returns The dot product of the vectors.
	 */
	dot(v: Vector4): number {
		return (this[0] as number) * (v[0] as number)
			+ (this[1] as number) * (v[1] as number)
			+ (this[2] as number) * (v[2] as number)
			+ (this[3] as number) * (v[3] as number);
	}

	/**
	 * Calculates the cross product of this vector and two others in a four-dimensional space.
	 * @param v - The first other vector.
	 * @param w - The second other vector.
	 * @returns The cross product of the vectors.
	 */
	cross(v: Vector4, w: Vector4): Vector4 {
		const a: number = (v[0] as number) * (w[1] as number) - (v[1] as number) * (w[0] as number);
		const b: number = (v[0] as number) * (w[2] as number) - (v[2] as number) * (w[0] as number);
		const c: number = (v[0] as number) * (w[3] as number) - (v[3] as number) * (w[0] as number);
		const d: number = (v[1] as number) * (w[2] as number) - (v[2] as number) * (w[1] as number);
		const e: number = (v[1] as number) * (w[3] as number) - (v[3] as number) * (w[1] as number);
		const f: number = (v[2] as number) * (w[3] as number) - (v[3] as number) * (w[2] as number);

		const g: number = this[0] as number;
		const h: number = this[1] as number;
		const i: number = this[2] as number;
		const j: number = this[3] as number;

		return new Vector4(
			h * f - i * e + j * d,
			-(g * f) + i * c - j * b,
			g * e - h * c + j * a,
			-(g * d) + h * b - i * a);
	}

	/**
	 * Performs a linear interpolation between this vector and another.
	 * @param v - The other vector.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated vector.
	 */
	lerp(v: Vector4, t: number): Vector4 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		return new Vector4(
			x + t * ((v[0] as number) - x),
			y + t * ((v[1] as number) - y),
			z + t * ((v[2] as number) - z),
			w + t * ((v[3] as number) - w));
	}

	/**
	 * Transforms this vector by a four-dimensional matrix.
	 * @param m - The matrix.
	 * @returns The transformed vector.
	 */
	transformMatrix4(m: Matrix4): Vector4 {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		return new Vector4(
			(m[0] as number) * x + (m[4] as number) * y + (m[8] as number) * z + (m[12] as number) * w,
			(m[1] as number) * x + (m[5] as number) * y + (m[9] as number) * z + (m[13] as number) * w,
			(m[2] as number) * x + (m[6] as number) * y + (m[10] as number) * z + (m[14] as number) * w,
			(m[3] as number) * x + (m[7] as number) * y + (m[11] as number) * z + (m[15] as number) * w);
	}

	/**
	 * Transforms this vector by a quaternion.
	 * @param q - The quaternion.
	 * @returns The transformed vector.
	 */
	transformQuaternion(q: Quaternion): Vector4 {
		const qx: number = q[0] as number;
		const qy: number = q[1] as number;
		const qz: number = q[2] as number;
		const qw: number = q[3] as number;

		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		const ix: number = qw * x + qy * z - qz * y;
		const iy: number = qw * y + qz * x - qx * z;
		const iz: number = qw * z + qx * y - qy * x;
		const iw: number = -qx * x - qy * y - qz * z;

		return new Vector4(
			ix * qw + iw * -qx + iy * -qz - iz * -qy,
			iy * qw + iw * -qy + iz * -qx - ix * -qz,
			iz * qw + iw * -qz + ix * -qy - iy * -qx,
			this[3] as number);
	}

	/**
	 * Returns a string representation of this vector.
	 * @returns A string representation of this vector.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`;
	}

	/**
	 * Returns whether or not this vector has exactly the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have exactly the same elements.
	 */
	exactEquals(v: Vector4): boolean {
		return this[0] === v[0]
			&& this[1] === v[1]
			&& this[2] === v[2]
			&& this[3] === v[3];
	}

	/**
	 * Returns whether or not this vector has approximately the same elements as another.
	 * @param v - The other vector.
	 * @returns Whether or not the vectors have approximately the same elements.
	 */
	equals(v: Vector4): boolean {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;
		const z1: number = this[2] as number;
		const w1: number = this[3] as number;

		const x2: number = v[0] as number;
		const y2: number = v[1] as number;
		const z2: number = v[2] as number;
		const w2: number = v[3] as number;
		
		return (Math.abs(x1 - x2) <= EPSILON * Math.max(1, Math.abs(x1), Math.abs(x2))
			&& Math.abs(y1 - y2) <= EPSILON * Math.max(1, Math.abs(y1), Math.abs(y2))
			&& Math.abs(z1 - z2) <= EPSILON * Math.max(1, Math.abs(z1), Math.abs(z2))
			&& Math.abs(w1 - w2) <= EPSILON * Math.max(1, Math.abs(w1), Math.abs(w2)));
	}
}