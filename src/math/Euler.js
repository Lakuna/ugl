import { Matrix } from "./Matrix.js";

export class Euler extends Array {
	toQuaternion() {
		return this.toMatrix().toQuaternion();
	}

	toMatrix() {
		return new Matrix().rotate(...this);
	}
}