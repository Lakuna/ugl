import { Numbers1x3, Numbers1x4, Numbers4x4 } from "../../types/Tuples.js";
import { IMatrix } from "./IMatrix.js";
import { vec3, mat4, quat } from "gl-matrix";
import { Vector3 } from "../vector/Vector3.js";
import { Quaternion } from "../Quaternion.js";

/** A 4x4 matrix. */
export class Matrix4 extends Float32Array implements IMatrix {
  /** Creates a 4x4 identity matrix. */
  constructor();

  /** Creates a copy of a 4x4 matrix. */
  constructor(data: Numbers4x4);

  /**
   * Creates a 4x4 matrix from values.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x0y2 - The value in the third row and first column.
   * @param x0y3 - The value in the fourth row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @param x1y2 - The value in the third row and second column.
   * @param x1y3 - The value in the fourth row and second column.
   * @param x2y0 - The value in the first row and third column.
   * @param x2y1 - The value in the second row and third column.
   * @param x2y2 - The value in the third row and third column.
   * @param x2y3 - The value in the fourth row and third column.
   * @param x3y0 - The value in the first row and fourth column.
   * @param x3y1 - The value in the second row and fourth column.
   * @param x3y2 - The value in the third row and fourth column.
   * @param x3y3 - The value in the fourth row and fourth column.
   */
  constructor(
    x0y0: number, x0y1: number, x0y2: number, x0y3: number,
    x1y0: number, x1y1: number, x1y2: number, x1y3: number,
    x2y0: number, x2y1: number, x2y2: number, x2y3: number,
    x3y0: number, x3y1: number, x3y2: number, x3y3: number
  );

  constructor(
    x0y0?: number | Numbers4x4, x0y1?: number, x0y2?: number, x0y3?: number,
    x1y0?: number, x1y1?: number, x1y2?: number, x1y3?: number,
    x2y0?: number, x2y1?: number, x2y2?: number, x2y3?: number,
    x3y0?: number, x3y1?: number, x3y2?: number, x3y3?: number
  ) {
    if (x0y0) {
      if (typeof x0y0 == "number") {
        super([
          x0y0 as number, x0y1 as number, x0y2 as number, x0y3 as number,
          x1y0 as number, x1y1 as number, x1y2 as number, x1y3 as number,
          x2y0 as number, x2y1 as number, x2y2 as number, x2y3 as number,
          x3y0 as number, x3y1 as number, x3y2 as number, x3y3 as number
        ]);
      } else {
        super(x0y0);
      }
    } else {
      super(9);

      this[0] = 1;
      this[5] = 1;
      this[10] = 1;
      this[15] = 1;
    }
  }

  /**
   * Creates a clone of this matrix.
   * @returns A clone of this matrix.
   */
  get clone(): Matrix4 {
    return new Matrix4(this);
  }

  /**
   * Copy the values from another matrix into this one.
   * @param m - The other matrix.
   * @returns This.
   */
  copy(m: Numbers4x4): this {
    return mat4.copy(this, m) as this;
  }

  /**
   * Sets the values in this matrix.
   * @param x0y0 - The value in the first row and first column.
   * @param x0y1 - The value in the second row and first column.
   * @param x0y2 - The value in the third row and first column.
   * @param x0y3 - The value in the fourth row and first column.
   * @param x1y0 - The value in the first row and second column.
   * @param x1y1 - The value in the second row and second column.
   * @param x1y2 - The value in the third row and second column.
   * @param x1y3 - The value in the fourth row and second column.
   * @param x2y0 - The value in the first row and third column.
   * @param x2y1 - The value in the second row and third column.
   * @param x2y2 - The value in the third row and third column.
   * @param x2y3 - The value in the fourth row and third column.
   * @param x3y0 - The value in the first row and fourth column.
   * @param x3y1 - The value in the second row and fourth column.
   * @param x3y2 - The value in the third row and fourth column.
   * @param x3y3 - The value in the fourth row and fourth column.
   * @returns This.
   */
  setValues(
    x0y0: number, x0y1: number, x0y2: number, x0y3: number,
    x1y0: number, x1y1: number, x1y2: number, x1y3: number,
    x2y0: number, x2y1: number, x2y2: number, x2y3: number,
    x3y0: number, x3y1: number, x3y2: number, x3y3: number
  ): this {
    return mat4.set(this,
      x0y0, x0y1, x0y2, x0y3,
      x1y0, x1y1, x1y2, x1y3,
      x2y0, x2y1, x2y2, x2y3,
      x3y0, x3y1, x3y2, x3y3
    ) as this;
  }

  /**
   * Resets this matrix to identity.
   * @returns This.
   */
  identity(): this {
    return mat4.identity(this) as this;
  }

