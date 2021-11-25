import { Vector3 } from "./Vector3.js";
import { Matrix3 } from "./Matrix3.js";

const EPSILON = 0.000001;
const xUnitVector3: Vector3 = new Vector3(1, 0, 0);
const yUnitVector3: Vector3 = new Vector3(0, 1, 0);

/** The quotient of two vectors in a three-dimensional space. Immutable. */
export class Quaternion extends Float32Array {
	/**
	 * Generates a random unit quaternion.
	 * @returns A unit quaternion.
	 */
	static random(): Quaternion {
		const u1: number = Math.random();
		const u2: number = Math.random();
		const u3: number = Math.random();

		const s1: number = Math.sqrt(1 - u1);
		const s: number = Math.sqrt(u1);

		return new Quaternion(
			s1 * Math.sin(2 * Math.PI * u2),
			s1 * Math.cos(2 * Math.PI * u2),
			s * Math.sin(2 * Math.PI * u3),
			s * Math.sin(2 * Math.PI * u3));
	}

	/**
	 * Creates a quaternion from a rotation about an axis.
	 * @param axis - The axis.
	 * @param r - The rotation amount in radians.
	 * @returns A quaternion.
	 */
	static fromAxisAngle(axis: Vector3, r: number): Quaternion {
		r /= 2;
		const s: number = Math.sin(r);

		return new Quaternion(
			s * (axis[0] as number),
			s * (axis[1] as number),
			s * (axis[2] as number),
			Math.cos(r));
	}

	/**
	 * Creates a quaternion from a three-dimensional rotation matrix. The result is not normalized.
	 * @param m - The matrix.
	 * @returns A quaternion.
	 */
	static fromMatrix3(m: Matrix3): Quaternion {
		const fTrace: number = (m[0] as number) + (m[4] as number) + (m[8] as number);

		if (fTrace > 0) {
			let fRoot: number = Math.sqrt(fTrace + 1);
			const o3: number = fRoot / 2;
			fRoot = 0.5 / fRoot;
			return new Quaternion(
				((m[5] as number) - (m[7] as number)) * fRoot,
				((m[6] as number) - (m[2] as number)) * fRoot,
				((m[1] as number) - (m[3] as number)) * fRoot,
				o3);
		} else {
			let i = 0;
			if ((m[4] as number) > (m[0] as number)) { i = 1; }
			if ((m[8] as number) > (m[i * 3 + i] as number)) { i = 2; }
			const j: number = (i + 1) % 3;
			const k: number = (i + 2) % 3;

			let fRoot: number = Math.sqrt((m[i * 3 + i] as number) - (m[j * 3 + j] as number) - (m[k * 3 + k] as number) + 1);
			const out: Float32Array = new Float32Array(4);
			out[i] = fRoot / 2;
			fRoot = 0.5 / fRoot;
			out[3] = ((m[j * 3 + k] as number) - (m[k * 3 + j] as number)) * fRoot;
			out[j] = ((m[j * 3 + i] as number) - (m[i * 3 + j] as number)) * fRoot;
			out[k] = ((m[k * 3 + i] as number) - (m[i * 3 + k] as number)) * fRoot;
			return new Quaternion(
				out[0] as number,
				out[1] as number,
				out[2] as number,
				out[3] as number);
		}
	}

	/**
	 * Creates a quaternion from a Euler angle.
	 * @param x - The angle to rotate about the X axis in degrees.
	 * @param y - The angle to rotate about the Y axis in degrees.
	 * @param z - The angle to rotate about the Z axis in degrees.
	 * @returns A quaternion.
	 */
	static fromEuler(x: number, y: number, z: number): Quaternion {
		const halfToRadians: number = Math.PI / 360;
		x *= halfToRadians;
		y *= halfToRadians;
		z *= halfToRadians;

		const sx: number = Math.sin(x);
		const cx: number = Math.cos(x);
		const sy: number = Math.sin(y);
		const cy: number = Math.cos(y);
		const sz: number = Math.sin(z);
		const cz: number = Math.cos(z);

		return new Quaternion(
			sx * cy * cz - cx * sy * sz,
			cx * sy * cz + sx * cy * sz,
			cx * cy * sz - sx * sy * cz,
			cx * cy * cz + sx * sy * sz);
	}

