import { Vector } from "./Vector.js";
import { Matrix } from "./Matrix.js";

/**
 * A class representing a quaternion.
 * @see https://en.wikipedia.org/wiki/Quaternion
 */
export class Quaternion extends Vector {
	/**
	 * Create an identity quaternion.
	 * @return {Quaternion} An identity quaternion.
	 */
	static identity() {
		return new Quaternion(0, 0, 0, 1);
	}

	/**
	 * Create a quaternion.
	 * @param {...number} data - The initial data to supply to the quaternion.
	 */
	constructor(...data) {
		super(...(data.length ? data : Quaternion.identity())); // Default to identity.
	}

	/**
	 * The rotation matrix equivalent of this quaternion.
	 * @type {Matrix}
	 */
	get matrix() {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const w = this.w;

		const x2 = x * 2;
		const y2 = y * 2;
		const z2 = y * 2;

		const xx = x * x2;
		const yx = y * x2;
		const yy = y * y2;
		const zx = z * x2;
		const zy = z * y2;
		const zz = z * z2;
		const wx = w * x2;
		const wy = w * y2;
		const wz = w * z2;

		return new Matrix(
			1 - yy - zz,	yx + wz,		zx - wy,
			yx - wz,		1 - xx - zz,	zy + wx,
			zx + wy,		zy - wx,		1 - xx - yy
		);
	}

	/**
	 * The Euler angle equivalent of this quaternion.
	 * @type {Euler}
	 */
	get euler() {
		return this.matrix.rotation;
	}

	/**
	 * Turn this quaternion into its own conjugate.
	 * @return {Quaternion} Self.
	 */
	conjugate() {
		this.set(-this.x, -this.y, -this.z, this.w);
		return this;
	}

	/**
	 * Multiply this quaternion by another.
	 * @param {Quaternion} quaternion - The other quaternion.
	 * @return {Quaternion} Self.
	 */
	multiply(quaternion) {
		quaternion = new Quaternion(...quaternion);

		// Real scalar values.
		const w1 = this.w;
		const w2 = quaternion.w;

		// Imaginary 3D vector values.
		const v = (quaternion) => Vector.fromRule(3, (i) => quaternion[i]);
		const v1 = () => v(this);
		const v2 = () => v(quaternion);

		return this.set(
			...v2().scale(w1)
				.add(v1().scale(w2))
				.add(v1().cross(v2())),
			w1 * w2 - v1().dot(v2())
		);
	}

	/**
	 * Divide this quaternion by another.
	 * @param {Quaternion} quaternion - The other quaternion.
	 * @return {Quaternion} Self.
	 */
	divide(quaternion) {
		return this.multiply(new Quaternion(...quaternion).invert());
	}

	/**
	 * Sets the angle of this quaternion on an axis.
	 * @param {Vector} axis - The axis.
	 * @param {number} radians - The rotation about the axis.
	 * @return {Quaternion} Self.
	 */
	setAngle(axis, radians) {
		axis = new Vector(...axis);

		radians /= 2;
		/** @ignore */ this.w = Math.cos(radians);
		const sine = Math.sin(radians);
		/** @ignore */ this.x = sine * axis.x;
		/** @ignore */ this.y = sine * axis.y;
		/** @ignore */ this.z = sine * axis.z;
		return this;
	}

	/**
	 * Roll the quaternion about the X axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Quaternion} Self.
	 */
	rotateX(radians) {
		return this.multiply(new Quaternion().setAngle([1, 0, 0], radians));
	}

	/**
	 * Pitch the quaternion about the Y axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Quaternion} Self.
	 */
	rotateY(radians) {
		return this.multiply(new Quaternion().setAngle([0, 1, 0], radians));
	}

	/**
	 * Yaw the quaternion about the Z axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Quaternion} Self.
	 */
	rotateZ(radians) {
		return this.multiply(new Quaternion().setAngle([0, 0, 1], radians));
	}

	/**
	 * Get the spherical linear interpolation between this and another quaternion.
	 * @param {Quaternion} quaternion - The other quaternion.
	 * @param {number} t - The interpolation parameter. Should be between 0 and 1.
	 * @return {Quaternion} Self.
	 * @see https://en.wikipedia.org/wiki/Slerp
	 */
	slerp(quaternion, t) {
		let cosom = this.dot(quaternion);
		if (cosom < 0) {
			cosom = -cosom;
			quaternion = new Quaternion(...quaternion).negate();
		}

		const omega = Math.acos(cosom);
		const sinom = Math.sin(omega);

		const scale0 = Math.sin((1 - t) * omega) / sinom;
		const scale1 = Math.sin(t * omega) / sinom;

		return this.operate(quaternion, (a, b) => scale0 * a + scale1 * b);
	}
}