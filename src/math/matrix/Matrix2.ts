import { mat2 } from "gl-matrix";
import { Numbers2x2, Numbers1x2 } from "../../types/Array.js";

/** The LDU decomposition of a 2x2 matrix. */
export class LDU2 {
	/**
	 * Creates an LDU decomposition of a 2x2 matrix.
	 * @param m - The matrix to factorize.
	 */
	constructor(m: Matrix2) {
		this.l = new Matrix2();
		this.d = new Matrix2();
		this.u = new Matrix2();
		mat2.LDU(this.l, this.d, this.u, m);
	}

	/** The lower triangular matrix. */
	readonly l: Matrix2;

	/** The diagonal matrix. */
	readonly d: Matrix2;

	/** The upper triangular matrix. */
	readonly u: Matrix2;
}

/** A 2x2 matrix. Column-major. */
export class Matrix2 extends Float32Array {
	/**
	 * Creates a matrix from a given angle.
	 * @param r - The angle in radians.
	 * @returns The matrix.
	 */
	static fromRotation(r: number): Matrix2 {
		return mat2.fromRotation(new Matrix2(), r) as Matrix2;
	}

	/**
	 * Creates a matrix from a given vector scaling.
	 * @param v - The vector scaling.
	 * @returns The matrix.
	 */
	static fromScaling(v: Numbers1x2): Matrix2 {
		return mat2.fromScaling(new Matrix2(), v) as Matrix2;
	}

	/**
	 * Creates a 2x2 matrix.
	 * @param x1y1 - The value in the first row and first column.
	 * @param x1y2 - The value in the second row and first column.
	 * @param x2y1 - The value in the first row and second column.
	 * @param x2y2 - The value in the second row and second column.
	 */
	constructor(
		x1y1 = 1, x1y2 = 0,
		x2y1 = 0, x2y2 = 1) {
		super([
			x1y1, x1y2,
			x2y1, x2y2
		]);
	}

	/**
	 * Adds two 2x2 matrices.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Numbers2x2): this {
		return mat2.add(this, this, m) as this;
	}

	/** Calculates the adjugate of this matrix. */
	get adjoint(): this {
		return mat2.adjoint(this, this) as this;
	}

	/** Creates a new 2x2 matrix initialized with values from this matrix. */
	get clone(): Matrix2 {
		return new Matrix2(...this);
	}

	/** Calculates the determinant of this matrix. */
	get determinant(): number {
		return mat2.determinant(this);
	}

	/**
	 * Whether or not two 2x2 matrices have approximately the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	equals(m: Numbers2x2): boolean {
		return mat2.equals(this, m);
	}

	/**
	 * Whether or not two 2x2 matrices have exactly the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	exactEquals(m: Numbers2x2): boolean {
		return mat2.exactEquals(this, m);
	}

	/** The Frobenius normal of this matrix. */
	get frob(): number {
		return mat2.frob(this);
	}

	/** Inverts this matrix. */
	get invert(): this {
		return mat2.invert(this, this) as this;
	}

	/** Returns lower triangular, diagonal, and upper triangular matrices by factorizing this matrix. */
	get ldu(): LDU2 {
		return new LDU2(this);
	}

	/**
	 * Multiplies two 2x2 matrices.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Numbers2x2): this {
		return mat2.multiply(this, this, m) as this;
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The product.
	 */
	multiplyScalar(s: number): this {
		return mat2.multiplyScalar(this, this, s) as this;
	}

	/**
	 * Adds two 2x2 matrices after multiplying each element of the second operand by a scalar value.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Numbers2x2, s: number): this {
		return mat2.multiplyScalarAndAdd(this, this, m, s) as this;
	}

	/**
	 * Rotates this matrix by the given angle.
	 * @param r - The angle in radians.
	 * @returns The rotated matrix.
	 */
	rotate(r: number): this {
		return mat2.rotate(this, this, r) as this;
	}

	/**
	 * Scales this matrix by the dimensions in a given two-dimensional vector.
	 * @param v - The vector.
	 * @returns The scaled matrix.
	 */
	scale(v: Numbers1x2): this {
		return mat2.scale(this, this, v) as this;
	}

	/**
	 * Returns a string representation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `[[${this[0]}, ${this[1]}], [${this[2]}, ${this[3]}]]`;
	}

	/**
	 * Subtracts two 2x2 matrices.
	 * @param m - The other matrix.
	 * @returns The difference.
	 */
	subtract(m: Numbers2x2): this {
		return mat2.subtract(this, this, m) as this;
	}

	/** Transposes this matrix. */
	get transpose(): this {
		return mat2.transpose(this, this) as this;
	}
}
