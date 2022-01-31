import { Numbers1x2, Numbers2x2 } from "../../types/Numbers.js";

// Based on code from glMatrix.

/** A 2x2 matrix. */
export class Matrix2 extends Float32Array {
  /**
   * Creates a 2x2 matrix from a rotation.
   * @param r - The rotation in radians.
   * @returns A matrix.
   */
  static fromRotation(r: number): Matrix2 {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return new Matrix2(
      c, s,
      -s, c
    );
  }

  /**
   * Creates a 2x2 matrix from a vector scaling.
   * @param v - The scaling vector.
   * @returns A matrix.
   */
  static fromScaling(v: Numbers1x2): Matrix2 {
    return new Matrix2(
      v[0], 0,
      0, v[1]
    );
  }

  /**
   * Creates a 2x2 matrix.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   */
  constructor(
    x0y0 = 1, x0y1 = 0,
    x1y0 = 0, x1y1 = 1
  ) {
    super(2 * 2);

    // Only assign values if they aren't 0 to speed up creation.
    if (x0y0) { this[0] = x0y0; }
    if (x0y1) { this[1] = x0y1; }

    if (x1y0) { this[2] = x1y0; }
    if (x1y1) { this[3] = x1y1; }
  }

  /** A clone of this matrix. */
  get clone(): Matrix2 {
    return new Matrix2(...this);
  }

  /**
   * Resets this matrix to identity.
   * @returns This.
   */
  identity(): this {
    return this.setValues(
      1, 0,
      0, 1
    );
  }

  /**
   * Sets the values in this matrix.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @returns This.
   */
  setValues(
    x0y0: number, x0y1: number,
    x1y0: number, x1y1: number
  ): this {
    this[0] = x0y0;
    this[1] = x0y1;
    this[2] = x1y0;
    this[3] = x1y1;

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns This.
   */
  transpose(): this {
    [this[1], this[2]] = [this[2] as number, this[1] as number];

    return this;
  }

  /**
   * Inverts this matrix.
   * @returns This.
   */
  invert(): this {
    const d: number = 1 / this.determinant;

    return this.setValues(
      this[3] as number * d, -(this[1] as number) * d,
      -(this[2] as number) * d, this[0] as number * d
    );
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This.
   */
  adjoint(): this {
    return this.setValues(
      this[3] as number, -(this[1] as number),
      -(this[2] as number), this[0] as number
    );
  }

  /** The determinant of this matrix. */
  get determinant(): number {
    return (this[0] as number) * (this[3] as number) - (this[2] as number) * (this[1] as number);
  }

  /**
   * Multiplies two matrices together.
   * @param m - The other matrix.
   * @returns This.
   */
  multiply(m: Numbers2x2): this {
    return this.setValues(
      (this[0] as number) * m[0] + (this[2] as number) * m[1],
      (this[1] as number) * m[0] + (this[3] as number) * m[1],

      (this[1] as number) * m[0] + (this[3] as number) * m[1],
      (this[1] as number) * m[2] + (this[3] as number) * m[3]
    );
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r - The angle to rotate by in radians.
   */
  rotate(r: number): this {
    const s: number = Math.sin(r);
    const c: number = Math.cos(r);

    return this.setValues(
      (this[0] as number) * c + (this[2] as number) * s,
      (this[1] as number) * c + (this[3] as number) * s,

      (this[0] as number) * -s + (this[2] as number) * c,
      (this[1] as number) * -s + (this[3] as number) * c
    );
  }

  /**
   * Scales this matrix by the given dimensions.
   * @param v - The vector to scale by.
   * @returns This.
   */
  scale(v: Numbers1x2): this {
    return this.setValues(
      (this[0] as number) * v[0],
      (this[1] as number) * v[0],

      (this[2] as number) * v[1],
      (this[3] as number) * v[1]
    );
  }

  /**
   * Returns a string representation of this matrix.
   * @returns A string representation of this matrix.
   */
  override toString(): string {
    return `[[${this[0]}, ${this[1]}], [${this[2]}, ${this[3]}]]`;
  }

  /** The Frobenius normal of this matrix. */
  get frob(): number {
    return Math.hypot(
      this[0] as number, this[1] as number,
      this[2] as number, this[3] as number
    );
  }

  /**
   * Adds two matrices.
   * @param m - The other matrix.
   * @returns This.
   */
  add(m: Numbers2x2): this {
    return this.setValues(
      (this[0] as number) + m[0], (this[1] as number) + m[1],
      (this[2] as number) + m[2], (this[3] as number) + m[3]
    );
  }

  /**
   * Subtracts another matrix from this one.
   * @param m - The other matrix.
   * @returns This.
   */
  subtract(m: Numbers2x2): this {
    return this.setValues(
      (this[0] as number) - m[0], (this[1] as number) - m[1],
      (this[2] as number) - m[2], (this[3] as number) - m[3]
    );
  }

  /**
   * Checks if two matrices are equivalent.
   * @param m - The other matrix.
   * @return Whether the matrices are equivalent.
   */
  equals(m: Numbers2x2): boolean {
    return this[0] == m[0] && this[1] == m[1]
      && this[2] == m[2] && this[3] == m[3];
  }

  /**
   * Multiplies each element of this matrix by a scalar.
   * @param s - The scalar.
   * @returns This.
   */
   multiplyScalar(s: number): this {
     return this.setValues(
       (this[0] as number) * s, (this[1] as number) * s,
       (this[2] as number) * s,  (this[3] as number) * s
     );
   }
}
