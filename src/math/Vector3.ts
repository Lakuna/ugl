import { Vector } from "./Vector.js";
import { Quaternion } from "./Quaternion.js";

/** A collection of numbers arranged in one column with three rows. */
export class Vector3 extends Vector {
  /**
   * Creates a 3x1 vector with the given values.
   * @param x The first value.
   * @param y The second value.
   * @param z The third value.
   */
  public constructor(x = 0, y = 0, z = 0) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  /**
   * Calculates the angle in radians between this vector and another.
   * @param b The other vector.
   * @returns The angle in radians.
   */
  public angle(b: Vector3): number {
    const ax: number = this[0] as number;
    const ay: number = this[1] as number;
    const az: number = this[2] as number;
    const bx: number = b[0] as number;
    const by: number = b[1] as number;
    const bz: number = b[2] as number;

    const mag1: number = Math.sqrt(ax * ax + ay * ay + az * az);
    const mag2: number = Math.sqrt(bx * bx + by * by + bz * bz);
    const mag: number = mag1 * mag2;

    const cosine: number = mag && this.dot(b) / mag;

    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }

  /**
   * Performs a Bézier interpolation between two vectors with two control points.
   * @param a The first vector.
   * @param b The second vector.
   * @param c The third vector.
   * @param d The fourth vector.
   * @param t The interpolation amount.
   * @returns The interpolated value.
   */
  public static bezier(a: Vector3, b: Vector3, c: Vector3, d: Vector3, t: number): Vector3 {
    const inverseFactor: number = 1 - t;
    const inverseFactorSquared: number = inverseFactor * inverseFactor;
    const factorSquared: number = t * t;
    const factor1: number = inverseFactorSquared * inverseFactor;
    const factor2: number = 3 * t * inverseFactorSquared;
    const factor3: number = 3 * factorSquared * inverseFactor;
    const factor4: number = factorSquared * t;

    return new Vector3(
      (a[0] as number) * factor1 + (b[0] as number) * factor2 + (c[0] as number) * factor3 + (d[0] as number) * factor4,
      (a[1] as number) * factor1 + (b[1] as number) * factor2 + (c[1] as number) * factor3 + (d[1] as number) * factor4,
      (a[2] as number) * factor1 + (b[2] as number) * factor2 + (c[2] as number) * factor3 + (d[2] as number) * factor4
    );
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Vector3 {
    return new Vector3(...(this as ArrayLike<number> as [number, number, number]));
  }

  /**
   * Computes the cross product between this and another vector.
   * @param b The other vector.
   * @returns The cross product.
   */
  public cross(b: Vector3): this {
    const ax: number = this[0] as number;
    const ay: number = this[1] as number;
    const az: number = this[2] as number;
    const bx: number = b[0] as number;
    const by: number = b[1] as number;
    const bz: number = b[2] as number;

    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;

    return this;
  }

  /**
   * Performs a Hermite interpolation between two vectors with two control points.
   * @param a The first vector.
   * @param b The second vector.
   * @param c The third vector.
   * @param d The fourth vector.
   * @param t The interpolation amount.
   * @returns The interpolated value.
   */
  public static hermite(a: Vector3, b: Vector3, c: Vector3, d: Vector3, t: number): Vector3 {
    const factorSquared: number = t * t;
    const factor1: number = factorSquared * (2 * t - 3) + 1;
    const factor2: number = factorSquared * (t - 2) + t;
    const factor3: number = factorSquared * (t - 1);
    const factor4: number = factorSquared * (3 - 2 * t);

    return new Vector3(
      (a[0] as number) * factor1 + (b[0] as number) * factor2 + (c[0] as number) * factor3 + (d[0] as number) * factor4,
      (a[1] as number) * factor1 + (b[1] as number) * factor2 + (c[1] as number) * factor3 + (d[1] as number) * factor4,
      (a[2] as number) * factor1 + (b[2] as number) * factor2 + (c[2] as number) * factor3 + (d[2] as number) * factor4
    );
  }

  /**
   * Multiplies this vector by a quaternion.
   * @param b The quaternion.
   * @returns The product.
   */
  public multiplyQuaternion(b: Quaternion): this {
    const qx: number = b[0] as number;
    const qy: number = b[1] as number;
    const qz: number = b[2] as number;
    const qw: number = b[3] as number;
    const x: number = this[0] as number;
    const y: number = this[1] as number;
    const z: number = this[2] as number;

    let uvx: number = qy * z - qz * y;
    let uvy: number = qz * x - qx * z;
    let uvz: number = qx * y - qy * x;

    let uuvx: number = qy * uvz - qz * uvy;
    let uuvy: number = qz * uvx - qx * uvz;
    let uuvz: number = qx * uvy - qy * uvx;

    const w2: number = qw * 2;

    uvx *= w2;
    uvy *= w2;
    uvz *= w2;

    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;

    this[0] += uvx + uuvx;
    this[1] += uvy + uuvy;
    this[2] += uvz + uuvz;

    return this;
  }

  /**
   * Rotates this vector by the given angle about the horizontal axis.
   * @param b The origin of the rotation.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateX(b: Vector3, r: number): this {
    const b1: number = b[1] as number;
    const b2: number = b[2] as number;

    const p1: number = (this[1] as number) - b1;
    const p2: number = (this[2] as number) - b2;

    const cos: number = Math.cos(r);
    const sin: number = Math.sin(r);

    const r1: number = p1 * cos - p2 * sin;
    const r2: number = p1 * sin + p2 * cos;

    this[1] = r1 + b1;
    this[2] = r2 + b2;

    return this;
  }

  /**
   * Rotates this vector by the given angle about the vertical axis.
   * @param b The origin of the rotation.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateY(b: Vector3, r: number): this {
    const b0: number = b[0] as number;
    const b2: number = b[2] as number;

    const p0: number = (this[0] as number) - b0;
    const p2: number = (this[2] as number) - b2;

    const cos: number = Math.cos(r);
    const sin: number = Math.sin(r);

    const r0: number = p2 * sin + p0 * cos;
    const r2: number = p2 * cos - p0 * sin;

    this[0] = r0 + b0;
    this[2] = r2 + b2;

    return this;
  }

  /**
   * Rotates this vector by the given angle about the depth axis.
   * @param b The origin of the rotation.
   * @param r The angle in radians.
   * @returns The rotated vector.
   */
  public rotateZ(b: Vector3, r: number): this {
    const b0: number = b[0] as number;
    const b1: number = b[1] as number;

    const p0: number = (this[0] as number) - b0;
    const p1: number = (this[1] as number) - b1;

    const cos: number = Math.cos(r);
    const sin: number = Math.sin(r);

    const r0: number = p0 * cos - p1 * sin;
    const r1: number = p0 * sin + p1 * cos;

    this[0] = r0 + b0;
    this[1] = r1 + b1;

    return this;
  }
}
