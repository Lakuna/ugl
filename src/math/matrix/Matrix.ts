/** A rectangular array of quantities that is treated as a single entity. */
export interface Matrix extends ArrayLike<number> {
  /**
   * Adds another matrix to this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the sum of the factors.
   */
  add(matrix: Matrix): this;

  /**
   * Calculates the adjugate of this matrix.
   * @returns This matrix, with its contents set to its adjugate.
   */
  adjoint(): this;

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A clone of this matrix.
   */
  clone(): Matrix;

  /**
   * Calculates the cofactor matrix of this matrix.
   * @returns This matrix, with its values set to its cofactor matrix.
   */
  cofactor(): this;

  /** The determinant of this matrix. */
  get determinant(): number;

  /**
   * Checks whether this matrix has the same elements as another.
   * @param matrix - The other matrix.
   * @returns Whether the matrices have the same elements.
   */
  equals(matrix: Matrix): boolean;

  /** The Frobenius norm of this matrix. */
  get frob(): number;

  /** The number of rows in this matrix. */
  get height(): number;

  /**
   * Resets this matrix to the identity matrix.
   * @returns This matrix, with its contents set to the identity.
   */
  identity(): this;

  /**
   * Inverts this matrix.
   * @returns This matrix, with its contents inverted.
   */
  invert(): this;

  /**
   * Calculates the minor of this matrix resulting from removing the given rows and columns.
   * @param rows - The row(s) to remove.
   * @param columns - The column(s) to remove.
   * @returns A minor of this matrix.
   */
  minor(rows: number | number[], columns: number | number[]): number;

  /**
   * Multiplies this matrix by another.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the product of the factors.
   */
  multiply(matrix: Matrix): this;

  /**
   * Multiplies this matrix by a scalar number.
   * @param scalar - The scalar number.
   * @returns This matrix, containing the product of the factors.
   */
  multiplyScalar(scalar: number): this;

  /**
   * Sets the contents of this matrix.
   * @param columns - The new columns to put into in this matrix.
   * @returns This matrix, with its contents replaced with the given columns.
   */
  set(...columns: number[][]): this;

  /**
   * Sets the contents of this matrix (must be made square).
   * @param values - The new values to put into this matrix in column-major order.
   * @returns This matrix, with its contents replaced with the given values.
   */
  set(...values: number[]): this;

  /**
   * Creates a submatrix by removing the given rows and columns from this matrix.
   * @param rows - The row(s) to remove.
   * @param columns - The column(s) to remove.
   * @returns A submatrix of this matrix.
   */
  submatrix(rows: number | number[], columns: number | number[]): Matrix;

  /**
   * Subtracts another matrix from this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the difference between the factors.
   */
  subtract(matrix: Matrix): this;

  /**
   * Transposes this matrix.
   * @returns This matrix, with its contents transposed.
   */
  transpose(): this;

  /** The number of columns in this matrix. */
  get width(): number;
}
