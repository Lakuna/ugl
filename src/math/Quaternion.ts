import { Numbers1x3, Numbers1x4, Numbers3x3 } from "../types/Tuples.js";
import { quat } from "gl-matrix";
import { Vector3 } from "./vector/Vector3.js";

/** A complex number with four parts, typically used to describe rotations in three-dimensional space. */
export class Quaternion extends Float32Array {
  /** Creates an identity quaternion. */
  constructor();

  /** Creates a copy of a quaternion. */
  constructor(data: Numbers1x4);

  /**
   * Creates a quaternion from values.
   * @param x - The first value.
   * @param y - The second value.
   * @param z - The third value.
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

      this[3] = 1;
    }
  }

  /** The first value. */
  get x(): number {
    return this[0] as number;
  }
  set x(value: number) {
    this[0] = value;
  }

  /** The second value. */
  get y(): number {
    return this[1] as number;
  }
  set y(value: number) {
    this[1] = value;
  }

  /** The third value. */
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

  /**
   * Sets this quaternion to the identity.
   * @returns This.
   */
  identity(): this {
    return quat.identity(this) as this;
  }

  /**
   * Sets this quaternion from a given angle and rotation axis.
   * @param a - The axis around which to rotate.
   * @param r - The angle of rotation in radians.
   * @returns This.
   */
  setAxisAngle(a: Numbers1x3, r: number): this {
    return quat.setAxisAngle(this, a, r) as this;
  }

  /** The rotation axis of this quaternion. */
  get axis(): Vector3 {
    const out: Vector3 = new Vector3();
    quat.getAxisAngle(out, this);
    return out;
  }

  /** The angle of rotation for this quaternion in radians. */
  get angle(): number {
    return quat.getAxisAngle([0, 0, 0], this);
  }

  /**
   * Gets the angular distance between two unit quaternions.
   * @param q - The other unit quaternion.
   * @returns The angle in radians between the unit quaternions.
   */
  angleTo(q: Numbers1x4): number {
    return quat.getAngle(this, q);
  }

  /**
   * Multiplies two quaternions.
   * @param q - The other quaternion.
   * @returns This.
   */
  multiply(q: Numbers1x4): this {
    return quat.multiply(this, this, q) as this;
  }

  /**
   * Rotates this quaternion around the X axis.
   * @param r - The angle in radians.
   * @returns This.
   */
  rotateX(r: number): this {
    return quat.rotateX(this, this, r) as this;
  }

  /**
   * Rotates this quaternion around the Y axis.
   * @param r - The angle in radians.
   * @returns This.
   */
  rotateY(r: number): this {
    return quat.rotateY(this, this, r) as this;
  }

  /**
   * Rotates this quaternion around the Z axis.
   * @param r - The angle in radians.
   * @returns This.
   */
  rotateZ(r: number): this {
    return quat.rotateZ(this, this, r) as this;
  }

  /** The W component based on the X, Y, and Z components, assuming tha tthe quaternion is 1 unit in length. */
  get calculatedW(): number {
    return quat.calculateW(this, this)[3];
  }

  /**
   * Calculates the exponential of this unit quaternion.
   * @returns This.
   */
  exp(): this {
    return quat.exp(this, this) as this;
  }

  /**
   * Calculates the natural logarithm of this unit quaternion.
   * @returns This.
   */
  ln(): this {
    return quat.ln(this, this) as this;
  }

  /**
   * Calculates the scalar power of this unit quaternion.
   * @param s - The amount to scale by.
   * @returns This.
   */
  pow(s: number): this {
    return quat.pow(this, this, s) as this;
  }

  /**
   * Performs a spherical linear interpolation between two quaternions.
   * @param q - The other quaternion.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  slerp(q: Numbers1x4, t: number): this {
    return quat.slerp(this, this, q, t) as this;
  }

  /**
   * Sets this to a random unit quaternion.
   * @returns This.
   */
  random(): this {
    return quat.random(this) as this;
  }

