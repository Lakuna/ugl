import { mat4 } from "gl-matrix";
import { Numbers4x4, Numbers1x3, Numbers1x4 } from "../../types/Array.js";
import { Quaternion } from "../Quaternion.js";
import { Vector3 } from "../vector/Vector3.js";

/** A 4x4 matrix. Column-major. */
export class Matrix4 extends Float32Array {
	/**
	 * Calculates a 4x4 matrix from a quaternion.
	 * @param q - The quaternion.
	 * @returns A 4x4 matrix.
	 */
	static fromQuaternion(q: Numbers1x4): Matrix4 {
		return mat4.fromQuat(new Matrix4(), q) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from a given angle.
	 * @param r - The angle in radians.
	 * @param axis - The axis to rotate around.
	 * @returns A 3x3 matrix.
	 */
	static fromRotation(r: number, axis: Numbers1x3): Matrix4 {
		return mat4.fromRotation(new Matrix4(), r, axis) as Matrix4;
	}

	/**
	 * Creates a matrix from a quaternion rotation and a vector translation.
	 * @param q - The rotation quaternion.
	 * @param v - The translation vector.
	 * @returns A 4x4 matrix.
	 */
	static fromRotationTranslation(q: Numbers1x4, v: Numbers1x3): Matrix4 {
		return mat4.fromRotationTranslation(new Matrix4(), q, v) as Matrix4;
	}

	/**
	 * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale.
	 * @param q - The rotation quaternion.
	 * @param v - The translation vector.
	 * @param s - The scaling vector.
	 * @returns A 4x4 matrix.
	 */
	static fromRotationTranslationScale(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3): Matrix4 {
		return mat4.fromRotationTranslationScale(new Matrix4(), q, v, s) as Matrix4;
	}

	/**
	 * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale, rotating and scaling around a given origin.
	 * @param q - The rotation quaternion.
	 * @param v - The translation vector.
	 * @param s - The scaling vector.
	 * @param o - The origin vector.
	 * @returns A 4x4 matrix.
	 */
	static fromRotationTranslationScaleOrigin(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3, o: Numbers1x3): Matrix4 {
		return mat4.fromRotationTranslationScaleOrigin(new Matrix4(), q, v, s, o) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from a vector scaling.
	 * @param v - The scaling vector.
	 * @returns A 4x4 matrix.
	 */
	static fromScaling(v: Numbers1x3): Matrix4 {
		return mat4.fromScaling(new Matrix4(), v) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from a vector translation.
	 * @param v - The translation vector.
	 * @returns A 4x4 matrix.
	 */
	static fromTranslation(v: Numbers1x3): Matrix4 {
		return mat4.fromTranslation(new Matrix4(), v) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from the given angle around the X axis.
	 * @param r - The angle in radians.
	 * @returns A 4x4 matrix.
	 */
	static fromXRotation(r: number): Matrix4 {
		return mat4.fromXRotation(new Matrix4(), r) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from the given angle around the Y axis.
	 * @param r - The angle in radians.
	 * @returns A 4x4 matrix.
	 */
	static fromYRotation(r: number): Matrix4 {
		return mat4.fromYRotation(new Matrix4(), r) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix from the given angle around the Z axis.
	 * @param r - The angle in radians.
	 * @returns A 4x4 matrix.
	 */
	static fromZRotation(r: number): Matrix4 {
		return mat4.fromZRotation(new Matrix4(), r) as Matrix4;
	}

	/**
	 * Generates a frustum matrix.
	 * @param left - The left bound of the frustum.
	 * @param right - The right bound of the frustum.
	 * @param bottom - The bottom bound of the frustum.
	 * @param top - The top bound of the frustum.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 * @returns A frustum matrix.
	 */
	static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		return mat4.frustum(new Matrix4(), left, right, bottom, top, near, far) as Matrix4;
	}

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis. If you want a matrix that actually makes an object look at another object, you should use `targetTo` instead.
	 * @param eye - The position of the viewer.
	 * @param center - The point that the viewer is looking at.
	 * @param up - A vector pointing up.
	 * @returns A look-at matrix.
	 */
	static lookAt(eye: Numbers1x3, center: Numbers1x3, up: Numbers1x3): Matrix4 {
		return mat4.lookAt(new Matrix4(), eye, center, up) as Matrix4;
	}

	/**
	 * Generates an orthagonal projection matrix.
	 * @param left - The left bound of the frustum.
	 * @param right - The right bound of the frustum.
	 * @param bottom - The bottom bound of the frustum.
	 * @param top - The top bound of the frustum.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 * @returns A frustum matrix.
	 */
	static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		return mat4.ortho(new Matrix4(), left, right, bottom, top, near, far) as Matrix4;
	}

	/**
	 * Generates a perspective projection matrix.
	 * @param fovy - The vertical field of view in radians.
	 * @param aspect - The aspect ratio.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 */
	static perspective(fovy: number, aspect: number, near: number, far?: number): Matrix4 {
		return mat4.perspective(new Matrix4(), fovy, aspect, near, far as number) as Matrix4;
	}

	/**
	 * Generates a perspective projection matrix with the given bounds. This is primarily useful for generating projection matrices to be used with the WebXR API.
	 * @param up - The angle up in degrees of the field of view.
	 * @param down - The angle down in degrees of the field of view.
	 * @param left - The angle left in degrees of the field of view.
	 * @param right - The angle right in degrees of the field of view.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 */
	static perspectiveFromFov(up: number, down: number, left: number, right: number, near: number, far: number): Matrix4 {
		return mat4.perspectiveFromFieldOfView(
			new Matrix4(),
			{
				upDegrees: up,
				downDegrees: down,
				leftDegrees: left,
				rightDegrees: right
			},
			near,
			far) as Matrix4;
	}

	/**
	 * Generates a matrix that makes something look at something else.
	 * @param eye - The position of the viewer.
	 * @param center - The point that the viewer is looking at.
	 * @param up - A vector pointing up.
	 * @returns A look-at matrix.
	 */
	static targetTo(eye: Numbers1x3, center: Numbers1x3, up: Numbers1x3): Matrix4 {
		return mat4.targetTo(new Matrix4(), eye, center, up) as Matrix4;
	}

	/**
	 * Creates a 4x4 matrix.
	 * @param x1y1 - The value in the first row and first column.
	 * @param x1y2 - The value in the second row and first column.
	 * @param x1y3 - The value in the third row and first column.
	 * @param x1y4 - The value in the fourth row and first column.
	 * @param x2y1 - The value in the first row and second column.
	 * @param x2y2 - The value in the second row and second column.
	 * @param x2y3 - The value in the third row and second column.
	 * @param x2y4 - The value in the fourth row and second column.
	 * @param x3y1 - The value in the first row and third column.
	 * @param x3y2 - The value in the second row and third column.
	 * @param x3y3 - The value in the third row and third column.
	 * @param x3y4 - The value in the fourth row and third column.
	 * @param x4y1 - The value in the first row and fourth column.
	 * @param x4y2 - The value in the second row and fourth column.
	 * @param x4y3 - The value in the third row and fourth column.
	 * @param x4y4 - The value in the fourth row and fourth column.
	 */
	constructor(
		x1y1 = 1, x1y2 = 0, x1y3 = 0, x1y4 = 0,
		x2y1 = 0, x2y2 = 1, x2y3 = 0, x2y4 = 0,
		x3y1 = 0, x3y2 = 0, x3y3 = 1, x3y4 = 0,
		x4y1 = 0, x4y2 = 0, x4y3 = 0, x4y4 = 1) {
		super([
			x1y1, x1y2, x1y3, x1y4,
			x2y1, x2y2, x2y3, x2y4,
			x3y1, x3y2, x3y3, x3y4,
			x4y1, x4y2, x4y3, x4y4
		]);
	}

	/**
	 * Adds two 4x4 matrices.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Numbers4x4): this {
		return mat4.add(this, this, m) as this;
	}

	/** Calculates the adjugate of this matrix. */
	get adjoint(): this {
		return mat4.adjoint(this, this) as this;
	}

	/** Creates a new 3x3 matrix initialized with values from this matrix. */
	get clone(): Matrix4 {
		return new Matrix4(...this);
	}

	/** Calculates the determinant of this matrix. */
	get determinant(): number {
		return mat4.determinant(this);
	}

	/**
	 * Whether or not two 4x4 matrices have approximately the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	equals(m: Numbers4x4): boolean {
		return mat4.equals(this, m);
	}

	/**
	 * Whether or not two 4x4 matrices have exactly the same elements in the same position.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are equivalent.
	 */
	exactEquals(m: Numbers4x4): boolean {
		return mat4.exactEquals(this, m);
	}

	/** The Frobenius normal of this matrix. */
	get frob(): number {
		return mat4.frob(this);
	}

	/** A quaternion representing the rotational component of a transform matrix. */
	get rotation(): Quaternion {
		return mat4.getRotation(new Quaternion(), this) as Quaternion;
	}

	/** The scaling factor component of a transformation matrix. */
	get scaling(): Vector3 {
		return mat4.getScaling(new Vector3(), this) as Vector3;
	}

	/** The translation vector component of a transformation matrix. */
	get translation(): Vector3 {
		return mat4.getTranslation(new Vector3(), this) as Vector3;
	}

	/** Inverts this matrix. */
	get invert(): this {
		return mat4.invert(this, this) as this;
	}

	/**
	 * Multiplies two 4x4 matrices.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Numbers4x4): this {
		return mat4.multiply(this, this, m) as this;
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The product.
	 */
	multiplyScalar(s: number): this {
		return mat4.multiplyScalar(this, this, s) as this;
	}

	/**
	 * Adds two 4x4 matrices after multiplying each element of the second operand by a scalar value.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Numbers4x4, s: number): this {
		return mat4.multiplyScalarAndAdd(this, this, m, s) as this;
	}

	/**
	 * Rotates this matrix by the given angle.
	 * @param r - The angle in radians.
	 * @param axis - The axis to rotate around.
	 * @returns The rotated matrix.
	 */
	rotate(r: number, axis: Numbers1x3): this {
		return mat4.rotate(this, this, r, axis) as this;
	}

	/**
	 * Rotates this matrix by the given angle around the X axis.
	 * @param r - The angle in radians.
	 * @returns The rotated matrix.
	 */
	rotateX(r: number): this {
		return mat4.rotateX(this, this, r) as this;
	}

	/**
	 * Rotates this matrix by the given angle around the Y axis.
	 * @param r - The angle in radians.
	 * @returns The rotated matrix.
	 */
	rotateY(r: number): this {
		return mat4.rotateY(this, this, r) as this;
	}

	/**
	 * Rotates this matrix by the given angle around the Z axis.
	 * @param r - The angle in radians.
	 * @returns The rotated matrix.
	 */
	rotateZ(r: number): this {
		return mat4.rotateZ(this, this, r) as this;
	}

	/**
	 * Scales this matrix by the dimensions in a given three-dimensional vector.
	 * @param v - The vector.
	 * @returns The scaled matrix.
	 */
	scale(v: Numbers1x3): this {
		return mat4.scale(this, this, v) as this;
	}

	/**
	 * Returns a string representation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `[[${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}], [${this[4]}, ${this[5]}, ${this[6]}, ${this[7]}], [${this[8]}, ${this[9]}, ${this[10]}, ${this[11]}], [${this[12]}, ${this[13]}, ${this[14]}, ${this[15]}]]`;
	}

	/**
	 * Subtracts two 4x4 matrices.
	 * @param m - The other matrix.
	 * @returns The difference.
	 */
	subtract(m: Numbers4x4): this {
		return mat4.subtract(this, this, m) as this;
	}

	/**
	 * Translates this matrix by a given vector.
	 * @param v - The vector to translate by.
	 * @returns The translated matrix.
	 */
	translate(v: Numbers1x3): this {
		return mat4.translate(this, this, v) as this;
	}

	/** Transposes this matrix. */
	get transpose(): this {
		return mat4.transpose(this, this) as this;
	}
}