  /**
   * Transposes this matrix.
   * @returns This.
   */
  transpose(): this {
    return mat4.transpose(this, this) as this;
  }

  /**
   * Inverts this matrix.
   * @returns This.
   */
  invert(): this {
    return mat4.invert(this, this) as this;
  }

  /**
   * Calculates the adjugate of this matrix.
   * @returns This.
   */
  adjoint(): this {
    return mat4.adjoint(this, this) as this;
  }

  /** The determinant of this matrix. */
  get determinant(): number {
    return mat4.determinant(this);
  }

  /**
   * Multiplies two matrices together.
   * @param m - The other matrix.
   * @returns This.
   */
  multiply(m: Numbers4x4): this {
    return mat4.multiply(this, this, m) as this;
  }

  /**
   * Translates this matrix by the given vector.
   * @param v - The vector to translate by.
   * @returns This.
   */
  translate(v: Numbers1x3): this {
    return mat4.translate(this, this, v) as this;
  }

  /**
   * Scales this matrix by the given dimensions.
   * @param v - The vector to scale by.
   * @returns This.
   */
  scale(v: Numbers1x3): this {
    return mat4.scale(this, this, v) as this;
  }

  /**
   * Rotates this matrix by the given angle around the given axis.
   * @param r - The angle to rotate by in radians.
   * @param a - The axis to rotate around.
   * @returns This.
   */
  rotate(r: number, a: Numbers1x3): this {
    return mat4.rotate(this, this, r, a) as this;
  }

  /**
   * Rotates this matrix by the given angle around the X axis.
   * @param r - The angle to rotate by in radians.
   * @returns This.
   */
  rotateX(r: number): this {
    return mat4.rotateX(this, this, r) as this;
  }

  /**
   * Rotates this matrix by the given angle around the Y axis.
   * @param r - The angle to rotate by in radians.
   * @returns This.
   */
  rotateY(r: number): this {
    return mat4.rotateY(this, this, r) as this;
  }

  /**
   * Rotates this matrix by the given angle around the Z axis.
   * @param r - The angle to rotate by in radians.
   * @returns This.
   */
  rotateZ(r: number): this {
    return mat4.rotateZ(this, this, r) as this;
  }

  /**
   * Sets the values of this matrix from a vector translation.
   * @param v - The translation vector.
   * @returns This.
   */
  fromTranslation(v: Numbers1x3): this {
    return mat4.fromTranslation(this, v) as this;
  }

  /**
   * Sets the values of this matrix from a vector scaling.
   * @param v - The scaling vector.
   * @returns This.
   */
  fromScaling(v: Numbers1x3): this {
    return mat4.fromScaling(this, v) as this;
  }

  /**
   * Sets the values of this matrix from a rotation around the given axis.
   * @param r - The angle of rotation in radians.
   * @param a - The axis to rotate around.
   * @returns This.
   */
  fromRotation(r: number, a: Numbers1x3): this {
    return mat4.fromRotation(this, r, a) as this;
  }

  /**
   * Sets the values of this matrix from a rotation around the X axis.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  fromXRotation(r: number): this {
    return mat4.fromXRotation(this, r) as this;
  }

  /**
   * Sets the values of this matrix from a rotation around the Y axis.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  fromYRotation(r: number): this {
    return mat4.fromYRotation(this, r) as this;
  }

  /**
   * Sets the values of this matrix from a rotation around the Z axis.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  fromZRotation(r: number): this {
    return mat4.fromZRotation(this, r) as this;
  }

  /**
   * Sets the values of this matrix from a quaternion rotation and a vector translation.
   * @param q - The rotation quaternion.
   * @param v - The translation vector.
   * @returns This.
   */
  fromRotationTranslation(q: Numbers1x4, v: Numbers1x3): this {
    return mat4.fromRotationTranslation(this, q, v) as this;
  }

  /** The translation vector component of a transformation matrix. */
  get translation(): Vector3 {
    return mat4.getTranslation(new Vector3() as vec3, this) as Vector3;
  }

  /** The scaling factor component of a transformation matrix. */
  get scaling(): Vector3 {
    return mat4.getScaling(new Vector3() as vec3, this) as Vector3;
  }

  /** A quaternion representing the rotational component of a transformation matrix. */
  get rotation(): Quaternion {
    return mat4.getRotation(new Quaternion() as quat, this) as Quaternion;
  }

  /**
   * Sets the values of this matrix from a quaternion rotation, a vector translation, and a vector scale.
   * @param q - The rotation quaternion.
   * @param v - The translation vector.
   * @param s - The scaling vector.
   * @returns This.
   */
  fromRotationTranslationScale(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3): this {
    return mat4.fromRotationTranslationScale(this, q, v, s) as this;
  }

