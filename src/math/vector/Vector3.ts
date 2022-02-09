import { Numbers1x3, Numbers1x4, Numbers3x3, Numbers4x4 } from "../../types/Numbers.js";
import { IVector } from "./IVector.js";
import { vec3 } from "gl-matrix";

/** A three-dimensional vector. */
export class Vector3 extends Float32Array implements IVector {
  /** Creates an empty three-dimensional vector. */
  constructor();

  /** Creates a copy of a three-dimensional vector. */
  constructor(data: Numbers1x3);

  /**
   * Creates a three-dimensional vector from values.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   * @param z - The third value. Typically represents the value on the depth axis.
   */
  constructor(x: number, y: number, z: number);

  constructor(x?: number | Numbers1x3, y?: number, z?: number) {
    if (x) {
      if (typeof x == "number") {
        super([x as number, y as number, z as number]);
      } else {
        super(x);
      }
    } else {
      super(3);
    }
  }

  /** The first value. Typically represents the value on the horizontal axis. */
  get x(): number {
    return this[0] as number;
  }
  set x(value: number) {
    this[0] = value;
  }

  /** The second value. Typically represents the value on the vertical axis. */
  get y(): number {
    return this[1] as number;
  }
  set y(value: number) {
    this[1] = value;
  }

  /** The third value. Typically represents the value on the depth axis. */
  get z(): number {
    return this[2] as number;
  }
  set z(value: number) {
    this[2] = value;
  }

  /** A clone of this vector. */
  get clone(): Vector3 {
    return new Vector3(this);
  }

  /**
   * Copy the values from another vector into this one.
   * @param v - The other vector.
   * @returns This.
   */
  copy(v: Numbers1x3): this {
    return vec3.copy(this, v) as this;
  }

  /**
   * Sets the values in this vector.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   * @param z - The third value. Typically represents the value on the depth axis.
   * @returns This.
   */
  setValues(x: number, y: number, z: number): this {
    return vec3.set(this, x, y, z) as this;
  }

  /**
   * Adds two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  add(v: Numbers1x3): this {
    return vec3.add(this, this, v) as this;
  }

  /**
   * Subtracts another vector from this one.
   * @param v - The other vector.
   * @returns This.
   */
  subtract(v: Numbers1x3): this {
    return vec3.subtract(this, this, v) as this;
  }

  /**
   * Multiplies two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  multiply(v: Numbers1x3): this {
    return vec3.multiply(this, this, v) as this;
  }

  /**
   * Divides this vector by another.
   * @param v - The other vector.
   * @returns This.
   */
  divide(v: Numbers1x3): this {
    return vec3.divide(this, this, v) as this;
  }

  /**
   * Rounds up the components of this vector.
   * @returns This.
   */
  ceil(): this {
    return vec3.ceil(this, this) as this;
  }

  /**
   * Rounds down the components of this vector.
   * @returns This.
   */
  floor(): this {
    return vec3.floor(this, this) as this;
  }

  /**
   * Sets this vector to the minimum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  min(v: Numbers1x3): this {
    return vec3.min(this, this, v) as this;
  }

  /**
   * Sets this vector to the maximum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  max(v: Numbers1x3): this {
    return vec3.max(this, this, v) as this;
  }

  /**
   * Rounds the components of this vector.
   * @returns This.
   */
  round(): this {
    return vec3.round(this, this) as this;
  }

  /**
   * Scales this vector by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  scale(s: number): this {
    return vec3.scale(this, this, s) as this;
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The Euclidean distance between the vectors.
   */
  distance(v: Numbers1x3): number {
    return vec3.distance(this, v);
  }

  /**
   * Calculates the squared Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The squared Euclidean distance between the vectors.
   */
  squaredDistance(v: Numbers1x3): number {
    return vec3.squaredDistance(this, v);
  }

  /** The length of this vector. */
  get magnitude(): number {
    return vec3.length(this);
  }

  /** The squared length of this vector. */
  get squaredMagnitude(): number {
    return vec3.squaredLength(this);
  }

  /**
   * Negates this vector.
   * @returns This.
   */
  negate(): this {
    return vec3.negate(this, this) as this;
  }

  /**
   * Inverts the components of this vector.
   * @returns This.
   */
  inverse(): this {
    return vec3.inverse(this, this) as this;
  }

  /**
   * Normalizes this vector.
   * @returns This.
   */
  normalize(): this {
    return vec3.normalize(this, this) as this;
  }

  /**
   * Calculates the dot product of two vectors.
   * @param v - The other vector.
   * @returns The dot product of the vectors.
   */
  dot(v: Numbers1x3): number {
    return vec3.dot(this, v);
  }

  /**
   * Computes the cross product of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  cross(v: Numbers1x3): this {
    return vec3.cross(this, this, v) as this;
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param v - The other vector.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  lerp(v: Numbers1x3, t: number): this {
    return vec3.lerp(this, this, v, t) as this;
  }

  /**
   * Performs a Hermite interpolation with two control points.
   * @param a - The first control point.
   * @param b - The second control point.
   * @param v - The other end.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  hermite(a: Numbers1x3, b: Numbers1x3, v: Numbers1x3, t: number): this {
    return vec3.hermite(this, this, a, b, v, t) as this;
  }

  /**
   * Performs a Bézier interpolation with two control points.
   * @param a - The first control point.
   * @param b - The second control point.
   * @param v - The other end.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  bezier(a: Numbers1x3, b: Numbers1x3, v: Numbers1x3, t: number): this {
    return vec3.bezier(this, this, a, b, v, t) as this;
  }

  /**
   * Generates a random vector.
   * @param m - The magnitude of the vector.
   * @returns This.
   */
  random(m: number): this {
    return vec3.random(this, m) as this;
  }

  /**
   * Transforms this vector by a 3x3 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix3(m: Numbers3x3): this {
    return vec3.transformMat3(this, this, m) as this;
  }

  /**
   * Transforms this vector by a 4x4 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix4(m: Numbers4x4): this {
    return vec3.transformMat4(this, this, m) as this;
  }

  /**
   * Transforms this vector by a quaternion.
   * @param q - The quaternion.
   * @returns This.
   */
  transformQuaternion(q: Numbers1x4): this {
    return vec3.transformQuat(this, this, q) as this;
  }

  /**
   * Rotates this vector around the X axis.
   * @param o - The origin of the rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  rotateX(o: Numbers1x3, r: number): this {
    return vec3.rotateX(this, this, o, r) as this;
  }

  /**
   * Rotates this vector around the Y axis.
   * @param o - The origin of the rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  rotateY(o: Numbers1x3, r: number): this {
    return vec3.rotateY(this, this, o, r) as this;
  }

  /**
   * Rotates this vector around the Z axis.
   * @param o - The origin of the rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  rotateZ(o: Numbers1x3, r: number): this {
    return vec3.rotateZ(this, this, o, r) as this;
  }

  /**
   * Gets the angle between two vectors.
   * @param v - The other vector.
   * @returns The angle in radians between the vectors.
   */
  angle(v: Numbers1x3): number {
    return vec3.angle(this, v);
  }

  /**
   * Sets the components of this vector to 0.
   * @returns This.
   */
  zero(): this {
    return vec3.zero(this) as this;
  }

  /**
   * Whether two vectors have approximately the same elements in the same positions.
   * @param v - The other vector.
   * @returns Whether the vectors are approximately equal.
   */
  equals(v: Numbers1x3): boolean {
    return vec3.equals(this, v);
  }
}
