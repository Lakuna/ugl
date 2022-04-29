import { IMatrix } from "./IMatrix.js";
import { Matrix } from "./Matrix.js";

export class Matrix3 extends Float32Array implements IMatrix {
  /** Creates a 3x3 identity matrix. */
  public constructor();

  /**
   * Creates a 3x3 matrix from the given values.
   * @param c1r1 - The value in the first column and first row.
   * @param c1r2 - The value in the first column and second row.
   * @param c1r3 - The value in the first column and third row.
   * @param c2r1 - The value in the second column and first row.
   * @param c2r2 - The value in the second column and second row.
   * @param c2r3 - The value in the second column and third row.
   * @param c3r1 - The value in the third column and first row.
   * @param c3r2 - The value in the third column and second row.
   * @param c3r3 - The value in the third column and third row.
   */
  public constructor(c1r1: number, c1r2: number, c1r3: number, c2r1: number, c2r2: number, c2r3: number, c3r1: number, c3r2: number, c3r3: number);

  public constructor(c1r1 = 1, c1r2 = 0, c1r3 = 0, c2r1 = 0, c2r2 = 1, c2r3 = 0, c3r1 = 0, c3r2 = 0, c3r3 = 1) {
    super(9);

    this[0] = c1r1;
    this[1] = c1r2;
    this[2] = c1r3;
    this[3] = c2r1;
    this[4] = c2r2;
    this[5] = c2r3;
    this[6] = c3r1;
    this[7] = c3r2;
    this[8] = c3r3;

    this.width = 3;
    this.height = 3;
  }

