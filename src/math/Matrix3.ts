import { SquareMatrix } from "./SquareMatrix.js";
import { Matrix4 } from "./Matrix4.js";
import { Quaternion } from "./Quaternion.js";
import { Vector2 } from "./Vector2.js";

/** A collection of numbers arranged in three columns and three rows. */
export class Matrix3 extends SquareMatrix {
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
  public constructor(c1r1 = 1, c1r2 = 0, c1r3 = 0, c2r1 = 0, c2r2 = 1, c2r3 = 0, c3r1 = 0, c3r2 = 0, c3r3 = 1) {
    super(3);
    this[0] = c1r1;
    this[1] = c1r2;
    this[2] = c1r3;
    this[3] = c2r1;
    this[4] = c2r2;
    this[5] = c2r3;
    this[6] = c3r1;
    this[7] = c3r2;
    this[8] = c3r3;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public override adjoint(): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    this[0] = a11 * a22 - a12 * a21;
    this[1] = a02 * a21 - a01 * a22;
    this[2] = a01 * a12 - a02 * a11;
    this[3] = a12 * a20 - a10 * a22;
    this[4] = a00 * a22 - a02 * a20;
    this[5] = a02 * a10 - a00 * a12;
    this[6] = a10 * a21 - a11 * a20;
    this[7] = a01 * a20 - a00 * a21;
    this[8] = a00 * a11 - a01 * a10;

    return this;
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Matrix3 {
    return new Matrix3(...(this as ArrayLike<number> as [number, number, number, number, number, number, number, number, number]));
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    return a00 * (a22 * a11 - a12 * a21) +
      a01 * (-a22 * a10 + a12 * a20) +
      a02 * (a21 * a10 - a11 * a20);
  }

  /**
   * Creates a 3x3 matrix from the upper-left values of a 4x4 matrix.
   * @param m The 4x4 matrix.
   * @returns The 3x3 matrix.
   */
  public static fromMatrix4(m: Matrix4): Matrix3 {
    return new Matrix3(
      m[0] as number, m[1] as number, m[2] as number,
      m[4] as number, m[5] as number, m[6] as number,
      m[8] as number, m[9] as number, m[10] as number
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given quaternion.
   * @param q The quaternion.
   * @returns The transformation matrix.
   */
  public static fromQuaternion(q: Quaternion): Matrix3 {
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
      1 - yy - zz, yx + wz, zx - wy,
      yx - wz, 1 - xx - zz, zy + wx,
      zx + wy, zy - wx, 1 - xx - yy
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle.
   * @param r The angle in radians.
   * @returns The transformation matrix.
   */
  public static fromRotation(r: number): Matrix3 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param v The vector.
   * @returns The transformation matrix.
   */
  public static fromScaling(v: Vector2): Matrix3 {
    return new Matrix3(
      v[0] as number, 0, 0,
      0, v[1] as number, 0,
      0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that translates a matrix by the given vector.
   * @param v The vector.
   * @returns The transformation matrix.
   */
  public static fromTranslation(v: Vector2): Matrix3 {
    return new Matrix3(
      1, 0, 0,
      0, 1, 0,
      v[0] as number, v[1] as number, 1
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

    this[0] = b01 * det;
    this[1] = (-a22 * a01 + a02 * a21) * det;
    this[2] = (a12 * a01 - a02 * a11) * det;
    this[3] = b11 * det;
    this[4] = (a22 * a00 - a02 * a20) * det;
    this[5] = (-a12 * a00 + a02 * a10) * det;
    this[6] = b21 * det;
    this[7] = (-a21 * a00 + a01 * a20) * det;
    this[8] = (a11 * a00 - a01 * a10) * det;

    return this;
  }

  /**
   * Multiplies this matrix by another.
   * @param b The other matrix.
   * @returns The product.
   */
  public override multiply(b: Matrix3): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    const b00: number = b[0] as number;
    const b01: number = b[1] as number;
    const b02: number = b[2] as number;
    const b10: number = b[3] as number;
    const b11: number = b[4] as number;
    const b12: number = b[5] as number;
    const b20: number = b[6] as number;
    const b21: number = b[7] as number;
    const b22: number = b[8] as number;

    this[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22;
    this[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this[5] = b10 * a02 + b11 * a12 + b12 * a22;
    this[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return this;
  }

  /**
   * Calculates a 3x3 normal (transposed inverse) matrix from a 4x4 matrix.
   * @param m The 4x4 matrix.
   * @returns The 3x3 matrix.
   */
  public static normalFromMatrix4(m: Matrix4): Matrix3 {
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
      (a30 * b04 - a31 * b02 + a33 * b00) * det
    );
  }

  /**
   * Generates a two-dimensional projection matrix with the given bounds.
   * @param width The width of the rendering context.
   * @param height The height of the rendering context.
   * @returns The projection matrix.
   */
  public static projection(width: number, height: number): Matrix3 {
    return new Matrix3(
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    );
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotate(r: number): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    this[0] = c * a00 + s * a10;
    this[1] = c * a01 + s * a11;
    this[2] = c * a02 + s * a12;
    this[3] = c * a10 - s * a00;
    this[4] = c * a11 - s * a01;
    this[5] = c * a12 - s * a02;

    return this;
  }

  /**
   * Scales this matrix by the given vector.
   * @param v The vector.
   * @returns The scaled matrix.
   */
  public scale(v: Vector2): this {
    const x: number = v[0] as number;
    const y: number = v[1] as number;

    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= y;
    this[4] *= y;
    this[5] *= y;

    return this;
  }

  /**
   * Translates this matrix by the given vector.
   * @param v The vector.
   * @returns The translated matrix.
   */
  public translate(v: Vector2): this {
    const x: number = v[0] as number;
    const y: number = v[1] as number;

    this[6] = x * (this[0] as number) + y * (this[3] as number) + (this[6] as number);
    this[7] = x * (this[1] as number) + y * (this[4] as number) + (this[7] as number);
    this[8] = x * (this[2] as number) + y * (this[5] as number) + (this[8] as number);

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public override transpose(): this {
    [this[1], this[3]] = [this[3] as number, this[1] as number];
    [this[2], this[6]] = [this[6] as number, this[2] as number];
    [this[5], this[7]] = [this[7] as number, this[5] as number];

    return this;
  }
}
