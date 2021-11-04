import { clamp } from "./clamp";
import { Euler } from "./Euler";
import { Quaternion } from "./Quaternion";
import { sigma } from "./sigma";
import { Vector } from "./Vector";

/** A rectangular array of quantities. */
export class Matrix extends Array<number> {
	/**
	 * Creates a matrix from a rule.
	 * @param width - The width of the matrix.
	 * @param height - The height of the matrix.
	 * @param rule - The rule to follow to calculate the values in the matrix.
	 * @returns A matrix which conforms to the supplied rule.
	 */
	static fromRule(width: number, height: number, rule: (x: number, y: number) => number): Matrix {
		const data: number[] = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				data[y * width + x] = rule(x, y);
			}
		}
		const output: Matrix = new Matrix(...data);
		output.width = width;
		return output;
	}

	/**
	 * Creates an identity matrix.
	 * @param dim - The dimension of the matrix.
	 * @returns An identity matrix.
	 */
	static identity(dim = 4): Matrix {
		return Matrix.fromRule(dim, dim, (x: number, y: number): number => x == y ? 1 : 0);
	}
	
	#width?: number;

	/**
	 * Creates a matrix.
	 * @param data - The initial data to supply to the matrix.
	 */
	constructor(...data: Array<number>) {
		super(...(data.length ? data : Matrix.identity())); // Default to identity
	}

	/** The width of this matrix. Assumes that the matrix is square if not explicitly set. */
	get width(): number {
		return this.#width ?? Math.sqrt(this.length);
	}

	set width(value: number) {
		this.#width = value;
	}

	/** Whether this matrix is square or not. */
	get isSquare(): boolean {
		return !(this.width % 1) && this.width ** 2 == this.length;
	}

	/** The determinant of this matrix. */
	get determinant(): number {
		// End of recursion
		if (this.length == 1) {
			return this[0];
		}

		if (!this.isSquare) {
			throw new Error("Cannot get determinant of a non-square matrix.");
		}

		// Calculate the matrix that is not in this[i]'s row (0) or column (i)
		const oppositeMatrix = (i: number): Matrix => {
			const out: number[] = [];

			for (let x = 0; x < this.width; x++) {
				for (let y = 0; y < this.width; y++) {
					if (x == i) {
						continue;
					}

					out.push(this.getPoint(x, y));
				}
			}

			return new Matrix(...out);
		}

		let out = 0;
		for (let i = 0; i < this.width; i++) {
			out += -(i % 2 || -1) * this[i] * oppositeMatrix(i).determinant;
		}
		return out;
	}

	/**
	 * Gets the value at a point in the matrix.
	 * @param x - The column of the value.
	 * @param y - The row of the value.
	 * @returns The value at the given point.
	 */
	getPoint(x: number, y: number): number {
		return x < this.width ? this[y * this.width + x] : undefined;
	}

	/**
	 * Sets the value at a point in the matrix.
	 * @param x - The column of the value.
	 * @param y - The row of the value.
	 * @param value - The value to set.
	 * @returns Whether the operation succeeded.
	 */
	setPoint(x: number, y: number, value: number): boolean {
		if (x > this.width) {
			return false;
		}
		this[y * this.width + x] = value;
		return true;
	}

	/** The translation of the matrix. */
	get translation(): Vector {
		const m: Matrix = this.copy.resize(3);
		return Vector.fromRule(3, (i: number): number => m.getPoint(i, 3));
	}

	/** The scaling of the matrix. */
	get scaling() {
		const m: Matrix = this.copy.resize(3);
		return Vector.fromRule(3, (i: number): number => Math.hypot(...Vector.fromRule(3, (j: number): number => m.getPoint(i, j))));
	}

	/** The maximum scales of this matrix on each axis. */
	get maxScaleOnAxis(): Vector {
		const m: Matrix = this.copy.resize(3);
		return Vector.fromRule(3, (i: number): number => sigma(0, 2, (j: number): number => m.getPoint(i, j) ** 2));
	}

	/** The rotation of this matrix. */
	get rotation(): Euler {
		const m: Matrix = this.copy.resize(3);

		// Order of rotations: XYZ (intrinsic Tait-Bryan angles)
		return Math.abs(m[6]) < 1
			? new Euler(
				Math.atan2(-m[7], m[8]),
				Math.asin(clamp(m[6], -1, 1)),
				Math.atan2(-m[3], m[0])
			)
			: new Euler(
				Math.atan2(m[5], m[4]),
				Math.asin(clamp(m[6], -1, 1)),
				0
			);
	}

	/** The rotation of this matrix in quaternion form. */
	get quaternion(): Quaternion {
		const m: Matrix = this.copy.resize(3);

		const fTrace: number = m[0] + m[4] + m[8];
		if (fTrace > 0) {
			const fRoot: number = Math.sqrt(fTrace + 1); // 2w
			const r4w: number = 0.5 / fRoot; // 1/(4w)

			return new Quaternion(
				(m[5] - m[7]) * r4w,
				(m[6] - m[2]) * r4w,
				(m[1] - m[3]) * r4w,
				fRoot / 2
			);
		}

		let i = 0;
		if (m[4] > m[0]) {
			i = 1;
		}
		if (m[8] > m[i * 3 + i]) {
			i = 2;
		}
		const j: number = (i + 1) % 3;
		const k: number = (i + 2) % 3;

		const out: Quaternion = new Quaternion();

		let fRoot: number = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
		out[i] = fRoot / 2;
		fRoot = 0.5 / fRoot;
		out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
		out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
		out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;

		return out;
	}

	/** A copy of this matrix. */
	get copy(): Matrix {
		return new Matrix(...this);
	}

	/**
	 * Fills this matrix with the supplied data.
	 * @param data - The data to fill this matrix with.
	 * @returns This matrix.
	 */
	set(...data: Array<number>): Matrix {
		while (this.length > 0) {
			this.pop();
		}

		for (const value of data) {
			this.push(value);
		}

		return this;
	}

	/**
	 * Resizes this matrix. If the matrix expands, new points are filled with identity.
	 * @param width - The new width of the matrix.
	 * @param height - The new height of the matrix.
	 * @returns This matrix.
	 */
	resize(width: number, height?: number): Matrix {
		this.width = width;
		return this.set(...Matrix.fromRule(width, height || width, (x: number, y: number): number => this.getPoint(x, y) ?? (x == y ? 1 : 0)));
	}

	/**
	 * Multiplies this matrix by another.
	 * @param matrix - The other matrix.
	 * @param m - The size of the shared dimension between the matrices.
	 * @returns This matrix.
	 */
	multiply(matrix: Matrix, m: number = this.width): Matrix {
		const n: number = this.length / m;
		const p: number = matrix.length / m;

		this.width = n;
		return this.set(...Matrix.fromRule(n, p, (i: number, j: number): number =>
			sigma(0, m - 1, (k: number): number => this.getPoint(i, k) * matrix.getPoint(k, j))));
	}

	/**
	 * Translates this matrix.
	 * @param vector - The amount to translate by.
	 * @returns This matrix.
	 */
	translate(vector: Vector): Matrix {
		return this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			vector.x, vector.y, vector.z, 1
		] as Matrix);
	}

	/**
	 * Rolls this matrix about the X axis.
	 * @param radians - The amount to rotate in radians.
	 * @returns This matrix.
	 */
	rotateX(radians: number): Matrix {
		const c: number = Math.cos(radians);
		const s: number = Math.sin(radians);

		return this.multiply([
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1
		] as Matrix);
	}

	/**
	 * Pitches this matrix about the Y axis.
	 * @param radians - The amount to rotate in radians.
	 * @returns This matrix.
	 */
	rotateY(radians: number): Matrix {
		const c: number = Math.cos(radians);
		const s: number = Math.sin(radians);

		return this.multiply([
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1
		] as Matrix);
	}

	/**
	 * Yaws this matrix about the Z axis.
	 * @param radians - The amount to rotate in radians.
	 * @returns This matrix.
	 */
	rotateZ(radians: number): Matrix {
		const c: number = Math.cos(radians);
		const s: number = Math.sin(radians);

		return this.multiply([
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		] as Matrix);
	}

	/**
	 * Rotates this matrix.
	 * @param vector - The amount to rotate on each axis in radians.
	 * @returns This matrix.
	 */
	rotate(vector: Vector): Matrix {
		return this.rotateX(vector.x).rotateY(vector.y).rotateZ(vector.z);
	}

	/**
	 * Scales this matrix.
	 * @param vector - The amount to scale by on each axis.
	 * @return This matrix.
	 */
	scale(vector: Vector): Matrix {
		return this.multiply([
			vector.x, 0, 0, 0,
			0, vector.y, 0, 0,
			0, 0, vector.z, 0,
			0, 0, 0, 1
		] as Matrix);
	}

	/**
	 * Inverts this matrix.
	 * @returns This matrix.
	 */
	invert(): Matrix {
		if (!this.isSquare) {
			throw new Error("Cannot invert a non-square matrix.");
		}

		const identity: Matrix = Matrix.identity(this.width);
		const copy: Matrix = this.copy;

		for (let i = 0; i < this.width; i++) {
			let diagonal: number = copy.getPoint(i, i);
			if (diagonal == 0) {
				for (let ii: number = i + 1; ii < this.width; ii++) {
					if (copy.getPoint(ii, i) != 0) {
						for (let j = 0; j < this.width; j++) {
							[copy, identity].forEach((matrix: Matrix): void => {
								const temp: number = matrix.getPoint(i, j);
								matrix.setPoint(i, j, matrix.getPoint(ii, j));
								matrix.setPoint(ii, j, temp);
							});
						}

						break;
					}
				}

				diagonal = copy.getPoint(i, i);
				if (diagonal == 0) {
					throw new Error("Matrix is not invertible.");
				}
			}

			for (let j = 0; j < this.width; j++) {
				[copy, identity].forEach((matrix: Matrix): void => {
					matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal);
				});
			}

			for (let ii = 0; ii < this.width; ii++) {
				if (ii == i) {
					continue;
				}

				const temp = copy.getPoint(ii, i);
				for (let j = 0; j < this.width; j++) {
					[copy, identity].forEach((matrix: Matrix): void => {
						matrix.setPoint(ii, j, matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j));
					});
				}
			}
		}

		return this.set(...identity);
	}

	/**
	 * Transposes this matrix.
	 * @returns This matrix.
	 */
	transpose(): Matrix {
		const height: number = this.length / this.width;
		this.width = height;
		return this.set(...Matrix.fromRule(this.length, 1, (i: number): number => this.getPoint(Math.floor(i / height), i % height)));
	}

	/**
	 * Applies an orthographic projection to this matrix.
	 * @param left - The left boundary of the output.
	 * @param right - The right boundary of the output.
	 * @param bottom - The bottom boundary of the output.
	 * @param top - The top boundary of the output.
	 * @param near - The nearest that the projection can render.
	 * @param far - The farthest that the projection can render.
	 * @returns This matrix.
	 */
	orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
		return this.multiply([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, 2 / (near - far), 0,
			(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
		] as Matrix);
	}

	/**
	 * Applies perspective to this matrix.
	 * @param fov - The field of view of the projection.
	 * @param aspectRatio - The aspect ratio of the output.
	 * @param near - The nearest that the projection can render.
	 * @param far - The farthest that the projection can render.
	 * @returns This matrix.
	 */
	perspective(fov: number, aspectRatio: number, near: number, far: number): Matrix {
		const f: number = Math.tan(Math.PI / 2 - fov / 2);
		const range: number = 1 / (near - far);

		return this.multiply([
			f / aspectRatio, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * range, -1,
			0, 0, near * far * range * 2, 0
		] as Matrix);
	}

	/**
	 * Positions and rotates this matrix towards a target.
	 * @param position - The new position of this matrix.
	 * @param target - The position to rotate towards.
	 * @param up - A known direction that isn't used elsewhere in the calculation.
	 * @returns This matrix.
	 */
	lookAt(position: Vector, target: Vector, up: Vector = new Vector(0, 1, 0)): Matrix {
		const zAxis: Vector = position.copy.subtract(target).normalize();
		const xAxis: Vector = up.copy.cross(zAxis).normalize();
		const yAxis: Vector = zAxis.copy.cross(xAxis).normalize();

		return this.multiply([
			...xAxis, 0,
			...yAxis, 0,
			...zAxis, 0,
			...position, 1
		] as Matrix);
	}

	/**
	 * Multiplies the values of this matrix by a number.
	 * @param scalar - The scalar value to multiply by.
	 * @returns This matrix.
	 */
	multiplyScalar(scalar: number): Matrix {
		return this.set(...Vector.fromRule(this.length, (i: number): number => this[i] * scalar));
	}
}