import { mat3 } from "gl-matrix";
import { Numbers3x3, Numbers4x4, Numbers1x2, Numbers1x4 } from "../../types/Array.js";

/** A 3x3 matrix. Column-major. */
export class Matrix3 extends Float32Array {
	/**
	 * Turns the upper-left 3x3 values of a 4x4 matrix into a 3x3 matrix.
	 * @param m - The 4x4 matrix.
	 * @returns A 3x3 matrix.
	 */
	static fromMatrix4(m: Numbers4x4): Matrix3 {
		return mat3.fromMat4(new Matrix3(), m) as Matrix3;
	}

	/**
	 * Calculates a 3x3 matrix from a quaternion.
	 * @param q - The quaternion.
	 * @returns A 3x3 matrix.
	 */
	static fromQuaternion(q: Numbers1x4): Matrix3 {
		return mat3.fromQuat(new Matrix3(), q) as Matrix3;
	}

	/**
	 * Creates a 3x3 matrix from a given angle.
	 * @param r - The angle in radians.
	 * @returns A 3x3 matrix.
	 */
	static fromRotation(r: number): Matrix3 {
		return mat3.fromRotation(new Matrix3(), r) as Matrix3;
	}

	/**
	 * Creates a 3x3 matrix from a vector scaling.
	 * @param v - The scaling vector.
	 * @returns A 3x3 matrix.
	 */
	static fromScaling(v: Numbers1x2): Matrix3 {
		return mat3.fromScaling(new Matrix3(), v) as Matrix3;
	}

	/**
	 * Creates a 3x3 matrix from a vector translation.
	 * @param v - The translation vector.
	 * @returns A 3x3 matrix.
	 */
	static fromTranslation(v: Numbers1x2): Matrix3 {
		return mat3.fromTranslation(new Matrix3(), v) as Matrix3;
	}

	/**
	 * Calculates a 3x3 normal matrix from a 4x4 matrix.
	 * @param m - The 4x4 matrix.
	 * @returns The 3x3 normal matrix.
	 */
	static normalFromMatrix4(m: Numbers4x4): Matrix3 {
		return mat3.normalFromMat4(new Matrix3(), m) as Matrix3;
	}

	/**
	 * Generates a 2D projection matrix.
	 * @param width - The width of the context.
	 * @param height - The height of the context.
	 * @returns A 2D projection matrix.
	 */
	static projection(width: number, height: number): Matrix3 {
		return mat3.projection(new Matrix3(), width, height) as Matrix3;
	}

	/**
	 * Creates a 3x3 matrix.
	 * @param x1y1 - The value in the first row and first column.
	 * @param x1y2 - The value in the second row and first column.
	 * @param x1y3 - The value in the third row and first column.
	 * @param x2y1 - The value in the first row and second column.
	 * @param x2y2 - The value in the second row and second column.
	 * @param x2y3 - The value in the third row and second column.
	 * @param x3y1 - The value in the first row and third column.
	 * @param x3y2 - The value in the second row and third column.
	 * @param x3y3 - The value in the third row and third column.
	 */
	constructor(
		x1y1 = 1, x1y2 = 0, x1y3 = 0,
		x2y1 = 0, x2y2 = 1, x2y3 = 0,
		x3y1 = 0, x3y2 = 0, x3y3 = 1) {
		super([
			x1y1, x1y2, x1y3,
			x2y1, x2y2, x2y3,
			x3y1, x3y2, x3y3
		]);
	}

	/**
	 * Adds two 3x3 matrices.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Numbers3x3): this {
		return mat3.add(this, this, m) as this;
	}

	/** Calculates the adjugate of this matrix. */
	get adjoint(): this {
		return mat3.adjoint(this, this) as this;
	}

	/** Creates a new 3x3 matrix initialized with values from this matrix. */
	get clone(): Matrix3 {
		return new Matrix3(...this);
	}

	/** Calculates the determinant of this matrix. */
	get determinant(): number {
		return mat3.determinant(this);
	}

	/**
	 * Whether or not two 3x3 matrices have approximately the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	equals(m: Numbers3x3): boolean {
		return mat3.equals(this, m);
	}

	/**
	 * Whether or not two 3x3 matrices have exactly the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	exactEquals(m: Numbers3x3): boolean {
		return mat3.exactEquals(this, m);
	}

	/** The Frobenius normal of this matrix. */
	get frob(): number {
		return mat3.frob(this);
	}

	/** Inverts this matrix. */
	get invert(): this {
		return mat3.invert(this, this) as this;
	}

	/**
	 * Multiplies two 3x3 matrices.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Numbers3x3): this {
		return mat3.multiply(this, this, m) as this;
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The product.
	 */
	multiplyScalar(s: number): this {
		return mat3.multiplyScalar(this, this, s) as this;
	}

	/**
	 * Adds two 3x3 matrices after multiplying each element of the second operand by a scalar value.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Numbers3x3, s: number): this {
		return mat3.multiplyScalarAndAdd(this, this, m, s) as this;
	}

	/**
	 * Rotates this matrix by the given angle.
	 * @param r - The angle in radians.
	 * @returns The rotated matrix.
	 */
	rotate(r: number): this {
		return mat3.rotate(this, this, r) as this;
	}

	/**
	 * Scales this matrix by the dimensions in a given two-dimensional vector.
	 * @param v - The vector.
	 * @returns The scaled matrix.
	 */
	scale(v: Numbers1x2): this {
		return mat3.scale(this, this, v) as this;
	}

	/**
	 * Returns a string representation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `[[${this[0]}, ${this[1]}, ${this[2]}], [${this[3]}, ${this[4]}, ${this[5]}], [${this[6]}, ${this[7]}, ${this[8]}]]`;
	}

	/**
	 * Subtracts two 3x3 matrices.
	 * @param m - The other matrix.
	 * @returns The difference.
	 */
	subtract(m: Numbers3x3): this {
		return mat3.subtract(this, this, m) as this;
	}

	/**
	 * Translates this matrix by a given vector.
	 * @param v - The vector to translate by.
	 * @returns The translated matrix.
	 */
	translate(v: Numbers1x2): this {
		return mat3.translate(this, this, v) as this;
	}

	/** Transposes this matrix. */
	get transpose(): this {
		return mat3.transpose(this, this) as this;
	}
}
