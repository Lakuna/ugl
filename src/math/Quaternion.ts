import { Euler } from "./Euler.js";
import { Matrix } from "./Matrix.js";
import { Vector } from "./Vector.js";

/** A complex number with four parts. */
export class Quaternion extends Vector {
	/**
	 * Creates an identity quaternion.
	 * @returns An identity quaternion.
	 */
	static identity(): Quaternion {
		return new Quaternion(0, 0, 0, 1);
	}

	/**
	 * Creates a quaternion.
	 * @param data - The initial data to supply to the quaternion.
	 */
	constructor(...data: Array<number>) {
		super(...(data.length ? data : Quaternion.identity())); // Default to identity
	}

	/** The rotation matrix equivalent of this quaternion. */
	get matrix(): Matrix {
		const x: number = this.x;
		const y: number = this.y;
		const z: number = this.z;
		const w: number = this.w;

		const x2: number = x * 2;
		const y2: number = y * 2;
		const z2: number = z * 2;

		const xx: number = x * x2;
		const yx: number = y * x2;
		const yy: number = y * y2;
		const zx: number = z * x2;
		const zy: number = z * y2;
		const zz: number = z * z2;
		const wx: number = w * x2;
		const wy: number = w * y2;
		const wz: number = w * z2;

		return new Matrix(
			1 - yy - zz, yx + wz, zx - wy,
			yx - wz, 1 - xx - zz, zy + wx,
			zx + wy, zy - wx, 1 - xx - yy
		);
	}

	/** The Euler angle equivalent of this quaternion. */
	get euler(): Euler {
		return this.matrix.rotation;
	}

	/**
	 * Calculates the conjugate of this quaternion.
	 * @returns This quaternion.
	 */
	conjugate(): Quaternion {
		return this.set(-this.x, -this.y, -this.z, this.w) as Quaternion;
	}

	/**
	 * Multiplies two quaternions.
	 * @param quaternion - The other quaternion.
	 * @returns This quaternion.
	 */
	multiply(quaternion: Quaternion): Quaternion {
		quaternion = quaternion.copy as Quaternion;

		// Real scalar values
		const w1: number = this.w;
		const w2: number = quaternion.w;

		// Imaginary 3D vector values
		const v = (quaternion: Quaternion): Vector => Vector.fromRule(3, (i: number): number => quaternion[i] ?? 0);
		const v1 = (): Vector => v(this);
		const v2 = (): Vector => v(quaternion);

		return this.set(
			...v2().scale(w1)
				.add(v1().scale(w2))
				.add(v1().cross(v2())),
			w1 * w2 - v1().dot(v2())
		) as Quaternion;
	}

	/**
	 * Divides two quaternions.
	 * @param quaternion - The other quaternion.
	 * @returns This quaternion.
	 */
	divide(quaternion: Quaternion): Quaternion {
		return this.multiply(quaternion.copy.invert() as Quaternion)
	}

	/**
	 * Sets the angle of this quaternion on an axis.
	 * @param axis - The axis.
	 * @param radians - The rotation about the axis in radians.
	 * @returns This quaternion.
	 */
	setAngle(axis: Vector, radians: number): Quaternion {
		axis = axis.copy;

		radians /= 2;
		const c: number = Math.cos(radians);
		const s: number = Math.sin(radians);
		return this.set(s * axis.x, s * axis.y, s * axis.z, c) as Quaternion;
	}

	/**
	 * Rolls the quaternion about the X axis.
	 * @param radians - The rotation about the axis in radians.
	 * @returns This quaternion.
	 */
	rotateX(radians: number): Quaternion {
		return this.multiply(new Quaternion().setAngle(new Vector(1, 0, 0), radians));
	}

	/**
	 * Pitches the quaternion about the Y axis.
	 * @param radians - The rotation about the axis in radians.
	 * @returns This quaternion.
	 */
	rotateY(radians: number): Quaternion {
		return this.multiply(new Quaternion().setAngle(new Vector(0, 1, 0), radians));
	}

	/**
	 * Yaws the quaternion about the Z axis.
	 * @param radians - The rotation about the axis in radians.
	 * @returns This quaternion.
	 */
	rotateZ(radians: number): Quaternion {
		return this.multiply(new Quaternion().setAngle(new Vector(0, 0, 1), radians));
	}

	/**
	 * Performs a spherical linear interpolation between two quaternions.
	 * @param quaternion - The other quaternion.
	 * @param t - The interpolation parameter. Should be between 0 and 1.
	 * @returns This quaternion.
	 */
	slerp(quaternion: Quaternion, t: number): Quaternion {
		let cosom = this.dot(quaternion);
		if (cosom < 0) {
			cosom = -cosom;
			quaternion = quaternion.copy.negate() as Quaternion;
		}

		const omega: number = Math.acos(cosom);
		const sinom: number = Math.sin(omega);

		const scale0: number = Math.sin((1 - t) * omega) / sinom;
		const scale1: number = Math.sin(t * omega) / sinom;

		return this.operate(quaternion, (a: number, b: number): number => scale0 * a + scale1 * b) as Quaternion;
	}
}