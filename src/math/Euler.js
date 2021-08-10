import { Quaternion } from "./Quaternion.js";
import { Vector } from "./Vector.js";

/**
 * Class representing a Euler angle. Note that this is technically an intrinsic Tait-Bryan angle with order of rotations XYZ.
 * @see https://en.wikipedia.org/wiki/Euler_angles
 */
export class Euler extends Vector {
	/**
	 * The quaternion equivalent of this Euler angle.
	 * @type {Quaternion}
	 */
	get quaternion() {
		const sinX = Math.sin(this.x / 2);
		const cosX = Math.cos(this.x / 2);
		const sinY = Math.sin(this.y / 2);
		const cosY = Math.cos(this.y / 2);
		const sinZ = Math.sin(this.z / 2);
		const cosZ = Math.cos(this.z / 2);

		return new Quaternion(
			sinX * cosY * cosZ + cosX * sinY * sinZ,
			cosX * sinY * cosZ - sinX * cosY * sinZ,
			cosX * cosY * sinZ + sinX * sinY * cosZ,
			cosX * cosY * cosZ - sinX * sinY * sinZ);
	}

	/**
	 * The rotation matrix equivalent of this Euler angle.
	 * @type {Matrix}
	 */
	get matrix() {
		return this.quaternion.matrix;
	}
}