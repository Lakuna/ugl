import { Transform } from "./Transform.js";
import { Matrix } from "../math/Matrix.js";

export class Camera extends Transform {
	constructor({ near = 0.1, far = 100, fieldOfView = 45, aspectRatio = 1, left, right, bottom, top, zoom = 1 } = {}) {
		super();

		Object.defineProperties(this, {
			near: { value: near, writable: true },
			far: { value: far, writable: true },
			fieldOfView: { value: fieldOfView, writable: true },
			aspectRatio: { value: aspectRatio, writable: true },
			left: { value: left, writable: true },
			right: { value: right, writable: true },
			bottom: { value: bottom, writable: true },
			top: { value: top, writable: true },
			zoom: { value: zoom, writable: true }
		});
	}

	get projectionMatrix() {
		return this.left || this.right || this.bottom || this.top
			? new Matrix().orthographic(this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near, this.far)
			: new Matrix().perspective(this.fieldOfView, this.aspectRatio, this.near, this.far);
	}

	get viewMatrix() {
		return this.worldMatrix().invert();
	}

	get projectionViewMatrix() {
		return this.projectionMatrix.multiply(this.viewMatrix);
	}
}