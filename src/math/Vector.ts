import { Matrix } from "./Matrix.js";

/** A quantity with direction and magnitude. */
export class Vector extends Float32Array implements Readonly<Float32Array> {
  /**
   * Creates a vector from a transformation matrix's translation.
   * @param m - The translation matrix.
   * @returns A vector.
   */
  static fromMatrixTranslation(m: Matrix): Vector {
    if (m.width != 4 || m.length != 4) { throw new Error("Invalid transformation matrix."); }
    return new Vector(m[12] as number, m[13] as number, m[14] as number);
  }

  /**
   * Creates a vector from a transformation matrix's scaling.
   * @param m - The translation matrix.
   * @returns A vector.
   */
  static fromMatrixScaling(m: Matrix): Vector {
    if (m.width != 4 || m.length != 4) { throw new Error("Invalid transformation matrix."); }
    return new Vector(
      Math.hypot(m[0] as number, m[1] as number, m[2] as number),
      Math.hypot(m[4] as number, m[5] as number, m[6] as number),
      Math.hypot(m[8] as number, m[9] as number, m[10] as number)
    );
  }

  /**
   * Creates a Euler angle (XYZ intrinsic Tait-Bryan angles) from a transformation matrix's rotation.
   * @param m - The translation matrix.
   * @returns A vector.
   */
  static fromMatrixRotation(m: Matrix): Vector {
    if (m.width != 4 || m.length != 4) { throw new Error("Invalid transformation matrix."); }
    return (Math.abs(m[6] as number) < 1)
      ? new Vector(
        Math.atan2(-(m[7] as number), m[8] as number),
        Math.asin(Math.min(Math.max(m[6] as number, -1), 1)),
        Math.atan2(-(m[3] as number), m[0] as number)
      )
      : new Vector(
        Math.atan2(m[5] as number, m[4] as number),
        Math.asin(Math.min(Math.max(m[6] as number, -1), 1)),
        0
      );
  }

  /**
   * Creates a vector.
   * @param values - The values in the vector.
   */
  constructor(...values: number[]) {
    super(values);
  }

  /** The magnitude (size) of this vector. */
  get magnitude(): number {
    return Math.hypot(...this);
  }

  /**
   * Calculates the distance between two vectors.
   * @param v - The other vector.
   * @returns The distance between the vectors.
   */
  distance(v: Vector): number {
    if (this.length != v.length) { throw new Error("Vectors have different number of dimensions."); }
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) - (v[i] as number)); }
    return Math.hypot(...out);
  }

  /**
   * Calculates the dot product of two vectors.
   * @param v - The other vector.
   * @returns The dot product of the vectors.
   */
  dot(v: Vector): number {
    if (this.length != 3 || v.length != 3) { throw new Error("Vectors must have three dimensions."); }
    let out = 0;
    for (let i = 0; i < 3; i++) { out += (this[i] as number) * (v[i] as number); }
    return out;
  }

  /**
   * Calculates the angle between two vectors.
   * @param v - The other vector.
   * @returns The angle between the vectors.
   */
  angle(v: Vector): number {
    return Math.acos(Math.min(Math.max(this.normalize().dot(v.normalize()), -1), 1));
  }

  /**
   * Transforms this vector with a transformation matrix.
   * @param m - The transformation matrix.
   * @reuturns The transformed matrix.
   */
  transform(m: Matrix): Vector {
    return new Vector(...m.multiply(this));
  }

  /**
   * Negates this vector.
   * @returns The negated vector.
   */
  negate(): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push(-(this[i] as number)); }
    return new Vector(...out);
  }

  /**
   * Inverts this vector.
   * @returns The inverted vector.
   */
  invert(): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push(1 / (this[i] as number)); }
    return new Vector(...out);
  }

  /**
   * Normalizes this vector.
   * @returns The normalized vector.
   */
  normalize(): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) / this.magnitude); }
    return new Vector(...out);
  }

  /**
   * Calculates the cross product of two vectors.
   * @param v - The other vector.
   * @returns The cross product of the vectors.
   */
  cross(v: Vector): Vector {
    if (this.length != 3 || v.length != 3) { throw new Error("Vectors must have three dimensions."); }
    return new Vector(
      (this[1] as number) * (v[2] as number) - (this[2] as number) * (v[1] as number),
      (this[2] as number) * (v[0] as number) - (this[0] as number) * (v[2] as number),
      (this[0] as number) * (v[1] as number) - (this[1] as number) * (v[0] as number)
    );
  }

  /**
   * Multiplies each value in this vector by a scalar.
   * @param s - The scalar.
   * @returns The scaled vector.
   */
  scale(s: number): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) * s); }
    return new Vector(...out);
  }

  /**
   * Adds two vectors.
   * @param v - The other vector.
   * @returns The sum of the vectors.
   */
  add(v: Vector): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) + (v[i] as number)); }
    return new Vector(...out);
  }

  /**
   * Adds two vectors.
   * @param v - The other vector.
   * @returns The sum of the vectors.
   */
  subtract(v: Vector): Vector {
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) - (v[i] as number)); }
    return new Vector(...out);
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param v - The other vector.
   * @param t - The interpolation amount (between `0` and `1`).
   * @returns The interpolated vector.
   */
  lerp(v: Vector, t: number): Vector {
    if (t < 0 || t > 1) { throw new Error("The interpolation amount is out of range."); }
    const out: number[] = [];
    for (let i = 0; i < this.length; i++) { out.push((this[i] as number) + t * ((v[i] as number) - (this[i] as number))); }
    return new Vector(...out);
  }
}
