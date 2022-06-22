import { Matrix3 } from "./Matrix3.js";
import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";

/** A hypercomplex number used to describe rotations in three-dimensional space. */
export class Quaternion extends Vector4 {
  /**
   * Creates a quaternion with the given values.
   * @param x The first value.
   * @param y The second value.
   * @param z The third value.
   * @param w The fourth value.
   */
  public constructor(x = 0, y = 0, z = 0, w = 1) {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
  }

  /** The rotation angle of this quaternion. */
  public get angle(): number {
    return Math.acos(this[3] as number) * 2;
  }

  /** The rotation axis of this quaternion. */
  public get axis(): Vector3 {
    const r: number = Math.acos(this[3] as number) * 2;

    const sin: number = Math.sin(r / 2);

    if (sin > 0.000001) {
      return new Vector3(
        (this[0] as number) / sin,
        (this[1] as number) / sin,
        (this[2] as number) / sin
      );
    }

    return new Vector3();
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Quaternion {
    return new Quaternion(...(this as ArrayLike<number> as [number, number, number, number]));
  }

  /**
   * Calculates the conjugate of this quaternion.
   * @returns The conjugate.
   */
  public conjugate(): this {
    this[0] = -(this[0] as number);
    this[1] = -(this[1] as number);
    this[2] = -(this[2] as number);

    return this;
  }

  /**
   * Gets the angular distance between this quaternion and another.
   * @param b The other quaternion.
   * @returns The angle in radians.
   */
  public override distance(b: Quaternion): number {
    const d: number = this.dot(b);

    return Math.acos(2 * d * d - 1);
  }

  /**
   * Calculates the exponential of this unit quaternion.
   * @returns The exponential.
   */
  public exp(): this {
    const x: number = this[0] as number;
    const y: number = this[1] as number;
    const z: number = this[2] as number;

    const r: number = Math.sqrt(x * x + y * y + z * z);
    const et: number = Math.exp(this[3] as number);
    const s: number = r > 0 ? (et * Math.sin(r)) / r : 0;

    this[0] *= s;
    this[1] *= s;
    this[2] *= s;
    this[3] = et * Math.cos(r);

    return this;
  }

  /**
   * Creates a quaternion from the given X, Y, Z Euler angle.
   * @param x The angle to rotate around the X axis in radians.
   * @param y The angle to rotate around the Y axis in radians.
   * @param z The angle to rotate around the Z axis in radians.
   * @returns The quaternion.
   */
  public static fromEuler(x: number, y: number, z: number): Quaternion {
    x /= 2;
    y /= 2;
    z /= 2;

    const sx: number = Math.sin(x);
    const cx: number = Math.cos(x);
    const sy: number = Math.sin(y);
    const cy: number = Math.cos(y);
    const sz: number = Math.sin(z);
    const cz: number = Math.cos(z);

    return new Quaternion(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz
    );
  }

  /**
   * Creates a quaternion from a 3x3 rotation matrix.
   * @param m The matrix.
   * @returns The quaternion.
   */
  public static fromMatrix3(m: Matrix3): Quaternion {
    const fTrace: number = (m[0] as number) + (m[4] as number) + (m[8] as number);

    const out: Quaternion = new Quaternion();

    if (fTrace > 0) {
      let fRoot: number = Math.sqrt(fTrace + 1); // 2w
      out[3] = fRoot / 2;
      fRoot = 0.5 / fRoot; // 1/4w
      out[0] = ((m[5] as number) - (m[7] as number)) * fRoot;
      out[1] = ((m[6] as number) - (m[2] as number)) * fRoot;
      out[2] = ((m[1] as number) - (m[3] as number)) * fRoot;

      return out;
    }

    let i = 0;
    if ((m[4] as number) > (m[0] as number)) { i = 1; }
    if ((m[8] as number) > (m[i * 3 + i] as number)) { i = 2; }
    const j: number = (i + 1) % 3;
    const k: number = (i + 2) % 3;

    let fRoot: number = Math.sqrt((m[i * 3 + i] as number) - (m[j * 3 + j] as number) - (m[k * 3 + k] as number) + 1);
    out[i] = fRoot / 2;
    fRoot = 0.5 / fRoot;
    out[3] = ((m[j * 3 + k] as number) - (m[k * 3 + j] as number)) * fRoot;
    out[j] = ((m[j * 3 + i] as number) - (m[i * 3 + j] as number)) * fRoot;
    out[k] = ((m[k * 3 + i] as number) - (m[i * 3 + k] as number)) * fRoot;

    return out;
  }

  /**
   * Returns the inverse of this quaternion.
   * @returns The inverse.
   */
  public override inverse(): this {
    const a0: number = this[0] as number;
    const a1: number = this[1] as number;
    const a2: number = this[2] as number;
    const a3: number = this[3] as number;

    const dot: number = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;

    if (dot < 0.000001) {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 0;

      return this;
    }

    const invDot: number = dot ? 1 / dot : 0;

    this[0] = -a0 * invDot;
    this[1] = -a1 * invDot;
    this[2] = -a2 * invDot;
    this[3] = a3 * invDot;

    return this;
  }

  /**
   * Calculates the natural logarithm of this unit quaternion.
   * @returns The natural logarithm.
   */
  public ln(): this {
    const x: number = this[0] as number;
    const y: number = this[1] as number;
    const z: number = this[2] as number;
    const w: number = this[3] as number;

    const r: number = Math.sqrt(x * x + y * y + z * z);
    const t: number = r > 0 ? Math.atan2(r, w) / r : 0;

    this[0] *= t;
    this[1] *= t;
    this[2] *= t;
    this[3] = Math.log(x * x + y * y + z * z + w * w) / 2;

    return this;
  }

  /**
   * Multiplies this quaternion by another.
   * @param b The other quaternion.
   * @returns The product.
   */
  public override multiplyQuaternion(b: Quaternion): this {
    const ax: number = this[0] as number;
    const ay: number = this[1] as number;
    const az: number = this[2] as number;
    const aw: number = this[3] as number;
    const bx: number = b[0] as number;
    const by: number = b[1] as number;
    const bz: number = b[2] as number;
    const bw: number = b[3] as number;

    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  /**
   * Calculates the scalar power of this unit quaternion.
   * @param b The scalar.
   * @returns The scalar power.
   */
  public pow(b: number): this {
    return this.ln().multiplyScalar(b).exp();
  }

  /**
   * Rotates this quaternion by the given angle about the horizontal axis.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateX(r: number): this {
    r /= 2;

    const ax: number = this[0] as number;
    const ay: number = this[0] as number;
    const az: number = this[0] as number;
    const aw: number = this[0] as number;

    const bx: number = Math.sin(r);
    const bw: number = Math.cos(r);

    this[0] = ax * bw + aw * bx;
    this[1] = ay * bw + az * bx;
    this[2] = az * bw - ay * bx;
    this[3] = aw * bw - ax * bx;

    return this;
  }

  /**
   * Rotates this quaternion by the given angle about the vertical axis.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateY(r: number): this {
    r /= 2;

    const ax: number = this[0] as number;
    const ay: number = this[0] as number;
    const az: number = this[0] as number;
    const aw: number = this[0] as number;

    const by: number = Math.sin(r);
    const bw: number = Math.cos(r);

    this[0] = ax * bw - az * by;
    this[1] = ay * bw + aw * by;
    this[2] = az * bw + ax * by;
    this[3] = aw * bw - ay * by;

    return this;
  }

  /**
   * Rotates this quaternion by the given angle about the depth axis.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateZ(r: number): this {
    r /= 2;

    const ax: number = this[0] as number;
    const ay: number = this[0] as number;
    const az: number = this[0] as number;
    const aw: number = this[0] as number;

    const bz: number = Math.sin(r);
    const bw: number = Math.cos(r);

    this[0] = ax * bw + ay * bz;
    this[1] = ay * bw - ax * bz;
    this[2] = az * bw + aw * bz;
    this[3] = aw * bw - az * bz;

    return this;
  }

  /**
   * Creates a quaternion representing the shortest rotation between two unit vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @returns The quaternion.
   */
  public static rotationBetween(a: Vector3, b: Vector3): Quaternion {
    const d: number = a.dot(b);

    if (d < -0.999999) {
      let t: Vector3 = new Vector3(1, 0, 0).cross(a);
      if (t.magnitude < 0.000001) { t = new Vector3(0, 1, 0).cross(a); }
      t.normalize();
      return new Quaternion().setAxisAngle(t, Math.PI);
    }

    if (d > 0.999999) { return new Quaternion(); }

    const t: Vector3 = a.clone().cross(b);

    return new Quaternion(t[0] as number, t[1] as number, t[2] as number, 1 + d).normalize();
  }

  /**
   * Creates a quaternion with values corresponding to the given axes.
   * @param view The unit vector representing the viewing direction.
   * @param right The unit vector representing the local "right" direction which is perpendicular to the viewing direction.
   * @param up The unit vector representing the local "up" direction which is perpendicular to both the viewing direction and the local "right" direction.
   * @returns The quaternion.
   */
  public static fromAxes(view: Vector3, right: Vector3, up: Vector3): Quaternion {
    return Quaternion.fromMatrix3(new Matrix3(
      right[0] as number, up[0] as number, -(view[0] as number),
      right[1] as number, up[1] as number, -(view[1] as number),
      right[2] as number, up[2] as number, -(view[2] as number)
    )).normalize();
  }

  /**
   * Sets this quaternion to represent the given angle around the given axis.
   * @param a The axis.
   * @param r The angle in radians.
   * @returns The quaternion.
   */
  public setAxisAngle(a: Vector3, r: number): this {
    r /= 2;

    const s: number = Math.sin(r);

    this[0] = s * (a[0] as number);
    this[1] = s * (a[1] as number);
    this[2] = s * (a[2] as number);
    this[3] = Math.cos(r);

    return this;
  }

  /**
   * Performs a spherical linear interpolation between two quaternions.
   * @param a The first quaternion.
   * @param b The second quaternion.
   * @param t The interpolation amount.
   * @returns The interpolated value.
   */
  public static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
    const ax: number = a[0] as number;
    const ay: number = a[1] as number;
    const az: number = a[2] as number;
    const aw: number = a[3] as number;
    let bx: number = b[0] as number;
    let by: number = b[1] as number;
    let bz: number = b[2] as number;
    let bw: number = b[3] as number;

    let cosom: number = ax * bx + ay * by + az * bz + aw * bw;

    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    let scale0: number;
    let scale1: number;

    if (1 - cosom > 0.000001) {
      // Spherical linear interpolation.
      const omega: number = Math.acos(cosom);
      const sinom: number = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // Linear interpolation.
      scale0 = 1 - t;
      scale1 = t;
    }

    return new Quaternion(
      scale0 * ax + scale1 * bx,
      scale0 * ay + scale1 * by,
      scale0 * az + scale1 * bz,
      scale0 * aw + scale1 * bw
    );
  }

  /**
   * Performs a spherical linear interpolation between two quaternions with two control points.
   * @param a The first quaternion.
   * @param b The second quaternion.
   * @param t The interpolation amount.
   * @returns The interpolated value.
   */
  public static sqlerp(a: Quaternion, b: Quaternion, c: Quaternion, d: Quaternion, t: number): Quaternion {
    return Quaternion.slerp(Quaternion.slerp(a, d, t), Quaternion.slerp(b, c, t), 2 * t * (1 - t));
  }

  /** Calculates the W component of this unit quaternion from the X, Y, and Z values (ignoring the actual W value). */
  public get w(): number {
    const x: number = this[0] as number;
    const y: number = this[1] as number;
    const z: number = this[2] as number;

    return Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
  }
}
