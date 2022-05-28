/** A collection of numbers arranged in columns and rows. */
export class Matrix extends Float32Array {
  /**
   * Creates a matrix.
   * @param cols The columns in the matrix.
   */
  public constructor(...cols: ArrayLike<number>[]) {
    const width: number = cols.length;
    const height: number = cols[0]?.length ?? 0;

    super(width * height);

    this.width = width;
    this.height = height;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (typeof (cols[i] as ArrayLike<number>)[j] != "number") { throw new Error("Column heights differ."); }
        this[i * height + j] = (cols[i] as ArrayLike<number>)[j] as number;
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
  public static add<T extends Matrix>(a: Matrix, b: Matrix, out: T): T {
    if (a.width != b.width || a.width != out.width || a.height != b.height || a.height != out.height) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < a.width * a.height; i++) {
      out[i] = (a[i] as number) + (b[i] as number);
    }

    return out;
  }

  /**
   * Adds another matrix to this one.
   * @param m The matrix.
   * @returns The sum.
   */
  public add(m: Matrix): this {
    return Matrix.add(this, m, this);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns The new matrix.
   */
  public clone(): Matrix {
    return new Matrix(...(this.reduce((previousValue: number[][], currentValue: number, index: number): number[][] => {
      const chunkIndex: number = Math.floor(index / this.height);
      previousValue[chunkIndex] ??= [];
      (previousValue[chunkIndex] as number[]).push(currentValue);
      return previousValue;
    }, [] as number[][])));
  }

  /**
   * Determines whether two matrices are equivalent.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param epsilon The maximum allowed difference between the matrices to count as equivalent.
   * @returns Whether the matrices are equivalent.
   */
  public static equals(a: Matrix, b: Matrix, epsilon = 0.000001): boolean {
    if (a.width != b.width || a.height != b.height) { return false; }

    for (let i = 0; i < a.length; i++) {
      if (Math.abs((a[i] as number) - (b[i] as number)) > epsilon) { return false; }
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

  /**
   * Creates an empty matrix with the given dimensions.
   * @param width The number of columns in the matrix.
   * @param height The number of rows in the matrix.
   * @returns The matrix.
   */
  public static fromDimensions(width: number, height: number): Matrix {
    return new Matrix(...(new Array(width).fill(new Array(height).fill(0))));
  }

  /** The number of rows in this matrix. */
  public readonly height: number;

  /**
   * Multiplies two matrices.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiply<T extends Matrix>(a: Matrix, b: Matrix, out: T): T {
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
   * @returns The product.
   */
  public multiply(m: Matrix): Matrix {
    return Matrix.multiply(this, m, Matrix.fromDimensions(m.width, this.height));
  }

  /**
   * Multiplies a matrix by a scalar.
   * @param m The matrix.
   * @param s The scalar.
   * @param out The matrix to store the product in.
   * @returns The product.
   */
  public static multiplyScalar<T extends Matrix>(m: Matrix, s: number, out: T): T {
    if (m.width != out.width || m.height != out.height) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.length; i++) {
      out[i] = (m[i] as number) * s;
    }

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param s The scalar.
   * @returns The product.
   */
  public multiplyScalar(s: number): this {
    return Matrix.multiplyScalar(this, s, this);
  }

  /**
   * Subtracts one matrix from another.
   * @param a The first matrix.
   * @param b The second matrix.
   * @param out The matrix to store the difference in.
   * @returns The difference.
   */
  public static subtract<T extends Matrix>(a: Matrix, b: Matrix, out: T): T {
    if (a.width != b.width || a.width != out.width || a.height != b.height || a.height != out.height) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < a.width * a.height; i++) {
      out[i] = (a[i] as number) - (b[i] as number);
    }

    return out;
  }

  /**
   * Subtracts another matrix from this one.
   * @returns The difference.
   */
  public subtract(m: Matrix): this {
    return Matrix.subtract(this, m, this);
  }

  /**
   * Transposes a matrix.
   * @param m The matrix to transpose.
   * @param out The matrix to store the transposed matrix in.
   * @returns The transposed matrix.
   */
  public static transpose<T extends Matrix>(m: Matrix, out: T): T {
    if (m.width != out.height || m.height != out.width) { throw new Error("Matrix size mismatch."); }

    for (let i = 0; i < m.width; i++) {
      for (let j = 0; j < m.height; j++) {
        out[j * out.height + i] = m[i * m.height + j] as number;
      }
    }

    return out;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public transpose(): Matrix {
    return Matrix.transpose(this, Matrix.fromDimensions(this.height, this.width));
  }

  /** The number of columns in this matrix. */
  public readonly width: number;
}
