import { Matrix } from "./Matrix.js";
import { Quaternion } from "./Quaternion.js";

export class Euler extends Array {
	toQuaternion() {
		// return this.toMatrix().toQuaternion();

		const sinX = Math.sin(this[0] * 0.5);
		const cosX = Math.cos(this[0] * 0.5);
		const sinY = Math.sin(this[1] * 0.5);
		const cosY = Math.cos(this[1] * 0.5);
		const sinZ = Math.sin(this[2] * 0.5);
		const cosZ = Math.cos(this[2] * 0.5);

		return new Quaternion(
			sinX * cosY * cosZ + cosX * sinY * sinZ,
			cosX * sinY * cosZ - sinX * cosY * sinZ,
			cosX * cosY * sinZ + sinX * sinY * cosZ,
			cosX * cosY * cosZ - sinX * sinY * sinZ);
	}

	toMatrix() {
		return new Matrix().rotate(...this);
	}
}