import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";

const EPSILON = 0.000001;

/** A rectangular array of quantities in rows and columns that is treated as a single entity. Immutable. Column-major. */
export class Matrix4 extends Float32Array {
	/**
	 * Creates a matrix from a translation.
	 * @param v - The translation vector.
	 * @returns A matrix.
	 */
	static fromTranslation(v: Vector3): Matrix4 {
		return new Matrix4(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			v[0] as number, v[1] as number, v[2] as number, 1);
	}

	/**
	 * Creates a matrix from a scaling.
	 * @param v - The scaling vector.
	 * @returns A matrix.
	 */
	static fromScaling(v: Vector3): Matrix4 {
		return new Matrix4(
			v[0] as number, 0, 0, 0,
			0, v[1] as number, 0, 0,
			0, 0, v[2] as number, 0,
			0, 0, 0, 1);
	}

	/**
	 * Creates a matrix from an angle about an axis.
	 * @param r - The angle in radians.
	 * @param v - The axis to rotate about.
	 * @returns A matrix.
	 */
	static fromRotation(r: number, v: Vector3): Matrix4 {
		let x: number = v[0] as number;
		let y: number = v[1] as number;
		let z: number = v[2] as number;

		const len: number = 1 / Math.hypot(x, y, z);

		x *= len;
		y *= len;
		z *= len;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);
		const t: number = 1 - c;

