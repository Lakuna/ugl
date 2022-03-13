import { Vector } from "./Vector.js";

/** A rectangular array of quantities in rows and columns that is treated as a single entity. */
export class Matrix extends Float32Array implements Readonly<Float32Array> {
  /** Creates a 4x4 identity matrix. */
  constructor();

  /**
   * Creates a matrix from the given columns.
   * @param columns - The columns in the matrix.
   */
  constructor(...columns: number[][]);

  /**
   * Creates a square matrix from the given values.
   * @param values - The values in the matrix in column-major order.
   */
  constructor(...values: number[]);

  constructor(...values: (number | number[])[]) {
    if (values.length) {
      if (Array.isArray(values[0])) {
        super(([] as number[]).concat(...values));
        this.width = values.length;
        this.height = (values[0] as number[]).length;
        if (this.length != this.width * this.height) { throw new Error("Every column in a matrix must be the same length."); }
      } else {
        super(values as number[]);
        const dim: number = Math.sqrt((values as number[]).length);
        if (dim % 1) { throw new Error("Matrices initialized from an array must be square."); }
        this.width = dim;
        this.height = dim;
      }
    } else {
      super([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
      this.width = 4;
      this.height = 4;
    }
  }

  /** The number of columns in this matrix. */
  readonly width: number;

  /** The number of rows in this matrix. */
  readonly height: number;

  /**
   * Multiplies this matrix with another.
   * @param other - The other matrix.
   * @returns The product of the matrices.
   */
  multiply(other: Matrix | Vector): Matrix {
    const columns: number[][] = [];

    const n: number = this.width;
    const m: number = other instanceof Matrix ? other.width : other.length;
    if (this.height != m) { throw new Error("Matrices don't share a dimension."); }
    const p: number = other instanceof Matrix ? other.height : 1;

    for (let i = 0; i < n; i++) {
      const column: number[] = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += (this[i * m + k] as number) * (other[k * p + j] as number);
        }
        column.push(sum);
      }
      columns.push(column);
    }

    return new Matrix(...columns);
  }

  /**
   * Removes the first column and the given row from this matrix. For use when calculating the determinant.
   * @param row - The row to remove.
   * @returns The resulting matrix.
   */
  #determinantSubsetMatrix(row: number): Matrix {
    const columns: number[][] = [];

    for (let x = 1; x < this.width; x++) {
      const column: number[] = [];
      for (let y = 0; y < this.height; y++) {
        if (y == row) { continue; }
        column.push(this[x * this.height + y] as number);
      }
      columns.push(column);
    }

