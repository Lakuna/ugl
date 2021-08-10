import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";
import { Vector } from "./Vector.js";
import { Euler } from "./Euler.js";
import { Quaternion } from "./Quaternion.js";

/** Class representing a matrix. */
export class Matrix extends Array {
	/**
	 * Creates a matrix from a rule.
	 * @param {number} width - The width of the resulting matrix.
	 * @param {number} height - The height of the resulting matrix.
	 * @param {function<number, number>} rule - The rule to follow to calculate values in the matrix.
	 * @return {Matrix} A matrix which conforms to the supplied rule.
	 */
	static fromRule(width, height, rule) {
		let data = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				data[y * width + x] = rule(x, y);
			}
		}
		return new Matrix(...data);
	}

	/**
	 * Creates an identity matrix for the given dimension.
	 * @param {number} [dim=4] - The number of rows and columns in the matrix.
	 * @return {Matrix} An identity matrix.
	 */
	static identity(dim = 4) {
		return Matrix.fromRule(dim, dim, (x, y) => x == y ? 1 : 0);
	}

	#width;

	/**
	 * Create a matrix.
	 * @param {...number} [data=Matrix.identity()] - The initial data to supply to the matrix.
	 */
	constructor(...data) {
		super(...(data.length ? data : Matrix.identity())); // Default to identity.
	}

	/**
	 * The width of this matrix. Assumes that the matrix is square if not set.
	 * @type {number}
	 */
	get width() {
		return this.#width ?? Math.sqrt(this.length);
	}

	/**
	 * The width of this matrix. Assumes that the matrix is square if not set.
	 * @type {number}
	 */
	set width(value) {
		/** @ignore */ this.#width = value;
	}

	/**
	 * The determinant of this matrix. Note that calculating this value can be extremely expensive depending on the size of the matrix.
	 * @type {number}
	 */
	get determinant() {
		if (this.width ** 2 != this.length) { throw new Error("Cannot get determinant of a non-square matrix."); }

		// End of recursion.
		if (this.width == 1) {
			return this[0];
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

	/**
	 * Gets the value at a point in the matrix.
	 * @param {number} x - The horizontal coordinate of the value.
	 * @param {number} y - The vertical coordinate of the value.
	 * @return {number} The value at the point.
	 */
	getPoint(x, y) {
		return x < this.width ? this[y * this.width + x] : undefined;
	}

	/**
	 * Sets the value at a point in the matrix.
	 * @param {number} x - The horizontal coordinate of the value.
	 * @param {number} y - The vertical coordinate of the value.
	 * @param {number} value - The new value at the location.
	 * @return {boolean} Whether the operation succeeded.
	 */
	setPoint(x, y, value) {
		if (x > this.width) { return false; }
		/** @ignore */ this[y * this.width + x] = value;
		return true;
	}

	/**
	 * The translation of the matrix.
	 * @type {Vector}
	 */
	get translation() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => m.getPoint(i, 3));
	}

	/**
	 * The scale of the matrix.
	 * @type {Vector}
	 */
	get scaling() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => Math.hypot(...Vector.fromRule(3, (j) => m.getPoint(i, j))));
	}

	/**
	 * The maximum scales of this matrix on each axis.
	 * @type {Vector}
	 */
	get maxScaleOnAxis() {
		const m = new Matrix(...this).resize(3);
		return Vector.fromRule(3, (i) => sigma(0, 2, (j) => m.getPoint(i, j) ** 2));
	}

	/**
	 * The rotation of this matrix.
	 * @type {Euler}
	 */
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

	/**
	 * The rotation of this matrix in quaternion form.
	 * @type {Quaternion}
	 * @see https://doi.org/10.1016/B978-0-12-336156-1.50030-6
	 */
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

	/**
	 * Fills this matrix with the supplied data.
	 * @param {...number} data - The data to fill the matrix with.
	 * @return {Matrix} Self.
	 */
	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	/**
	 * Resizes this matrix. If the matrix expands, new points are filled with identity.
	 * @param {number} width - The new width of the matrix.
	 * @param {number} height - The new height of the matrix.
	 * @return {Matrix} Self.
	 */
	resize(width, height) {
		return this.set(...Matrix.fromRule(width, height || width, (x, y) => this.getPoint(x, y) ?? (x == y ? 1 : 0)));
	}

	/**
	 * Multiplies this matrix by another.
	 * @param {Matrix} matrix - The other matrix.
	 * @param {number} [m=this.width] - The shared dimension between the matrices.
	 * @return {Matrix} Self.
	 */
	multiply(matrix, m = this.width) {
		matrix = new Matrix(...matrix);

		const n = this.length / m;
		const p = matrix.length / m;

		return this.set(...Matrix.fromRule(n, p, (i, j) => sigma(0, m - 1, (k) => this.getPoint(i, k) * matrix.getPoint(k, j))));
	}

	/**
	 * Translates this matrix by the given value.
	 * @param {Vector} vector - The amount to translate by.
	 * @return {Matrix} Self.
	 */
	translate(vector) {
		return this.multiply([
			1, 			0, 			0, 			0,
			0, 			1, 			0, 			0,
			0, 			0, 			1, 			0,
			vector.x,	vector.y,	vector.z,	1
		]);
	}

	/**
	 * Roll the matrix about the X axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Pitch the matrix about the Y axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Yaw the matrix about the Z axis.
	 * @param {number} radians - The amount to rotate in radians.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Rotate the matrix about all axes.
	 * @param {Vector} vector - The amount to rotate by on each axis in radians.
	 * @return {Matrix} Self.
	 */
	rotate(vector) {
		return this.rotateX(vector.x).rotateY(vector.y).rotateZ(vector.z);
	}

	/**
	 * Scale the matrix.
	 * @param {Vector} vector - The amount to scale by on each axis.
	 * @return {Matrix} Self.
	 */
	scale(vector) {
		return this.multiply([
			vector.x,	0,			0,			0,
			0,			vector.y,	0,			0,
			0,			0,			vector.z,	0,
			0,			0,			0,			1
		]);
	}

	/**
	 * Invert the matrix.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Transpose the matrix.
	 * @return {Matrix} Self.
	 */
	transpose() {
		const height = this.length / this.width;
		return this.set(...Matrix.fromRule(this.length, 1, (i) => this.getPoint(Math.floor(i / height), i % height, this.width)));
	}

	/**
	 * Apply an orthographic projection.
	 * @param {number} left - The left boundary of the output.
	 * @param {number} right - The right boundary of the output.
	 * @param {number} bottom - The bottom boundary of the output.
	 * @param {number} top - The top boundary of the output.
	 * @param {number} near - The nearest that the projection can render.
	 * @param {number} far - The farthest that the projection can render.
	 * @return {Matrix} Self.
	 */
	orthographic(left, right, bottom, top, near, far) {
		return this.multiply([
			2 / (right - left),					0,									0,									0,
			0,									2 / (top - bottom),					0,									0,
			0,									0,									2 / (near - far),					0,
			(left + right) / (left - right),	(bottom + top) / (bottom - top),	(near + far) / (near - far),		1
		]);
	}

	/**
	 * Apply perspective.
	 * @param {number} fieldOfView - The field of view of the projection.
	 * @param {number} aspectRatio - The aspect ratio of the output.
	 * @param {number} near - The nearest that the projection can render.
	 * @param {number} far - The farthest that the projection can render.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Positions and rotates the matrix towards a target.
	 * @param {Vector} position - The new position of this matrix.
	 * @param {Vector} target - The position to rotate towards.
	 * @param {Vector} [up=new Vector(0, 1, 0)] - A known direction that isn't used elsewhere in the calculation.
	 * @return {Matrix} Self.
	 */
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

	/**
	 * Multiply the values of this matrix by a number.
	 * @param {number} scalar - The scalar value to multiply by.
	 * @return {Matrix} Self.
	 */
	multiplyScalar(scalar) {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] * scalar));
	}
}