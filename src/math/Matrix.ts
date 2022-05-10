/** A collection of numbers arranged in columns and rows. */
export class Matrix extends Float32Array {
  /** Creates a 4x4 identity matrix. */
  public constructor();

  /**
   * Creates an empty matrix with the given width and height.
   * @param width The number of columns in the matrix.
   * @param height The number of rows in the matrix.
   */
  public constructor(width: number, height: number);

  /**
   * Creates a matrix from the given columns.
   * @param cols The columns in the matrix.
   */
  public constructor(...cols: ArrayLike<number>[]);

  /**
   * Creates a square matrix from the given values.
   * @param vals The values in the matrix in column-wise order.
   */
  public constructor(...vals: number[]);

  public constructor(...data: (ArrayLike<number> | number)[]) {
    let width: number;
    let height: number;

    switch (typeof data[0]) {
      case "undefined":
        width = 4;
        height = 4;

        break;
      case "number":
        if (data.length == 2) {
          width = data[0];
          height = data[1] as number;

          break;
        }

        width = Math.sqrt(data.length);
        if (width % 1) { throw new Error("Values cannot make a square matrix."); }
        height = width;

        break;
      case "object":
        width = data.length;
        height = data[0].length;

        break;
    }

    super(width * height);
    this.width = width;
    this.height = height;

    switch (typeof data[0]) {
      case "undefined":
        this[0] = 1;
        this[5] = 1;
        this[10] = 1;
        this[15] = 1;

        break;
      case "number":
        if (data.length == 2) { break; }

        for (let i = 0; i < data.length; i++) {
          this[i] = data[i] as number;
        }

        break;
      case "object":
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            if (!(data[i] as ArrayLike<number>)[j]) { throw new Error("Row lengths differ."); }
            this[i * height + j] = (data[i] as ArrayLike<number>)[j] as number;
          }
        }