  /**
   * Calculates the inverse of this quaternion.
   * @returns This.
   */
  invert(): this {
    return quat.invert(this, this) as this;
  }

  /**
   * Calculates the conjugate of this quaternion.
   * @returns This.
   */
  conjugate(): this {
    return quat.conjugate(this, this) as this;
  }

  /**
   * Sets the values of this quaternion from a 3x3 rotation matrix.
   * @param m - The matrix.
   * @returns This.
   */
  fromMatrix3(m: Numbers3x3): this {
    return quat.fromMat3(this, m) as this;
  }

  /**
   * Sets the values of this quaternion from an X, Y, Z Euler angle.
   * @param x - The angle to rotate around the X axis in degrees.
   * @param y - The angle to rotate around the Y axis in degrees.
   * @param z - The angle to rotate around the Z axis in degrees.
   * @returns This.
   */
  fromEuler(x: number, y: number, z: number): this {
    return quat.fromEuler(this, x, y, z) as this;
  }

  /** A clone of this quaternion. */
  get clone(): Quaternion {
    return new Quaternion(this);
  }

  /**
   * Copy the values from another quaternion into this one.
   * @param q - The other quaternion.
   * @returns This.
   */
  copy(q: Numbers1x4): this {
    return quat.copy(this, q) as this;
  }

  /**
   * Sets the values in this quaternion.
   * @param x - The first value.
   * @param y - The second value.
   * @param z - The third value.
   * @param w - The fourth value.
   * @returns This.
   */
  setValues(x: number, y: number, z: number, w: number): this {
    return quat.set(this, x, y, z, w) as this;
  }

  /**
   * Adds two quaternions.
   * @param q - The other quaternion.
   * @returns This.
   */
  add(q: Numbers1x4): this {
    return quat.add(this, this, q) as this;
  }

  /**
   * Scales this quaternion by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  scale(s: number): this {
    return quat.scale(this, this, s) as this;
  }

  /**
   * Calculates the dot product of two quaternions.
   * @param q - The other quaternion.
   * @returns The dot product of the quaternions.
   */
  dot(q: Numbers1x4): number {
    return quat.dot(this, q);
  }

  /**
   * Performs a linear interpolation between two quaternions.
   * @param q - The other quaternion.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  lerp(q: Numbers1x4, t: number): this {
    return quat.lerp(this, this, q, t) as this;
  }

  /** The length of this quaternion. */
  get magnitude(): number {
    return quat.length(this);
  }

  /** The squared length of this quaternion. */
  get squaredMagnitude(): number {
    return quat.squaredLength(this);
  }

  /**
   * Normalizes this quaternion.
   * @returns This.
   */
  normalize(): this {
    return quat.normalize(this, this) as this;
  }

  /**
   * Whether two quaternions have approximately the same elements in the same positions.
   * @param q - The other quaternion.
   * @returns Whether the quaternions are approximately equal.
   */
  equals(q: Numbers1x4): boolean {
    return quat.equals(this, q);
  }

  /**
   * Sets this quaternion to represent the shortest rotation from one unit vector to another.
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns This.
   */
  rotationTo(a: Numbers1x3, b: Numbers1x3): this {
    return quat.rotationTo(this, a, b) as this;
  }

  /**
   * Performs a spherical linear interpolation with two control points.
   * @param a - The first control point.
   * @param b - The second control point.
   * @param q - The other end.
   * @param t - The interpolation amount. Must be between 0 and 1.
   * @returns This.
   */
  sqlerp(a: Numbers1x4, b: Numbers1x4, q: Numbers1x4, t: number): this {
    return quat.sqlerp(this, this, a, b, q, t) as this;
  }

  /**
   * Sets this quaternion to a value based on given axes.
   * @param view - The vector representing the viewing direction.
   * @param right - The vector representing the local "right" direction.
   * @param up - The vector representing the local "up" direction.
   * @returns This.
   */
  fromAxes(view: Numbers1x3, right: Numbers1x3, up: Numbers1x3): this {
    return quat.setAxes(this, view, right, up) as this;
  }
}
