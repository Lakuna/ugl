import { Numbers1x4, Numbers4x4 } from "../../types/Numbers.js";
import { IVector } from "./IVector.js";
import { vec4 } from "gl-matrix";

/** A four-dimensional vector. */
export class Vector4 extends Float32Array implements IVector {
  /** Creates an empty three-dimensional vector. */
  constructor();

  /** Creates a copy of a four-dimensional vector. */
  constructor(data: Numbers1x4);

  /**
   * Creates a four-dimensional vector from values.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   * @param z - The third value. Typically represents the value on the depth axis.
   * @param w - The fourth value.
   */
  constructor(x: number, y: number, z: number, w: number);

  constructor(x?: number | Numbers1x4, y?: number, z?: number, w?: number) {
    if (x) {
      if (typeof x == "number") {
        super([x as number, y as number, z as number, w as number]);
      } else {
        super(x);
      }
    } else {
      super(4);
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

  /** The fourth value. */
  get w(): number {
    return this[3] as number;
  }
  set w(value: number) {
    this[3] = value;
  }

  /** A clone of this vector. */
  get clone(): Vector4 {
    return new Vector4(this);
  }

  /**
   * Copy the values from another vector into this one.
   * @param v - The other vector.
   * @returns This.
   */
  copy(v: Numbers1x4): this {
    return vec4.copy(this, v) as this;
  }

  /**
   * Sets the values in this vector.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   * @param z - The third value. Typically represents the value on the depth axis.
   * @param w - The fourth value.
   * @returns This.
   */
  setValues(x: number, y: number, z: number, w: number): this {
    return vec4.set(this, x, y, z, w) as this;
  }

  /**
   * Adds two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  add(v: Numbers1x4): this {
    return vec4.add(this, this, v) as this;
  }

  /**
   * Subtracts another vector from this one.
   * @param v - The other vector.
   * @returns This.
   */
  subtract(v: Numbers1x4): this {
    return vec4.subtract(this, this, v) as this;
  }

  /**
   * Multiplies two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  multiply(v: Numbers1x4): this {
    return vec4.multiply(this, this, v) as this;
  }

  /**
   * Divides this vector by another.
   * @param v - The other vector.
   * @returns This.
   */
  divide(v: Numbers1x4): this {
    return vec4.divide(this, this, v) as this;
  }

  /**
   * Rounds up the components of this vector.
   * @returns This.
   */
  ceil(): this {
    return vec4.ceil(this, this) as this;
  }

  /**
   * Rounds down the components of this vector.
   * @returns This.
   */
  floor(): this {
    return vec4.floor(this, this) as this;
  }

  /**
   * Sets this vector to the minimum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  min(v: Numbers1x4): this {
    return vec4.min(this, this, v) as this;
  }

  /**
   * Sets this vector to the maximum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  max(v: Numbers1x4): this {
    return vec4.max(this, this, v) as this;
  }

  /**
   * Rounds the components of this vector.
   * @returns This.
   */
  round(): this {
    return vec4.round(this, this) as this;
  }

  /**
   * Scales this vector by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  scale(s: number): this {
    return vec4.scale(this, this, s) as this;
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The Euclidean distance between the vectors.
   */
  distance(v: Numbers1x4): number {
    return vec4.distance(this, v);
  }

  /**
   * Calculates the squared Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The squared Euclidean distance between the vectors.
   */
  squaredDistance(v: Numbers1x4): number {
    return vec4.squaredDistance(this, v);
  }

  /** The length of this vector. */
  get magnitude(): number {
    return vec4.length(this);
  }

  /** The squared length of this vector. */
  get squaredMagnitude(): number {
    return vec4.squaredLength(this);
  }

  /**
   * Negates this vector.
   * @returns This.
   */
  negate(): this {
    return vec4.negate(this, this) as this;
  }

  /**
   * Inverts the components of this vector.
   * @returns This.
   */
  inverse(): this {
    return vec4.inverse(this, this) as this;
  }

  /**
   * Normalizes this vector.
   * @returns This.
   */
  normalize(): this {
    return vec4.normalize(this, this) as this;
  }

  /**
   * Calculates the dot product of two vectors.
   * @param v - The other vector.
   * @returns The dot product of the vectors.
   */
  dot(v: Numbers1x4): number {
    return vec4.dot(this, v);
  }

  /**
   * Computes the cross product of three vectors.
   * @param v - The first other vector.
   * @param w - The second other vector.
   * @returns This.
   */
  cross(v: Numbers1x4, w: Numbers1x4): this {
    return vec4.cross(this, this, v, w) as this;
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param v - The other vector.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  lerp(v: Numbers1x4, t: number): this {
    return vec4.lerp(this, this, v, t) as this;
  }

  /**
   * Generates a random vector.
   * @param m - The magnitude of the vector.
   * @returns This.
   */
  random(m: number): this {
    return vec4.random(this, m) as this;
  }

  /**
   * Transforms this vector by a 4x4 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix4(m: Numbers4x4): this {
    return vec4.transformMat4(this, this, m) as this;
  }

  /**
   * Transforms this vector by a quaternion.
   * @param q - The quaternion.
   * @returns This.
   */
  transformQuaternion(q: Numbers1x4): this {
    return vec4.transformQuat(this, this, q) as this;
  }

  /**
   * Sets the components of this vector to 0.
   * @returns This.
   */
  zero(): this {
    return vec4.zero(this) as this;
  }

  /**
   * Whether two vectors have approximately the same elements in the same positions.
   * @param v - The other vector.
   * @returns Whether the vectors are approximately equal.
   */
  equals(v: Numbers1x4): boolean {
    return vec4.equals(this, v);
  }
}
