import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";
import { Vector } from "./Vector.js";
import { Euler } from "./Euler.js";
import { Quaternion } from "./Quaternion.js";

export class Matrix extends Array {
	static fromRule(width, height, rule) {
		let data = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				data[y * width + x] = rule(x, y);
			}
		}
		return new Matrix(...data);
	}

	static identity(dim = 4) {
		return Matrix.fromRule(dim, dim, (x, y) => x == y ? 1 : 0);
	}

	#width;

	constructor(...data) {
		super(...(data.length ? data : Matrix.identity())); // Default to identity.
	}

	get width() {
		return this.#width ?? Math.sqrt(this.length);
	}

	set width(value) {
		this.#width = value;
	}

	// Extremely slow past 10x10.
	get determinant() {
		if (this.width ** 2 != this.length) { throw new Error("Cannot get determinant of a non-square matrix."); }

		// End of recursion.
		if (this.width == 2) {
			return this[0] * this[3] - this[1] * this[2];
		}

		// Calculate the matrix that is not in this[i]'s row (0) or column (i).
		const oppositeMatrix = (i) => {
			const out = [];

			for (let x = 0; x < this.width; x++) {
				for (let y = 1; y < this.width; y++) {
					if (x == i) { continue; }

					out.push(this.getPoint(x, y));
				}
			}

			return new Matrix(...out);
		};
		
		let out = 0;
		for (let i = 0; i < this.width; i++) { out += -(i % 2 || -1) * this[i] * oppositeMatrix(i).determinant; }
		return out;
	}

	getPoint(x, y) {
		return x < this.width ? this[y * this.width + x] : undefined;
	}

	setPoint(x, y, value) {
		if (x > this.width) { return false; }
		this[y * this.width + x] = value;
		return true;
	}

	get translation() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => m.getPoint(i, 3));
	}

	get scaling() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => Math.hypot(...Vector.fromRule(3, (j) => m.getPoint(i, j))));
	}

	get maxScaleOnAxis() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => sigma(0, 2, (j) => m.getPoint(i, j) ** 2));
	}

	// Based on work by the authors of three.js.
	get rotation() {
		const m = new Matrix(...this).resize(3);

		// Order of rotations: XYZ (intrinsic Tait-Bryan angles).
		return Math.abs(m[6]) < 1
			? new Euler(
				Math.atan2(-m[7], m[8]),
				Math.asin(clamp(m[6], -1, 1)),
				Math.atan2(-m[3], m[0]))
			: new Euler(
				Math.atan2(m[5], m[4]),
				Math.asin(clamp(m[6], -1, 1)),
				0);
	}

	// Algorithm by Ken Shoemake, "Quaternion Calculus and Fast Animation," 1987 SIGGRAPH course notes.
	get quaternion() {
		const m = new Matrix(...this).resize(3);

		const fTrace = m[0] + m[4] + m[8];
		if (fTrace > 0) {
			const fRoot = Math.sqrt(fTrace + 1); // 2w
			const r4w = 0.5 / fRoot; // 1/(4w)

			return new Quaternion(
				(m[5] - m[7]) * r4w,
				(m[6] - m[2]) * r4w,
				(m[1] - m[3]) * r4w,
				fRoot / 2);
		}

		let i = 0;
		if (m[4] > m[0]) { i = 1; }
		if (m[8] > m[i * 3 + i]) { i = 2; }
		const j = (i + 1) % 3;
		const k = (i + 2) % 3;

		const out = new Quaternion();

		let fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
		out[i] = fRoot / 2;
		fRoot = 0.5 / fRoot;
		out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
		out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
		out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;

		return out;
	}

	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	resize(width, height) {
		return this.set(...Matrix.fromRule(width, height || width, (x, y) => this.getPoint(x, y) ?? (x == y ? 1 : 0)));
	}

	multiply(matrix, m = this.width) {
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
		if (this.width ** 2 != this.length) { throw new Error("Cannot invert a non-square matrix."); }

		const identity = Matrix.identity(this.width);
		const copy = new Matrix(...this);

		for (let i = 0; i < this.width; i++) {
			let diagonal = copy.getPoint(i, i);
			if (diagonal == 0) {
				for (let ii = i + 1; ii < this.width; ii++) {
					if (copy.getPoint(ii, i) != 0) {
						for (let j = 0; j < this.width; j++) {
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

			for (let j = 0; j < this.width; j++) {
				[copy, identity].forEach((matrix) => matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal));
			}

			for (let ii = 0; ii < this.width; ii++) {
				if (ii == i) { continue; }

				let temp = copy.getPoint(ii, i);

				for (let j = 0; j < this.width; j++) {
					[copy, identity].forEach((matrix) => matrix.setPoint(ii, j, matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j)));
				}
			}
		}

		return this.set(...identity);
	}

	transpose() {
		const height = this.length / this.width;
		return this.set(...Matrix.fromRule(this.length, 1, (i) => this.getPoint(Math.floor(i / height), i % height, this.width)));
	}

	orthographic(left, right, bottom, top, near, far) {
		return this.multiply([
			2 / (right - left),					0,									0,									0,
			0,									2 / (top - bottom),					0,									0,
			0,									0,									2 / (near - far),					0,
			(left + right) / (left - right),	(bottom + top) / (bottom - top),	(near + far) / (near - far),		1
		]);
	}

	perspective(fieldOfView, aspectRatio, near, far) {
		const f = Math.tan(Math.PI / 2 - fieldOfView / 2);
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

	projection(width, height) {
		return new Matrix(
			2 / width,		0,				0,
			0,				-2 / height,	0,
			-1,				1,				1
		);
	}

	multiplyScalar(scalar) {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] * scalar));
	}
}