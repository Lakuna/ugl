import { Matrix } from "./Matrix.js";

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