        break;
    }
  }

  /**
   * Adds two matrices together.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the sum in.
   * @returns The sum.
   */
  public static add(a: Matrix, b: Matrix, out: Matrix = new Matrix(a.width, a.height)): Matrix {
    if (a.width != b.width || a.width != out.width || a.height != b.height || a.height != out.height) { throw new Error("Matrix size mismatch."); }

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
  public add(m: Matrix, out: Matrix = this): Matrix {
    return Matrix.add(this, m, out);
  }

  /**
   * Calculates the adjugate of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public static adjoint(m: Matrix, out: Matrix = new Matrix(m.height, m.width)): Matrix {
    return Matrix.transpose(Matrix.cofactor(m), out);
  }

  /**
   * Calculates the adjugate of this matrix.
   * @param out The matrix to store the adjugate in.
   * @returns The adjugate.
   */
  public adjoint(out: Matrix = this): Matrix {
    return Matrix.adjoint(this, out);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public clone(): Matrix {
    return new Matrix(this.width, this.height).copy(this);
  }

  /**
   * Copies the values in a matrix to another.
   * @param src The source matrix.
   * @param dst The destination matrix.
   * @returns The destination matrix.
   */
  public static copy(src: Matrix, dst: Matrix): Matrix {
    if (src.width != dst.width || src.height != dst.height) { throw new Error("Matrix size mismatch."); }

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
  public copy(src: Matrix): this {
    return Matrix.copy(src, this) as this;
  }

  /**
   * Calculates the cofactor of a matrix.
   * @param m The matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public static cofactor(m: Matrix, out: Matrix = new Matrix(m.width, m.height)): Matrix {
    if (m.width != out.width || m.height != out.height) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.width; i++) {
      for (let j = 0; j < m.height; j++) {
        out[i * m.height + j] = ((i + j) % 2 ? -1 : 1) * m.minor([i], [j]);
      }
    }

    return out;
  }

  /**
   * Calculates the cofactor of this matrix.
   * @param out The matrix to store the cofactor in.
   * @returns The cofactor.
   */
  public cofactor(out: Matrix = this): Matrix {
    return Matrix.cofactor(this, out);
  }

  /**
   * Calculates the determinant of a matrix.
   * @param m The matrix.
   * @returns The determinant.
   */
  public static determinant(m: Matrix): number {
    if (m.length == 1) { return m[0] as number; }

    if (m.width != m.height) { throw new Error("Matrix is not square."); }

    let out = 0;
    for (let i = 0; i < m.height; i++) {
      out += (i % 2 ? 1 : -1) * (m[i] as number) * m.minor([0], [i]);
    }

    return out;
  }

  /** The determinant of this matrix. */
  public get determinant(): number {
    return Matrix.determinant(this);
  }

  /**
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @returns Whether the matrices are equivalent.
   */
  public static equals(a: Matrix, b: Matrix): boolean {
    if (a.width != b.width || a.height != b.height) { return false; }

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
  public equals(m: Matrix): boolean {
    return Matrix.equals(this, m);
  }

  /**
   * Calculates the Frobenius norm of a matrix.
   * @param m The matrix.
   * @returns The Frobenius norm.
   */
  public static frob(m: Matrix): number {
    return Math.hypot(...m);
  }

  /** The Frobenius norm of this matrix. */
  public get frob(): number {
    return Matrix.frob(this);
  }

  /** The number of rows in this matrix. */
  public readonly height: number;

  /**
   * Sets a matrix to the identity.
   * @param m The matrix.
   * @returns The matrix.
   */
  public static identity(m: Matrix): Matrix {
    if (m.width != m.height) { throw new Error("Matrix is not square."); }

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
    return Matrix.identity(this) as this;
  }

  /**
   * Inverts a matrix.
   * @param m The matrix.
   * @param out The matrix to store the inverted matrix in.
   * @returns The inverted matrix.
   */
  public static invert(m: Matrix, out: Matrix = new Matrix(m.width, m.height)): Matrix {
    if (m.width != m.height) { throw new Error("Matrix is not square."); }

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
  public invert(out: Matrix = this): Matrix {
    return Matrix.invert(this, out);
  }

  /**
   * Calculates the minor of a matrix which results from removing the given rows and columns.
   * @param m The matrix.
   * @param rows The rows to remove.
   * @param cols The columns to remove.
   * @returns The minor.
   */
  public static minor(m: Matrix, rows: number[], cols: number[]): number {
    return Matrix.determinant(Matrix.submatrix(m, rows, cols));
  }

  /**
   * Calculates the minor of this matrix which results from removing the given rows and columns.
   * @param rows The rows to remove.
   * @param cols The columns to remove.
   * @returns The minor.
   */
  public minor(rows: number[], cols: number[]): number {
    return Matrix.minor(this, rows, cols);
  }

  /**
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiply(a: Matrix, b: Matrix, out: Matrix = new Matrix(b.width, a.height)): Matrix {
    if (a.height != out.height || a.width != b.height || b.width != out.width) { throw new Error("Matrix size mismatch."); }

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
  public multiply(m: Matrix, out: Matrix = new Matrix(m.width, this.height)): Matrix {
    return Matrix.multiply(this, m, out);
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiplyScalar(m: Matrix, s: number, out: Matrix = new Matrix(m.width, m.height)): Matrix {
    if (m.width != out.width || m.height != out.height) { throw new Error("Matrix size mismatch."); }

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
  public multiplyScalar(s: number, out: Matrix = this): Matrix {
    return Matrix.multiplyScalar(this, s, out);
  }

  /**
   * Creates a submatrix by removing the given rows and columns from a matrix.
   * @param m The matrix.
   * @param rows The rows to remove.
   * @param cols The columns to remove.
   * @param out The matrix to store the submatrix in.
   * @returns The submatrix.
   */
  public static submatrix(m: Matrix, rows: number[], cols: number[], out: Matrix = new Matrix(m.width - cols.length, m.height - rows.length)): Matrix {
    if (out.width != (m.width - cols.length) || out.height != (m.height - rows.length)) { throw new Error("Matrix size mismatch."); }

    let k = 0;
    for (let i = 0; i < m.width; i++) {
      if (i in cols) { continue; }

      for (let j = 0; j < m.height; j++) {
        if (j in rows) { continue; }

        out[k++] = m[i * m.height + j] as number;
      }
    }

    return out;
  }

  /**
   * Creates a submatrix by removing the given rows and columns from this matrix.
   * @param rows The rows to remove.
   * @param cols The columns to remove.
   * @param out The matrix to store the submatrix in.
   * @returns The submatrix.
   */
  public submatrix(rows: number[], cols: number[], out: Matrix = new Matrix(this.width - cols.length, this.height - rows.length)): Matrix {
    return Matrix.submatrix(this, rows, cols, out);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static subtract(a: Matrix, b: Matrix, out: Matrix = new Matrix(a.width, a.height)): Matrix {
    if (a.width != b.width || a.width != out.width || a.height != b.height || a.height != out.height) { throw new Error("Matrix size mismatch."); }

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
  public subtract(m: Matrix, out: Matrix = this): Matrix {
    return Matrix.subtract(this, m, out);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static transpose(m: Matrix, out: Matrix = new Matrix(m.height, m.width)): Matrix {
    if (m.width != out.width || m.height != out.height) { throw new Error("Matrix size mismatch."); }

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
  public transpose(out: Matrix = new Matrix(this.height, this.width)): Matrix {
    return Matrix.transpose(this, out);
  }

  /** The number of columns in this matrix. */
  public readonly width: number;
}
