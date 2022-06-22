import { MatrixSizeError } from "./MatrixSizeError.js";

/** A collection of numbers arranged in columns and rows. */
export class Matrix extends Float32Array {
  /**
   * Creates a matrix.
   * @param width The number of columns in the matrix.
   * @param height The number of rows in the matrix.
   */
  public constructor(width: number, height: number) {
    super(width * height);
    this.width = width;
    this.height = height;
  }

  /**
   * Adds another matrix to this one.
   * @param b The other matrix.
   * @returns The sum.
   */
  public add(b: Matrix): this {
    if (this.width != b.width || this.height != b.height) { throw new MatrixSizeError(); }

    for (let i = 0; i < this.length; i++) {
      this[i] += b[i] as number;
    }

    return this;
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public clone(): Matrix {
    const out: Matrix = new Matrix(this.width, this.height);

    for (let i = 0; i < out.length; i++) {
      out[i] = this[i] as number;
    }

    return out;
  }

  /**
   * Determines whether this matrix is equivalent to another.
   * @param b The other matrix.
   * @param epsilon The maximum allowed difference between the matrices.
   * @returns Whether the matrices are equivalent.
   */
  public equals(b: Matrix, epsilon = 0.000001): boolean {
    if (this.width != b.width || this.height != b.height) { return false; }

    for (let i = 0; i < this.length; i++) {
      if (Math.abs((this[i] as number) - (b[i] as number)) > epsilon) { return false; }
    }

    return true;
  }

  /** The Frobenius norm of this matrix. */
  public get frob(): number {
    return Math.hypot(...this);
  }

  /** The number of rows in this matrix. */
  public readonly height: number;

  /**
   * Multiplies this matrix by another.
   * @param b The other matrix.
   * @returns The product.
   */
  public multiply(b: Matrix): Matrix {
    if (this.width != b.height) { throw new MatrixSizeError(); }

    const n: number = this.height;
    const m: number = this.width;
    const p: number = b.width;

    const out: Matrix = new Matrix(n, p);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += (this[k * this.height + i] as number) * (b[j * b.height + k] as number);
        }

        out[j * out.height + i] = sum;
      }
    }

    return out;
  }

  /**
   * Multiplies this matrix by a scalar.
   * @param b The scalar.
   * @returns The product.
   */
  public multiplyScalar(b: number): this {
    for (let i = 0; i < this.length; i++) {
      this[i] *= b;
    }

    return this;
  }

  /**
   * Subtracts another matrix from this one.
   * @param b The other matrix.
   * @returns The difference.
   */
  public subtract(b: Matrix): this {
    if (this.width != b.width || this.height != b.height) { throw new MatrixSizeError(); }

    for (let i = 0; i < this.length; i++) {
      this[i] -= b[i] as number;
    }

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  public transpose(): Matrix {
    const out: Matrix = new Matrix(this.height, this.width);

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        out[j * out.height + i] = this[i * this.height + j] as number;
      }
    }

    return out;
  }

  /** The number of columns in this matrix. */
  public readonly width: number;
}
