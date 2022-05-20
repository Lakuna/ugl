import { SquareMatrix } from "./SquareMatrix.js";
import { Numbers1x2, Numbers1x4, Numbers4x4 } from "../types/Numbers.js";

/** A collection of numbers arranged in three columns and three rows. */
export class Matrix3 extends SquareMatrix {
  /** Creates a 3x3 identity matrix. */
  public constructor();

  /**
   * Creates a 3x3 matrix with the given values.
   * @param c1r1 The value in the first column and first row.
   * @param c1r2 The value in the first column and second row.
   * @param c1r3 The value in the first column and third row.
   * @param c2r1 The value in the second column and first row.
   * @param c2r2 The value in the second column and second row.
   * @param c2r3 The value in the second column and third row.
   * @param c3r1 The value in the third column and first row.
   * @param c3r2 The value in the third column and second row.
   * @param c3r3 The value in the third column and third row.
   */
  public constructor(c1r1: number, c1r2: number, c1r3: number, c2r1: number, c2r2: number, c2r3: number, c3r1: number, c3r2: number, c3r3: number);

  public constructor(c1r1 = 1, c1r2 = 0, c1r3 = 0, c2r1 = 0, c2r2 = 1, c2r3 = 0, c3r1 = 0, c3r2 = 0, c3r3 = 1) {
    super(c1r1, c1r2, c1r3, c2r1, c2r2, c2r3, c3r1, c3r2, c3r3);
  }

  /**
   * Adds two matrices together.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public static override add(a: Matrix3, b: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = (a[0] as number) + (b[0] as number);
    out[1] = (a[1] as number) + (b[1] as number);
    out[2] = (a[2] as number) + (b[2] as number);
    out[3] = (a[3] as number) + (b[3] as number);
    out[4] = (a[4] as number) + (b[4] as number);
    out[5] = (a[5] as number) + (b[5] as number);
    out[6] = (a[6] as number) + (b[6] as number);
    out[7] = (a[7] as number) + (b[7] as number);
    out[8] = (a[8] as number) + (b[8] as number);

    return out;
  }

  /**
   * Adds another matrix to this one.
   * @param m The matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public override add(m: Matrix3, out: Matrix3 = this): Matrix3 {
    return Matrix3.add(this, m, out);
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static override adjoint(m: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a10: number = m[3] as number;
    const a11: number = m[4] as number;
    const a12: number = m[5] as number;
    const a20: number = m[6] as number;
    const a21: number = m[7] as number;
    const a22: number = m[8] as number;

    out[0] = a11 * a22 - a12 * a21;
    out[1] = a02 * a21 - a01 * a22;
    out[2] = a01 * a12 - a02 * a11;
    out[3] = a12 * a20 - a10 * a22;
    out[4] = a00 * a22 - a02 * a20;
    out[5] = a02 * a10 - a00 * a12;
    out[6] = a10 * a21 - a11 * a20;
    out[7] = a01 * a20 - a00 * a21;
    out[8] = a00 * a11 - a01 * a10;

    return out;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public override adjoint(out: Matrix3 = this): Matrix3 {
    return Matrix3.adjoint(this, out);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public override clone(): Matrix3 {
    return new Matrix3(this[0] as number, this[1] as number, this[2] as number, this[3] as number, this[4] as number, this[5] as number, this[6] as number, this[7] as number, this[8] as number);
  }

  /**
   * Copies the values in a matrix to another.
   * @param src The source matrix.
   * @param dst The destination matrix.
   * @returns The destination matrix.
   */
  public static override copy(src: Matrix3, dst: Matrix3): Matrix3 {
    dst[0] = src[0] as number;
    dst[1] = src[1] as number;
    dst[2] = src[2] as number;
    dst[3] = src[3] as number;
    dst[4] = src[4] as number;
    dst[5] = src[5] as number;
    dst[6] = src[6] as number;
    dst[7] = src[7] as number;
    dst[8] = src[8] as number;

    return dst;
  }

