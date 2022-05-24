import { Matrix } from "./Matrix.js";

/** A collection of numbers arranged in an equal number of columns and rows. */
export class SquareMatrix extends Matrix {
  /**
   * Creates a square matrix from the given values.
   * @param vals The values in the matrix in column-wise order.
   */
  public constructor(...vals: number[]) {
    let dim: number = Math.sqrt(vals.length);
    if (dim % 1) { throw new Error("Values cannot form a square matrix."); }

    super(...(vals.reduce((previousValue: number[][], currentValue: number, index: number): number[][] => {
      const chunkIndex: number = Math.floor(index / dim);
      previousValue[chunkIndex] ??= [];
      (previousValue[chunkIndex] as number[]).push(currentValue);
      return previousValue;
    }, [] as number[][])));
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static adjoint<T extends SquareMatrix>(m: SquareMatrix, out: T): T {
    return SquareMatrix.transpose(SquareMatrix.cofactor(m, out), out);
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public adjoint(): this {
    return SquareMatrix.adjoint(this, this);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public override clone(): SquareMatrix {
    return new SquareMatrix(...this);
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static cofactor<T extends SquareMatrix>(m: SquareMatrix, out: T): T {
    if (m.width != out.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.width; i++) {
      for (let j = 0; j < m.height; j++) {
        out[i * m.height + j] = ((i + j) % 2 ? -1 : 1) * m.minor(i, j);
      }
    }

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @returns The cofactor.
   */
  public cofactor(): this {
    return SquareMatrix.cofactor(this, this);
  }

  /**
   * Calculates the determinant of a matrix.
   * @param m The matrix.
   * @returns The determinant.
   */
  public static determinant(m: SquareMatrix): number {
    if (m.length == 1) { return m[0] as number; }

    let out = 0;
    for (let i = 0; i < m.height; i++) {
      out += (i % 2 ? 1 : -1) * (m[i] as number) * m.minor(0, i);
    }

    return out;
  }

  /** The determinant of this matrix. */
  public get determinant(): number {
    return SquareMatrix.determinant(this);
  }

  /**
   * Creates an empty matrix with the given dimensions.
   * @param dim The number of columns and rows in the matrix.
   * @returns The matrix.
   */
  public static override fromDimensions(dim: number): SquareMatrix {
    return new SquareMatrix(...(new Array(dim * dim).fill(0)));
  }

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static identity<T extends SquareMatrix>(m: T): T {
    for (let i = 0; i < m.width; i++) {
      for (let j = 0; j < m.height; j++) {
        m[i * m.height + j] = i == j ? 1 : 0;
      }
    }

    return m;
  }

  /**
   * Sets this matrix to the identity.
   * @returns This matrix.
   */
  public identity(): this {
    return SquareMatrix.identity(this);
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static invert<T extends SquareMatrix>(m: SquareMatrix, out: T): T {
    const dim: number = m.width;

    const clone: SquareMatrix = new SquareMatrix(...m);
    out.identity();

    for (let i = 0; i < dim; i++) {
      let diagonal: number = clone[i * dim + i] as number;

      if (!diagonal) {
        for (let ii: number = i + 1; ii < dim; ii++) {
          if (clone[ii * dim + i]) {
            for (let j = 0; j < dim; j++) {
              for (const matrix of [clone, out]) {
                [matrix[i * dim + j], matrix[ii * dim + j]] = [matrix[ii * dim + j] as number, matrix[i * dim + j] as number];
              }
            }

            break;
          }
        }

        diagonal = clone[i * dim + i] as number;
        if (!diagonal) { throw new Error("Matrix is not invertible."); }
      }

      for (let j = 0; j < dim; j++) {
        for (const matrix of [clone, out]) {
          matrix[i * dim + j] /= diagonal;
        }
      }

      for (let ii = 0; ii < dim; ii++) {
        if (ii == i) { continue; }

        const temp: number = clone[ii * dim + i] as number;

        for (let j = 0; j < dim; j++) {
          for (const matrix of [clone, out]) {
            matrix[ii * dim + j] -= temp * (matrix[i * dim + j] as number);
          }
        }
      }
    }

    return out;
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  public invert(): this {
    return SquareMatrix.invert(this, this);
  }

  /**
   * Calculates the minor of a matrix which results from removing the given row and column.
   * @param m The matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The minor.
   */
  public static minor(m: SquareMatrix, row: number, col: number): number {
    return SquareMatrix.determinant(SquareMatrix.submatrix(m, row, col, new SquareMatrix(m.width - 1)));
  }

  /**
   * Calculates the minor of this matrix which results from removing the given row and column.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The minor.
   */
  public minor(row: number, col: number): number {
    return SquareMatrix.minor(this, row, col);
  }

  /**
   * Creates a submatrix by removing the given row and column from a matrix.
   * @param m The matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @param out The matrix to store the submatrix in.
   * @returns The submatrix.
   */
  public static submatrix<T extends SquareMatrix>(m: Matrix, row: number, col: number, out: T): T {
    if (out.width != (m.width - 1)) { throw new Error("Matrix size mismatch."); }

    let k = 0;
    for (let i = 0; i < m.width; i++) {
      if (i == col) { continue; }

      for (let j = 0; j < m.height; j++) {
        if (j == row) { continue; }

        out[k++] = m[i * m.height + j] as number;
      }
    }

    return out;
  }

  /**
   * Creates a submatrix by removing the given row and column from this matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The submatrix.
   */
  public submatrix(row: number, col: number): SquareMatrix {
    return SquareMatrix.submatrix(this, row, col, new SquareMatrix(this.width - 1));
  }
}
