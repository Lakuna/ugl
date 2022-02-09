/** The interface for matrices. */
export interface IMatrix extends Iterable<number> {
  /** A clone of this matrix. */
  get clone(): IMatrix;

  /**
   * Copies the values from another matrix into this one.
   * @param m - The other matrix.
   * @returns This.
   */
  copy(m: Iterable<number>): this;

  /**
   * Sets this matrix to the identity.
   * @returns This.
   */
  identity(): this;

  /**
   * Transposes this matrix.
   * @returns This.
   */
  transpose(): this;

  /**
   * Inverts this matrix.
   * @returns This.
   */
  invert(): this;

  /**
   * Calculates the adjugate of this matrix.
   * @returns This.
   */
  adjoint(): this;

  /** The determinant of this matrix. */
  get determinant(): number;

  /**
   * Multiplies this matrix with another.
   * @param m - The other matrix.
   * @returns This.
   */
  multiply(m: Iterable<number>): this;

  /** The Frobenius normal of this matrix. */
  get frob(): number;

  /**
   * Adds this matrix to another.
   * @param m - The other matrix.
   * @returns This.
   */
  add(m: Iterable<number>): this;

  /**
   * Subtracts another matrix from this one.
   * @param m - The other matrix.
   * @returns This.
   */
  subtract(m: Iterable<number>): this;

  /**
   * Whether this matrix is approximately equivalent to another.
   * @param m - The other matrix.
   * @returns Whether the matrices are approximately equivalent.
   */
  equals(m: Iterable<number>): boolean;

  /**
   * Multiplies this by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  multiplyScalar(s: number): this;
}
