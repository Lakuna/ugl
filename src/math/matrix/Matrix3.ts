import { Numbers1x2, Numbers1x4, Numbers3x3, Numbers4x4 } from "../../types/Numbers.js";
import { mat3 } from "gl-matrix";

/** A 3x3 matrix. */
export class Matrix3 extends Float32Array {
  /** Creates a 3x3 identity matrix. */
  constructor();

  /** Creates a copy of a 3x3 matrix. */
  constructor(data: Numbers3x3);

  /**
   * Creates a 3x3 matrix from values.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x0y2 - The value in the third row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @param x1y2 - The value in the third row and second column.
   * @param x2y0 - The value in the first row and third column.
   * @param x2y1 - The value in the second row and third column.
   * @param x2y2 - The value in the third row and third column.
   */
  constructor(
    x0y0: number, x0y1: number, x0y2: number,
    x1y0: number, x1y1: number, x1y2: number,
    x2y0: number, x2y1: number, x2y2: number
  );

  constructor(
    x0y0?: number | Numbers3x3, x0y1?: number, x0y2?: number,
    x1y0?: number, x1y1?: number, x1y2?: number,
    x2y0?: number, x2y1?: number, x2y2?: number
  ) {
    if (x0y0) {
      if (typeof x0y0 == "number") {
        super([
          x0y0 as number, x0y1 as number, x0y2 as number,
          x1y0 as number, x1y1 as number, x1y2 as number,
          x2y0 as number, x2y1 as number, x2y2 as number
        ]);
      } else {
        super(x0y0);
      }
    } else {
      super(9);

      this[0] = 1;
      this[4] = 1;
      this[8] = 1;
    }
  }

  /**
   * Copies the upper-left 3x3 values of a 4x4 matrix into this matrix.
   * @param m - The 4x4 matrix.
   * @returns This.
   */
  fromMatrix4(m: Numbers4x4): this {
    return mat3.fromMat4(this, m) as this;
  }

  /**
   * Creates a clone of this matrix.
   * @returns A clone of this matrix.
   */
  get clone(): Matrix3 {
    return new Matrix3(this);
  }

  /**
   * Copy the values from another matrix into this one.
   * @param m - The other matrix.
   * @returns This.
   */
  copy(m: Numbers3x3): this {
    return mat3.copy(this, m) as this;
  }

  /**
   * Sets the values in this matrix.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x0y2 - The value in the third row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @param x1y2 - The value in the third row and second column.
   * @param x2y0 - The value in the first row and third column.
   * @param x2y1 - The value in the second row and third column.
   * @param x2y2 - The value in the third row and third column.
   * @returns This.
   */
  setValues(
    x0y0: number, x0y1: number, x0y2: number,
    x1y0: number, x1y1: number, x1y2: number,
    x2y0: number, x2y1: number, x2y2: number
  ): this {
    return mat3.set(this,
      x0y0, x0y1, x0y2,
      x1y0, x1y1, x1y2,
      x2y0, x2y1, x2y2
    ) as this;
  }

  /**
   * Resets this matrix to identity.
   * @returns This.
   */
  identity(): this {
    return mat3.identity(this) as this;
  }

  /**
   * Transposes this matrix.
   * @returns This.
   */
  transpose(): this {
    return mat3.transpose(this, this) as this;
  }

  /**
   * Inverts this matrix.
   * @returns This.
   */
  invert(): this {
    return mat3.invert(this, this) as this;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This.
   */
  adjoint(): this {
    return mat3.adjoint(this, this) as this;
  }

  /** The determinant of this matrix. */
  get determinant(): number {
    return mat3.determinant(this);
  }

  /**
   * Multiplies two matrices together.
   * @param m - The other matrix.
   * @returns This.
   */
  multiply(m: Numbers3x3): this {
    return mat3.multiply(this, this, m) as this;
  }

  /**
   * Translates this matrix by the given vector.
   * @param v - The vector to translate by.
   * @returns This.
   */
  translate(v: Numbers1x2): this {
    return mat3.translate(this, this, v) as this;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r - The angle to rotate by in radians.
   * @returns This.
   */
  rotate(r: number): this {
    return mat3.rotate(this, this, r) as this;
  }

  /**
   * Scales this matrix by the given dimensions.
   * @param v - The vector to scale by.
   * @returns This.
   */
  scale(v: Numbers1x2): this {
    return mat3.scale(this, this, v) as this;
  }

  /**
   * Sets the values of this matrix from a vector translation.
   * @param v - The translation vector.
   * @returns This.
   */
  fromTranslation(v: Numbers1x2): this {
    return mat3.fromTranslation(this, v) as this;
  }

  /**
   * Sets the values of this matrix from a rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  fromRotation(r: number): this {
    return mat3.fromRotation(this, r) as this;
  }

  /**
   * Sets the values of this matrix from a vector scaling.
   * @param v - The scaling vector.
   * @returns This.
   */
  fromScaling(v: Numbers1x2): this {
    return mat3.fromScaling(this, v) as this;
  }

  /**
   * Sets the values of this matrix from a quaternion.
   * @param q - The quaternion.
   * @returns This.
   */
  fromQuaternion(q: Numbers1x4): this {
    return mat3.fromQuat(this, q) as this;
  }

  /**
   * Sets the values of this matrix to the normal matrix of a 4x4 matrix.
   * @param m - The 4x4 matrix.
   * @returns This.
   */
  normalFromMatrix4(m: Numbers4x4): this {
    return mat3.normalFromMat4(this, m) as this;
  }

  /**
   * Sets the values of this matrix to a 2D projection matrix.
   * @param width - The width of the projection.
   * @param height - The height of the projection.
   * @returns This.
   */
  projection(width: number, height: number): this {
    return mat3.projection(this, width, height) as this;
  }

  /** The Frobenius normal of this matrix. */
  get frob(): number {
    return mat3.frob(this);
  }

  /**
   * Adds two matrices.
   * @param m - The other matrix.
   * @returns This.
   */
  add(m: Numbers3x3): this {
    return mat3.add(this, this, m) as this;
  }

  /**
   * Subtracts another matrix from this one.
   * @param m - The other matrix.
   * @returns This.
   */
  subtract(m: Numbers3x3): this {
    return mat3.subtract(this, this, m) as this;
  }

  /**
   * Multiplies each element of this matrix by a scalar.
   * @param s - The scalar.
   * @returns This.
   */
   multiplyScalar(s: number): this {
     return mat3.multiplyScalar(this, this, s) as this;
   }

   /**
    * Checks if two matrices are equivalent.
    * @param m - The other matrix.
    * @return Whether the matrices are equivalent.
    */
   equals(m: Numbers3x3): boolean {
     return mat3.equals(this, m);
   }
}
