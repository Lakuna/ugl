import { Matrix } from "./Matrix.js";

/** A collection of numbers arranged in an equal number of columns and rows. */
export class SquareMatrix extends Matrix {
  /** Creates a 4x4 identity matrix. */
  public constructor();

  /**
   * Creates an empty matrix with the given width and height.
   * @param dim The number of columns and rows in the matrix.
   */
  public constructor(dim: number);

  /**
   * Creates a square matrix from the given values.
   * @param vals The values in the matrix in column-wise order.
   */
  public constructor(...vals: number[]);

  public constructor(...data: number[]) {
    let dim: number;

    switch (data.length) {
      case 0:
        dim = 4;

        break;
      case 1:
        dim = data[0] as number;

        break;
      default:
        dim = data.length;

        break;
    }

    super(dim, dim);

    if (data.length == 0) {
      this[0] = 1;
      this[5] = 1;
      this[10] = 1;
      this[15] = 1;
    } else {
      for (let i = 0; i < data.length; i++) {
        this[i] = data[i] as number;
      }
    }
  }

  /**
   * Adds two matrices together.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public static override add(a: SquareMatrix, b: SquareMatrix, out: SquareMatrix = new SquareMatrix(a.width)): SquareMatrix {
    if (a.width != b.width || a.width != out.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < a.width * a.height; i++) {
      out[i] = (a[i] as number) + (b[i] as number);
    }

    return out;
  }

  /**
   * Adds another matrix to this one.
   * @param m The matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public override add(m: SquareMatrix, out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.add(this, m, out);
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static adjoint(m: SquareMatrix, out: SquareMatrix = new SquareMatrix(m.height)): SquareMatrix {
    return SquareMatrix.transpose(SquareMatrix.cofactor(m), out);
  }

  /**
   * Calculates the adjugate of this matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public adjoint(out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.adjoint(this, out);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public override clone(): SquareMatrix {
    return new SquareMatrix(this.width).copy(this);
  }

  /**
   * Copies the values in a matrix to another.
   * @param src The source matrix.
   * @param dst The destination matrix.
   * @returns The destination matrix.
   */
  public static override copy(src: SquareMatrix, dst: SquareMatrix): SquareMatrix {
    if (src.width != dst.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < src.length; i++) {
      dst[i] = src[i] as number;
    }

    return dst;
  }

  /**
   * Copies the values in another matrix to this one.
   * @param src The source matrix.
   * @returns This matrix.
   */
  public override copy(src: SquareMatrix): SquareMatrix {
    return SquareMatrix.copy(src, this);
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static cofactor(m: SquareMatrix, out: SquareMatrix = new SquareMatrix(m.width)): SquareMatrix {
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
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public cofactor(out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.cofactor(this, out);
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
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @returns Whether the matrices are equivalent.
   */
  public static override equals(a: SquareMatrix, b: SquareMatrix): boolean {
    if (a.width != b.width) { return false; }

    for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) { return false; }
    }

    return true;
  }

  /**
   * Determines whether this matrix is equivalent to another.
   * @param m The other matrix.
   * @returns Whether the matrices are equivalent.
   */
  public override equals(m: SquareMatrix): boolean {
    return SquareMatrix.equals(this, m);
  }

  /**
   * Calculates the Frobenius norm of a matrix.
   * @param m The matrix.
   * @returns The Frobenius norm.
   */
  public static override frob(m: SquareMatrix): number {
    return Math.hypot(...m);
  }

  /** The Frobenius norm of this matrix. */
  public override get frob(): number {
    return SquareMatrix.frob(this);
  }

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static identity(m: SquareMatrix): SquareMatrix {
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
  public identity(): SquareMatrix {
    return SquareMatrix.identity(this);
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static invert(m: SquareMatrix, out: SquareMatrix = new SquareMatrix(m.width)): SquareMatrix {
    const dim: number = m.width;

    const clone: Matrix = m.clone();
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
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public invert(out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.invert(this, out);
  }

  /**
   * Calculates the minor of a matrix which results from removing the given row and column.
   * @param m The matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @returns The minor.
   */
  public static minor(m: SquareMatrix, row: number, col: number): number {
    return SquareMatrix.determinant(SquareMatrix.submatrix(m, row, col));
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
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiply(a: SquareMatrix, b: SquareMatrix, out: SquareMatrix = new SquareMatrix(b.width)): SquareMatrix {
    if (a.height != out.height || a.width != b.height) { throw new Error("Matrix size mismatch."); }

    const n: number = a.height;
    const m: number = a.width;
    const p: number = b.width;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += (a[k * a.height + i] as number) * (b[j * b.height + k] as number);
        }

        out[j * out.height + i] = sum;
      }
    }

    return out;
  }

  /**
   * Multiplies this matrix by another.
   * @param m The other matrix.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiply(m: SquareMatrix, out: SquareMatrix = new SquareMatrix(m.width)): SquareMatrix {
    return SquareMatrix.multiply(this, m, out);
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static override multiplyScalar(m: SquareMatrix, s: number, out: SquareMatrix = new SquareMatrix(m.width)): SquareMatrix {
    if (m.width != out.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.length; i++) {
      out[i] = (m[i] as number) * s;
    }

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public override multiplyScalar(s: number, out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.multiplyScalar(this, s, out);
  }

  /**
   * Creates a submatrix by removing the given row and column from a matrix.
   * @param m The matrix.
   * @param row The row to remove.
   * @param col The column to remove.
   * @param out The matrix to store the submatrix in.
   * @returns The submatrix.
   */
  public static submatrix(m: Matrix, row: number, col: number, out: SquareMatrix = new SquareMatrix(m.width - 1)): SquareMatrix {
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
   * @param out The matrix to store the submatrix in.
   * @returns The submatrix.
   */
  public submatrix(row: number, col: number, out: SquareMatrix = new SquareMatrix(this.width - 1)): SquareMatrix {
    return SquareMatrix.submatrix(this, row, col, out);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static override subtract(a: SquareMatrix, b: SquareMatrix, out: SquareMatrix = new SquareMatrix(a.width)): SquareMatrix {
    if (a.width != b.width || a.width != out.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < a.width * a.height; i++) {
      out[i] = (a[i] as number) - (b[i] as number);
    }

    return out;
  }

  /**
   * Subtracts another matrix from this one.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public override subtract(m: SquareMatrix, out: SquareMatrix = this): SquareMatrix {
    return SquareMatrix.subtract(this, m, out);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static override transpose(m: SquareMatrix, out: SquareMatrix = new SquareMatrix(m.height)): SquareMatrix {
    if (m.width != out.height) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.width; i++) {
      for (let j = 0; j < m.height; j++) {
        out[j * out.height + i] = m[i * m.height + j] as number;
      }
    }

    return out;
  }

  /**
   * Transposes this matrix.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public override transpose(out: SquareMatrix = new SquareMatrix(this.height)): SquareMatrix {
    return SquareMatrix.transpose(this, out);
  }
}
