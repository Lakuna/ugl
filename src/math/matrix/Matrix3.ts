import { IMatrix } from "./IMatrix.js";
import { Matrix } from "./Matrix.js";
import { Matrix4 } from "./Matrix4.js";

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
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    return this.setContents(
      a11 * a22 - a12 * a21,
      a02 * a21 - a01 * a22,
      a01 * a12 - a02 * a11,
      a12 * a20 - a10 * a22,
      a00 * a22 - a02 * a20,
      a02 * a10 - a00 * a12,
      a10 * a21 - a11 * a20,
      a01 * a20 - a00 * a21,
      a00 * a11 - a01 * a10
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
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    return a00 * (a22 * a11 - a12 * a21) +
      a01 * (-a22 * a10 + a12 * a20) +
      a02 * (a21 * a10 - a11 * a20)
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

  /**
   * Creates a transformation matrix that rotates a matrix by the given angle.
   * @param angle - The angle in radians.
   * @returns A transformation matrix that rotates a matrix by the given angle.
   */
  public static fromRotation(angle: number): Matrix3 {
    const s: number = Math.sin(angle);
    const c: number = Math.cos(angle);

    return new Matrix3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that scales a matrix by the given factors.
   * @param x - The scaling factor on the horizontal axis.
   * @param y - The scaling factor on the vertical axis.
   * @returns A transformation matrix that scales a matrix by the given factors.
   */
  public static fromScaling(x: number, y: number): Matrix3 {
    return new Matrix3(
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    );
  }

  /**
   * Creates a transformation matrix that translates a matrix by the given amounts.
   * @param x - The magnitude of the translation on the horizontal axis.
   * @param y - The magnitude of the translation on the vertical axis.
   * @returns A transformation matrix that scales a matrix by the given factors.
   */
  public static fromTranslation(x: number, y: number): Matrix3 {
    return new Matrix3(
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    );
  }

  /**
   * Creates a transformation matrix that rotates a matrix by the rotation described by the given quaternion.
   * @param x - The first component of the quaternion.
   * @param y - The second component of the quaternion.
   * @param z - The third component of the quaternion.
   * @param w - The fourth component of the quaternion.
   * @returns A transformation matrix that rotates a matrix by the rotation described by the given quaternion.
   */
  public static fromQuaternion(x: number, y: number, z: number, w: number): Matrix3 {
    const x2: number = x + x;
    const y2: number = y + y;
    const z2: number = z + z;

    const xx: number = x * x2;
    const yx: number = y * x2;
    const yy: number = y * y2;
    const zx: number = z * x2;
    const zy: number = z * y2;
    const zz: number = z * z2;
    const wx: number = w * x2;
    const wy: number = w * y2;
    const wz: number = w * z2;

    return new Matrix3(
      1 - yy - zz,
      yx + wz,
      zx - wy,
      yx - wz,
      1 - xx - zz,
      zy + wx,
      zx + wy,
      zy - wx,
      1 - xx - yy
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
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    const b01: number = a22 * a11 - a12 * a21;
    const b11: number = -a22 * a10 + a12 * a20;
    const b21: number = a21 * a10 - a11 * a20;

    const det: number = 1 / (a00 * b01 + a01 * b11 + a02 * b21);

    return this.setContents(
      b01 * det,
      (-a22 * a01 + a02 * a21) * det,
      (a12 * a01 - a02 * a11) * det,
      b11 * det,
      (a22 * a00 - a02 * a20) * det,
      (-a12 * a00 + a02 * a10) * det,
      b21 * det,
      (-a21 * a00 + a01 * a20) * det,
      (a11 * a00 - a01 * a10) * det
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
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    const b00: number = matrix[0] as number;
    const b01: number = matrix[1] as number;
    const b02: number = matrix[2] as number;
    const b10: number = matrix[3] as number;
    const b11: number = matrix[4] as number;
    const b12: number = matrix[5] as number;
    const b20: number = matrix[6] as number;
    const b21: number = matrix[7] as number;
    const b22: number = matrix[8] as number;

    return this.setContents(
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22
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
   * Calculates a 3x3 normal (transposed inverse) matrix from a 4x4 transformation matrix.
   * @param matrix - The 4x4 transformation matrix.
   * @returns The normal matrix.
   */
  public static normalFromMatrix4(matrix: Matrix4): Matrix3 {
    const a00: number = matrix[0] as number;
    const a01: number = matrix[1] as number;
    const a02: number = matrix[2] as number;
    const a03: number = matrix[3] as number;
    const a10: number = matrix[4] as number;
    const a11: number = matrix[5] as number;
    const a12: number = matrix[6] as number;
    const a13: number = matrix[7] as number;
    const a20: number = matrix[8] as number;
    const a21: number = matrix[9] as number;
    const a22: number = matrix[10] as number;
    const a23: number = matrix[11] as number;
    const a30: number = matrix[12] as number;
    const a31: number = matrix[13] as number;
    const a32: number = matrix[14] as number;
    const a33: number = matrix[15] as number;

    const b00: number = a00 * a11 - a01 * a10;
    const b01: number = a00 * a12 - a02 * a10;
    const b02: number = a00 * a13 - a03 * a10;
    const b03: number = a01 * a12 - a02 * a11;
    const b04: number = a01 * a13 - a03 * a11;
    const b05: number = a02 * a13 - a03 * a12;
    const b06: number = a20 * a31 - a21 * a30;
    const b07: number = a20 * a32 - a22 * a30;
    const b08: number = a20 * a33 - a23 * a30;
    const b09: number = a21 * a32 - a22 * a31;
    const b10: number = a21 * a33 - a23 * a31;
    const b11: number = a22 * a33 - a23 * a32;

    const det: number = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    return new Matrix3(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det
    );
  }

  /**
   * Generates a two-dimensional projection matrix with the given bounds.
   * @param width - The horizontal size of the rendering context.
   * @param height - The vertical size of the rendering context.
   * @returns A two-dimensional projection matrix with the given bounds.
   */
  public static projection(width: number, height: number): Matrix3 {
    return new Matrix3(
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    );
  }

  /**
   * Rotates this matrix by the given angle.
   * @param angle - The angle in radians.
   * @returns This matrix, with its transformation rotated.
   */
  public rotate(angle: number): this {
    const a00: number = this[0] as number;
    const a01: number = this[1] as number;
    const a02: number = this[2] as number;
    const a10: number = this[3] as number;
    const a11: number = this[4] as number;
    const a12: number = this[5] as number;
    const a20: number = this[6] as number;
    const a21: number = this[7] as number;
    const a22: number = this[8] as number;

    const s: number = Math.sin(angle);
    const c: number = Math.cos(angle);

    return this.setContents(
      c * a00 + s * a10,
      c * a01 + s * a11,
      c * a02 + s * a12,
      c * a10 - s * a00,
      c * a11 - s * a01,
      c * a12 - s * a02,
      a20,
      a21,
      a22
    );
  }

  /**
   * Scales this matrix by the given factors.
   * @param x - The scaling factor on the horizontal axis.
   * @param y - The scaling factor on the vertical axis.
   * @returns This matrix, with its transformation scaled.
   */
  public scale(x: number, y: number): this {
    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= y;
    this[4] *= y;
    this[5] *= y;

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
   * Translates this matrix by the given amounts.
   * @param x - The scaling factor on the horizontal axis.
   * @param y - The scaling factor on the vertical axis.
   * @returns This matrix, with its transformation scaled.
   */
  public translate(x: number, y: number): this {
    this[6] += x * (this[0] as number) + y * (this[3] as number);
    this[7] += x * (this[1] as number) + y * (this[4] as number);
    this[8] += x * (this[2] as number) + y * (this[5] as number);

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
