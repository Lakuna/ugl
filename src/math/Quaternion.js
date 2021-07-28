import { Vector } from "./Vector.js";
import { Matrix } from "./Matrix.js";

export class Quaternion extends Vector {
	static identity() {
		return new Quaternion(0, 0, 0, 1);
	}

	constructor(...data) {
		super(...(data.length ? data : Quaternion.identity())); // Default to identity.
	}

	get matrix() {
		const x = this[0];
		const y = this[1];
		const z = this[2];
		const w = this[3];

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

	get euler() {
		return this.matrix.rotation;
	}

	conjugate() {
		this.set(-this[0], -this[1], -this[2], this[3]);
		return this;
	}

	// Based on work by Robert Eisele.
	multiply(quaternion) {
		// Real scalar values.
		const w1 = this[3];
		const w2 = quaternion[3];

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

	divide(quaternion) {
		return this.multiply(new Quaternion(...quaternion).invert());
	}

	setAngle(axis, radians) {
		radians /= 2;
		this[3] = Math.cos(radians);
		const sine = Math.sin(radians);
		this[0] = sine * axis[0];
		this[1] = sine * axis[1];
		this[2] = sine * axis[2];
		return this;
	}

	// Roll
	rotateX(radians) {
		return this.multiply(new Quaternion().setAngle([1, 0, 0], radians));
	}

	// Pitch
	rotateY(radians) {
		return this.multiply(new Quaternion().setAngle([0, 1, 0], radians));
	}

	// Yaw
	rotateZ(radians) {
		return this.multiply(new Quaternion().setAngle([0, 0, 1], radians));
	}

	slerp(quaternion, t) {
		let cosom = this.dot(quaternion);
		if (cosom < 0) {
			cosom = -cosom;
			quaternion = new Quaternion(quaternion).negate();
		}

		const omega = Math.acos(cosom);
		const sinom = Math.sin(omega);

		const scale0 = Math.sin((1 - t) * omega) / sinom;
		const scale1 = Math.sin(t * omega) / sinom;

		return this.operate(quaternion, (a, b) => scale0 * a + scale1 * b);
	}
}