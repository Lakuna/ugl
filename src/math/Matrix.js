import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";
import { Vector } from "./Vector.js";
import { Euler } from "./Euler.js";
import { Quaternion } from "./Quaternion.js";

export class Matrix extends Array {
	constructor(...data) {
		super(...(data.length ? data : Matrix.identity())); // Default to identity.
	}

	get dim() {
		return Math.sqrt(this.length);
	}

	get determinant() {
		// TODO
		throw new Error("Not implemented.");
		// https://www.mathsisfun.com/algebra/matrix-determinant.html
	}

	getPoint(x, y, width = this.dim) {
		return x < width ? this[y * width + x] : undefined;
	}

	setPoint(x, y, value, width = this.dim) {
		if (x > width) { return false; }
		this[y * width + x] = value;
		return true;
	}

	getTranslation(width = this.dim) {
		return Vector.fromRule(3, (i) => this.getPoint(i, 3, width));
	}

	getScaling(width = this.dim) {
		return Vector.fromRule(3, (i) => Math.hypot(...Vector.fromRule(3, (j) => this.getPoint(i, j, width))));
	}

	getMaxScaleOnAxis(width = this.dim) {
		return Vector.fromRule(3, (i) => sigma(0, 2, (j) => this.getPoint(i, j, width) ** 2));
	}

	// Based on work by the authors of three.js.
	toEuler(width = this.dim) {
		// TODO: Test if the second case can be removed.

		// Order of rotations: XYZ (intrinsic Tait-Bryan angles).
		return Math.abs(this.getPoint(0, 2, width)) < 1
			? new Euler(
				Math.atan2(-this.getPoint(1, 2, width), this.getPoint(2, 2, width)),
				Math.asin(clamp(this.getPoint(0, 2, width), -1, 1)),
				Math.atan2(-this.getPoint(0, 1, width), this[0] /* this.getPoint(0, 0, width) */))
			: new Euler(
				Math.atan2(-this.getPoint(2, 1, width), this.getPoint(1, 1, width)),
				Math.asin(clamp(this.getPoint(0, 2, width), -1, 1)),
				0);
	}

	toQuaternion(width = this.dim) {
		// TODO
		throw new Error("Not implemented.");
	}

	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	resize(width, height, currentWidth = this.dim) {
		return this.set(...Matrix.fromRule(width, height || width, (x, y) => this.getPoint(x, y, currentWidth) ?? (x == y ? 1 : 0)));
	}

	multiply(matrix, m = this.dim) {
		matrix = new Matrix(...matrix);

		const n = this.length / m;
		const p = matrix.length / m;

		return this.set(...Matrix.fromRule(n, p, (i, j) => sigma(0, m - 1, (k) => this.getPoint(i, k) * matrix.getPoint(k, j))));
	}

	translate(x, y, z) {
		return this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		]);
	}

	// Roll
	rotateX(radians) {
		const cosine = Math.cos(radians);
		const sine = Math.sin(radians);

		return this.multiply([
			1,		0,		0,		0,
			0,		cosine,	sine,	0,
			0,		-sine,	cosine,	0,
			0,		0,		0,		1
		]);
	}

	// Pitch
	rotateY(radians) {
		const cosine = Math.cos(radians);
		const sine = Math.sin(radians);

		return this.multiply([
			cosine,	0,		-sine,	0,
			0,		1,		0,		0,
			sine,	0,		cosine,	0,
			0,		0,		0,		1
		]);
	}

	// Yaw
	rotateZ(radians) {
		const cosine = Math.cos(radians);
		const sine = Math.sin(radians);

		return this.multiply([
			cosine,	sine,	0,		0,
			-sine,	cosine,	0,		0,
			0,		0,		1,		0,
			0,		0,		0,		1
		]);
	}

	rotate(x, y, z) {
		return this.rotateX(x).rotateY(y).rotateZ(z);
	}

	scale(x, y, z) {
		return this.multiply([
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		]);
	}

	// Based on work by Andrew Ippoliti.
	invert() {
		const dim = this.dim;

		if (dim ** 2 != this.length) { throw new Error("Cannot invert a non-square matrix."); }

		const identity = Matrix.identity(dim);
		const copy = new Matrix(...this);

		for (let i = 0; i < dim; i++) {
			let diagonal = copy.getPoint(i, i);
			if (diagonal == 0) {
				for (let ii = i + 1; ii < dim; ii++) {
					if (copy.getPoint(ii, i) != 0) {
						for (let j = 0; j < dim; j++) {
							[copy, identity].forEach((matrix) => {
								let temp = matrix.getPoint(i, j);
								matrix.setPoint(i, j, matrix.getPoint(ii, j));
								matrix.setPoint(ii, j, temp);
							});
						}

						break;
					}
				}

				diagonal = copy.getPoint(i, i);
				if (diagonal == 0) { throw new Error("Matrix is not invertible."); }
			}

			for (let j = 0; j < dim; j++) {
				[copy, identity].forEach((matrix) => matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal));
			}

			for (let ii = 0; ii < dim; ii++) {
				if (ii == i) { continue; }

				let temp = copy.getPoint(ii, i);

				for (let j = 0; j < dim; j++) {
					[copy, identity].forEach((matrix) => matrix.setPoint(ii, j, matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j)));
				}
			}
		}

		return this.set(...identity);
	}

	transpose(width = this.dim) {
		const height = this.length / width;
		return this.set(...Matrix.fromRule(this.length, 1, (i) => this.getPoint(Math.floor(i / height), i % height, width)));
	}

	orthographic(left, right, top, bottom, near, far) {
		return this.multiply([
			2 / (right - left),					0,									0,									0,
			0,									2 / (top - bottom),					0,									0,
			0,									0,									2 / (near - far),					0,
			(left + right) / (left - right),	(bottom + top) / (bottom - top),	(near + far) / (near - far),		1
		]);
	}

	perspective(fov, aspectRatio, near, far) {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
		const range = 1 / (near - far);

		return this.multiply([
			f / aspectRatio,		0,						0,						0,
			0,						f,						0,						0,
			0,						0,						(near + far) * range,	-1,
			0,						0,						near * far * range * 2,	0
		]);
	}

	lookAt(position, target, up = [0, 1, 0]) {
		const zAxis = new Vector(...position).subtract(target).normalize();
		const xAxis = new Vector(...up).cross(zAxis).normalize();
		const yAxis = new Vector(...zAxis).cross(xAxis).normalize();

		return this.multiply([
			...xAxis,		0,
			...yAxis,		0,
			...zAxis,		0,
			...position,	1
		]);
	}

	projection() {
		// TODO
		throw new Error("Not implemented.");
	}

	multiplyScalar() {
		// TODO
		throw new Error("Not implemented.");
	}
}
Matrix.fromRule = (width, height, rule) => {
	let data = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			data[y * width + x] = rule(x, y);
		}
	}
	return new Matrix(...data);
};
Matrix.identity = (dim = 4) => Matrix.fromRule(dim, dim, (x, y) => x == y ? 1 : 0);

console.log(new Matrix(
	1, 14, -4, 8,
	-10, 7,  12, 2,
	16, 3, 9, 6,
	5, 11, 15, -13
).normal);