import { IMatrix } from "./IMatrix.js";

export class Matrix extends Array<number> implements IMatrix {
  /** Creates a 4x4 identity matrix. */
  public constructor();

  /**
   * Creates a matrix from the given columns.
   * @param columns - The columns in the matrix.
   */
  public constructor(...columns: number[][]);

  /**
   * Creates a square matrix from the given values.
   * @param values - The values in the matrix in column-major order.
   */
  public constructor(...values: number[]);

  public constructor(...values: (number | number[])[]) {
    super(...(values.length
      ? ([] as number[]).concat(...values)
      : [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    ));

    if (values.length) {
      if (typeof values[0] == "number") {
        const dim: number = Math.sqrt(values.length);
        if (dim % 1) { throw new Error("Matrices initialized from an array must be square."); }
        this.privateWidth = dim;
        this.privateHeight = dim;
      } else {
        this.privateWidth = values.length;
        this.privateHeight = (values[0] as number[]).length;
        if (this.length != this.width * this.height) { throw new Error("Every column in a matrix must be the same length."); }
      }
    } else {
      this.privateWidth = 4;
      this.privateHeight = 4;
    }
  }

  /**
   * Adds another matrix to this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the sum of the factors.
   */
  public add(matrix: IMatrix): this {
    if (this.width != matrix.width || this.height != matrix.height) {
      throw new Error("Cannot add matrices with different dimensions.");
    }

    for (let i = 0; i < this.length; i++) {
      this[i] += matrix[i] as number;
    }

    return this;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This matrix, with its contents set to its adjugate.
   */
  public adjoint(): this {
    return this.cofactor().transpose();
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A clone of this matrix.
   */
  public clone(): Matrix {
    return new Matrix(...this);
  }

  /**
   * Calculates the cofactor matrix of this matrix.
   * @returns This matrix, with its values set to its cofactor matrix.
   */
  public cofactor(): this {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this[i * this.width + j] = ((-1) ** ((i + 1) * (j + 1))) * this.minor(i, j);
      }
    }

    return this;
  }

  /** The determinant of this matrix. */
  public get determinant(): number {
    if (this.length == 1) {
      if (this[0]) {
        return this[0];
      } else {
        throw new Error("Cannot calculate the determinant of a matrix with an undefined index.");
      }
    }

    if (this.width != this.height) {
      throw new Error("Cannot calculate the determinant of a non-square matrix.");
    }

    let out = 0;
    for (let i = 0; i < this.height; i++) {
      out += (i % 2 ? 1 : -1) * (this[i] as number) * this.submatrix(0, i).determinant;
    }
    return out;
  }

  /**
   * Checks whether this matrix has the same elements as another.
   * @param matrix - The other matrix.
   * @returns Whether the matrices have the same elements.
   */
  public equals(matrix: IMatrix): boolean {
    if (this.width != matrix.width || this.height != matrix.height) { return false; }

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this[i * this.width + j] != matrix[i * matrix.width + j]) { return false; }
      }
    }

    return true;
  }

  /** The Frobenius norm of this matrix. */
  public get frob(): number {
    return Math.hypot(...this);
  }

  /** The number of rows in this matrix. */
  private privateHeight: number;

  /** The number of rows in this matrix. */
  public get height(): number {
    return this.privateHeight;
  }

  /**
   * Resets this matrix to the identity matrix.
   * @returns This matrix, with its contents set to the identity.
   */
  public identity(): this {
    // Make the matrix square by setting the width to the height.
    this.privateWidth = this.height;

    // Clear the current values.
    while (this.length) { this.pop(); }

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this[i * this.width + j] = i == j ? 1 : 0;
      }
    }

    return this;
  }

  /**
   * Inverts this matrix.
   * @returns This matrix, with its contents inverted.
   */
  public invert(): this {
    // Uses Gaussian Elimination.

    if (this.width != this.height) {
      throw new Error("Cannot calculate the inverse of a non-square matrix.");
    }

    const dim: number = this.width;
    const identity: Matrix = this.clone().identity();
    const copy: Matrix = this.clone();

    for (let i = 0; i < dim; i++) {
      let diagonal: number = copy[i * dim + i] as number;
      if (!diagonal) {
        for (let ii: number = i + 1; ii < dim; ii++) {
          if (copy[ii * dim + i]) {
            for (let j = 0; j < dim; j++) {
              for (const matrix of [copy, identity]) {
                [matrix[i * dim + j], matrix[ii * dim + j]]
                  = [matrix[ii * dim + j] as number, matrix[i * dim + j] as number];
              }
            }
            break;
          }
        }

        diagonal = copy[i * dim + i] as number;
        if (!diagonal) { throw new Error("Matrix is not invertible."); }
      }

      for (let j = 0; j < dim; j++) {
        for (const matrix of [copy, identity]) {
          matrix[i * dim + j] /= diagonal;
        }
      }

      for (let ii = 0; ii < dim; ii++) {
        if (ii == i) { continue; }
        const temp: number = copy[ii * dim + i] as number;
        for (let j = 0; j < dim; j++) {
          for (const matrix of [copy, identity]) {
            matrix[ii * dim + j] -= temp * (matrix[i * dim + j] as number);
          }
        }
      }
    }

    return this.set(...identity);
  }

  /**
   * Calculates the minor of this matrix resulting from removing the given rows and columns.
   * @param rows - The row(s) to remove.
   * @param columns - The column(s) to remove.
   * @returns A minor of this matrix.
   */
  public minor(rows: number | number[], columns: number | number[]): number {
    return this.submatrix(rows, columns).determinant;
  }

  /**
   * Multiplies another matrix by this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the product of the factors.
   */
  public multiply(matrix: IMatrix): this {
    const n: number = this.height;
    const m: number = this.width;
    if (matrix.height != m) {
      throw new Error("The multiplier's width must match the multiplicand's height.");
    }
    const p: number = matrix.width;

    const columns: number[][] = [];
    for (let i = 0; i < n; i++) {
      const column: number[] = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += (this[i * m + k] as number) * (matrix[k * p + j] as number);
        }
        column.push(sum);
      }
      columns.push(column);
    }

    return this.set(...columns);
  }

  /**
   * Multiplies this matrix by a scalar number.
   * @param scalar - The scalar number.
   * @returns This matrix, containing the product of the factors.
   */
  public multiplyScalar(scalar: number): this {
    return this.set(...this.map((value: number): number => value * scalar));
  }

  /**
   * Sets the contents of this matrix.
   * @param columns - The new columns to put into in this matrix.
   * @returns This matrix, with its contents replaced with the given columns.
   */
  public set(...columns: number[][]): this;

  /**
   * Sets the contents of this matrix (must be made square).
   * @param values - The new values to put into this matrix in column-major order.
   * @returns This matrix, with its contents replaced with the given values.
   */
  public set(...values: number[]): this;

  public set(...values: (number | number[])[]): this {
    // Clear old values.
    while (this.length) { this.pop(); }

    // Fill new values.
    for (const value of ([] as number[]).concat(...values)) {
      this.push(value);
    }

    // Update width and height.
    if (values.length) {
      if (typeof values[0] == "number") {
        const dim: number = Math.sqrt(values.length);
        if (dim % 1) { throw new Error("Matrices initialized from an array must be square."); }
        this.privateWidth = dim;
        this.privateHeight = dim;
      } else {
        this.privateWidth = values.length;
        this.privateHeight = (values[0] as number[]).length;
        if (this.length != this.width * this.height) { throw new Error("Every column in a matrix must be the same length."); }
      }
    } else {
      this.privateWidth = 0;
      this.privateHeight = 0;
    }

    return this;
  }

  /**
   * Creates a submatrix by removing the given rows and columns from this matrix.
   * @param rows - The row(s) to remove.
   * @param columns - The column(s) to remove.
   * @returns A submatrix of this matrix.
   */
  public submatrix(rows: number | number[], columns: number | number[]): Matrix {
    const out: number[][] = [];

    if (typeof rows == "number") { rows = [rows]; }
    if (typeof columns == "number") { columns = [columns]; }

    for (let j = 0; j < this.width; j++) {
      if (j in columns) { continue; }
      const column: number[] = [];
      for (let i = 0; i < this.height; i++) {
        if (i in rows) { continue; }
        column.push(this[i * this.width + j] as number);
      }
      out.push(column);
    }

    return new Matrix(...out);
  }

  /**
   * Subtracts another matrix from this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the difference between the factors.
   */
  public subtract(matrix: Matrix): this {
    if (this.width != matrix.width || this.height != matrix.height) {
      throw new Error("Cannot subtract matrices with different dimensions.");
    }

    for (let i = 0; i < this.length; i++) {
      this[i] -= matrix[i] as number;
    }

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns This matrix, with its contents transposed.
   */
  public transpose(): this {
    const columns: number[][] = [];

    for (let j = 0; j < this.width; j++) {
      const column: number[] = [];
      for (let i = 0; i < this.height; i++) {
        column.push(this[j * this.height + i] as number);
      }
      columns.push(column);
    }

    return this.set(...columns);
  }

  /** The number of columns in this matrix. */
  private privateWidth: number;

  /** The number of columns in this matrix. */
  public get width(): number {
    return this.privateWidth;
  }
}
