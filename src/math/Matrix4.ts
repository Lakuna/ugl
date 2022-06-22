import { SquareMatrix } from "./SquareMatrix.js";
import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";

/** A collection of numbers arranged in four columns and four rows. */
export class Matrix4 extends SquareMatrix {
  /**
   * Creates a 4x4 matrix with the given values.
   * @param c1r1 The value in the first column and first row.
   * @param c1r2 The value in the first column and second row.
   * @param c1r3 The value in the first column and third row.
   * @param c1r4 The value in the first column and fourth row.
   * @param c2r1 The value in the second column and first row.
   * @param c2r2 The value in the second column and second row.
   * @param c2r3 The value in the second column and third row.
   * @param c2r4 The value in the second column and fourth row.
   * @param c3r1 The value in the third column and first row.
   * @param c3r2 The value in the third column and second row.
   * @param c3r3 The value in the third column and third row.
   * @param c3r4 The value in the third column and fourth row.
   * @param c4r1 The value in the fourth column and first row.
   * @param c4r2 The value in the fourth column and second row.
   * @param c4r3 The value in the fourth column and third row.
   * @param c4r4 The value in the fourth column and fourth row.
   */
  public constructor(c1r1 = 1, c1r2 = 0, c1r3 = 0, c1r4 = 0, c2r1 = 0, c2r2 = 1, c2r3 = 0, c2r4 = 0, c3r1 = 0, c3r2 = 0, c3r3 = 1, c3r4 = 0, c4r1 = 0, c4r2 = 0, c4r3 = 0, c4r4 = 1) {
    super(4);
    this[0] = c1r1;
    this[1] = c1r2;
    this[2] = c1r3;
    this[3] = c1r4;
    this[4] = c2r1;
    this[5] = c2r2;
    this[6] = c2r3;
    this[7] = c2r4;
    this[8] = c3r1;
    this[9] = c3r2;
    this[10] = c3r3;
    this[11] = c3r4;
    this[12] = c4r1;
    this[13] = c4r2;
    this[14] = c4r3;
    this[15] = c4r4;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public override adjoint(): this {
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

    this[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    this[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    this[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    this[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    this[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    this[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    this[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    this[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    this[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    this[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    this[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    this[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    this[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    this[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    this[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    this[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);

    return this;
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Matrix4 {
    return new Matrix4(...(this as ArrayLike<number> as [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]));
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
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

    return (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
      (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
      (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
      (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
      (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
      (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion.
   * @param q The quaternion.
   * @returns The transformation matrix.
   */
  public static fromQuaternion(q: Quaternion): Matrix4 {
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
      0, 0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the given axis.
   * @param r The angle in radians.
   * @param v The axis.
   * @returns The transformation matrix.
   */
  public static fromRotation(r: number, v: Vector3): Matrix4 {
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
      x * x * t + c, y * x * t + z * s, z * x * t - y * s, 0,
      x * y * t - z * s, y * y * t + c, z * y * t + x * s, 0,
      x * z * t + y * s, y * z * t - x * s, z * z * t + c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion and translates by the given vector.
   * @param q The quaternion.
   * @param v The vector.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslation(q: Quaternion, v: Vector3): Matrix4 {
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
      v[0] as number, v[1] as number, v[2] as number, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion, translates by the given vector, and scales by the given vector.
   * @param q The quaternion.
   * @param v The translation vector.
   * @param s The scaling vector.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslationScale(q: Quaternion, v: Vector3, s: Vector3): Matrix4 {
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
      v[0] as number, v[1] as number, v[2] as number, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion about the given origin, translates by the given vector, and scales by the given vector about the given origin.
   * @param q The quaternion.
   * @param v The translation vector.
   * @param s The scaling vector.
   * @param o The origin.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslationScaleOrigin(q: Quaternion, v: Vector3, s: Vector3, o: Vector3): Matrix4 {
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
      (v[0] as number) + ox - (out0 * ox + out4 * oy + out8 * oz),
      (v[1] as number) + oy - (out1 * ox + out5 * oy + out9 * oz),
      (v[2] as number) + oz - (out2 * ox + out6 * oy + out10 * oz),
      1
    );
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param v The vector.
   * @returns The transformation matrix.
   */
  public static fromScaling(v: Vector3): Matrix4 {
    return new Matrix4(
      v[0] as number, 0, 0, 0,
      0, v[1] as number, 0, 0,
      0, 0, v[2] as number, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that translates a matrix by the given vector.
   * @param v The vector.
   * @returns The transformation matrix.
   */
  public static fromTranslation(v: Vector3): Matrix4 {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v[0] as number, v[1] as number, v[2] as number, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the horizontal axis.
   * @param r The angle in radians.
   * @returns The transformation matrix.
   */
  public static fromXRotation(r: number): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix4(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the vertical axis.
   * @param r The angle in radians.
   * @returns The transformation matrix.
   */
  public static fromYRotation(r: number): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix4(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the depth axis.
   * @param r The angle in radians.
   * @returns The transformation matrix.
   */
  public static fromZRotation(r: number): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix4(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Generates a frustum matrix with the given bounds.
   * @param left The left bound of the frustum.
   * @param right The right bound of the frustum.
   * @param bottom The bottom bound of the frustum.
   * @param top The top bound of the frustum.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @returns The frustum matrix.
   */
  public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    const rl: number = 1 / (right - left);
    const tb: number = 1 / (top - bottom);
    const nf: number = 1 / (near - far);

    return new Matrix4(
      near * 2 * rl, 0, 0, 0,
      0, near * 2 * tb, 0, 0,
      (right + left) * rl, (top + bottom) * tb, (far + near) * nf, -1,
      0, 0, far * near * 2 * nf, 0
    );
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  public override invert(): this {
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

    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return this;
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * @param eye The position of the viewer.
   * @param center The focal point.
   * @param up The up axis.
   * @returns The look-at matrix.
   */
  public static lookAt(eye: Vector3, center: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4 {
    const eyex: number = eye[0] as number;
    const eyey: number = eye[1] as number;
    const eyez: number = eye[2] as number;

    const centerx: number = center[0] as number;
    const centery: number = center[1] as number;
    const centerz: number = center[2] as number;

    const upx: number = up[0] as number;
    const upy: number = up[1] as number;
    const upz: number = up[2] as number;

    let z0: number = eyex - centerx;
    let z1: number = eyey - centery;
    let z2: number = eyez - centerz;

    const lenz: number = 1 / Math.hypot(z0, z1, z2);

    z0 *= lenz;
    z1 *= lenz;
    z2 *= lenz;

    let x0: number = upy * z2 - upz * z1;
    let x1: number = upz * z0 - upx * z2;
    let x2: number = upx * z1 - upy * z0;

    const lenx: number = 1 / Math.hypot(x0, x1, x2);

    x0 *= lenx;
    x1 *= lenx;
    x2 *= lenx;

    let y0: number = z1 * x2 - z2 * x1;
    let y1: number = z2 * x0 - z0 * x2;
    let y2: number = z0 * x1 - z1 * x0;

    const leny: number = 1 / Math.hypot(y0, y1, y2);

    y0 *= leny;
    y1 *= leny;
    y2 *= leny;

    return new Matrix4(
      x0, y0, z0, 0,
      x1, y1, z1, 0,
      x2, y2, z2, 0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    );
  }

  /**
   * Multiplies this matrix by another.
   * @param b The other matrix.
   * @returns The product.
   */
  public override multiply(b: Matrix4): this {
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

    const b00: number = b[0] as number;
    const b01: number = b[1] as number;
    const b02: number = b[2] as number;
    const b03: number = b[3] as number;
    const b10: number = b[4] as number;
    const b11: number = b[5] as number;
    const b12: number = b[6] as number;
    const b13: number = b[7] as number;
    const b20: number = b[8] as number;
    const b21: number = b[9] as number;
    const b22: number = b[10] as number;
    const b23: number = b[11] as number;
    const b30: number = b[12] as number;
    const b31: number = b[13] as number;
    const b32: number = b[14] as number;
    const b33: number = b[15] as number;

    this[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    this[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    this[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    this[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    this[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    this[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    this[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    this[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    this[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    this[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    this[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    this[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    this[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    this[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return this;
  }

  /**
   * Generates an orthogonal projection matrix with the given bounds.
   * @param left The left bound of the frustum.
   * @param right The right bound of the frustum.
   * @param bottom The bottom bound of the frustum.
   * @param top The top bound of the frustum.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @returns The orthogonal projection matrix.
   */
  public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    const lr: number = 1 / (left - right);
    const bt: number = 1 / (bottom - top);
    const nf: number = 1 / (near - far);

    return new Matrix4(
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
    );
  }

  /**
   * Generates a perspective projection matrix with the given bounds.
   * @param fovy The vertical field of view in radians.
   * @param aspect The aspect ratio.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @returns The perspective projection matrix.
   */
  public static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
    const f: number = 1 / Math.tan(fovy / 2);

    const out: Matrix4 = new Matrix4(
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, -1, -1,
      0, 0, -2 * near, 0
    );

    if (far != Infinity) {
      const nf: number = 1 / (near - far);

      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    }

    return out;
  }

  /**
   * Generates a perspective projection matrix with the given field of view.
   * @param up The angle to the top of the frustum in radians.
   * @param down The angle to the top of the frustum in radians.
   * @param left The angle to the top of the frustum in radians.
   * @param right The angle to the top of the frustum in radians.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @returns The perspective projection matrix.
   */
  public static perspectiveFromFieldOfView(up: number, down: number, left: number, right: number, near: number, far: number): Matrix4 {
    const upTan: number = Math.tan(up);
    const downTan: number = Math.tan(down);
    const leftTan: number = Math.tan(left);
    const rightTan: number = Math.tan(right);

    const xScale: number = 2 / (leftTan + rightTan);
    const yScale: number = 2 / (upTan + downTan);

    return new Matrix4(
      xScale, 0, 0, 0,
      0, yScale, 0, 0,
      -((leftTan - rightTan) * xScale / 2), (upTan - downTan) * yScale / 2, far / (near - far), -1,
      0, 0, (far * near) / (near - far), 0
    );
  }

  /**
   * Rotates this matrix by the given angle about the given axis.
   * @param r The angle in radians.
   * @param v The axis.
   * @returns The rotated matrix.
   */
  public rotate(r: number, v: Vector3): this {
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

    const b00: number = x * x * t + c;
    const b01: number = y * x * t + z * s;
    const b02: number = z * x * t - y * s;
    const b10: number = x * y * t - z * s;
    const b11: number = y * y * t + c;
    const b12: number = z * y * t + x * s;
    const b20: number = x * z * t + y * s;
    const b21: number = y * z * t - x * s;
    const b22: number = z * z * t + c;

    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  /**
   * Rotates this matrix by the given angle about the horizontal axis.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotateX(r: number): this {
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

    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;

    return this;
  }

  /**
   * Rotates this matrix by the given angle about the vertical axis.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotateY(r: number): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a03: number = this[3] as number;
    const a20: number = this[8] as number;
    const a21: number = this[9] as number;
    const a22: number = this[10] as number;
    const a23: number = this[11] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;

    return this;
  }

  /**
   * Rotates this matrix by the given angle about the depth axis.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotateZ(r: number): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a03: number = this[3] as number;
    const a10: number = this[4] as number;
    const a11: number = this[5] as number;
    const a12: number = this[6] as number;
    const a13: number = this[7] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;

    return this;
  }

  /**
   * The scaling vector component of this transformation matrix.
   * @returns The scaling vector.
   */
  public get rotation(): Quaternion {
    const out: Quaternion = new Quaternion();

    const scaling: Vector3 = this.scaling;

    const is1: number = 1 / (scaling[0] as number);
    const is2: number = 1 / (scaling[1] as number);
    const is3: number = 1 / (scaling[2] as number);

    const sm00: number = (this[0] as number) * is1;
    const sm01: number = (this[1] as number) * is2;
    const sm02: number = (this[2] as number) * is3;
    const sm10: number = (this[4] as number) * is1;
    const sm11: number = (this[5] as number) * is2;
    const sm12: number = (this[6] as number) * is3;
    const sm20: number = (this[8] as number) * is1;
    const sm21: number = (this[9] as number) * is2;
    const sm22: number = (this[10] as number) * is3;

    const trace: number = sm00 + sm11 + sm22;

    if (trace > 0) {
      const s: number = Math.sqrt(trace + 1) * 2;

      out[0] = (sm12 - sm21) / s;
      out[1] = (sm20 - sm02) / s;
      out[2] = (sm01 - sm10) / s;
      out[3] = s / 4;

      return out;
    }

    if (sm00 > sm11 && sm00 > sm22) {
      const s: number = Math.sqrt(1 + sm00 - sm11 - sm22) * 2;

      out[0] = s / 4;
      out[1] = (sm01 + sm10) / s;
      out[2] = (sm20 + sm02) / s;
      out[3] = (sm12 -  sm21) / s;

      return out;
    }

    if (sm11 > sm22) {
      const s: number = Math.sqrt(1 + sm11 - sm00 - sm22) * 2;

      out[0] = (sm01 + sm10) / s;
      out[1] = s / 4;
      out[2] = (sm12 + sm21) / s;
      out[3] = (sm20 - sm02) / s;

      return out;
    }

    const s: number = Math.sqrt(1 + sm22 - sm00 - sm11) * 2;

    out[0] = (sm20 + sm02) / s;
    out[1] = (sm12 + sm21) / s;
    out[2] = s / 4;
    out[3] = (sm01 - sm10) / s;

    return out;
  }

  /**
   * Scales this matrix by the given vector.
   * @param v The vector.
   * @returns The scaled matrix.
   */
  public scale(v: Vector3): this {
    const x: number = v[0] as number;
    const y: number = v[1] as number;
    const z: number = v[2] as number;

    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= x;
    this[4] *= y;
    this[5] *= y;
    this[6] *= y;
    this[7] *= y;
    this[8] *= z;
    this[9] *= z;
    this[10] *= z;
    this[11] *= z;

    return this;
  }

  /**
   * The scaling vector component of this transformation matrix.
   * @returns The scaling vector.
   */
  public get scaling(): Vector3 {
    return new Vector3(
      Math.hypot(this[0] as number, this[1] as number, this[2] as number),
      Math.hypot(this[4] as number, this[5] as number, this[6] as number),
      Math.hypot(this[8] as number, this[9] as number, this[10] as number)
    );
  }

  /**
   * Generates a matrix that makes a transformation matrix point towards a point.
   * @param eye The position of the viewer.
   * @param target The focal point.
   * @param up The up axis.
   * @returns The matrix.
   */
  public static targetTo(eye: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4 {
    const eyex: number = eye[0] as number;
    const eyey: number = eye[1] as number;
    const eyez: number = eye[2] as number;

    const upx: number = up[0] as number;
    const upy: number = up[1] as number;
    const upz: number = up[2] as number;

    let z0: number = eyex - (target[0] as number);
    let z1: number = eyey - (target[1] as number);
    let z2: number = eyez - (target[2] as number);

    const lenz: number = 1 / (z0 * z0 + z1 * z1 + z2 * z2);

    z0 *= lenz;
    z1 *= lenz;
    z2 *= lenz;

    let x0: number = upy * z2 - upz * z1;
    let x1: number = upz * z0 - upx * z2;
    let x2: number = upx * z1 - upy * z0;

    const lenx: number = 1 / (x0 * x0 + x1 * x1 + x2 * x2);

    x0 *= lenx;
    x1 *= lenx;
    x2 *= lenx;

    return new Matrix4(
      x0, x1, x2, 0,
      z1 * x2 - z2 * x1, z2 * x0 - z0 * x2, z0 * x1 - z1 * x0, 0,
      z0, z1, z2, 0,
      eyex, eyey, eyez, 1
    );
  }

  /**
   * Translates this matrix by the given vector.
   * @param v The vector.
   * @returns The translated matrix.
   */
  public translate(v: Vector3): this {
    const x: number = v[0] as number;
    const y: number = v[1] as number;
    const z: number = v[2] as number;

    this[12] += (this[0] as number) * x + (this[4] as number) * y + (this[8] as number) * z;
    this[13] += (this[1] as number) * x + (this[5] as number) * y + (this[9] as number) * z;
    this[14] += (this[2] as number) * x + (this[6] as number) * y + (this[10] as number) * z;
    this[15] += (this[3] as number) * x + (this[7] as number) * y + (this[11] as number) * z;

    return this;
  }

  /**
   * The translation vector component of this transformation matrix.
   * @returns The translation vector.
   */
  public get translation(): Vector3 {
    return new Vector3(this[12] as number, this[13] as number, this[14] as number);
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public override transpose(): this {
    [this[1], this[4]] = [this[4] as number, this[1] as number];
    [this[2], this[8]] = [this[8] as number, this[2] as number];
    [this[3], this[12]] = [this[12] as number, this[3] as number];
    [this[6], this[9]] = [this[9] as number, this[6] as number];
    [this[7], this[13]] = [this[13] as number, this[7] as number];
    [this[11], this[14]] = [this[14] as number, this[11] as number];

    return this;
  }
}
