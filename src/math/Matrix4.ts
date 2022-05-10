import { Matrix } from "./Matrix.js";
import { Numbers1x3, Numbers1x4 } from "../types/Numbers.js";
import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";

/** A collection of numbers arranged in four columns and four rows. */
export class Matrix4 extends Matrix {
  /** Creates a 4x4 identity matrix. */
  public constructor();

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
  public constructor(c1r1: number, c1r2: number, c1r3: number, c1r4: number, c2r1: number, c2r2: number, c2r3: number, c2r4: number, c3r1: number, c3r2: number, c3r3: number, c3r4: number, c4r1: number, c4r2: number, c4r3: number, c4r4: number);

  public constructor(c1r1 = 1, c1r2 = 0, c1r3 = 0, c1r4 = 0, c2r1 = 0, c2r2 = 1, c2r3 = 0, c2r4 = 0, c3r1 = 0, c3r2 = 0, c3r3 = 1, c3r4 = 0, c4r1 = 0, c4r2 = 0, c4r3 = 0, c4r4 = 1) {
    super(c1r1, c1r2, c1r3, c1r4, c2r1, c2r2, c2r3, c2r4, c3r1, c3r2, c3r3, c3r4, c4r1, c4r2, c4r3, c4r4);
  }

  /**
   * Adds two matrices together.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public static override add(a: Matrix4, b: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = (a[0] as number) + (b[0] as number);
    out[1] = (a[1] as number) + (b[1] as number);
    out[2] = (a[2] as number) + (b[2] as number);
    out[3] = (a[3] as number) + (b[3] as number);
    out[4] = (a[4] as number) + (b[4] as number);
    out[5] = (a[5] as number) + (b[5] as number);
    out[6] = (a[6] as number) + (b[6] as number);
    out[7] = (a[7] as number) + (b[7] as number);
    out[8] = (a[8] as number) + (b[8] as number);
    out[9] = (a[9] as number) + (b[9] as number);
    out[10] = (a[10] as number) + (b[10] as number);
    out[11] = (a[11] as number) + (b[11] as number);
    out[12] = (a[12] as number) + (b[12] as number);
    out[13] = (a[13] as number) + (b[13] as number);
    out[14] = (a[14] as number) + (b[14] as number);
    out[15] = (a[15] as number) + (b[15] as number);

    return out;
  }

  /**
   * Adds another matrix to this one.
   * @param m The matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public override add(m: Matrix4, out: Matrix4 = this): Matrix4 {
    return Matrix4.add(this, m, out);
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static override adjoint(m: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
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

    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);

    return out;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public override adjoint(out: Matrix4 = this): Matrix4 {
    return Matrix4.adjoint(this, out);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public override clone(): Matrix4 {
    return new Matrix4(this[0] as number, this[1] as number, this[2] as number, this[3] as number, this[4] as number, this[5] as number, this[6] as number, this[7] as number, this[8] as number, this[9] as number, this[10] as number, this[11] as number, this[12] as number, this[13] as number, this[14] as number, this[15] as number);
  }

  /**
   * Copies the values in a matrix to another.
   * @param src The source matrix.
   * @param dst The destination matrix.
   * @returns The destination matrix.
   */
  public static override copy(src: Matrix4, dst: Matrix4): Matrix4 {
    dst[0] = src[0] as number;
    dst[1] = src[1] as number;
    dst[2] = src[2] as number;
    dst[3] = src[3] as number;
    dst[4] = src[4] as number;
    dst[5] = src[5] as number;
    dst[6] = src[6] as number;
    dst[7] = src[7] as number;
    dst[8] = src[8] as number;
    dst[9] = src[9] as number;
    dst[10] = src[10] as number;
    dst[11] = src[11] as number;
    dst[12] = src[12] as number;
    dst[13] = src[13] as number;
    dst[14] = src[14] as number;
    dst[15] = src[15] as number;

    return dst;
  }

