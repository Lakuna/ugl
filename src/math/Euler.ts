import { Matrix } from "./Matrix";
import { Quaternion } from "./Quaternion";
import { Vector } from "./Vector";

/** Three angles used to describe the orientation of a rigid body with respect to a fixed coordinate system. */
export class Euler extends Vector {
	/** The quaternion equivalent of this Euler angle. */
	get quaternion(): Quaternion {
		const sinX: number = Math.sin(this.x / 2);
		const cosX: number = Math.cos(this.x / 2);
		const sinY: number = Math.sin(this.y / 2);
		const cosY: number = Math.cos(this.y / 2);
		const sinZ: number = Math.sin(this.z / 2);
		const cosZ: number = Math.cos(this.z / 2);

		return new Quaternion(
			sinX * cosY * cosZ + cosX * sinY * sinZ,
			cosX * sinY * cosZ - sinX * cosY * sinZ,
			cosX * cosY * sinZ + sinX * sinY * cosZ,
			cosX * cosY * cosZ - sinX * sinY * sinZ
		);
	}

	/** The rotation matrix equivalent of this Euler angle. */
	get matrix(): Matrix {
		return this.quaternion.matrix;
	}
}