  /**
   * Adds another matrix to this one.
   * @param matrix - The other matrix.
   * @returns This matrix, containing the sum of the factors.
   */
  public add(matrix: Matrix3): this {
    this[0] += matrix[0] as number;
    this[1] += matrix[1] as number;
    this[2] += matrix[2] as number;
    this[3] += matrix[3] as number;
    this[4] += matrix[4] as number;
    this[5] += matrix[5] as number;
    this[6] += matrix[6] as number;
    this[7] += matrix[7] as number;
    this[8] += matrix[8] as number;

    return this;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This matrix, with its contents set to its adjugate.
   */
  public adjoint(): this {
    return this.setContents(
      (this[4] as number) * (this[8] as number) - (this[5] as number) * (this[7] as number),
      (this[2] as number) * (this[7] as number) - (this[1] as number) * (this[8] as number),
      (this[1] as number) * (this[5] as number) - (this[2] as number) * (this[4] as number),
      (this[5] as number) * (this[6] as number) - (this[3] as number) * (this[8] as number),
      (this[0] as number) * (this[8] as number) - (this[2] as number) * (this[6] as number),
      (this[2] as number) * (this[3] as number) - (this[0] as number) * (this[5] as number),
      (this[3] as number) * (this[7] as number) - (this[4] as number) * (this[6] as number),
      (this[1] as number) * (this[6] as number) - (this[0] as number) * (this[7] as number),
      (this[0] as number) * (this[4] as number) - (this[1] as number) * (this[3] as number)
    );
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A clone of this matrix.
   */
  public clone(): Matrix3 {
    return new Matrix3(
      this[0] as number, this[1] as number, this[2] as number,
      this[3] as number, this[4] as number, this[5] as number,
      this[6] as number, this[7] as number, this[8] as number
    );
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
    return (this[0] as number) * ((this[8] as number) * (this[4] as number) - (this[5] as number) * (this[7] as number)) +
      (this[1] as number) * (-(this[8] as number) * (this[3] as number) + (this[5] as number) * (this[6] as number)) +
      (this[2] as number) * ((this[7] as number) * (this[3] as number) - (this[4] as number) * (this[6] as number));
  }

  /**
   * Checks whether this matrix has the same elements as another.
   * @param matrix - The other matrix.
   * @returns Whether the matrices have the same elements.
   */
  public equals(matrix: Matrix3): boolean {
    return this[0] == matrix[0]
      && this[1] == matrix[1]
      && this[2] == matrix[2]
      && this[3] == matrix[3]
      && this[4] == matrix[4]
      && this[5] == matrix[5]
      && this[6] == matrix[6]
      && this[7] == matrix[7]
      && this[8] == matrix[8];
  }

  /** The Frobenius norm of this matrix. */
  public get frob(): number {
    return Math.hypot(
      this[0] as number, this[1] as number, this[2] as number,
      this[3] as number, this[4] as number, this[5] as number,
      this[6] as number, this[7] as number, this[8] as number
    );
  }

  /** The number of rows in this matrix. */
  public readonly height: number;

  /**
   * Resets this matrix to the identity matrix.
   * @returns This matrix, with its contents set to the identity.
   */
  public identity(): this {
    return this.setContents(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }

  /**
   * Inverts this matrix.
   * @returns This matrix, with its contents inverted.
   */
  public invert(): this {
    const d: number = 1 / this.determinant;

    return this.setContents(
      ((this[8] as number) * (this[4] as number) - (this[5] as number) * (this[7] as number)) * d,
      (-(this[8] as number) * (this[1] as number) + (this[2] as number) * (this[7] as number)) * d,
      ((this[5] as number) * (this[1] as number) - (this[2] as number) * (this[4] as number)) * d,
      (-(this[8] as number) * (this[3] as number) + (this[5] as number) * (this[6] as number)) * d,
      ((this[8] as number) * (this[0] as number) - (this[2] as number) * (this[6] as number)) * d,
      (-(this[5] as number) * (this[0] as number) + (this[2] as number) * (this[3] as number)) * d,
      ((this[7] as number) * (this[3] as number) - (this[4] as number) * (this[6] as number)) * d,
      (-(this[7] as number) * (this[0] as number) + (this[1] as number) * (this[6] as number)) * d,
      ((this[4] as number) * (this[0] as number) - (this[1] as number) * (this[3] as number)) * d
    );
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
  public multiply(matrix: Matrix3): this {
    return this.setContents(
      (matrix[0] as number) * (this[0] as number) + (matrix[1] as number) * (this[3] as number) + (matrix[2] as number) * (this[6] as number),
      (matrix[0] as number) * (this[1] as number) + (matrix[1] as number) * (this[4] as number) + (matrix[2] as number) * (this[7] as number),
      (matrix[0] as number) * (this[2] as number) + (matrix[1] as number) * (this[5] as number) + (matrix[2] as number) * (this[8] as number),
      (matrix[3] as number) * (this[0] as number) + (matrix[4] as number) * (this[3] as number) + (matrix[5] as number) * (this[6] as number),
      (matrix[3] as number) * (this[1] as number) + (matrix[4] as number) * (this[4] as number) + (matrix[5] as number) * (this[7] as number),
      (matrix[3] as number) * (this[2] as number) + (matrix[4] as number) * (this[5] as number) + (matrix[5] as number) * (this[8] as number),
      (matrix[6] as number) * (this[0] as number) + (matrix[7] as number) * (this[3] as number) + (matrix[8] as number) * (this[6] as number),
      (matrix[6] as number) * (this[1] as number) + (matrix[7] as number) * (this[4] as number) + (matrix[8] as number) * (this[7] as number),
      (matrix[6] as number) * (this[2] as number) + (matrix[7] as number) * (this[5] as number) + (matrix[8] as number) * (this[8] as number)
    );
  }

  /**
   * Multiplies this matrix by a scalar number.
   * @param scalar - The scalar number.
   * @returns This matrix, containing the product of the factors.
   */
  public multiplyScalar(scalar: number): this {
    this[0] *= scalar;
    this[1] *= scalar;
    this[2] *= scalar;
    this[3] *= scalar;
    this[4] *= scalar;
    this[5] *= scalar;
    this[6] *= scalar;
    this[7] *= scalar;
    this[8] *= scalar;

    return this;
  }

  /**
   * Sets the contents of this matrix.
   * @param c1r1 - The value in the first column and first row.
   * @param c1r2 - The value in the first column and second row.
   * @param c1r3 - The value in the first column and third row.
   * @param c2r1 - The value in the second column and first row.
   * @param c2r2 - The value in the second column and second row.
   * @param c2r3 - The value in the second column and third row.
   * @param c3r1 - The value in the third column and first row.
   * @param c3r2 - The value in the third column and second row.
   * @param c3r3 - The value in the third column and third row.
   * @returns This matrix, with its contents replaced with the given values.
   */
  public setContents(c1r1: number, c1r2: number, c1r3: number, c2r1: number, c2r2: number, c2r3: number, c3r1: number, c3r2: number, c3r3: number): this {
    this[0] = c1r1;
    this[1] = c1r2;
    this[2] = c1r3;
    this[3] = c2r1;
    this[4] = c2r2;
    this[5] = c2r3;
    this[6] = c3r1;
    this[7] = c3r2;
    this[8] = c3r3;

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
  public subtract(matrix: Matrix3): this {
    this[0] -= matrix[0] as number;
    this[1] -= matrix[1] as number;
    this[2] -= matrix[2] as number;
    this[3] -= matrix[3] as number;
    this[4] -= matrix[4] as number;
    this[5] -= matrix[5] as number;
    this[6] -= matrix[6] as number;
    this[7] -= matrix[7] as number;
    this[8] -= matrix[8] as number;

    return this;
  }

  /**
   * Transposes this matrix.
   * @returns This matrix, with its contents transposed.
   */
  public transpose(): this {
    [this[1], this[3]] = [this[3] as number, this[1] as number];
    [this[2], this[6]] = [this[6] as number, this[2] as number];
    [this[5], this[7]] = [this[7] as number, this[5] as number];

    return this;
  }

  /** The number of columns in this matrix. */
  public readonly width: number;
}
