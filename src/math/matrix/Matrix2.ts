import { Numbers1x2, Numbers2x2 } from "../../types/Numbers.js";
import { mat2 } from "gl-matrix";

/** A 2x2 matrix. */
export class Matrix2 extends Float32Array {
  /** Creates a 2x2 identity matrix. */
  constructor();

  /** Creates a copy of a 2x2 matrix. */
  constructor(data: Numbers2x2);

  /**
   * Creates a 2x2 matrix from values.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   */
  constructor(
    x0y0: number, x0y1: number,
    x1y0: number, x1y1: number
  );

  constructor(
    x0y0?: number | Numbers2x2, x0y1?: number,
    x1y0?: number, x1y1?: number
  ) {
    if (x0y0) {
      if (typeof x0y0 == "number") {
        super([
          x0y0 as number, x0y1 as number,
          x1y0 as number, x1y1 as number
        ]);
      } else {
        super(x0y0);
      }
    } else {
      super(4);

      this[0] = 1;
      this[3] = 1;
    }
  }

  /** A clone of this matrix. */
  get clone(): Matrix2 {
    return new Matrix2(this);
  }

  /**
   * Copy the values from another matrix into this one.
   * @param m - The other matrix.
   * @returns This.
   */
  copy(m: Numbers2x2): this {
    return mat2.copy(this, m) as this;
  }

  /**
   * Resets this matrix to identity.
   * @returns This.
   */
  identity(): this {
    return mat2.identity(this) as this;
  }

  /**
   * Sets the values in this matrix.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @returns This.
   */
  setValues(
    x0y0: number, x0y1: number,
    x1y0: number, x1y1: number
  ): this {
    return mat2.set(this,
      x0y0, x0y1,
      x1y0, x1y1
    ) as this;
  }

  /**
   * Transposes this matrix.
   * @returns This.
   */
  transpose(): this {
    return mat2.transpose(this, this) as this;
  }

  /**
   * Inverts this matrix.
   * @returns This.
   */
  invert(): this {
    return mat2.invert(this, this) as this;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This.
   */
  adjoint(): this {
    return mat2.adjoint(this, this) as this;
  }

  /** The determinant of this matrix. */
  get determinant(): number {
    return mat2.determinant(this);
  }

  /**
   * Multiplies two matrices together.
   * @param m - The other matrix.
   * @returns This.
   */
  multiply(m: Numbers2x2): this {
    return mat2.multiply(this, this, m) as this;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param r - The angle to rotate by in radians.
   * @returns This.
   */
  rotate(r: number): this {
    return mat2.rotate(this, this, r) as this;
  }

  /**
   * Scales this matrix by the given dimensions.
   * @param v - The vector to scale by.
   * @returns This.
   */
  scale(v: Numbers1x2): this {
    return mat2.scale(this, this, v) as this;
  }

  /**
   * Sets the values of this matrix from a rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  fromRotation(r: number): this {
    return mat2.fromRotation(this, r) as this;
  }

  /**
   * Sets the values of this matrix from a vector scaling.
   * @param v - The scaling vector.
   * @returns This.
   */
  fromScaling(v: Numbers1x2): this {
    return mat2.fromScaling(this, v) as this;
  }

  /** The Frobenius normal of this matrix. */
  get frob(): number {
    return mat2.frob(this);
  }

  /**
   * Adds two matrices.
   * @param m - The other matrix.
   * @returns This.
   */
  add(m: Numbers2x2): this {
    return mat2.add(this, this, m) as this;
  }

  /**
   * Subtracts another matrix from this one.
   * @param m - The other matrix.
   * @returns This.
   */
  subtract(m: Numbers2x2): this {
    return mat2.subtract(this, this, m) as this;
  }

  /**
   * Checks if two matrices are equivalent.
   * @param m - The other matrix.
   * @return Whether the matrices are equivalent.
   */
  equals(m: Numbers2x2): boolean {
    return mat2.equals(this, m);
  }

  /**
   * Multiplies each element of this matrix by a scalar.
   * @param s - The scalar.
   * @returns This.
   */
   multiplyScalar(s: number): this {
     return mat2.multiplyScalar(this, this, s) as this;
   }
}