  /**
   * Copies the values in another matrix to this one.
   * @param src The source matrix.
   * @returns This matrix.
   */
  public override copy(src: Matrix3): Matrix3 {
    return Matrix3.copy(src, this);
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static override cofactor(m: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = m.minor(0, 0);
    out[1] = -m.minor(0, 1);
    out[2] = m.minor(0, 2);
    out[3] = -m.minor(1, 0);
    out[4] = m.minor(1, 1);
    out[5] = -m.minor(1, 2);
    out[6] = m.minor(2, 0);
    out[7] = -m.minor(2, 1);
    out[8] = m.minor(2, 2);

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public override cofactor(out: Matrix3 = this): Matrix3 {
    return Matrix3.cofactor(this, out);
  }

  /**
   * Calculates the determinant of a matrix.
   * @param m The matrix.
   * @returns The determinant.
   */
  public static override determinant(m: Matrix3): number {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a10: number = m[3] as number;
    const a11: number = m[4] as number;
    const a12: number = m[5] as number;
    const a20: number = m[6] as number;
    const a21: number = m[7] as number;
    const a22: number = m[8] as number;

    return a00 * (a22 * a11 - a12 * a21) +
      a01 * (-a22 * a10 + a12 * a20) +
      a02 * (a21 * a10 - a11 * a20);
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
    return Matrix3.determinant(this);
  }

  /**
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @returns Whether the matrices are equivalent.
   */
  public static override equals(a: Matrix3, b: Matrix3): boolean {
    return a[0] == b[0]
      && a[1] == b[1]
      && a[2] == b[2]
      && a[3] == b[3]
      && a[4] == b[4]
      && a[5] == b[5]
      && a[6] == b[6]
      && a[7] == b[7]
      && a[8] == b[8];
  }

  /**
   * Determines whether this matrix is equivalent to another.
   * @param m The other matrix.
   * @returns Whether the matrices are equivalent.
   */
  public override equals(m: Matrix3): boolean {
    return Matrix3.equals(this, m);
  }

  /**
   * Calculates the Frobenius norm of a matrix.
   * @param m The matrix.
   * @returns The Frobenius norm.
   */
  public static override frob(m: Matrix3): number {
    return Math.hypot(m[0] as number, m[1] as number, m[2] as number, m[3] as number, m[4] as number, m[5] as number, m[6] as number, m[7] as number, m[8] as number);
  }

  /** The Frobenius norm of this matrix. */
  public override get frob(): number {
    return Matrix3.frob(this);
  }

  /**
   * Creates a 3x3 matrix from the upper-left values of a 4x4 matrix.
   * @param m The 4x4 matrix.
   * @param out The matrix to store the 3x3 matrix in.
   * @returns The 3x3 matrix.
   */
  public static fromMatrix4(m: Numbers4x4, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[4];
    out[4] = m[5];
    out[5] = m[6];
    out[6] = m[8];
    out[7] = m[9];
    out[8] = m[10];

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion.
   * @param q The quaternion.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromQuaternion(q: Numbers1x4, out: Matrix3 = new Matrix3()): Matrix3 {
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
    out[3] = yx - wz;
    out[4] = 1 - xx - zz;
    out[5] = zy + wx;
    out[6] = zx + wy;
    out[7] = zy - wx;
    out[8] = 1 - xx - yy;

    return out;
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle.
   * @param r The angle in radians.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotation(r: number, out: Matrix3 = new Matrix3()): Matrix3 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = -s;
    out[4] = c;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromScaling(v: Numbers1x2, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;

    return out;
  }

  /**
   * Creates a transformation matrix that translates a matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromTranslation(v: Numbers1x2, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;

    return out;
  }

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static override identity(m: Matrix3): Matrix3 {
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 1;
    m[5] = 0;
    m[6] = 0;
    m[7] = 0;
    m[8] = 1;

    return m;
  }

  /**
   * Sets this matrix to the identity.
   * @returns This matrix.
   */
  public override identity(): Matrix3 {
    return Matrix3.identity(this);
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static override invert(m: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a10: number = m[3] as number;
    const a11: number = m[4] as number;
    const a12: number = m[5] as number;
    const a20: number = m[6] as number;
    const a21: number = m[7] as number;
    const a22: number = m[8] as number;

    const b01: number = a22 * a11 - a12 * a21;
    const b11: number = -a22 * a10 + a12 * a20;
    const b21: number = a21 * a10 - a11 * a20;

    const det: number = 1 / (a00 * b01 + a01 * b11 + a02 * b21);

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;

    return out;
  }

  /**
   * Inverts this matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public override invert(out: Matrix3 = this): Matrix3 {
    return Matrix3.invert(this, out);
  }

  /**
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiply(a: Matrix3, b: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = a[0] as number;
    const a01: number = a[1] as number;
    const a02: number = a[2] as number;
    const a10: number = a[3] as number;
    const a11: number = a[4] as number;
    const a12: number = a[5] as number;
    const a20: number = a[6] as number;
    const a21: number = a[7] as number;
    const a22: number = a[8] as number;

    const b00: number = b[0] as number;
    const b01: number = b[1] as number;
    const b02: number = b[2] as number;
    const b10: number = b[3] as number;
    const b11: number = b[4] as number;
    const b12: number = b[5] as number;
    const b20: number = b[6] as number;
    const b21: number = b[7] as number;
    const b22: number = b[8] as number;

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return out;
  }

  /**
   * Multiplies this matrix by another.
   * @param m The other matrix.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiply(m: Matrix3, out: Matrix3 = this): Matrix3 {
    return Matrix3.multiply(this, m, out);
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiplyScalar(m: Matrix3, s: number, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = (m[0] as number) * s;
    out[1] = (m[1] as number) * s;
    out[2] = (m[2] as number) * s;
    out[3] = (m[3] as number) * s;
    out[4] = (m[4] as number) * s;
    out[5] = (m[5] as number) * s;
    out[6] = (m[6] as number) * s;
    out[7] = (m[7] as number) * s;
    out[8] = (m[8] as number) * s;

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiplyScalar(s: number, out: Matrix3 = this): Matrix3 {
    return Matrix3.multiplyScalar(this, s, out);
  }

  /**
   * Calculates a 3x3 normal (transposed inverse) matrix from a 4x4 matrix.
   * @param m The 4x4 matrix.
   * @param out The matrix to store the 3x3 matrix in.
   * @returns The 3x3 matrix.
   */
  public static normalFromMatrix4(m: Numbers4x4, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = m[0];
    const a01: number = m[1];
    const a02: number = m[2];
    const a03: number = m[3];
    const a10: number = m[4];
    const a11: number = m[5];
    const a12: number = m[6];
    const a13: number = m[7];
    const a20: number = m[8];
    const a21: number = m[9];
    const a22: number = m[10];
    const a23: number = m[11];
    const a30: number = m[12];
    const a31: number = m[13];
    const a32: number = m[14];
    const a33: number = m[15];

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
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
  }

  /**
   * Generates a two-dimensional projection matrix with the given bounds.
   * @param width The width of the rendering context.
   * @param height The height of the rendering context.
   * @param out The matrix that will store the projection matrix.
   * @returns The projection matrix.
   */
  public static projection(width: number, height: number, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;

    return out;
  }

  /**
   * Rotates a matrix by the given angle.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotate(m: Matrix3, r: number, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a10: number = m[3] as number;
    const a11: number = m[4] as number;
    const a12: number = m[5] as number;
    const a20: number = m[6] as number;
    const a21: number = m[7] as number;
    const a22: number = m[8] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;

    return out;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public rotate(r: number, out: Matrix3 = this): Matrix3 {
    return Matrix3.rotate(this, r, out);
  }

  /**
   * Scales a matrix by the given vector.
   * @param m The matrix.
   * @param v The vector.
   * @param out The matrix to store the scaled matrix in.
   * @returns The scaled matrix.
   */
  public static scale(m: Matrix3, v: Numbers1x2, out: Matrix3 = new Matrix3()): Matrix3 {
    const x: number = v[0];
    const y: number = v[1];

    out[0] = (m[0] as number) * x;
    out[1] = (m[1] as number) * x;
    out[2] = (m[2] as number) * x;
    out[3] = (m[3] as number) * y;
    out[4] = (m[4] as number) * y;
    out[5] = (m[5] as number) * y;
    out[6] = (m[6] as number);
    out[7] = (m[7] as number);
    out[8] = (m[8] as number);

    return out;
  }

  /**
   * Scales this matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the scaled matrix in.
   * @returns The scaled matrix.
   */
  public scale(v: Numbers1x2, out: Matrix3 = this): Matrix3 {
    return Matrix3.scale(this, v, out);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static override subtract(a: Matrix3, b: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = (a[0] as number) - (b[0] as number);
    out[1] = (a[1] as number) - (b[1] as number);
    out[2] = (a[2] as number) - (b[2] as number);
    out[3] = (a[3] as number) - (b[3] as number);
    out[4] = (a[4] as number) - (b[4] as number);
    out[5] = (a[5] as number) - (b[5] as number);
    out[6] = (a[6] as number) - (b[6] as number);
    out[7] = (a[7] as number) - (b[7] as number);
    out[8] = (a[8] as number) - (b[8] as number);

    return out;
  }

  /**
   * Subtracts another matrix from this one.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public override subtract(m: Matrix3, out: Matrix3 = this): Matrix3 {
    return Matrix3.subtract(this, m, out);
  }

  /**
   * Translates a matrix by the given vector.
   * @param m The matrix.
   * @param v The vector.
   * @param out The matrix to store the translated matrix in.
   * @returns The translated matrix.
   */
  public static translate(m: Matrix3, v: Numbers1x2, out: Matrix3 = new Matrix3()): Matrix3 {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a02: number = m[2] as number;
    const a10: number = m[3] as number;
    const a11: number = m[4] as number;
    const a12: number = m[5] as number;
    const a20: number = m[6] as number;
    const a21: number = m[7] as number;
    const a22: number = m[8] as number;

    const x: number = v[0];
    const y: number = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;

    return out;
  }

  /**
   * Translates this matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the translated matrix in.
   * @returns The translated matrix.
   */
  public translate(v: Numbers1x2, out: Matrix3 = this): Matrix3 {
    return Matrix3.translate(this, v, out);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static override transpose(m: Matrix3, out: Matrix3 = new Matrix3()): Matrix3 {
    out[0] = m[0] as number;
    out[1] = m[3] as number;
    out[2] = m[6] as number;
    out[3] = m[1] as number;
    out[4] = m[4] as number;
    out[5] = m[7] as number;
    out[6] = m[2] as number;
    out[7] = m[5] as number;
    out[8] = m[8] as number;

    return out;
  }

  /**
   * Transposes this matrix.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public override transpose(out: Matrix3 = this): Matrix3 {
    return Matrix3.transpose(this, out);
  }
}
