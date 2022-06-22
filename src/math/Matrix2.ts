import { SquareMatrix } from "./SquareMatrix.js";
import { Vector2 } from "./Vector2.js";

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
    super(2);
    this[0] = c1r1;
    this[1] = c1r2;
    this[2] = c2r1;
    this[3] = c2r2;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public override adjoint(): this {
    this[0] = this[3] as number;
    this[1] = -(this[1] as number);
    this[2] = -(this[2] as number);
    this[3] = this[0] as number;

    return this;
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Matrix2 {
    return new Matrix2(...(this as ArrayLike<number> as [number, number, number, number]));
  }

  /** The determinant of this matrix. */
  public override get determinant(): number {
    return (this[0] as number) * (this[3] as number) - (this[2] as number) * (this[1] as number);
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle.
   * @param r The angle in radians.
   * @returns The transformation matrix.
   */
  public static fromRotation(r: number): Matrix2 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix2(
      c, s,
      -s, c
    );
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given vector.
   * @param b The vector.
   * @returns The transformation matrix.
   */
  public static fromScaling(b: Vector2): Matrix2 {
    return new Matrix2(
      b[0] as number, 0,
      0, b[1] as number
    );
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  public override invert(): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a10: number = this[2] as number;
    const a11: number = this[3] as number;

    const det: number = 1 / (a00 * a11 - a10 * a01);

    this[0] = a11 * det;
    this[1] = -a01 * det;
    this[2] = -a10 * det;
    this[3] = a00 * det;

    return this;
  }

  /**
   * Multiplies this matrix by another.
   * @param b The other matrix.
   * @returns The product.
   */
  public override multiply(b: Matrix2): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a10: number = this[2] as number;
    const a11: number = this[3] as number;

    const b00: number = b[0] as number;
    const b01: number = b[1] as number;
    const b10: number = b[2] as number;
    const b11: number = b[3] as number;

    this[0] = a00 * b00 + a10 * b01;
    this[1] = a01 * b00 + a11 * b01;
    this[2] = a00 * b10 + a10 * b11;
    this[3] = a01 * b10 + a11 * b11;

    return this;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r The angle in radians.
   * @returns The rotated matrix.
   */
  public rotate(r: number): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a10: number = this[2] as number;
    const a11: number = this[3] as number;

    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a00 * -s + a10 * c;
    this[3] = a01 * -s + a11 * c;

    return this;
  }

  /**
   * Scales this matrix by the given vector.
   * @param b The vector.
   * @returns The scaled matrix.
   */
  public scale(b: Vector2): this {
    const x: number = b[0] as number;
    const y: number = b[1] as number;

    this[0] *= x;
    this[1] *= x;
    this[2] *= y;
    this[3] *= y;

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public override transpose(): this {
    [this[1], this[2]] = [this[2] as number, this[1] as number];

    return this;
  }
}