  /**
   * Sets the values of this matrix from a quaternion rotation, a vector translation, and a vector scale. Rotated and scaled around an origin.
   * @param q - The rotation quaternion.
   * @param v - The translation vector.
   * @param s - The scaling vector.
   * @param o - The origin around which to scale and rotate.
   * @returns This.
   */
  fromRotationTranslationScaleOrigin(q: Numbers1x4, v: Numbers1x3, s: Numbers1x3, o: Numbers1x3): this {
    return mat4.fromRotationTranslationScaleOrigin(this, q, v, s, o) as this;
  }

  /**
   * Sets the values of this matrix from a quaternion.
   * @param q - The quaternion.
   * @returns This.
   */
  fromQuaternion(q: Numbers1x4): this {
    return mat4.fromQuat(this, q) as this;
  }

  /**
   * Sets the values of this matrix to a frustum.
   * @param left - The left bound of the frustum.
   * @param right - The right bound of the frustum.
   * @param bottom - The bottom bound of the frustum.
   * @param top - The top bound of the frustum.
   * @param near - The near bound of the frustum.
   * @param far - The far bound of the frustum.
   * @returns This.
   */
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    return mat4.frustum(this, left, right, bottom, top, near, far) as this;
  }

  /**
   * Sets the values of this matrix to a perspective projection.
   * @param fovy - The vertical field of view in radians.
   * @param aspect - The aspect ratio.
   * @param near - The near bound of the frustum.
   * @param far - The far bound of the frustum. Defaults to infinity.
   * @returns This.
   */
  perspective(fovy: number, aspect: number, near: number, far?: number): this {
    return mat4.perspective(this, fovy, aspect, near, far ?? Infinity) as this;
  }

  /**
   * Sets the values of this matrix to a perspective projection generated from a field of view. For use with the WebXR API.
   * @param up - The angle to the top of the field of view in degrees.
   * @param down - The angle to the bottom of the field of view in degrees.
   * @param left - The angle to the left side of the field of view in degrees.
   * @param right - The angle to the right side of the field of view in degrees.
   * @param near - The near bound of the frustum.
   * @param far - The far bound of the frustum.
   * @returns This.
   */
  perspectiveFromFieldOfView(up: number, down: number, left: number, right: number, near: number, far: number): this {
    return mat4.perspectiveFromFieldOfView(this, { upDegrees: up, downDegrees: down, leftDegrees: left, rightDegrees: right }, near, far) as this;
  }

  /**
   * Sets the values of this matrix to an orthogonal projection.
   * @param left - The left bound of the frustum.
   * @param right - The right bound of the frustum.
   * @param bottom - The bottom bound of the frustum.
   * @param top - The top bound of the frustum.
   * @param near - The near bound of the frustum.
   * @param far - The far bound of the frustum.
   * @returns This.
   */
  orthogonal(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    return mat4.ortho(this, left, right, bottom, top, near, far) as this;
  }

  /**
   * Sets the values of this matrix to a look-at matrix. If you want a matrix that actually makes an object look at another object, use `targetTo` instead.
   * @param eye - The position of the viewer.
   * @param center - The point that the viewer is looking at.
   * @param up - A vector pointing up.
   * @returns This.
   */
  lookAt(eye: Numbers1x3, center: Numbers1x3, up: Numbers1x3 = [0, 1, 0]): this {
    return mat4.lookAt(this, eye, center, up) as this;
  }

  /**
   * Sets the values of this matrix to make something look at something else.
   * @param eye - The position of the viewer.
   * @param target - The point that the viewer is looking at.
   * @param up - A vector pointing up.
   * @returns This.
   */
  targetTo(eye: Numbers1x3, target: Numbers1x3, up: Numbers1x3 = [0, 1, 0]): this {
    return mat4.targetTo(this, eye, target, up) as this;
  }

  /** The Frobenius normal of this matrix. */
  get frob(): number {
    return mat4.frob(this);
  }

  /**
   * Adds two matrices.
   * @param m - The other matrix.
   * @returns This.
   */
  add(m: Numbers4x4): this {
    return mat4.add(this, this, m) as this;
  }

  /**
   * Subtracts another matrix from this one.
   * @param m - The other matrix.
   * @returns This.
   */
  subtract(m: Numbers4x4): this {
    return mat4.subtract(this, this, m) as this;
  }

  /**
   * Multiplies each element of this matrix by a scalar.
   * @param s - The scalar.
   * @returns This.
   */
   multiplyScalar(s: number): this {
     return mat4.multiplyScalar(this, this, s) as this;
   }

   /**
    * Checks if two matrices are equivalent.
    * @param m - The other matrix.
    * @return Whether the matrices are equivalent.
    */
   equals(m: Numbers4x4): boolean {
     return mat4.equals(this, m);
   }
}
