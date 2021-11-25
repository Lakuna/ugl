import { Vector2 } from "./Vector2.js";

const EPSILON = 0.000001;

/** A rectangular array of quantities in rows and columns that is treated as a single entity. Immutable. Column-major. */
export class Matrix2 extends Float32Array {
	/**
	 * Creates a matrix from an angle.
	 * @param r - The angle in radians.
	 * @returns A matrix.
	 */
	static fromRotation(r: number): Matrix2 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix2(
			c, s,
			-s, c);
	}

	/**
	 * Creates a matrix from a scaling.
	 * @param v - The scaling vector.
	 * @returns A matrix.
	 */
	static fromScaling(v: Vector2): Matrix2 {
		return new Matrix2(
			v[0] as number, 0,
			0, v[1] as number);
	}

	/** Creates an identity two-dimensional matrix. */
	constructor();

	/**
	 * Creates a two-dimensional matrix.
	 * @param m00 - The entry in column 0, row 0.
	 * @param m01 - The entry in column 0, row 1.
	 * @param m10 - The entry in column 1, row 0.
	 * @param m11 - The entry in column 1, row 1.
	 */
	constructor(
		m00: number, m01: number,
		m10: number, m11: number);

	constructor(
		m00 = 1, m01 = 0,
		m10 = 0, m11 = 1) {
		super([
			m00, m01,
			m10, m11]);
	}

	/**
	 * Transposes the values of this matrix.
	 * @returns The transposed matrix.
	 */
	get transpose(): Matrix2 {
		return new Matrix2(
			this[0] as number, this[2] as number,
			this[1] as number, this[3] as number);
	}

	/**
	 * Inverts this matrix.
	 * @returns The inverted matrix.
	 */
	get invert(): Matrix2 {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;

		const det: number = 1 / (a0 * a3 - a2 * a1);

		return new Matrix2(
			a3 * det, -a1 * det,
			-a2 * det, a0 * det);
	}

	/**
	 * Calculates the adjugate of this matrix.
	 * @returns The adjugate of this matrix.
	 */
	get adjoint(): Matrix2 {
		return new Matrix2(
			this[3] as number, -(this[1] as number),
			-(this[2] as number), this[0] as number);
	}

	/**
	 * Calculates the determinant of this matrix.
	 * @returns The determinant of this matrix.
	 */
	get determinant(): number {
		return (this[0] as number) * (this[3] as number)
			- (this[2] as number) * (this[1] as number);
	}

	/**
	 * Multiplies this matrix with another.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Matrix2): Matrix2 {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;

		const b0: number = m[0] as number;
		const b1: number = m[1] as number;
		const b2: number = m[2] as number;
		const b3: number = m[3] as number;

		return new Matrix2(
			a0 * b0 + a2 * b1, a1 * b0 + a3 * b1,
			a0 * b2 + a2 * b3, a1 * b2 + a3 * b3);
	}

	/**
	 * Rotates this matrix by the given angle.
	 * @param r - The angle to rotate by in radians.
	 * @returns The rotated matrix.
	 */
	rotate(r: number): Matrix2 {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix2(
			a0 * c + a2 * s, a1 * c + a3 * s,
			a0 * -s + a2 * c, a1 * -s + a3 * c);
	}

	/**
	 * Scales this matrix by the given dimensions.
	 * @param v - The amount to scale this matrix by.
	 * @returns The scaled matrix.
	 */
	scale(v: Vector2): Matrix2 {
		const v0: number = v[0] as number;
		const v1: number = v[1] as number;

		return new Matrix2(
			this[0] as number * v0, this[1] as number * v0,
			this[2] as number * v1, this[3] as number * v1);
	}

	/**
	 * Returns a string represenation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]} | ${this[2]}, ${this[3]})`;
	}

	/**
	 * Returns the Frobenius norm of this matrix.
	 * @returns The Frobenius norm of this matrix.
	 */
	get frob(): number {
		return Math.hypot(
			this[0] as number, this[1] as number,
			this[2] as number, this[3] as number);
	}

	/**
	 * Returns L, D, and U (lower triangular, diagonal, and upper triangular) matrices by factorizing this matrix.
	 * @param l - The lower triangular matrix.
	 * @param d - The diagonal matrix.
	 * @param u - The upper triangular matrix.
	 * @returns The L, D, and U matrices.
	 */
	ldu(l: Matrix2, d: Matrix2, u: Matrix2): [Matrix2, Matrix2, Matrix2] {
		const l2: number = (this[2] as number) / (this[0] as number);
		const u1: number = this[1] as number;

		return [
			new Matrix2(
				l[0] as number, l[1] as number,
				l2, l[3] as number),
			d,
			new Matrix2(
				this[0] as number, u1,
				u[2] as number, (this[3] as number) - l2 * u1)
		];
	}

	/**
	 * Adds another matrix to this matrix.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Matrix2): Matrix2 {
		return new Matrix2(
			(this[0] as number) + (m[0] as number), (this[1] as number) + (m[1] as number),
			(this[2] as number) + (m[2] as number), (this[3] as number) + (m[3] as number));
	}

	/**
	 * Subtracts another matrix from this matrix.
	 * @param m - The other matrix.
	 * @returns The difference between the matrices.
	 */
	subtract(m: Matrix2): Matrix2 {
		return new Matrix2(
			(this[0] as number) - (m[0] as number), (this[1] as number) - (m[1] as number),
			(this[2] as number) - (m[2] as number), (this[3] as number) - (m[3] as number));
	}

	/**
	 * Returns whether or not this matrix has exactly the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have exactly the same elements.
	 */
	exactEquals(m: Matrix2): boolean {
		return this[0] === m[0]
			&& this[1] === m[1]

			&& this[2] === m[2]
			&& this[3] === m[3];
	}

	/**
	 * Returns whether or not this matrix has approximately the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have approximately the same elements.
	 */
	equals(m: Matrix2): boolean {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;

		const b0: number = m[0] as number;
		const b1: number = m[1] as number;
		const b2: number = m[2] as number;
		const b3: number = m[3] as number;

		return (Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0))
			&& Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1))
			&& Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2))
			&& Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)));
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The scaled matrix.
	 */
	multiplyScalar(s: number): Matrix2 {
		return new Matrix2(
			(this[0] as number) * s, (this[1] as number) * s,
			(this[2] as number) * s, (this[3] as number) * s);
	}

	/**
	 * Scales a matrix by a scalar and then adds it to this matrix.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Matrix2, s: number): Matrix2 {
		return new Matrix2(
			(this[0] as number) + (m[0] as number) * s, (this[1] as number) + (m[1] as number) * s,
			(this[2] as number) + (m[2] as number) * s, (this[3] as number) + (m[3] as number) * s);
	}
}