  /**
   * Copies the values in another matrix to this one.
   * @param src The source matrix.
   * @returns This matrix.
   */
  public override copy(src: Matrix4): this {
    return Matrix4.copy(src, this) as this;
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static override cofactor(m: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = m.minor([0], [0]);
    out[1] = -m.minor([0], [1]);
    out[2] = m.minor([0], [2]);
    out[3] = -m.minor([0], [3]);
    out[4] = m.minor([1], [0]);
    out[5] = -m.minor([1], [1]);
    out[6] = m.minor([1], [2]);
    out[7] = -m.minor([1], [3]);
    out[8] = m.minor([2], [0]);
    out[9] = -m.minor([2], [1]);
    out[10] = m.minor([2], [2]);
    out[11] = -m.minor([2], [3]);
    out[12] = m.minor([3], [0]);
    out[13] = -m.minor([3], [1]);
    out[14] = m.minor([3], [2]);
    out[15] = -m.minor([3], [3]);

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public override cofactor(out: Matrix4 = this): Matrix4 {
    return Matrix4.cofactor(this, out);
  }

  /**
   * Calculates the determinant of a matrix.
   * @param m The matrix.
   * @returns The determinant.
   */
  public static override determinant(m: Matrix4): number {
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

    return (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
      (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
      (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
      (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
      (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
      (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
    return Matrix4.determinant(this);
  }

  /**
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @returns Whether the matrices are equivalent.
   */
  public static override equals(a: Matrix4, b: Matrix4): boolean {
    return a[0] == b[0]
      && a[1] == b[1]
      && a[2] == b[2]
      && a[3] == b[3]
      && a[4] == b[4]
      && a[5] == b[5]
      && a[6] == b[6]
      && a[7] == b[7]
      && a[8] == b[8]
      && a[9] == b[9]
      && a[10] == b[10]
      && a[11] == b[11]
      && a[12] == b[12]
      && a[13] == b[13]
      && a[14] == b[14]
      && a[15] == b[15];
  }

  /**
   * Determines whether this matrix is equivalent to another.
   * @param m The other matrix.
   * @returns Whether the matrices are equivalent.
   */
  public override equals(m: Matrix4): boolean {
    return Matrix4.equals(this, m);
  }

  /**
   * Calculates the Frobenius norm of a matrix.
   * @param m The matrix.
   * @returns The Frobenius norm.
   */
  public static override frob(m: Matrix4): number {
    return Math.hypot(m[0] as number, m[1] as number, m[2] as number, m[3] as number, m[4] as number, m[5] as number, m[6] as number, m[7] as number, m[8] as number, m[9] as number, m[10] as number, m[11] as number, m[12] as number, m[13] as number, m[14] as number, m[15] as number);
  }

  /** The Frobenius norm of this matrix. */
  public override get frob(): number {
    return Matrix4.frob(this);
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion.
   * @param q The quaternion.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromQuaternion(q: Numbers1x4, out: Matrix4 = new Matrix4()): Matrix4 {
    const x: number = q[0];
    const y: number = q[1];
    const z: number = q[2];
    const w: number = q[3];

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

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the given axis.
   * @param r The angle in radians.
   * @param v The axis.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotation(r: number, v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    let x: number = v[0];
    let y: number = v[1];
    let z: number = v[2];

    const len: number = 1 / Math.hypot(x, y, z);

    x *= len;
    y *= len;
    z *= len;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);
    const t: number = 1 - c;

    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion and translates by the given vector.
   * @param q The quaternion.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslation(q: Numbers1x4, v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    const x: number = q[0];
    const y: number = q[1];
    const z: number = q[2];
    const w: number = q[3];

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

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion, translates by the given vector, and scales by the given vector.
   * @param q The quaternion.
   * @param v The translation vector.
   * @param s The scaling vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslationScale(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    const x: number = q[0];
    const y: number = q[1];
    const z: number = q[2];
    const w: number = q[3];

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

    const sx: number = s[0];
    const sy: number = s[1];
    const sz: number = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion about the given origin, translates by the given vector, and scales by the given vector about the given origin.
   * @param q The quaternion.
   * @param v The translation vector.
   * @param s The scaling vector.
   * @param o The origin.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotationTranslationScaleOrigin(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3, o: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    const x: number = q[0];
    const y: number = q[1];
    const z: number = q[2];
    const w: number = q[3];

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

    const sx: number = s[0];
    const sy: number = s[1];
    const sz: number = s[2];

    const ox: number = o[0];
    const oy: number = o[1];
    const oz: number = o[2];

    const out0: number = (1 - (yy + zz)) * sx;
    const out1: number = (xy + wz) * sx;
    const out2: number = (xz - wy) * sx;
    const out4: number = (xy - wz) * sy;
    const out5: number = (1 - (xx + zz)) * sy;
    const out6: number = (yz + wx) * sy;
    const out8: number = (xz + wy) * sz;
    const out9: number = (yz - wx) * sz;
    const out10: number = (1 - (xx + yy)) * sz;

    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromScaling(v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that translates a matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromTranslation(v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the horizontal axis.
   * @param r The angle in radians.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromXRotation(r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the vertical axis.
   * @param r The angle in radians.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromYRotation(r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle around the depth axis.
   * @param r The angle in radians.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromZRotation(r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Generates a frustum matrix with the given bounds.
   * @param left The left bound of the frustum.
   * @param right The right bound of the frustum.
   * @param bottom The bottom bound of the frustum.
   * @param top The top bound of the frustum.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @param out The matrix that will store the frustum matrix.
   * @returns The frustum matrix.
   */
  public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const rl: number = 1 / (right - left);
    const tb: number = 1 / (top - bottom);
    const nf: number = 1 / (near - far);

    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;

    return out;
  }

  /**
   * Gets the rotation quaternion component of a transformation matrix.
   * @param m The transformation matrix.
   * @param out The quaternion to store the rotation quaternion in.
   * @returns The rotation quaternion.
   */
  public static getRotation(m: Matrix4, out: Quaternion = new Quaternion()): Quaternion {
    const scaling: Vector3 = Matrix4.getScaling(m);

    const is1: number = 1 / (scaling[0] as number);
    const is2: number = 1 / (scaling[1] as number);
    const is3: number = 1 / (scaling[2] as number);

    const sm00: number = (m[0] as number) * is1;
    const sm01: number = (m[1] as number) * is2;
    const sm02: number = (m[2] as number) * is3;
    const sm10: number = (m[4] as number) * is1;
    const sm11: number = (m[5] as number) * is2;
    const sm12: number = (m[6] as number) * is3;
    const sm20: number = (m[8] as number) * is1;
    const sm21: number = (m[9] as number) * is2;
    const sm22: number = (m[10] as number) * is3;

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
   * The scaling vector component of this transformation matrix.
   * @param out The vector to store the scaling vector in.
   * @returns The scaling vector.
   */
  public getRotation(out: Quaternion = new Quaternion()): Quaternion {
    return Matrix4.getRotation(this, out);
  }

  /**
   * Gets the scaling vector component of a transformation matrix.
   * @param m The transformation matrix.
   * @param out The vector to store the scaling vector in.
   * @returns The scaling vector.
   */
  public static getScaling(m: Matrix4, out: Vector3 = new Vector3()): Vector3 {
    out[0] = Math.hypot(m[0] as number, m[1] as number, m[2] as number);
    out[1] = Math.hypot(m[4] as number, m[5] as number, m[6] as number);
    out[2] = Math.hypot(m[8] as number, m[9] as number, m[10] as number);

    return out;
  }

  /**
   * The scaling vector component of this transformation matrix.
   * @param out The vector to store the scaling vector in.
   * @returns The scaling vector.
   */
  public getScaling(out: Vector3 = new Vector3()): Vector3 {
    return Matrix4.getScaling(this, out);
  }

  /**
   * Gets the translation vector component of a transformation matrix.
   * @param m The transformation matrix.
   * @param out The vector to store the translation vector in.
   * @returns The translation vector.
   */
  public static getTranslation(m: Matrix4, out: Vector3 = new Vector3()): Vector3 {
    out[0] = m[12] as number;
    out[1] = m[13] as number;
    out[2] = m[14] as number;

    return out;
  }

  /**
   * The translation vector component of this transformation matrix.
   * @param out The vector to store the translation vector in.
   * @returns The translation vector.
   */
  public getTranslation(out: Vector3 = new Vector3()): Vector3 {
    return Matrix4.getTranslation(this, out);
  }

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static override identity(m: Matrix4): Matrix4 {
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;

    return m;
  }

  /**
   * Sets this matrix to the identity.
   * @returns This matrix.
   */
  public override identity(): this {
    return Matrix4.identity(this) as this;
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static override invert(m: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
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

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }

  /**
   * Inverts this matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public override invert(out: Matrix4 = this): Matrix4 {
    return Matrix4.invert(this, out);
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * @param eye The position of the viewer.
   * @param center The focal point.
   * @param up The up axis.
   * @param out The matrix to store the look-at matrix in.
   * @returns The look-at matrix.
   */
  public static lookAt(eye: Numbers1x3, center: Numbers1x3, up: Numbers1x3 = [0, 1, 0], out: Matrix4 = new Matrix4()): Matrix4 {
    const eyex: number = eye[0];
    const eyey: number = eye[1];
    const eyez: number = eye[2];

    const centerx: number = center[0];
    const centery: number = center[1];
    const centerz: number = center[2];

    const upx: number = up[0];
    const upy: number = up[1];
    const upz: number = up[2];

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

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
  }

  /**
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiply(a: Matrix4, b: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
    const a00: number = a[0] as number;
    const a01: number = a[1] as number;
    const a02: number = a[2] as number;
    const a03: number = a[3] as number;
    const a10: number = a[4] as number;
    const a11: number = a[5] as number;
    const a12: number = a[6] as number;
    const a13: number = a[7] as number;
    const a20: number = a[8] as number;
    const a21: number = a[9] as number;
    const a22: number = a[10] as number;
    const a23: number = a[11] as number;
    const a30: number = a[12] as number;
    const a31: number = a[13] as number;
    const a32: number = a[14] as number;
    const a33: number = a[15] as number;

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

    out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return out;
  }

  /**
   * Multiplies this matrix by another.
   * @param m The other matrix.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiply(m: Matrix4, out: Matrix4 = this): Matrix4 {
    return Matrix4.multiply(this, m, out);
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiplyScalar(m: Matrix4, s: number, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = (m[0] as number) * s;
    out[1] = (m[1] as number) * s;
    out[2] = (m[2] as number) * s;
    out[3] = (m[3] as number) * s;
    out[4] = (m[4] as number) * s;
    out[5] = (m[5] as number) * s;
    out[6] = (m[6] as number) * s;
    out[7] = (m[7] as number) * s;
    out[8] = (m[8] as number) * s;
    out[9] = (m[9] as number) * s;
    out[10] = (m[10] as number) * s;
    out[11] = (m[11] as number) * s;
    out[12] = (m[12] as number) * s;
    out[13] = (m[13] as number) * s;
    out[14] = (m[14] as number) * s;
    out[15] = (m[15] as number) * s;

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiplyScalar(s: number, out: Matrix4 = this): Matrix4 {
    return Matrix4.multiplyScalar(this, s, out);
  }

  /**
   * Generates an orthogonal projection matrix with the given bounds.
   * @param left The left bound of the frustum.
   * @param right The right bound of the frustum.
   * @param bottom The bottom bound of the frustum.
   * @param top The top bound of the frustum.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @param out The matrix that will store the orthogonal projection matrix.
   * @returns The orthogonal projection matrix.
   */
  public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const lr: number = 1 / (left - right);
    const bt: number = 1 / (bottom - top);
    const nf: number = 1 / (near - far);

    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;

    return out;
  }

  /**
   * Generates a perspective projection matrix with the given bounds.
   * @param fovy The vertical field of view in radians.
   * @param aspect The aspect ratio.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @param out The matrix that will store the perspective projection matrix.
   * @returns The perspective projection matrix.
   */
  public static perspective(fovy: number, aspect: number, near: number, far?: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const f: number = 1 / Math.tan(fovy / 2);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = -1;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = -2 * near;
    out[15] = 0;

    if (far) {
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
   * @param out The matrix that will store the perspective projection matrix.
   * @returns The perspective projection matrix.
   */
  public static perspectiveFromFieldOfView(up: number, down: number, left: number, right: number, near: number, far: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const upTan: number = Math.tan(up);
    const downTan: number = Math.tan(down);
    const leftTan: number = Math.tan(left);
    const rightTan: number = Math.tan(right);

    const xScale: number = 2 / (leftTan + rightTan);
    const yScale: number = 2 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale / 2);
    out[9] = (upTan - downTan) * yScale / 2;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near) / (near - far);
    out[15] = 0;

    return out;
  }

  /**
   * Rotates a matrix by the given angle around the given axis.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param v The axis.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotate(m: Matrix4, r: number, v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
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

    let x: number = v[0];
    let y: number = v[1];
    let z: number = v[2];

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

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    out[12] = m[12] as number;
    out[13] = m[13] as number;
    out[14] = m[14] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Rotates this matrix by the given angle about the given axis.
   * @param r The angle in radians.
   * @param v The axis.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public rotate(r: number, v: Numbers1x3, out: Matrix4 = this): Matrix4 {
    return Matrix4.rotate(this, r, v, out);
  }

  /**
   * Rotates a matrix by the given angle around the horizontal axis.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotateX(m: Matrix4, r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const a10: number = m[4] as number;
    const a11: number = m[5] as number;
    const a12: number = m[6] as number;
    const a13: number = m[7] as number;
    const a20: number = m[8] as number;
    const a21: number = m[9] as number;
    const a22: number = m[10] as number;
    const a23: number = m[11] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = m[0] as number;
    out[1] = m[1] as number;
    out[2] = m[2] as number;
    out[3] = m[3] as number;
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    out[12] = m[12] as number;
    out[13] = m[13] as number;
    out[14] = m[14] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Rotates this matrix by the given angle about the horizontal axis.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public rotateX(r: number, out: Matrix4 = this): Matrix4 {
    return Matrix4.rotateX(this, r, out);
  }

  /**
   * Rotates a matrix by the given angle around the vertical axis.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotateY(m: Matrix4, r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a03: number = m[3] as number;
    const a20: number = m[8] as number;
    const a21: number = m[9] as number;
    const a22: number = m[10] as number;
    const a23: number = m[11] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[4] = m[4] as number;
    out[5] = m[5] as number;
    out[6] = m[6] as number;
    out[7] = m[7] as number;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    out[12] = m[12] as number;
    out[13] = m[13] as number;
    out[14] = m[14] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Rotates this matrix by the given angle about the vertical axis.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public rotateY(r: number, out: Matrix4 = this): Matrix4 {
    return Matrix4.rotateY(this, r, out);
  }

  /**
   * Rotates a matrix by the given angle around the depth axis.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotateZ(m: Matrix4, r: number, out: Matrix4 = new Matrix4()): Matrix4 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a03: number = m[3] as number;
    const a10: number = m[4] as number;
    const a11: number = m[5] as number;
    const a12: number = m[6] as number;
    const a13: number = m[7] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    out[8] = m[8] as number;
    out[9] = m[9] as number;
    out[10] = m[10] as number;
    out[11] = m[11] as number;
    out[12] = m[12] as number;
    out[13] = m[13] as number;
    out[14] = m[14] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Rotates this matrix by the given angle about the depth axis.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public rotateZ(r: number, out: Matrix4 = this): Matrix4 {
    return Matrix4.rotateZ(this, r, out);
  }

  /**
   * Scales a matrix by the given vector.
   * @param m The matrix.
   * @param v The vector.
   * @param out The matrix to store the scaled matrix in.
   * @returns The scaled matrix.
   */
  public static scale(m: Matrix4, v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
    const x: number = v[0];
    const y: number = v[1];
    const z: number = v[2];

    out[0] = (m[0] as number) * x;
    out[1] = (m[1] as number) * x;
    out[2] = (m[2] as number) * x;
    out[3] = (m[3] as number) * x;
    out[4] = (m[4] as number) * y;
    out[5] = (m[5] as number) * y;
    out[6] = (m[6] as number) * y;
    out[7] = (m[7] as number) * y;
    out[8] = (m[8] as number) * z;
    out[9] = (m[9] as number) * z;
    out[10] = (m[10] as number) * z;
    out[11] = (m[11] as number) * z;
    out[12] = m[12] as number;
    out[13] = m[13] as number;
    out[14] = m[14] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Scales this matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the scaled matrix in.
   * @returns The scaled matrix.
   */
  public scale(v: Numbers1x3, out: Matrix4 = this): Matrix4 {
    return Matrix4.scale(this, v, out);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static override subtract(a: Matrix4, b: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = (a[0] as number) - (b[0] as number);
    out[1] = (a[1] as number) - (b[1] as number);
    out[2] = (a[2] as number) - (b[2] as number);
    out[3] = (a[3] as number) - (b[3] as number);
    out[4] = (a[4] as number) - (b[4] as number);
    out[5] = (a[5] as number) - (b[5] as number);
    out[6] = (a[6] as number) - (b[6] as number);
    out[7] = (a[7] as number) - (b[7] as number);
    out[8] = (a[8] as number) - (b[8] as number);
    out[9] = (a[9] as number) - (b[9] as number);
    out[10] = (a[10] as number) - (b[10] as number);
    out[11] = (a[11] as number) - (b[11] as number);
    out[12] = (a[12] as number) - (b[12] as number);
    out[13] = (a[13] as number) - (b[13] as number);
    out[14] = (a[14] as number) - (b[14] as number);
    out[15] = (a[15] as number) - (b[15] as number);

    return out;
  }

  /**
   * Subtracts another matrix from this one.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public override subtract(m: Matrix4, out: Matrix4 = this): Matrix4 {
    return Matrix4.subtract(this, m, out);
  }

  /**
   * Generates a matrix that makes a transformation matrix point towards a point.
   * @param eye The position of the viewer.
   * @param target The focal point.
   * @param up The up axis.
   * @param out The matrix to store the look-at matrix in.
   * @returns The matrix.
   */
  public static targetTo(eye: Numbers1x3, target: Numbers1x3, up: Numbers1x3 = [0, 1, 0], out: Matrix4 = new Matrix4()): Matrix4 {
    const eyex: number = eye[0];
    const eyey: number = eye[1];
    const eyez: number = eye[2];

    const upx: number = up[0];
    const upy: number = up[1];
    const upz: number = up[2];

    let z0: number = eyex - target[0];
    let z1: number = eyey - target[1];
    let z2: number = eyez - target[2];

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

    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    
    return out;
  }

  /**
   * Translates a matrix by the given vector.
   * @param m The matrix.
   * @param v The vector.
   * @param out The matrix to store the translated matrix in.
   * @returns The translated matrix.
   */
  public static translate(m: Matrix4, v: Numbers1x3, out: Matrix4 = new Matrix4()): Matrix4 {
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

    const x: number = v[0];
    const y: number = v[1];
    const z: number = v[2];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + (m[12] as number);
    out[13] = a01 * x + a11 * y + a21 * z + (m[13] as number);
    out[14] = a02 * x + a12 * y + a22 * z + (m[14] as number);
    out[15] = a03 * x + a13 * y + a23 * z + (m[15] as number);

    return out;
  }

  /**
   * Translates this matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the translated matrix in.
   * @returns The translated matrix.
   */
  public translate(v: Numbers1x3, out: Matrix4 = this): Matrix4 {
    return Matrix4.translate(this, v, out);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static override transpose(m: Matrix4, out: Matrix4 = new Matrix4()): Matrix4 {
    out[0] = m[0] as number;
    out[1] = m[4] as number;
    out[2] = m[8] as number;
    out[3] = m[12] as number;
    out[4] = m[1] as number;
    out[5] = m[5] as number;
    out[6] = m[9] as number;
    out[7] = m[13] as number;
    out[8] = m[2] as number;
    out[9] = m[6] as number;
    out[10] = m[10] as number;
    out[11] = m[14] as number;
    out[12] = m[3] as number;
    out[13] = m[7] as number;
    out[14] = m[11] as number;
    out[15] = m[15] as number;

    return out;
  }

  /**
   * Transposes this matrix.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public override transpose(out: Matrix4 = this): Matrix4 {
    return Matrix4.transpose(this, out);
  }
}
