import { SquareMatrix } from "./SquareMatrix.js";
import { Numbers1x2 } from "../types/Numbers.js";

/** A collection of numbers arranged in two columns and two rows. */
export class Matrix2 extends SquareMatrix {
  /**
   * Creates a 2x2 matrix with the given values.
   * @param c1r1 The value in the first column and first row.
   * @param c1r2 The value in the first column and second row.
   * @param c2r1 The value in the second column and first row.
   * @param c2r2 The value in the second column and second row.
   */
  public constructor(c1r1 = 1, c1r2 = 0, c2r1 = 0, c2r2 = 1) {
    super(c1r1, c1r2, c2r1, c2r2);
  }

  /**
   * Adds two matrices together.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public static add2<T extends Matrix2>(a: Matrix2, b: Matrix2, out: T): T {
    out[0] = (a[0] as number) + (b[0] as number);
    out[1] = (a[1] as number) + (b[1] as number);
    out[2] = (a[2] as number) + (b[2] as number);
    out[3] = (a[3] as number) + (b[3] as number);

    return out;
  }

  /**
   * Adds another matrix to this one.
   * @param m The matrix.
   * @returns The sum.
   */
  public override add(m: Matrix2): this {
    return Matrix2.add2(this, m, this);
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static adjoint2<T extends Matrix2>(m: Matrix2, out: T): T {
    out[0] = m[3] as number;
    out[1] = -(m[1] as number);
    out[2] = -(m[2] as number);
    out[3] = m[0] as number;

    return out;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public override adjoint(): this {
    return Matrix2.adjoint2(this, this);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public override clone(): Matrix2 {
    return new Matrix2(this[0] as number, this[1] as number, this[2] as number, this[3] as number);
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static cofactor2<T extends Matrix2>(m: Matrix2, out: T): T {
    out[0] = m[3] as number;
    out[1] = -(m[1] as number);
    out[2] = m[2] as number;
    out[3] = -(m[0] as number);

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @returns The cofactor.
   */
  public override cofactor(): this {
    return Matrix2.cofactor2(this, this);
  }

  /**
   * Calculates the determinant of a matrix.
   * @param m The matrix.
   * @returns The determinant.
   */
  public static determinant2(m: Matrix2): number {
    return (m[0] as number) * (m[3] as number) - (m[2] as number) * (m[1] as number);
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
    return Matrix2.determinant2(this);
  }

  /**
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @returns Whether the matrices are equivalent.
   */
  public static equals2(a: Matrix2, b: Matrix2): boolean {
    return a[0] == b[0]
      && a[1] == b[1]
      && a[2] == b[2]
      && a[3] == b[3];
  }

  /**
   * Determines whether this matrix is equivalent to another.
   * @param m The other matrix.
   * @returns Whether the matrices are equivalent.
   */
  public override equals(m: Matrix2): boolean {
    return Matrix2.equals2(this, m);
  }

  /**
   * Calculates the Frobenius norm of a matrix.
   * @param m The matrix.
   * @returns The Frobenius norm.
   */
  public static frob2(m: Matrix2): number {
    return Math.hypot(m[0] as number, m[1] as number, m[2] as number, m[3] as number);
  }

  /** The Frobenius norm of this matrix. */
  public override get frob(): number {
    return Matrix2.frob2(this);
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle.
   * @param r The angle in radians.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromRotation<T extends Matrix2>(r: number, out: T): T {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;

    return out;
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param v The vector.
   * @param out The matrix to store the transformation matrix in.
   * @returns The transformation matrix.
   */
  public static fromScaling<T extends Matrix2>(v: Numbers1x2, out: T): T {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];

    return out;
  }

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static identity2<T extends Matrix2>(m: T): T {
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 1;

    return m;
  }

  /**
   * Sets this matrix to the identity.
   * @returns This matrix.
   */
  public override identity(): this {
    return Matrix2.identity2(this);
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static invert2<T extends Matrix2>(m: Matrix2, out: T): T {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a10: number = m[2] as number;
    const a11: number = m[3] as number;

    const det: number = 1 / (a00 * a11 - a10 * a01);

    out[0] = a11 * det;
    out[1] = -a01 * det;
    out[2] = -a10 * det;
    out[3] = a00 * det;

    return out;
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  public override invert(): this {
    return Matrix2.invert2(this, this);
  }

  /**
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiply2<T extends Matrix2>(a: Matrix2, b: Matrix2, out: T): T {
    const a00: number = a[0] as number;
    const a01: number = a[1] as number;
    const a10: number = a[2] as number;
    const a11: number = a[3] as number;

    const b00: number = b[0] as number;
    const b01: number = b[1] as number;
    const b10: number = b[2] as number;
    const b11: number = b[3] as number;

    out[0] = a00 * b00 + a10 * b01;
    out[1] = a01 * b00 + a11 * b01;
    out[2] = a00 * b10 + a10 * b11;
    out[3] = a01 * b10 + a11 * b11;

    return out;
  }

  /**
   * Multiplies this matrix by another.
   * @param m The other matrix.
   * @returns The product.
   */
  public override multiply(m: Matrix2): this {
    return Matrix2.multiply2(this, m, this);
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiplyScalar2<T extends Matrix2>(m: Matrix2, s: number, out: T): T {
    out[0] = (m[0] as number) * s;
    out[1] = (m[1] as number) * s;
    out[2] = (m[2] as number) * s;
    out[3] = (m[3] as number) * s;

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param s The scalar.
   * @returns The product.
   */
  public override multiplyScalar(s: number): this {
    return Matrix2.multiplyScalar2(this, s, this);
  }

  /**
   * Rotates a matrix by the given angle.
   * @param m The matrix.
   * @param r The angle in radians.
   * @param out The matrix to store the rotated matrix in.
   * @returns The rotated matrix.
   */
  public static rotate<T extends Matrix2>(m: Matrix2, r: number, out: T): T {
    const a00: number = m[0] as number;
    const a01: number = m[1] as number;
    const a10: number = m[2] as number;
    const a11: number = m[3] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a00 * -s + a10 * c;
    out[3] = a01 * -s + a11 * c;

    return out;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotate(r: number): this {
    return Matrix2.rotate(this, r, this);
  }

  /**
   * Scales a matrix by the given vector.
   * @param m The matrix.
   * @param v The vector.
   * @param out The matrix to store the scaled matrix in.
   * @returns The scaled matrix.
   */
  public static scale<T extends Matrix2>(m: Matrix2, v: Numbers1x2, out: T): T {
    const x: number = v[0];
    const y: number = v[1];

    out[0] = (m[0] as number) * x;
    out[1] = (m[1] as number) * x;
    out[2] = (m[2] as number) * y;
    out[3] = (m[3] as number) * y;

    return out;
  }

  /**
   * Scales this matrix by the given vector.
   * @param v The vector.
   * @returns The scaled matrix.
   */
  public scale(v: Numbers1x2): this {
    return Matrix2.scale(this, v, this);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static subtract2<T extends Matrix2>(a: Matrix2, b: Matrix2, out: T): T {
    out[0] = (a[0] as number) - (b[0] as number);
    out[1] = (a[1] as number) - (b[1] as number);
    out[2] = (a[2] as number) - (b[2] as number);
    out[3] = (a[3] as number) - (b[3] as number);

    return out;
  }

  /**
   * Subtracts another matrix from this one.
   * @returns The difference.
   */
  public override subtract(m: Matrix2): this {
    return Matrix2.subtract2(this, m, this);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static transpose2<T extends Matrix2>(m: Matrix2, out: T): T {
    out[0] = m[0] as number;
    out[1] = m[2] as number;
    out[2] = m[1] as number;
    out[3] = m[3] as number;

    return out;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public override transpose(): this {
    return Matrix2.transpose2(this, this);
  }
}
