import { Quaternion } from "./Quaternion.js";

export class Euler extends Array {
	get quaternion() {
		const sinX = Math.sin(this[0] / 2);
		const cosX = Math.cos(this[0] / 2);
		const sinY = Math.sin(this[1] / 2);
		const cosY = Math.cos(this[1] / 2);
		const sinZ = Math.sin(this[2] / 2);
		const cosZ = Math.cos(this[2] / 2);

		return new Quaternion(
			sinX * cosY * cosZ + cosX * sinY * sinZ,
			cosX * sinY * cosZ - sinX * cosY * sinZ,
			cosX * cosY * sinZ + sinX * sinY * cosZ,
			cosX * cosY * cosZ - sinX * sinY * sinZ);
	}

	get matrix() {
		return this.quaternion.matrix;
	}
}