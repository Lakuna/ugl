import { Matrix } from "./Matrix.js";

/** A collection of numbers arranged in an equivalent number of columns and rows. */
export class SquareMatrix extends Matrix {
  /**
   * Creates a square matrix.
   * @param dim The number of columns and rows in the matrix.
   */
  public constructor(dim: number) {
    super(dim, dim);
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns The adjugate.
   */
  public adjoint(): this {
    return this.cofactor().transpose();
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): SquareMatrix {
    const out: SquareMatrix = new SquareMatrix(this.width);

    for (let i = 0; i < out.length; i++) {
      out[i] = this[i] as number;
    }

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @returns The cofactor.
   */
  public cofactor(): this {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this[i * this.height + j] = ((i + j) % 2 ? -1 : 1) * this.minor(i, j);
      }
    }

    return this;
  }

  /** The determinant of this matrix. */
  public get determinant(): number {
    if (this.length <= 1) { return this[0] ?? 0; }

    let out = 0;
    for (let i = 0; i < this.height; i++) {
      out += (i % 2 ? 1 : -1) * (this[i] as number) * this.minor(0, i);
    }

    return out;
  }

  /**
   * Sets this matrix to the identity.
   * @returns This matrix.
   */
  public identity(): this {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this[i * this.height + j] = i == j ? 1 : 0;
      }
    }

    return this;
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  public invert(): this {
    const dim: number = this.width;

    const clone: SquareMatrix = this.clone();
    this.identity();

    for (let i = 0; i < dim; i++) {
      let diagonal: number = clone[i * dim + i] as number;

      if (!diagonal) {
        for (let ii: number = i + 1; ii < dim; ii++) {
          if (clone[ii * dim + i]) {
            for (let j = 0; j < dim; j++) {
              for (const matrix of [clone, this]) {
                [matrix[i * dim + j], matrix[ii * dim + j]] = [matrix[ii * dim + j] as number, matrix[i * dim + j] as number];
              }
            }

            break;
          }
        }

        diagonal = clone[i * dim + i] as number;
        if (!diagonal) { throw new Error("Cannot invert."); }
      }

      for (let j = 0; j < dim; j++) {
        for (const matrix of [clone, this]) {
          matrix[i * dim + j] /= diagonal;
        }
      }

      for (let ii = 0; ii < dim; ii++) {
        if (ii == i) { continue; }

        const temp: number = clone[ii * dim + i] as number;

        for (let j = 0; j < dim; j++) {
          for (const matrix of [clone, this]) {
            matrix[ii * dim + j] -= temp * (matrix[i * dim + j] as number);
          }
        }
      }
    }

    return this;
  }

  /**
   * Calculates the minor of this matrix which results from removing the given row and column.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The minor.
   */
  public minor(row: number, col: number): number {
    return this.submatrix(row, col).determinant;
  }

  /**
   * Creates a submatrix by removing the given row and column from this matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The submatrix.
   */
  public submatrix(row: number, col: number): SquareMatrix {
    const out: SquareMatrix = new SquareMatrix(this.width - 1);

    let k = 0;
    for (let i = 0; i < this.width; i++) {
      if (i == col) { continue; }

      for (let j = 0; j < this.height; j++) {
        if (j == row) { continue; }

        out[k++] = this[i * this.height + j] as number;
      }
    }

    return out;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public override transpose(): this {
    const clone: SquareMatrix = this.clone();

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this[j * this.height + i] = clone[i * this.height + j] as number;
      }
    }

    return this;
  }
}
