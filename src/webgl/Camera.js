import { Transform } from "./Transform.js";
import { Vector } from "../math/Vector.js";
import { Matrix } from "../math/Matrix.js";

export class Camera extends Transform {
	constructor({ near = 0.1, far = 100, fov = 45, aspectRatio = 1, left, right, bottom, top, zoom = 1 } = {}) {
		super();

		Object.assign(this, { near, far, fov, aspectRatio, left, right, bottom, top, zoom });
	}

	get projectionMatrix() {
		return this.left
			? new Matrix().orthographic(this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near, this.far) // Orthographic
			: new Matrix().perspective(this.fov, this.aspectRatio, this.near, this.far); // Perspective
	}

	get viewMatrix() {
		return this.worldMatrix.invert();
	}

	get projectionViewMatrix() {
		return this.projectionMatrix.multiply(this.viewMatrix);
	}

	get frustum() {
		let frustum = [];
		let m = this.projectionViewMatrix;

		// Order: -x, +x, +y, -y, +z (far), -z (near)
		for (let i = 0; i < 6; i++) {
			const operation = (a, b) => a + (i % 4 % 3 ? 1 : -1) * b; // - + + - - +
			frustum[i] = new Vector(
				operation(m[3], m[Math.floor(i / 2)]),
				operation(m[7], m[4 + Math.floor(i / 2)]),
				operation(m[11], m[8 + Math.floor(i / 2)]));
			frustum[i].constant = operation(m[15], m[12 + Math.floor(i / 2)]);

			const invLen = 1 / frustum[i].distance();
			frustum[i].scale(invLen);
			frustum[i].constant *= invLen;
		}

		return frustum;
	}

	// Project 3D coordinate to 2D point.
	project(vector) {
		vector.transform(this.viewMatrix);
		vector.transform(this.projectionMatrix);
		return vector;
	}

	// Unproject 2D point to 3D coordinate.
	unproject(vector) {
		vector.transform(this.projectionMatrix.invert());
		vector.transform(this.worldMatrix);
		return vector;
	}

	frustumIntersectsMesh(node) {
		// Treat frustumCulled as false if the program has no "position" attribute.
		if (!node.geometry.attributes.position) { return true; }

		if (!node.geometry.bounds || node.geometry.bounds.radius == Infinity) { node.geometry.computeBoundingSphere(); }

		if (!node.geometry.bounds) { return true; }

		return this.frustumIntersectsSphere(
			new Vector(...node.geometry.bounds.center).transform(node.worldMatrix),
			node.geometry.bounds.radius * node.worldMatrix.maxScaleOnAxis);
	}

	frustumIntersectsSphere(center, radius) {
		for (let i = 0; i < 6; i++) {
			const plane = this.frustum[i];
			const distance = new Vector(...plane).dot(center) + plane.constant;
			if (distance < -radius) { return false; }
		}

		return true;
	}
}