	/**
	 * Creates a quaternion that represents the shortest rotation from one unit vector to another.
	 * @param a - The first vector.
	 * @param b - The second vector.
	 * @returns The shortest rotation between the unit vectors.
	 */
	static rotationBetween(a: Vector3, b: Vector3): Quaternion {
		const dot: number = a.dot(b);
		if (dot < -0.999999) {
			let cross: Vector3 = xUnitVector3.cross(a);
			if (cross.length < EPSILON) { cross = yUnitVector3.cross(a); }
			return Quaternion.fromAxisAngle(cross, Math.PI);
		} else if (dot > 0.999999) {
			return new Quaternion();
		} else {
			const cross: Vector3 = a.cross(b);
			return new Quaternion(
				cross[0] as number,
				cross[1] as number,
				cross[2] as number,
				1 + dot).normalize;
		}
	}

	/**
	 * Creates a quaternion with values corresponding to the given axes.
	 * @param view - A unit vector representing the viewing direction.
	 * @param right - A unit vector representing the local "right" direction.
	 * @param up - A unit vector representing the local "up" direction.
	 * @returns A quaternion.
	 */
	static fromAxes(view: Vector3, right: Vector3, up: Vector3): Quaternion {
		const m: Matrix3 = new Matrix3(
			right[0] as number, right[1] as number, right[2] as number,
			up[0] as number, up[1] as number, up[2] as number,
			-(view[0] as number), -(view[1] as number), -(view[2] as number));
		return Quaternion.fromMatrix3(m).normalize;
	}

	/** Creates an identity quaternion. */
	constructor();

	/**
	 * Creates a quaternion.
	 * @param x - The X component of the quaternion.
	 * @param y - The Y component of the quaternion.
	 * @param z - The Z component of the quaternion.
	 * @param w - The W component of the quaternion.
	 */
	constructor(x: number, y: number, z: number, w: number);

	constructor(x = 0, y = 0, z = 0, w = 1) {
		super([x, y, z, w]);
	}

	/** The rotation axis and angle of this quaternion. */
	get axisAngle(): [Vector3, number] {
		const r: number = Math.acos(this[3] as number) * 2;
		const s: number = Math.sin(r / 2);

		if (s > EPSILON) {
			return [
				new Vector3(
					(this[0] as number) / s,
					(this[1] as number) / s,
					(this[2] as number) / s),
				r
			];
		} else {
			return [new Vector3(), r];
		}
	}

	/**
	 * Gets the angular distance between this unit quaternion and another.
	 * @param q - The other unit quaternion.
	 * @returns The angular distance between the quaternions.
	 */
	angle(q: Quaternion): number {
		const dot: number = this.dot(q);
		return Math.acos(2 * dot * dot - 1);
	}

	/**
	 * Multiplies this quaternion with another.
	 * @param q - The other quaternion
	 * @returns The product of the quaternions.
	 */
	multiply(q: Quaternion): Quaternion {
		const ax: number = this[0] as number;
		const ay: number = this[1] as number;
		const az: number = this[2] as number;
		const aw: number = this[3] as number;

		const bx: number = q[0] as number;
		const by: number = q[1] as number;
		const bz: number = q[2] as number;
		const bw: number = q[3] as number;

		return new Quaternion(
			ax * bw + aw * bx + ay * bz - az * by,
			ay * bw + aw * by + az * bx - ax * bz,
			az * bw + aw * bz + ax * by - ay * bx,
			aw * bw - ax * bx - ay * by - az * bz);
	}

	/**
	 * Rotates this quaternion by the given angle about the X axis.
	 * @param r - The angle to rotate by in radians.
	 * @returns The rotated quaternion.
	 */
	rotateX(r: number): Quaternion {
		r /= 2;

		const ax: number = this[0] as number;
		const ay: number = this[1] as number;
		const az: number = this[2] as number;
		const aw: number = this[3] as number;

		const bx: number = Math.sin(r);
		const bw: number = Math.cos(r);

		return new Quaternion(
			ax * bw + aw * bx,
			ay * bw + az * bx,
			ay * bw + az * bx,
			aw * bw - ax * bx);
	}

	/**
	 * Rotates this quaternion by the given angle about the Y axis.
	 * @param r - The angle to rotate by in radians.
	 * @returns The rotated quaternion.
	 */
	rotateY(r: number): Quaternion {
		r /= 2;

		const ax: number = this[0] as number;
		const ay: number = this[1] as number;
		const az: number = this[2] as number;
		const aw: number = this[3] as number;

		const by: number = Math.sin(r);
		const bw: number = Math.cos(r);

		return new Quaternion(
			ax * bw - az * by,
			ay * bw + aw * by,
			az * bw + ax * by,
			az * bw + ax * by);
	}

