import { Numbers1x2, Numbers2x2, Numbers3x3, Numbers4x4 } from "../../types/Numbers.js";
import { Vector3 } from "./Vector3.js";
import { vec2 } from "gl-matrix";

/** A two-dimensional vector. */
export class Vector2 extends Float32Array {
  /** Creates an empty two-dimensional vector. */
  constructor();

  /** Creates a copy of a two-dimensional vector. */
  constructor(data: Numbers1x2);

  /**
   * Creates a two-dimensional vector from values.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   */
  constructor(x: number, y: number);

  constructor(x?: number | Numbers1x2, y?: number) {
    if (x) {
      if (typeof x == "number") {
        super([x as number, y as number]);
      } else {
        super(x);
      }
    } else {
      super(2);
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

  /** A clone of this vector. */
  get clone(): Vector2 {
    return new Vector2(this);
  }

  /**
   * Copy the values from another vector into this one.
   * @param v - The other vector.
   * @returns This.
   */
  copy(v: Numbers1x2): this {
    return vec2.copy(this, v) as this;
  }

  /**
   * Sets the values in this vector.
   * @param x - The first value. Typically represents the value on the horizontal axis.
   * @param y - The second value. Typically represents the value on the vertical axis.
   * @returns This.
   */
  setValues(x: number, y: number): this {
    return vec2.set(this, x, y) as this;
  }

  /**
   * Adds two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  add(v: Numbers1x2): this {
    return vec2.add(this, this, v) as this;
  }

  /**
   * Subtracts another vector from this one.
   * @param v - The other vector.
   * @returns This.
   */
  subtract(v: Numbers1x2): this {
    return vec2.subtract(this, this, v) as this;
  }

  /**
   * Multiplies two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  multiply(v: Numbers1x2): this {
    return vec2.multiply(this, this, v) as this;
  }

  /**
   * Divides this vector by another.
   * @param v - The other vector.
   * @returns This.
   */
  divide(v: Numbers1x2): this {
    return vec2.divide(this, this, v) as this;
  }

  /**
   * Rounds up the components of this vector.
   * @returns This.
   */
  ceil(): this {
    return vec2.ceil(this, this) as this;
  }

  /**
   * Rounds down the components of this vector.
   * @returns This.
   */
  floor(): this {
    return vec2.floor(this, this) as this;
  }

  /**
   * Sets this vector to the minimum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  min(v: Numbers1x2): this {
    return vec2.min(this, this, v) as this;
  }

  /**
   * Sets this vector to the maximum of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  max(v: Numbers1x2): this {
    return vec2.max(this, this, v) as this;
  }

  /**
   * Rounds the components of this vector.
   * @returns This.
   */
  round(): this {
    return vec2.round(this, this) as this;
  }

  /**
   * Scales this vector by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  scale(s: number): this {
    return vec2.scale(this, this, s) as this;
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The Euclidean distance between the vectors.
   */
  distance(v: Numbers1x2): number {
    return vec2.distance(this, v);
  }

  /**
   * Calculates the squared Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The squared Euclidean distance between the vectors.
   */
  squaredDistance(v: Numbers1x2): number {
    return vec2.squaredDistance(this, v);
  }

  /** The length of this vector. */
  get magnitude(): number {
    return vec2.length(this);
  }

  /** The squared length of this vector. */
  get squaredMagnitude(): number {
    return vec2.squaredLength(this);
  }

  /**
   * Negates this vector.
   * @returns This.
   */
  negate(): this {
    return vec2.negate(this, this) as this;
  }

  /**
   * Inverts the components of this vector.
   * @returns This.
   */
  inverse(): this {
    return vec2.inverse(this, this) as this;
  }

  /**
   * Normalizes this vector.
   * @returns This.
   */
  normalize(): this {
    return vec2.normalize(this, this) as this;
  }

  /**
   * Calculates the dot product of two vectors.
   * @param v - The other vector.
   * @returns The dot product of the vectors.
   */
  dot(v: Numbers1x2): number {
    return vec2.dot(this, v);
  }

  /**
   * Computes the cross product of two vectors.
   * @param v - The other vector.
   * @returns The cross product of the vectors.
   */
  cross(v: Numbers1x2): Vector3 {
    return vec2.cross(new Vector3(), this, v) as Vector3;
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param v - The other vector.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  lerp(v: Numbers1x2, t: number): this {
    return vec2.lerp(this, this, v, t) as this;
  }

  /**
   * Generates a random vector.
   * @param m - The magnitude of the vector.
   * @returns This.
   */
  random(m: number): this {
    return vec2.random(this, m) as this;
  }

  /**
   * Transforms this vector by a 2x2 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix2(m: Numbers2x2): this {
    return vec2.transformMat2(this, this, m) as this;
  }

  /**
   * Transforms this vector by a 3x3 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix3(m: Numbers3x3): this {
    return vec2.transformMat3(this, this, m) as this;
  }

  /**
   * Transforms this vector by a 4x4 matrix.
   * @param m - The matrix.
   * @returns This.
   */
  transformMatrix4(m: Numbers4x4): this {
    return vec2.transformMat4(this, this, m) as this;
  }

  /**
   * Rotates this vector.
   * @param o - The origin of the rotation.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  rotate(o: Numbers1x2, r: number): this {
    return vec2.rotate(this, this, o, r) as this;
  }

  /**
   * Gets the angle between two vectors.
   * @param v - The other vector.
   * @returns The angle in radians between the vectors.
   */
  angle(v: Numbers1x2): number {
    return vec2.angle(this, v);
  }

  /**
   * Sets the components of this vector to 0.
   * @returns This.
   */
  zero(): this {
    return vec2.zero(this) as this;
  }

  /**
   * Whether two vectors have approximately the same elements in the same positions.
   * @param v - The other vector.
   * @returns Whether the vectors are approximately equal.
   */
  equals(v: Numbers1x2): boolean {
    return vec2.equals(this, v);
  }
}