    return new Matrix(...columns);
  }

  /** The determinant of this matrix. */
  get determinant(): number {
    // End of recursion.
    if (this.length == 1) {
      if (this[0]) { return this[0]; } else { throw new Error("Matrix has an undefined index."); }
    }

    if (this.width != this.height) { throw new Error("Matrix isn't square."); }

    let out = 0;
    for (let y = 0; y < this.height; y++) {
      out += -(y % 2 || -1) * (this[y] as number) * this.#determinantSubsetMatrix(y).determinant;
    }
    return out;
  }

  /**
   * Creates a matrix that translates a transformation matrix in 3-dimensional space.
   * @param x - The amount to translate by on the X axis.
   * @param y - The amount to translate by on the Y axis.
   * @param z - The amount to translate by on the Z axis.
   * @returns A transformation matrix.
   */
  static fromTranslation(x: number, y: number, z: number): Matrix {
    return new Matrix(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    );
  }

  /**
   * Translates this matrix in three-dimensional space.
   * @param x - The amount to translate by on the X axis.
   * @param y - The amount to translate by on the Y axis.
   * @param z - The amount to translate by on the Z axis.
   * @returns A transformation matrix.
   */
  translate(x: number, y: number, z: number): Matrix {
    return this.multiply(Matrix.fromTranslation(x, y, z));
  }

  /**
   * Creates a matrix that rotates a transformation matrix about the X axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  static fromRotationX(r: number): Matrix {
    const c: number = Math.cos(r);
    const s: number = Math.sin(r);

    return new Matrix(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Rotates this matrix in about the X axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  rotateX(r: number): Matrix {
    return this.multiply(Matrix.fromRotationX(r));
  }

  /**
   * Creates a matrix that rotates a transformation matrix about the Y axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  static fromRotationY(r: number): Matrix {
    const c: number = Math.cos(r);
    const s: number = Math.sin(r);

    return new Matrix(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Rotates this matrix in about the Y axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  rotateY(r: number): Matrix {
    return this.multiply(Matrix.fromRotationY(r));
  }

  /**
   * Creates a matrix that rotates a transformation matrix about the Z axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  static fromRotationZ(r: number): Matrix {
    const c: number = Math.cos(r);
    const s: number = Math.sin(r);

    return new Matrix(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  /**
   * Rotates this matrix in about the Z axis.
   * @param r - The angle of rotation in radians.
   * @returns A transformation matrix.
   */
  rotateZ(r: number): Matrix {
    return this.multiply(Matrix.fromRotationZ(r));
  }

  /**
   * Creates a matrix that rotates a transformation matrix in three-dimensional space.
   * @param x - The angle of rotation about the X axis in radians.
   * @param y - The angle of rotation about the Y axis in radians.
   * @param z - The angle of rotation about the Z axis in radians.
   * @returns A transformation matrix.
   */
  static fromRotation(x: number, y: number, z: number): Matrix {
    return Matrix.fromRotationX(x).rotateY(y).rotateZ(z);
  }

  /**
   * Rotates this matrix in three-dimensional space.
   * @param x - The angle of rotation about the X axis in radians.
   * @param y - The angle of rotation about the Y axis in radians.
   * @param z - The angle of rotation about the Z axis in radians.
   * @returns A transformation matrix.
   */
  rotate(x: number, y: number, z: number): Matrix {
    return this.multiply(Matrix.fromRotation(x, y, z));
  }

  /**
   * Creates a matrix that scales a transformation matrix in three-dimensional space.
   * @param x - The scaling factor on the X axis.
   * @param y - The scaling factor on the Y axis.
   * @param z - The scaling factor on the Z axis.
   * @returns A transformation matrix.
   */
  static fromScale(x: number, y: number, z: number): Matrix {
    return new Matrix(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, z
    );
  }

  /**
   * Scales this matrix in three-dimensional space.
   * @param x - The scaling factor on the X axis.
   * @param y - The scaling factor on the Y axis.
   * @param z - The scaling factor on the Z axis.
   * @returns A transformation matrix.
   */
  scale(x: number, y: number, z: number): Matrix {
    return this.multiply(Matrix.fromScale(x, y, z));
  }

  /**
   * Creates an identity matrix with the given dimensions.
   * @param dim - The width and height of the identity matrix.
   * @returns An identity matrix.
   */
  static identity(dim: number): Matrix {
    const out: number[] = [];

    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        out[x * dim + y] = x == y ? 1 : 0;
      }
    }

    return new Matrix(...out);
  }

  /**
   * Inverts this matrix.
   * @returns The inverted matrix.
   */
  invert(): Matrix {
    if (this.width != this.height) { throw new Error("Matrix must be square."); }

    const dim: number = this.width;
    const identity: Matrix = Matrix.identity(dim);
    const copy: Matrix = new Matrix(...this);

    for (let x = 0; x < dim; x++) {
      let diagonal: number = copy[x * dim + x] as number;
      if (!diagonal) {
        for (let xx: number = x + 1; xx < dim; xx++) {
          if (copy[xx * dim + x]) {
            for (let y = 0; y < dim; y++) {
              for (const matrix of [copy, identity]) {
                [matrix[x * dim + y], matrix[xx * dim + y]]
                  = [matrix[xx * dim + y] as number, matrix[x * dim + y] as number];
              }
            }
            break;
          }
        }

        diagonal = copy[x * dim + x] as number;
        if (!diagonal) { throw new Error("Matrix is not invertible."); }
      }

      for (let y = 0; y < dim; y++) {
        for (const matrix of [copy, identity]) {
          matrix[x * dim + y] /= diagonal;
        }
      }

      for (let xx = 0; xx < dim; xx++) {
        if (xx == x) { continue; }
        const temp: number = copy[xx * dim + x] as number;
        for (let y = 0; y < dim; y++) {
          for (const matrix of [copy, identity]) {
            matrix[xx * dim + y] -= temp * (matrix[x * dim + y] as number);
          }
        }
      }
    }

    return identity;
  }

  /**
   * Transposes this matrix.
   * @returns The transposed matrix.
   */
  transpose(): Matrix {
    const columns: number[][] = [];

    for (let x = 0; x < this.width; x++) {
      const column: number[] = [];
      for (let y = 0; y < this.height; y++) {
        column.push(this[y * this.height + x] as number);
      }
      columns.push(column);
    }

    return new Matrix(...columns);
  }

  /**
   * Creates a transformation matrix which applies an orthographic projection to a transformation matrix.
   * @param left - The left boundary of the output.
   * @param right - The right boundary of the output.
   * @param bottom - The bottom boundary of the output.
   * @param top - The top boundary of the output.
   * @param near - The near boundary of the output.
   * @param far - The far boundary of the output.
   * @returns A transformation matrix.
   */
  static fromOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    return new Matrix(
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
      (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
    );
  }

  /**
   * Applies an orthographic projection to this matrix.
   * @param left - The left boundary of the output.
   * @param right - The right boundary of the output.
   * @param bottom - The bottom boundary of the output.
   * @param top - The top boundary of the output.
   * @param near - The near boundary of the output.
   * @param far - The far boundary of the output.
   * @returns The projected matrix.
   */
  orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    return this.multiply(Matrix.fromOrthographic(left, right, bottom, top, near, far));
  }

  /**
   * Creates a transformation matrix which applies perspective to a transformation matrix.
   * @param fov - The field of view of the projection in radians.
   * @param aspectRatio - The aspect ratio of the output.
   * @param near - The near boundary of the output.
   * @param far - The far boundary of the output.
   * @returns A transformation matrix.
   */
  static fromPerspective(fov: number, aspectRatio: number, near: number, far: number): Matrix {
    const f: number = Math.tan(Math.PI / 2 - fov / 2);
    const range: number = 1 / (near - far);

    return new Matrix(
      f / aspectRatio, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * range, -1,
      0, 0, near * far * range * 2, 0
    );
  }

  /**
   * Applies perspective to this matrix.
   * @param fov - The field of view of the projection in radians.
   * @param aspectRatio - The aspect ratio of the output.
   * @param near - The near boundary of the output.
   * @param far - The far boundary of the output.
   * @returns The projected matrix.
   */
  perspective(fov: number, aspectRatio: number, near: number, far: number): Matrix {
    return this.multiply(Matrix.fromPerspective(fov, aspectRatio, near, far));
  }

  /**
   * Creates a transformation matrix that translates and rotates a transformation matrix so that it is pointing towards a target.
   * @param position - The new position of the matrix.
   * @param target - The position to rotate towards.
   * @param up - The up vector.
   * @returns A transformation matrix.
   */
  static fromLookAt(position: Vector, target: Vector, up: Vector): Matrix {
    const zAxis: Vector = position.subtract(target).normalize();
    const xAxis: Vector = up.cross(zAxis).normalize();
    const yAxis: Vector = zAxis.cross(xAxis).normalize();

    return new Matrix(
      ...xAxis, 0,
      ...yAxis, 0,
      ...zAxis, 0,
      ...position, 1
    );
  }

  /**
   * Translates and rotates a this matrix so that it is pointing towards a target.
   * @param position - The new position of the matrix.
   * @param target - The position to rotate towards.
   * @param up - The up vector.
   * @returns The transformed matrix.
   */
  lookAt(position: Vector, target: Vector, up: Vector): Matrix {
    return this.multiply(Matrix.fromLookAt(position, target, up));
  }

  /**
   * Multiplies the values of this matrix by a scalar value.
   * @param s - The scalar value.
   * @returns The scaled matrix.
   */
  multiplyScalar(s: number): Matrix {
    const columns: number[][] = []
    for (let x = 0; x < this.width; x++) {
      const column: number[] = []
      for (let y = 0; y < this.height; y++) {
        column.push((this[x * this.height + y] as number) * s);
      }
      columns.push(column);
    }
    return new Matrix(...columns);
  }
}