	/**
	 * Rotates this quaternion by the given angle about the Z axis.
	 * @param r - The angle to rotate by in radians.
	 * @returns The rotated quaternion.
	 */
	rotateZ(r: number): Quaternion {
		r /= 2;

		const ax: number = this[0] as number;
		const ay: number = this[1] as number;
		const az: number = this[2] as number;
		const aw: number = this[3] as number;

		const bz: number = Math.sin(r);
		const bw: number = Math.cos(r);

		return new Quaternion(
			ax * bw + ay * bz,
			ay * bw - ax * bz,
			az * bw + aw * bz,
			aw * bw - az * bz);
	}

	/** This quaternion with a recalculated W component, assuming that the quaternion is a unit quaternion. */
	get calculateW(): Quaternion {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;

		return new Quaternion(x, y, z, Math.sqrt(Math.abs(1 - x * x - y * y - z * z)));
	}

	/** The exponential of this unit quaternion. */
	get exp(): Quaternion {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		const r: number = Math.sqrt(x * x + y * y + z * z);
		const et: number = Math.exp(w);
		const s: number = r > 0 ? (et * Math.sin(r)) / r : 0;

		return new Quaternion(
			x * s,
			y * s,
			z * s,
			et * Math.cos(r));
	}

	/** The natural logarithm of this unit quaternion. */
	get ln(): Quaternion {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		const r: number = Math.sqrt(x * x + y * y + z * z);
		const t: number = r > 0 ? Math.atan2(r, w) / r : 0;

		return new Quaternion(
			x * t,
			y * t,
			z * t,
			Math.log(x * x + y * y + z * z + w * w) / 2);
	}

	/**
	 * Calculates the scalar power of this unit quaternion.
	 * @param s - The amount to scale this quaternion by.
	 * @returns The scalar power of this unit quaternion.
	 */
	pow(s: number): Quaternion {
		return this.ln.scale(s).exp;
	}

	/**
	 * Performs a spherical linear interpolation between this quaternion and another.
	 * @param q - The other quaternion.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated quaternion.
	 */
	slerp(q: Quaternion, t: number): Quaternion {
		const ax: number = this[0] as number;
		const ay: number = this[1] as number;
		const az: number = this[2] as number;
		const aw: number = this[3] as number;

		let bx: number = q[0] as number;
		let by: number = q[1] as number;
		let bz: number = q[2] as number;
		let bw: number = q[3] as number;

		let cosom: number = ax * bx + ay * by + az * bz + aw * bw;
		if (cosom < 0) {
			cosom = -cosom;
			bx = -bx;
			by = -by;
			bz = -bz;
			bw = -bw;
		}

		let scale0: number;
		let scale1: number;
		if (1 - cosom > EPSILON) {
			const omega: number = Math.acos(cosom);
			const sinom: number = Math.sin(omega);
			scale0 = Math.sin((1 - t) * omega) / sinom;
			scale1 = Math.sin(t * omega) / sinom;
		} else {
			scale0 = 1 - t;
			scale1 = t;
		}

		return new Quaternion(
			scale0 * ax + scale1 * bx,
			scale0 * ay + scale1 * by,
			scale0 * az + scale1 * bz,
			scale0 * aw + scale1 * bw);
	}

	/** The inverse of this quaternion. */
	get invert(): Quaternion {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;

		const dot: number = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
		if (!dot) {
			return new Quaternion(0, 0, 0, 0);
		} else {
			const invDot: number = 1 / dot;
			return new Quaternion(
				-a0 * invDot,
				-a1 * invDot,
				-a2 * invDot,
				a3 * invDot);
		}
	}

	/** The conjugate of this quaternion. */
	get conjugate(): Quaternion {
		return new Quaternion(
			-(this[0] as number),
			-(this[1] as number),
			-(this[2] as number),
			this[3] as number);
	}

	/**
	 * Returns a string representation of this quaternion.
	 * @returns A string representation of this quaternion.
	 */
	override toString(): string {
		return `((${this[0]}, ${this[1]}, ${this[2]}), ${this[3]})`;
	}

