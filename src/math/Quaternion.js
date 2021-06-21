import { Vector } from "./Vector.js";

export class Quaternion extends Vector {
	constructor(...data) {
		super(...(data.length ? data : Quaternion.identity())); // Default to identity.
	}

	toMatrix() {
		// TODO
		throw new Error("Not implemented.");
	}

	toEuler() {
		// TODO
		throw new Error("Not implemented.");
	}

	conjugate() {
		this.set(-this[0], -this[1], -this[2], this[3]);
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
		radians *= 0.5;
		this[3] = Math.cos(radians);
		const sine = Math.sin(radians);
		this[0] = sine * axis[0];
		this[1] = sine * axis[1];
		this[2] = sine * axis[2];
		return this;
	}

	rotateX(radians) {
		return this.multiply(new Quaternion().setAngle([1, 0, 0], radians));
	}

	rotateY(radians) {
		return this.multiply(new Quaternion().setAngle([0, 1, 0], radians));
	}

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
Quaternion.identity = () => new Quaternion(0, 0, 0, 1);