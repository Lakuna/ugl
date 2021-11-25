import { Matrix4 } from "./Matrix4.js";
import { Vector2 } from "./Vector2.js";
import { Quaternion } from "./Quaternion.js";

const EPSILON = 0.000001;

/** A rectangular array of quantities in rows and columns that is treated as a single entity. Immutable. Column-major. */
export class Matrix3 extends Float32Array {
	/**
	 * Copies the upper-left values of a four-dimensional matrix into a three-dimensional matrix.
	 * @param m - The original matrix.
	 * @returns The resized matrix.
	 */
	fromMatrix4(m: Matrix4): Matrix3 {
		return new Matrix3(
			m[0] as number, m[1] as number, m[2] as number,
			m[4] as number, m[5] as number, m[6] as number,
			m[8] as number, m[9] as number, m[10] as number);
	}

	/**
	 * Creates a matrix from a translation.
	 * @param v - The translation vector.
	 * @returns A matrix.
	 */
	static fromTranslation(v: Vector2): Matrix3 {
		return new Matrix3(
			1, 0, 0,
			0, 1, 0,

			v[0] as number,
			v[1] as number,
			1);
	}

	/**
	 * Creates a matrix from an angle.
	 * @param r - The angle in radians.
	 * @returns A matrix.
	 */
	static fromRotation(r: number): Matrix3 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix3(
			c, s, 0,
			-s, c, 0,
			0, 0, 1);
	}

	/**
	 * Creates a matrix from a scaling.
	 * @param v - The scaling vector.
	 * @returns A matrix.
	 */
	static fromScaling(v: Vector2): Matrix3 {
		return new Matrix3(
			v[0] as number, 0, 0,
			0, v[1] as number, 0,
			0, 0, 1);
	}

	/**
	 * Calculates a matrix from a quaternion.
	 * @param q - The quaternion.
	 * @returns A matrix.
	 */
	static fromQuaternion(q: Quaternion): Matrix3 {
		const x: number = q[0] as number;
		const y: number = q[1] as number;
		const z: number = q[2] as number;
		const w: number = q[3] as number;

		const x2: number = x + x;
		const y2: number = y + y;
		const z2: number = z + z;

		const xx: number = x * x2;
		const yx: number = y * x2;
		const yy: number = y * y2;
		const zx: number = z * x2;
		const zy: number = z * y2;
		const zz: number = z * z2;
		const wx: number = w * x2;
		const wy: number = w * y2;
		const wz: number = w * z2;

		return new Matrix3(
			1 - yy - zz, yx - wz, zx + wy,
			yx + wz, 1 - xx - zz, zy - wx,
			zx - wy, zy + wx, 1 - xx - yy);
	}

	/**
	 * Calculates a normal matrix from a four-dimensional matrix.
	 * @param m - The four-dimensional matrix.
	 * @returns A normal matrix.
	 */
	static normalFromMatrix4(m: Matrix4): Matrix3 {
		const a00: number = m[0] as number;
		const a01: number = m[1] as number;
		const a02: number = m[2] as number;
		const a03: number = m[3] as number;
		const a10: number = m[4] as number;
		const a11: number = m[5] as number;
		const a12: number = m[6] as number;
		const a13: number = m[7] as number;
		const a20: number = m[8] as number;
		const a21: number = m[9] as number;
		const a22: number = m[10] as number;
		const a23: number = m[11] as number;
		const a30: number = m[12] as number;
		const a31: number = m[13] as number;
		const a32: number = m[14] as number;
		const a33: number = m[15] as number;

		const b00: number = a00 * a11 - a01 * a10;
		const b01: number = a00 * a12 - a02 * a10;
		const b02: number = a00 * a13 - a03 * a10;
		const b03: number = a01 * a12 - a02 * a11;
		const b04: number = a01 * a13 - a03 * a11;
		const b05: number = a02 * a13 - a03 * a12;
		const b06: number = a20 * a31 - a21 * a30;
		const b07: number = a20 * a32 - a22 * a30;
		const b08: number = a20 * a33 - a23 * a30;
		const b09: number = a21 * a32 - a22 * a31;
		const b10: number = a21 * a33 - a23 * a31;
		const b11: number = a22 * a33 - a23 * a32;

		const det: number = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

		return new Matrix3(
			(a11 * b11 - a12 * b10 + a13 * b09) * det,
			(a12 * b08 - a10 * b11 - a13 * b07) * det,
			(a10 * b10 - a11 * b08 + a13 * b06) * det,

			(a02 * b10 - a01 * b11 - a03 * b09) * det,
			(a00 * b11 - a02 * b08 + a03 * b07) * det,
			(a01 * b08 - a00 * b10 - a03 * b06) * det,

			(a31 * b05 - a32 * b04 + a33 * b03) * det,
			(a32 * b02 - a30 * b05 - a33 * b01) * det,
			(a30 * b04 - a31 * b02 + a33 * b00) * det);
	}

	/**
	 * Generates a two-dimensional projection matrix with the given bounds.
	 * @param width - The width of the projection.
	 * @param height - The height of the projection.
	 * @returns A projection matrix.
	 */
	static projection(width: number, height: number): Matrix3 {
		return new Matrix3(
			2 / width, 0, 0,
			0, -2 / height, 0,
			-1, 1, 1);
	}

	/** Creates an identity three-dimensional matrix. */
	constructor();

	/**
	 * Creates a three-dimensional matrix.
	 * @param m00 - The entry in column 0, row 0.
	 * @param m01 - The entry in column 0, row 1.
	 * @param m02 - The entry in column 0, row 2.
	 * @param m10 - The entry in column 1, row 0.
	 * @param m11 - The entry in column 1, row 1.
	 * @param m12 - The entry in column 1, row 2.
	 * @param m20 - The entry in column 2, row 0.
	 * @param m21 - The entry in column 2, row 1.
	 * @param m22 - The entry in column 2, row 2.
	 */
	constructor(
		m00: number, m01: number, m02: number,
		m10: number, m11: number, m12: number,
		m20: number, m21: number, m22: number);

	constructor(
		m00 = 1, m01 = 0, m02 = 0,
		m10 = 0, m11 = 1, m12 = 0,
		m20 = 0, m21 = 0, m22 = 1) {
		super([
			m00, m01, m02,
			m10, m11, m12,
			m20, m21, m22]);
	}

	/**
	 * Transposes the values of this matrix.
	 * @returns The transposed matrix.
	 */
	get transpose(): Matrix3 {
		return new Matrix3(
			this[0] as number, this[3] as number, this[6] as number,
			this[1] as number, this[4] as number, this[7] as number,
			this[2] as number, this[5] as number, this[8] as number);
	}

	/**
	 * Inverts this matrix.
	 * @returns The inverted matrix.
	 */
	get invert(): Matrix3 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		const b01: number = a22 * a11 - a12 * a21;
		const b11: number = -a22 * a10 + a12 * a20;
		const b21: number = a21 * a10 - a11 * a20;

		const det: number = 1 / (a00 * b01 + a01 * b11 + a02 * b21);

		return new Matrix3(
			b01 * det,
			(-a22 * a01 + a02 * a21) * det,
			(a12 * a01 - a02 * a11) * det,

			b11 * det,
			(a22 * a00 - a02 * a20) * det,
			(-a12 * a00 + a02 * a10) * det,

			b21 * det,
			(-a21 * a00 + a01 * a20) * det,
			(a11 * a00 - a01 * a10) * det);
	}

	/**
	 * Calculates the adjugate of this matrix.
	 * @returns The adjugate of this matrix.
	 */
	get adjoint(): Matrix3 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		return new Matrix3(
			a11 * a22 - a12 * a21,
			a02 * a21 - a01 * a22,
			a01 * a12 - a02 * a11,

			a12 * a20 - a10 * a22,
			a00 * a22 - a02 * a20,
			a02 * a10 - a00 * a12,

			a10 * a21 - a11 * a20,
			a01 * a20 - a00 * a21,
			a00 * a11 - a01 * a10);
	}

	/**
	 * Calculates the determinant of this matrix.
	 * @returns The determinant of this matrix.
	 */
	get determinant(): number {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		return a00 * (a22 * a11 - a12 * a21)
			+ a01 * (-a22 * a10 + a12 * a20)
			+ a02 * (a21 * a10 - a11 * a20);
	}

	/**
	 * Multiplies this matrix with another.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Matrix3): Matrix3 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		const b00: number = m[0] as number;
		const b01: number = m[1] as number;
		const b02: number = m[2] as number;
		const b10: number = m[3] as number;
		const b11: number = m[4] as number;
		const b12: number = m[5] as number;
		const b20: number = m[6] as number;
		const b21: number = m[7] as number;
		const b22: number = m[8] as number;

		return new Matrix3(
			b00 * a00 + b01 * a10 + b02 * a20,
			b00 * a01 + b01 * a11 + b02 * a21,
			b00 * a02 + b01 * a12 + b02 * a22,

			b10 * a00 + b11 * a10 + b12 * a20,
			b10 * a01 + b11 * a11 + b12 * a21,
			b10 * a02 + b11 * a12 + b12 * a22,

			b20 * a00 + b21 * a10 + b22 * a20,
			b20 * a01 + b21 * a11 + b22 * a21,
			b20 * a02 + b21 * a12 + b22 * a22);
	}

	/**
	 * Translates this matrix by the given vector.
	 * @param v - The amount to translate this matrix by.
	 * @returns The translated matrix.
	 */
	translate(v: Vector2): Matrix3 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		const x: number = v[0] as number;
		const y: number = v[1] as number;

		return new Matrix3(
			a00, a01, a02,
			a10, a11, a12,

			x * a00 + y * a10 + a20,
			x * a01 + y * a11 + a21,
			x * a02 + y * a12 + a22);
	}

	/**
	 * Rotates this matrix by the given angle.
	 * @param r - The angle to rotate by in radians.
	 * @returns The rotated matrix.
	 */
	rotate(r: number): Matrix3 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a10: number = this[3] as number;
		const a11: number = this[4] as number;
		const a12: number = this[5] as number;
		const a20: number = this[6] as number;
		const a21: number = this[7] as number;
		const a22: number = this[8] as number;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix3(
			c * a00 + s * a10, c * a01 + s * a11, c * a02 + s * a12,
			c * a10 - s * a00, c * a11 - s * a01, c * a12 - s * a02,
			a20, a21, a22);
	}

	/**
	 * Scales this matrix by the given dimensions.
	 * @param v - The amount to scale this matrix by.
	 * @returns The scaled matrix.
	 */
	scale(v: Vector2): Matrix3 {
		const x: number = v[0] as number;
		const y: number = v[1] as number;

		return new Matrix3(
			x * (this[0] as number), x * (this[1] as number), x * (this[2] as number),
			y * (this[3] as number), y * (this[4] as number), y * (this[5] as number),
			this[6] as number, this[7] as number, this[8] as number);
	}

	/**
	 * Returns a string represenation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]}, ${this[2]} | ${this[3]}, ${this[4]}, ${this[5]} | ${this[6]}, ${this[7]}, ${this[8]})`;
	}

	/**
	 * Returns the Frobenius norm of this matrix.
	 * @returns The Frobenius norm of this matrix.
	 */
	get frob(): number {
		return Math.hypot(
			this[0] as number, this[1] as number, this[2] as number,
			this[3] as number, this[4] as number, this[5] as number,
			this[6] as number, this[7] as number, this[8] as number);
	}

	/**
	 * Adds another matrix to this matrix.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Matrix3): Matrix3 {
		return new Matrix3(
			(this[0] as number) + (m[0] as number),
			(this[1] as number) + (m[1] as number),
			(this[2] as number) + (m[2] as number),

			(this[3] as number) + (m[3] as number),
			(this[4] as number) + (m[4] as number),
			(this[5] as number) + (m[5] as number),

			(this[6] as number) + (m[6] as number),
			(this[7] as number) + (m[7] as number),
			(this[8] as number) + (m[8] as number));
	}

	/**
	 * Subtracts another matrix from this matrix.
	 * @param m - The other matrix.
	 * @returns The difference between the matrices.
	 */
	subtract(m: Matrix3): Matrix3 {
		return new Matrix3(
			(this[0] as number) - (m[0] as number),
			(this[1] as number) - (m[1] as number),
			(this[2] as number) - (m[2] as number),

			(this[3] as number) - (m[3] as number),
			(this[4] as number) - (m[4] as number),
			(this[5] as number) - (m[5] as number),

			(this[6] as number) - (m[6] as number),
			(this[7] as number) - (m[7] as number),
			(this[8] as number) - (m[8] as number));
	}

	/**
	 * Returns whether or not this matrix has exactly the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have exactly the same elements.
	 */
	exactEquals(m: Matrix3): boolean {
		return this[0] === m[0]
			&& this[1] === m[1]
			&& this[2] === m[2]

			&& this[3] === m[3]
			&& this[4] === m[4]
			&& this[5] === m[5]

			&& this[6] === m[6]
			&& this[7] === m[7]
			&& this[8] === m[8];
	}

	/**
	 * Returns whether or not this matrix has approximately the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have approximately the same elements.
	 */
	equals(m: Matrix3): boolean {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;
		const a4: number = this[4] as number;
		const a5: number = this[5] as number;
		const a6: number = this[6] as number;
		const a7: number = this[7] as number;
		const a8: number = this[8] as number;

		const b0: number = m[0] as number;
		const b1: number = m[1] as number;
		const b2: number = m[2] as number;
		const b3: number = m[3] as number;
		const b4: number = m[4] as number;
		const b5: number = m[5] as number;
		const b6: number = m[6] as number;
		const b7: number = m[7] as number;
		const b8: number = m[8] as number;

		return (Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0))
			&& Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1))
			&& Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2))
			&& Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3))
			&& Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4))
			&& Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5))
			&& Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6))
			&& Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7))
			&& Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)));
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The scaled matrix.
	 */
	multiplyScalar(s: number): Matrix3 {
		return new Matrix3(
			(this[0] as number) * s, (this[1] as number) * s, (this[2] as number) * s,
			(this[3] as number) * s, (this[4] as number) * s, (this[5] as number) * s,
			(this[6] as number) * s, (this[7] as number) * s, (this[8] as number) * s);
	}

	/**
	 * Scales a matrix by a scalar and then adds it to this matrix.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Matrix3, s: number): Matrix3 {
		return new Matrix3(
			(this[0] as number) + (m[0] as number) * s,
			(this[1] as number) + (m[1] as number) * s,
			(this[2] as number) + (m[2] as number) * s,

			(this[3] as number) + (m[3] as number) * s,
			(this[4] as number) + (m[4] as number) * s,
			(this[5] as number) + (m[5] as number) * s,

			(this[6] as number) + (m[6] as number) * s,
			(this[7] as number) + (m[7] as number) * s,
			(this[8] as number) + (m[8] as number) * s);
	}
}