	/**
	 * Performs a spherical linear interpolation between this quaternion and another with two control points.
	 * @param a - The first control point.
	 * @param b - The second control point.
	 * @param q - The other quaternion.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated quaternion.
	 */
	sqlerp(a: Quaternion, b: Quaternion, q: Quaternion, t: number): Quaternion {
		const t1: Quaternion = this.slerp(q, t);
		const t2: Quaternion = a.slerp(b, t);
		return t1.slerp(t2, 2 * t * (1 - t));
	}

	/**
	 * Adds another quaternion to this quaternion.
	 * @param q - The other quaternion.
	 * @returns The sum of the quaternion.
	 */
	add(q: Quaternion): Quaternion {
		return new Quaternion(
			(this[0] as number) + (q[0] as number),
			(this[1] as number) + (q[1] as number),
			(this[2] as number) + (q[2] as number),
			(this[3] as number) + (q[3] as number));
	}

	/**
	 * Scales this quaternion by a scalar number.
	 * @param s - The scalar number.
	 * @returns The scaled quaternion.
	 */
	scale(s: number): Quaternion {
		return new Quaternion(
			(this[0] as number) * s,
			(this[1] as number) * s,
			(this[2] as number) * s,
			(this[3] as number) * s);
	}

	/**
	 * Calculates the dot product of this quaternion and another.
	 * @param q - The other quaternion.
	 * @returns The dot product of the quaternions.
	 */
	dot(q: Quaternion): number {
		return (this[0] as number) * (q[0] as number)
			+ (this[1] as number) * (q[1] as number)
			+ (this[2] as number) * (q[2] as number)
			+ (this[3] as number) * (q[3] as number);
	}

	/**
	 * Performs a linear interpolation between this quaternion and another.
	 * @param q - The other quaternion.
	 * @param t - The interpolation amount. Must be in the range [0, 1].
	 * @returns The interpolated quaternion.
	 */
	lerp(q: Quaternion, t: number): Quaternion {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		return new Quaternion(
			x + t * ((q[0] as number) - x),
			y + t * ((q[1] as number) - y),
			z + t * ((q[2] as number) - z),
			w + t * ((q[3] as number) - w));
	}

	/** Calculates the length of this quaternion. */
	override get length(): number {
		return Math.hypot(
			this[0] as number,
			this[1] as number,
			this[2] as number,
			this[3] as number);
	}

	/** Calculates the squared length of this quaternion. */
	get squaredLength(): number {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		return x * x + y * y + z * z + w * w;
	}

	/** Normalizes this quaternion. */
	get normalize(): Quaternion {
		const x: number = this[0] as number;
		const y: number = this[1] as number;
		const z: number = this[2] as number;
		const w: number = this[3] as number;

		let length: number = x * x + y * y + z * z + w * w;
		if (length > 0) { length = 1 / Math.sqrt(length); }

		return new Quaternion(
			x * length,
			y * length,
			z * length,
			w * length);
	}

	/**
	 * Returns whether or not this quaternion has exactly the same elements as another.
	 * @param q - The other quaternion.
	 * @returns Whether or not the quaternions have exactly the same elements.
	 */
	exactEquals(q: Quaternion): boolean {
		return this[0] === q[0]
			&& this[1] === q[1]
			&& this[2] === q[2]
			&& this[3] === q[3];
	}

	/**
	 * Returns whether or not this quaternion has approximately the same elements as another.
	 * @param q - The other quaternion.
	 * @returns Whether or not the quaternions have approximately the same elements.
	 */
	equals(q: Quaternion): boolean {
		const x1: number = this[0] as number;
		const y1: number = this[1] as number;
		const z1: number = this[2] as number;
		const w1: number = this[3] as number;

		const x2: number = q[0] as number;
		const y2: number = q[1] as number;
		const z2: number = q[2] as number;
		const w2: number = q[3] as number;
		
		return (Math.abs(x1 - x2) <= EPSILON * Math.max(1, Math.abs(x1), Math.abs(x2))
			&& Math.abs(y1 - y2) <= EPSILON * Math.max(1, Math.abs(y1), Math.abs(y2))
			&& Math.abs(z1 - z2) <= EPSILON * Math.max(1, Math.abs(z1), Math.abs(z2))
			&& Math.abs(w1 - w2) <= EPSILON * Math.max(1, Math.abs(w1), Math.abs(w2)));
	}
}