		return new Matrix4(
			x * x * t + c,
			y * x * t + z * s,
			z * x * t - y * s,
			0,

			x * y * t - z * s,
			y * y * t + c,
			z * y * t + x * s,
			0,

			x * z * t + y * s,
			y * z * t - x * s,
			z * z * t + c,
			0,

			0, 0, 0, 1);
	}

	/**
	 * Creates a matrix from the given angle about the X axis.
	 * @param r - The angle of rotation in radians.
	 * @returns A matrix.
	 */
	static fromXRotation(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix4(
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1);
	}

	/**
	 * Creates a matrix from the given angle about the Y axis.
	 * @param r - The angle of rotation in radians.
	 * @returns A matrix.
	 */
	static fromYRotation(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix4(
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1);
	}

	/**
	 * Creates a matrix from the given angle about the Z axis.
	 * @param r - The angle of rotation in radians.
	 * @returns A matrix.
	 */
	static fromZRotation(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		return new Matrix4(
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1);
	}

	/**
	 * Creates a matrix from a quaternion rotation and vector translation.
	 * @param q - The rotation quaternion.
	 * @param t - The translation vector.
	 * @returns A matrix.
	 */
	static fromRotationTranslation(q: Quaternion, t: Vector3): Matrix4 {
		const x: number = q[0] as number;
		const y: number = q[1] as number;
		const z: number = q[2] as number;
		const w: number = q[3] as number;

		const x2: number = x + x;
		const y2: number = y + y;
		const z2: number = z + z;

		const xx: number = x * x2;
		const xy: number = x * y2;
		const xz: number = x * z2;
		const yy: number = y * y2;
		const yz: number = y * z2;
		const zz: number = z * z2;
		const wx: number = w * x2;
		const wy: number = w * y2;
		const wz: number = w * z2;

		return new Matrix4(
			1 - (yy + zz), xy + wz, xz - wy, 0,
			xy - wz, 1 - (xx + zz), yz + wx, 0,
			xz + wy, yz - wx, 1 - (xx + yy), 0,
			t[0] as number, t[1] as number, t[2] as number, 1);
	}

	/**
	 * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale.
	 * @param q - The rotation quaternion.
	 * @param t - The translation vector.
	 * @param s - The scaling vector.
	 * @returns A matrix.
	 */
	static fromRotationTranslationScale(q: Quaternion, t: Vector3, s: Vector3): Matrix4 {
		const x: number = q[0] as number;
		const y: number = q[1] as number;
		const z: number = q[2] as number;
		const w: number = q[3] as number;

		const x2: number = x + x;
		const y2: number = y + y;
		const z2: number = z + z;

		const xx: number = x * x2;
		const xy: number = x * y2;
		const xz: number = x * z2;
		const yy: number = y * y2;
		const yz: number = y * z2;
		const zz: number = z * z2;
		const wx: number = w * x2;
		const wy: number = w * y2;
		const wz: number = w * z2;

		const sx: number = s[0] as number;
		const sy: number = s[1] as number;
		const sz: number = s[2] as number;

		return new Matrix4(
			(1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
			(xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
			(xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
			t[0] as number, t[1] as number, t[2] as number, 1);
	}

	/**
	 * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale, rotating and scaling about an origin.
	 * @param q - The rotation quaternion.
	 * @param t - The translation vector.
	 * @param s - The scaling vector.
	 * @param o - The origin vector.
	 * @returns A matrix.
	 */
	static fromRotationTranslationScaleOrigin(q: Quaternion, t: Vector3, s: Vector3, o: Vector3): Matrix4 {
		const x: number = q[0] as number;
		const y: number = q[1] as number;
		const z: number = q[2] as number;
		const w: number = q[3] as number;

		const x2: number = x + x;
		const y2: number = y + y;
		const z2: number = z + z;

		const xx: number = x * x2;
		const xy: number = x * y2;
		const xz: number = x * z2;
		const yy: number = y * y2;
		const yz: number = y * z2;
		const zz: number = z * z2;
		const wx: number = w * x2;
		const wy: number = w * y2;
		const wz: number = w * z2;

		const sx: number = s[0] as number;
		const sy: number = s[1] as number;
		const sz: number = s[2] as number;

		const ox: number = o[0] as number;
		const oy: number = o[1] as number;
		const oz: number = o[2] as number;

		const out0: number = (1 - (yy + zz)) * sx;
		const out1: number = (xy + wz) * sx;
		const out2: number = (xz - wy) * sx;
		const out4: number = (xy - wz) * sy;
		const out5: number = (1 - (xx + zz)) * sy;
		const out6: number = (yz + wx) * sy;
		const out8: number = (xz + wy) * sz;
		const out9: number = (yz - wx) * sz;
		const out10: number = (1 - (xx + yy)) * sz;

		return new Matrix4(
			out0, out1, out2, 0,
			out4, out5, out6, 0,
			out8, out9, out10, 0,

			(t[0] as number) + ox - (out0 * ox + out4 * oy + out8 * oz),
			(t[1] as number) + oy - (out1 * ox + out5 * oy + out9 * oz),
			(t[2] as number) + oz - (out2 * ox + out6 * oy + out10 * oz),
			1);
	}

	/**
	 * Calculates a matrix from a quaternion.
	 * @param q - The quaternion.
	 * @returns A matrix.
	 */
	static fromQuaternion(q: Quaternion): Matrix4 {
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

		return new Matrix4(
			1 - yy - zz, yx + wz, zx - wy, 0,
			yx - wz, 1 - xx - zz, zy + wx, 0,
			zx + wy, zy - wx, 1 - xx - yy, 0,
			0, 0, 0, 1);
	}

	/**
	 * Generates a frustum matrix with the given bounds.
	 * @param left - The left bound of the frustum.
	 * @param right - The right bound of the frustum.
	 * @param bottom - The bottom bound of the frustum.
	 * @param top - The top bound of the frustum.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 * @returns A frustum matrix.
	 */
	static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		const rl: number = 1 / (right - left);
		const tb: number = 1 / (top - bottom);
		const nf: number = 1 / (near - far);

		return new Matrix4(
			near * 2 * rl, 0, 0, 0,
			0, near * 2 * tb, 0, 0,

			(right + left) * rl,
			(top + bottom) * tb,
			(far + near) * nf,
			-1,

			0, 0, far * near * 2 * nf, 0);
	}

	/**
	 * Generates a perspective projection matrix with the given bounds.
	 * @param fov - The vertical field of view in radians.
	 * @param aspect - The aspect ratio.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 * @returns A perspective projection matrix.
	 */
	static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
		const f: number = 1 / Math.tan(fov / 2);
		const nf: number = 1 / (near - far);

		return new Matrix4(
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) * nf, -1,
			0, 0, 2 * far * near * nf, 0);
	}

	/**
	 * Generates a perspective projection matrix with the given field of view, for use with WebXR.
	 * @param left - The left angle of the field of view in degrees.
	 * @param right - The right angle of the field of view in degrees.
	 * @param bottom - The bottom angle of the field of view in degrees.
	 * @param top - The top angle of the field of view in degrees.
	 * @param near - The near bound of the frustum.
	 * @param far - The far bound of the frustum.
	 * @returns A frustum matrix.
	 */
	static perspectiveFromFieldOfView(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		const upTan: number = Math.tan((top * Math.PI) / 180);
		const downTan: number = Math.tan((bottom * Math.PI) / 180);
		const leftTan: number = Math.tan((left * Math.PI) / 180);
		const rightTan: number = Math.tan((right * Math.PI) / 180);

		const xScale: number = 2 / (leftTan + rightTan);
		const yScale: number = 2 / (upTan + downTan);

		return new Matrix4(
			xScale, 0, 0, 0,
			0, yScale, 0, 0,

			-((leftTan - rightTan) * xScale * 0.5),
			(upTan - downTan) * yScale * 0.5,
			far / (near - far),
			-1,

			0, 0, (far * near) / (near - far), 0);
	}

	/**
	 * Generates an orthagonal projection matrix with the given bounds.
	 * @param left - The left bound of the projection.
	 * @param right - The right bound of the projection.
	 * @param bottom - The bottom bound of the projection.
	 * @param top - The top bound of the projection.
	 * @param near - The near bound of the projection.
	 * @param far - The far bound of the projection.
	 */
	static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		const lr: number = 1 / (left - right);
		const bt: number = 1 / (bottom - top);
		const nf: number = 1 / (near - far);

		return new Matrix4(
			-2 * lr, 0, 0, 0,
			0, -2 * bt, 0, 0,
			0, 0, 2 * nf, 0,

			(left + right) * lr,
			(top + bottom) * bt,
			(far + near) * nf,
			1);
	}

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis. To make a matrix that makes an object look at another object, use targetTo instead.
	 * @param eye - The position of the viewer.
	 * @param center - The point that the viewer is looking at.
	 * @param up - A vector pointing up.
	 * @returns A look-at matrix.
	 */
	static lookAt(eye: Vector3, center: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4 {
		const eyex: number = eye[0] as number;
		const eyey: number = eye[1] as number;
		const eyez: number = eye[2] as number;

		const centerx: number = center[0] as number;
		const centery: number = center[1] as number;
		const centerz: number = center[2] as number;

		const upx: number = up[0] as number;
		const upy: number = up[1] as number;
		const upz: number = up[2] as number;

		if (Math.abs(eyex - centerx) < EPSILON
			&& Math.abs(eyey - centery) < EPSILON
			&& Math.abs(eyez - centerz) < EPSILON) {
			return new Matrix4();
		}

		let z0: number = eyex - centerx;
		let z1: number = eyey - centery;
		let z2: number = eyez - centerz;

		const zlen: number = 1 / Math.hypot(z0, z1, z2);
		z0 *= zlen;
		z1 *= zlen;
		z2 *= zlen;

		let x0: number = upy * z2 - upz * z1;
		let x1: number = upz * z0 - upx * z2;
		let x2: number = upx * z1 - upy * z0;

		let xlen: number = Math.hypot(x0, x1, x2);
		if (!xlen) {
			x0 = 0;
			x1 = 0;
			x2 = 0;
		} else {
			xlen = 1 / xlen;
			x0 *= xlen;
			x1 *= xlen;
			x2 *= xlen;
		}

		let y0: number = z1 * x2 - z2 * x1;
		let y1: number = z2 * x0 - z0 * x2;
		let y2: number = z0 * x1 - z1 * x0;

		let ylen: number = Math.hypot(y0, y1, y2);
		if (!ylen) {
			y0 = 0;
			y1 = 0;
			y2 = 0;
		} else {
			ylen = 1 / ylen;
			y0 *= ylen;
			y1 *= ylen;
			y2 *= ylen;
		}

		return new Matrix4(
			x0, y0, z0, 0,
			x1, y1, z1, 0,
			x2, y2, z2, 0,

			-(x0 * eyex + x1 * eyey + x2 * eyez),
			-(y0 * eyex + y1 * eyey + y2 * eyez),
			-(z0 * eyex + z1 * eyey + z2 * eyez),
			1);
	}

	/**
	 * Generates a matrix that makes something look at something else.
	 * @param eye - The position of the viewer.
	 * @param target - The point that the viewer is looking at.
	 * @param up - A vector pointing up.
	 * @returns A matrix that makes something look at something else.
	 */
	static targetTo(eye: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4 {
		const eyex: number = eye[0] as number;
		const eyey: number = eye[1] as number;
		const eyez: number = eye[2] as number;

		const upx: number = up[0] as number;
		const upy: number = up[1] as number;
		const upz: number = up[2] as number;

		let z0: number = eyex - (target[0] as number);
		let z1: number = eyey - (target[1] as number);
		let z2: number = eyez - (target[2] as number);

		let zlen: number = z0 * z0 + z1 * z1 + z2 * z2;
		if (zlen > 0) {
			zlen = 1 / Math.sqrt(zlen);
			z0 *= zlen;
			z1 *= zlen;
			z2 *= zlen;
		}

		let x0: number = upy * z2 - upz * z1;
		let x1: number = upz * z0 - upx * z2;
		let x2: number = upx * z1 - upy * z0;

		let xlen: number = x0 * x0 + x1 * x1 + x2 * x2;
		if (xlen > 0) {
			xlen = 1 / Math.sqrt(xlen);
			x0 *= xlen;
			x1 *= xlen;
			x2 *= xlen;
		}

		return new Matrix4(
			x0, x1, x2, 0,

			z1 * x2 - z2 * x1,
			z2 * x0 - z0 * x2,
			z0 * x1 - z1 * x0,
			0,

			z0, z1, z2, 0,
			eyex, eyey, eyez, 1);
	}

	/** Creates an identity four-dimensional matrix. */
	constructor();

	/**
	 * Creates a four-dimensional matrix.
	 * @param m00 - The entry in column 0, row 0.
	 * @param m01 - The entry in column 0, row 1.
	 * @param m02 - The entry in column 0, row 2.
	 * @param m03 - The entry in column 0, row 3.
	 * @param m10 - The entry in column 1, row 0.
	 * @param m11 - The entry in column 1, row 1.
	 * @param m12 - The entry in column 1, row 2.
	 * @param m13 - The entry in column 1, row 3.
	 * @param m20 - The entry in column 2, row 0.
	 * @param m21 - The entry in column 2, row 1.
	 * @param m22 - The entry in column 2, row 2.
	 * @param m23 - The entry in column 2, row 3.
	 * @param m30 - The entry in column 3, row 0.
	 * @param m31 - The entry in column 3, row 1.
	 * @param m32 - The entry in column 3, row 2.
	 * @param m33 - The entry in column 3, row 3.
	 */
	constructor(
		m00: number, m01: number, m02: number, m03: number,
		m10: number, m11: number, m12: number, m13: number,
		m20: number, m21: number, m22: number, m23: number,
		m30: number, m31: number, m32: number, m33: number);

	constructor(
		m00 = 1, m01 = 0, m02 = 0, m03 = 0,
		m10 = 0, m11 = 1, m12 = 0, m13 = 0,
		m20 = 0, m21 = 0, m22 = 1, m23 = 0,
		m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
		super([
			m00, m01, m02, m03,
			m10, m11, m12, m13,
			m20, m21, m22, m23,
			m30, m31, m32, m33]);
	}

	/**
	 * Transposes the values of this matrix.
	 * @returns The transposed matrix.
	 */
	get transpose(): Matrix4 {
		return new Matrix4(
			this[0] as number, this[4] as number, this[8] as number, this[12] as number,
			this[1] as number, this[5] as number, this[9] as number, this[13] as number,
			this[2] as number, this[6] as number, this[10] as number, this[14] as number,
			this[3] as number, this[7] as number, this[11] as number, this[15] as number);
	}

	/**
	 * Inverts this matrix.
	 * @returns The inverted matrix.
	 */
	get invert(): Matrix4 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;
		const a30: number = this[12] as number;
		const a31: number = this[13] as number;
		const a32: number = this[14] as number;
		const a33: number = this[15] as number;

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

		return new Matrix4(
			(a11 * b11 - a12 * b10 + a13 * b09) * det,
			(a02 * b10 - a01 * b11 - a03 * b09) * det,
			(a31 * b05 - a32 * b04 + a33 * b03) * det,
			(a22 * b04 - a21 * b05 - a23 * b03) * det,

			(a12 * b08 - a10 * b11 - a13 * b07) * det,
			(a00 * b11 - a02 * b08 + a03 * b07) * det,
			(a32 * b02 - a30 * b05 - a33 * b01) * det,
			(a20 * b05 - a22 * b02 + a23 * b01) * det,

			(a10 * b10 - a11 * b08 + a13 * b06) * det,
			(a01 * b08 - a00 * b10 - a03 * b06) * det,
			(a30 * b04 - a31 * b02 + a33 * b00) * det,
			(a21 * b02 - a20 * b04 - a23 * b00) * det,

			(a11 * b07 - a10 * b09 - a12 * b06) * det,
			(a00 * b09 - a01 * b07 + a02 * b06) * det,
			(a31 * b01 - a30 * b03 - a32 * b00) * det,
			(a31 * b01 - a30 * b03 - a32 * b00) * det);
	}

	/**
	 * Calculates the adjugate of this matrix.
	 * @returns The adjugate of this matrix.
	 */
	get adjoint(): Matrix4 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;
		const a30: number = this[12] as number;
		const a31: number = this[13] as number;
		const a32: number = this[14] as number;
		const a33: number = this[15] as number;

		return new Matrix4(
			a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22),
			-(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22)),
			a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12),
			-(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12)),

			-(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22)),
			a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22),
			-(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12)),
			a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12),

			a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21),
			-(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21)),
			a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11),
			-(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11)),

			-(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21)),
			a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21),
			-(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11)),
			a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	}

	/**
	 * Calculates the determinant of this matrix.
	 * @returns The determinant of this matrix.
	 */
	get determinant(): number {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;
		const a30: number = this[12] as number;
		const a31: number = this[13] as number;
		const a32: number = this[14] as number;
		const a33: number = this[15] as number;

		return (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32)
			- (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31)
			+ (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31)
			+ (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30)
			- (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30)
			+ (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
	}

	/**
	 * Multiplies this matrix with another.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: Matrix4): Matrix4 {
		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;
		const a30: number = this[12] as number;
		const a31: number = this[13] as number;
		const a32: number = this[14] as number;
		const a33: number = this[15] as number;

		const b00: number = m[0] as number;
		const b01: number = m[1] as number;
		const b02: number = m[2] as number;
		const b03: number = m[3] as number;
		const b10: number = m[4] as number;
		const b11: number = m[5] as number;
		const b12: number = m[6] as number;
		const b13: number = m[7] as number;
		const b20: number = m[8] as number;
		const b21: number = m[9] as number;
		const b22: number = m[10] as number;
		const b23: number = m[11] as number;
		const b30: number = m[12] as number;
		const b31: number = m[13] as number;
		const b32: number = m[14] as number;
		const b33: number = m[15] as number;

		return new Matrix4(
			b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
			b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
			b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
			b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

			b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
			b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
			b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
			b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

			b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
			b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
			b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
			b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

			b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
			b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
			b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
			b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33);
	}

	/**
	 * Translates this matrix by the given vector.
	 * @param v - The amount to translate this matrix by.
	 * @returns The translated matrix.
	 */
	translate(v: Vector3): Matrix4 {
		const x: number = v[0] as number;
		const y: number = v[1] as number;
		const z: number = v[2] as number;

		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;

		return new Matrix4(
			a00, a01, a02, a03,
			a10, a11, a12, a13,
			a20, a21, a22, a23,

			a00 * x + a10 * y + a20 * z + (this[12] as number),
			a01 * x + a11 * y + a21 * z + (this[13] as number),
			a02 * x + a12 * y + a22 * z + (this[14] as number),
			a03 * x + a13 * y + a23 * z + (this[15] as number));
	}

	/**
	 * Rotates this matrix by the given angle about the given axis.
	 * @param r - The angle to rotate by in radians.
	 * @param v - The axis to rotate about.
	 * @returns The rotated matrix.
	 */
	rotate(r: number, v: Vector3): Matrix4 {
		let x: number = v[0] as number;
		let y: number = v[1] as number;
		let z: number = v[2] as number;

		const len: number = 1 / Math.hypot(x, y, z);

		x *= len;
		y *= len;
		z *= len;

		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;

		const s: number = Math.sin(r);
		const c: number = Math.cos(r);
		const t: number = 1 - c;

		const b00: number = x * x * t + c;
		const b01: number = y * x * t + z * s;
		const b02: number = z * x * t - y * s;
		const b10: number = x * y * t - z * s;
		const b11: number = y * y * t + c;
		const b12: number = z * y * t + x * s;
		const b20: number = x * z * t + y * s;
		const b21: number = y * z * t - x * s;
		const b22: number = z * z * t + c;

		return new Matrix4(
			a00 * b00 + a10 * b01 + a20 * b02,
			a01 * b00 + a11 * b01 + a21 * b02,
			a02 * b00 + a12 * b01 + a22 * b02,
			a03 * b00 + a13 * b01 + a23 * b02,

			a00 * b10 + a10 * b11 + a20 * b12,
			a01 * b10 + a11 * b11 + a21 * b12,
			a02 * b10 + a12 * b11 + a22 * b12,
			a03 * b10 + a13 * b11 + a23 * b12,

			a00 * b20 + a10 * b21 + a20 * b22,
			a01 * b20 + a11 * b21 + a21 * b22,
			a02 * b20 + a12 * b21 + a22 * b22,
			a03 * b20 + a13 * b21 + a23 * b22,

			this[12] as number,
			this[13] as number,
			this[14] as number,
			this[15] as number);
	}

	/**
	 * Rotates this matrix by the given angle about the X axis.
	 * @param r - The angle to rotate this matrix by in radians.
	 * @returns A rotated matrix.
	 */
	rotateX(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;

		return new Matrix4(
			this[0] as number,
			this[1] as number,
			this[2] as number,
			this[3] as number,

			a10 * c + a20 * s,
			a11 * c + a21 * s,
			a11 * c + a21 * s,
			a13 * c + a23 * s,

			a13 * c + a23 * s,
			a21 * c - a11 * s,
			a22 * c - a12 * s,
			a23 * c - a13 * s,

			this[12] as number,
			this[13] as number,
			this[14] as number,
			this[15] as number);
	}

	/**
	 * Rotates this matrix by the given angle about the Y axis.
	 * @param r - The angle to rotate this matrix by in radians.
	 * @returns A rotated matrix.
	 */
	rotateY(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a20: number = this[8] as number;
		const a21: number = this[9] as number;
		const a22: number = this[10] as number;
		const a23: number = this[11] as number;

		return new Matrix4(
			a00 * c - a20 * s,
			a01 * c - a21 * s,
			a02 * c - a22 * s,
			a03 * c - a23 * s,

			this[4] as number,
			this[5] as number,
			this[6] as number,
			this[7] as number,

			a00 * s + a20 * c,
			a01 * s + a21 * c,
			a02 * s + a22 * c,
			a03 * s + a23 * c,

			this[12] as number,
			this[13] as number,
			this[14] as number,
			this[15] as number);
	}

	/**
	 * Rotates this matrix by the given angle about the Z axis.
	 * @param r - The angle to rotate this matrix by in radians.
	 * @returns A rotated matrix.
	 */
	rotateZ(r: number): Matrix4 {
		const s: number = Math.sin(r);
		const c: number = Math.cos(r);

		const a00: number = this[0] as number;
		const a01: number = this[1] as number;
		const a02: number = this[2] as number;
		const a03: number = this[3] as number;
		const a10: number = this[4] as number;
		const a11: number = this[5] as number;
		const a12: number = this[6] as number;
		const a13: number = this[7] as number;

		return new Matrix4(
			a00 * c + a10 * s,
			a01 * c + a11 * s,
			a02 * c + a12 * s,
			a03 * c + a13 * s,

			a10 * c - a00 * s,
			a11 * c - a01 * s,
			a12 * c - a02 * s,
			a12 * c - a02 * s,

			this[8] as number,
			this[9] as number,
			this[10] as number,
			this[11] as number,

			this[12] as number,
			this[13] as number,
			this[14] as number,
			this[15] as number);
	}

	/**
	 * Scales this matrix by the given dimensions.
	 * @param v - The amount to scale this matrix by.
	 * @returns The scaled matrix.
	 */
	scale(v: Vector3): Matrix4 {
		const x: number = v[0] as number;
		const y: number = v[1] as number;
		const z: number = v[2] as number;

		return new Matrix4(
			(this[0] as number) * x, (this[1] as number) * x, (this[2] as number) * x, (this[3] as number) * x,
			(this[4] as number) * y, (this[5] as number) * y, (this[6] as number) * y, (this[7] as number) * y,
			(this[8] as number) * z, (this[9] as number) * z, (this[10] as number) * z, (this[11] as number) * z,
			this[12] as number, this[13] as number, this[14] as number, this[15] as number);
	}

	/** The translation vector component of this transformation matrix. */
	get translation(): Vector3 {
		return new Vector3(
			this[12] as number,
			this[13] as number,
			this[14] as number);
	}

	/** The scaling factor component of this transformation matrix. */
	get scaling(): Vector3 {
		return new Vector3(
			Math.hypot(this[0] as number, this[1] as number, this[2] as number),
			Math.hypot(this[4] as number, this[5] as number, this[6] as number),
			Math.hypot(this[8] as number, this[9] as number, this[10] as number));
	}

	/** A quaternion representing the rotational component of this transformation matrix. */
	get rotation(): Quaternion {
		const scaling: Vector3 = this.scaling;

		const is1: number = 1 / (scaling[0] as number);
		const is2: number = 1 / (scaling[1] as number);
		const is3: number = 1 / (scaling[2] as number);

		const sm11: number = (this[0] as number) * is1;
		const sm12: number = (this[1] as number) * is2;
		const sm13: number = (this[2] as number) * is3;
		const sm21: number = (this[4] as number) * is1;
		const sm22: number = (this[5] as number) * is2;
		const sm23: number = (this[6] as number) * is3;
		const sm31: number = (this[8] as number) * is1;
		const sm32: number = (this[9] as number) * is2;
		const sm33: number = (this[10] as number) * is3;

		const trace: number = sm11 + sm22 + sm33;

		if (trace > 0) {
			const S: number = Math.sqrt(trace + 1) * 2;
			return new Quaternion(
				(sm23 - sm32) / S,
				(sm31 - sm13) / S,
				(sm12 - sm21) / S,
				S / 4);
		} else if (sm11 > sm22 && sm11 > sm33) {
			const S: number = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
			return new Quaternion(
				S / 4,
				(sm12 + sm21) / S,
				(sm31 + sm13) / S,
				(sm23 - sm32) / S);
		} else if (sm22 > sm33) {
			const S: number = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
			return new Quaternion(
				(sm12 + sm21) / S,
				S / 4,
				(sm23 + sm32) / S,
				(sm31 - sm13) / S);
		} else {
			const S: number = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
			return new Quaternion(
				(sm31 + sm13) / S,
				(sm23 + sm32) / S,
				S / 4,
				(sm12 - sm21) / S);
		}
	}

	/**
	 * Returns a string represenation of this matrix.
	 * @returns A string representation of this matrix.
	 */
	override toString(): string {
		return `(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]} | ${this[4]}, ${this[5]}, ${this[6]}, ${this[7]} | ${this[8]}, ${this[9]}, ${this[10]}, ${this[11]} | ${this[12]}, ${this[13]}, ${this[14]}, ${this[15]})`;
	}

	/**
	 * Returns the Frobenius norm of this matrix.
	 * @returns The Frobenius norm of this matrix.
	 */
	get frob(): number {
		return Math.hypot(
			this[0] as number, this[1] as number, this[2] as number, this[3] as number,
			this[4] as number, this[5] as number, this[6] as number, this[7] as number,
			this[8] as number, this[9] as number, this[10] as number, this[11] as number,
			this[12] as number, this[13] as number, this[14] as number, this[15] as number);
	}
	
	/**
	 * Adds another matrix to this matrix.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: Matrix4): Matrix4 {
		return new Matrix4(
			(this[0] as number) + (m[0] as number),
			(this[1] as number) + (m[1] as number),
			(this[2] as number) + (m[2] as number),
			(this[3] as number) + (m[3] as number),

			(this[4] as number) + (m[4] as number),
			(this[5] as number) + (m[5] as number),
			(this[6] as number) + (m[6] as number),
			(this[7] as number) + (m[7] as number),

			(this[8] as number) + (m[8] as number),
			(this[9] as number) + (m[9] as number),
			(this[10] as number) + (m[10] as number),
			(this[11] as number) + (m[11] as number),

			(this[12] as number) + (m[12] as number),
			(this[13] as number) + (m[13] as number),
			(this[14] as number) + (m[14] as number),
			(this[15] as number) + (m[15] as number));
	}

	/**
	 * Subtracts another matrix from this matrix.
	 * @param m - The other matrix.
	 * @returns The difference between the matrices.
	 */
	subtract(m: Matrix4): Matrix4 {
		return new Matrix4(
			(this[0] as number) - (m[0] as number),
			(this[1] as number) - (m[1] as number),
			(this[2] as number) - (m[2] as number),
			(this[3] as number) - (m[3] as number),

			(this[4] as number) - (m[4] as number),
			(this[5] as number) - (m[5] as number),
			(this[6] as number) - (m[6] as number),
			(this[7] as number) - (m[7] as number),

			(this[8] as number) - (m[8] as number),
			(this[9] as number) - (m[9] as number),
			(this[10] as number) - (m[10] as number),
			(this[11] as number) - (m[11] as number),

			(this[12] as number) - (m[12] as number),
			(this[13] as number) - (m[13] as number),
			(this[14] as number) - (m[14] as number),
			(this[15] as number) - (m[15] as number));
	}

	/**
	 * Returns whether or not this matrix has exactly the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have exactly the same elements.
	 */
	exactEquals(m: Matrix4): boolean {
		return this[0] === m[0]
			&& this[1] === m[1]
			&& this[2] === m[2]
			&& this[3] === m[3]

			&& this[4] === m[4]
			&& this[5] === m[5]
			&& this[6] === m[6]
			&& this[7] === m[7]

			&& this[8] === m[8]
			&& this[9] === m[9]
			&& this[10] === m[10]
			&& this[11] === m[11]

			&& this[12] === m[12]
			&& this[13] === m[13]
			&& this[14] === m[14]
			&& this[15] === m[15];
	}

	/**
	 * Returns whether or not this matrix has approximately the same elements as another.
	 * @param m - The other matrix.
	 * @returns Whether or not the matrices have approximately the same elements.
	 */
	equals(m: Matrix4): boolean {
		const a0: number = this[0] as number;
		const a1: number = this[1] as number;
		const a2: number = this[2] as number;
		const a3: number = this[3] as number;
		const a4: number = this[4] as number;
		const a5: number = this[5] as number;
		const a6: number = this[6] as number;
		const a7: number = this[7] as number;
		const a8: number = this[8] as number;
		const a9: number = this[9] as number;
		const a10: number = this[10] as number;
		const a11: number = this[11] as number;
		const a12: number = this[12] as number;
		const a13: number = this[13] as number;
		const a14: number = this[14] as number;
		const a15: number = this[15] as number;

		const b0: number = m[0] as number;
		const b1: number = m[1] as number;
		const b2: number = m[2] as number;
		const b3: number = m[3] as number;
		const b4: number = m[4] as number;
		const b5: number = m[5] as number;
		const b6: number = m[6] as number;
		const b7: number = m[7] as number;
		const b8: number = m[8] as number;
		const b9: number = m[9] as number;
		const b10: number = m[10] as number;
		const b11: number = m[11] as number;
		const b12: number = m[12] as number;
		const b13: number = m[13] as number;
		const b14: number = m[14] as number;
		const b15: number = m[15] as number;

		return (Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0))
			&& Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1))
			&& Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2))
			&& Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3))
			&& Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4))
			&& Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5))
			&& Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6))
			&& Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7))
			&& Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8))
			&& Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9))
			&& Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10))
			&& Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11))
			&& Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12))
			&& Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13))
			&& Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14))
			&& Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15)));
	}

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The scaled matrix.
	 */
	multiplyScalar(s: number): Matrix4 {
		return new Matrix4(
			(this[0] as number) * s, (this[1] as number) * s, (this[2] as number) * s, (this[3] as number) * s,
			(this[4] as number) * s, (this[5] as number) * s, (this[6] as number) * s, (this[7] as number) * s,
			(this[8] as number) * s, (this[9] as number) * s, (this[10] as number) * s, (this[11] as number) * s,
			(this[12] as number) * s, (this[13] as number) * s, (this[14] as number) * s, (this[15] as number) * s);
	}

	/**
	 * Scales a matrix by a scalar and then adds it to this matrix.
	 * @param m - The other matrix.
	 * @param s - The scalar.
	 * @returns The sum of the matrices.
	 */
	multiplyScalarAndAdd(m: Matrix4, s: number): Matrix4 {
		return new Matrix4(
			(this[0] as number) + (m[0] as number) * s,
			(this[1] as number) + (m[1] as number) * s,
			(this[2] as number) + (m[2] as number) * s,
			(this[3] as number) + (m[3] as number) * s,

			(this[4] as number) + (m[4] as number) * s,
			(this[5] as number) + (m[5] as number) * s,
			(this[6] as number) + (m[6] as number) * s,
			(this[7] as number) + (m[7] as number) * s,

			(this[8] as number) + (m[8] as number) * s,
			(this[9] as number) + (m[9] as number) * s,
			(this[10] as number) + (m[10] as number) * s,
			(this[11] as number) + (m[11] as number) * s,

			(this[12] as number) + (m[12] as number) * s,
			(this[13] as number) + (m[13] as number) * s,
			(this[14] as number) + (m[14] as number) * s,
			(this[15] as number) + (m[15] as number) * s);
	}
}