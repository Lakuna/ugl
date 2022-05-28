import { Matrix } from "./Matrix.js";

/** A collection of numbers arranged a column. */
export class Vector extends Matrix {
  /**
   * Creates a vector.
   * @param vals The values in the vector.
   */
  public constructor(...vals: number[]) {
    super(vals);
  }

  /**
   * Creates a new vector with the same values as this one.
   * @returns The new vector.
   */
  public override clone(): Vector {
    return new Vector(...this);
  }

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @returns The distance.
   */
  public static distance(a: Vector, b: Vector): number {
    if (a.height != b.height) { throw new Error("Vector size mismatch."); }

    return Math.hypot(...a.clone().subtract(b));
  }

  /**
   * Calculates the Euclidean distance between this vector and another.
   * @param v The other vector.
   * @returns The distance.
   */
  public distance(v: Vector): number {
    return Vector.distance(this, v);
  }

  /**
   * Divides a vector by another.
   * @param a The dividend.
   * @param b The divisor.
   * @returns The quotient.
   */
  public static divide<T extends Vector>(a: Vector, b: Vector, out: T): T {
    if (a.height != b.height) { throw new Error("Vector size mismatch."); }

    for (let i = 0; i < a.height; i++) {
      out[i] = (a[i] as number) / (b[i] as number);
    }

    return out;
  }

  /**
   * Divides this vector by another.
   * @param v The other vector.
   * @returns The quotient.
   */
  public divide(v: Vector): this {
    return Vector.divide(this, v, this);
  }

  /**
   * Calculates the dot product of two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @returns The dot product.
   */
  public static dot(a: Vector, b: Vector): number {
    if (a.height != b.height) { throw new Error("Vector size mismatch."); }

    let out = 0;
    for (let i = 0; i < a.height; i++) {
      out += (a[i] as number) * (b[i] as number);
    }

    return out;
  }

  /**
   * Calculates the dot product of this and another vector.
   * @param v The other vector.
   * @returns The dot product.
   */
  public dot(v: Vector): number {
    return Vector.dot(this, v);
  }

  /**
   * Creates an empty vector with the given height.
   * @param height The number of rows in the vector.
   * @returns The vector.
   */
  public static override fromDimensions(height: number): Vector {
    return new Vector(...(new Array(height).fill(0)));
  }

  /**
   * Returns the inverse of the components of a vector.
   * @param v The vector.
   * @param out The vector to store the inverse in.
   * @returns The inverse.
   */
  public static inverse<T extends Vector>(v: Vector, out: T): T {
    if (v.height != out.height) { throw new Error("Vector size mismatch."); }

    for (let i = 0; i < v.height; i++) {
      out[i] = 1 / (v[i] as number);
    }

    return out;
  }

  /**
   * Returns the inverse of the components of this vector.
   * @returns The inverse.
   */
  public inverse(): this {
    return Vector.inverse(this, this);
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @param t The interpolation amount.
   * @param out The vector to store the interpolated value in.
   * @returns The interpolated value.
   */
  public static lerp<T extends Vector>(a: Vector, b: Vector, t: number, out: T): T {
      if (a.height != b.height || a.height != out.height) { throw new Error("Vector size mismatch."); }

    for (let i = 0; i < a.height; i++) {
      out[i] = (a[i] as number) + t * ((b[i] as number) - (a[i] as number));
    }

    return out;
  }

  /**
   * Calculates the length/magnitude of a vector.
   * @param v The vector.
   * @returns The length.
   */
  public static magnitude(v: Vector): number {
    return Math.hypot(...v);
  }

  /** The length/magnitude of this vector. */
  public get magnitude(): number {
    return Vector.magnitude(this);
  }

  /**
   * Multiplies two vectors.
   * @param a The multiplicand.
   * @param b The multiplier.
   * @param out The vector to store the product in.
   * @returns The product.
   */
  public static multiplyVectors<T extends Vector>(a: Vector, b: Vector, out: T): T {
    if (a.height != b.height || a.height != out.height) { throw new Error("Vector size mismatch."); }

    for (let i = 0; i < a.height; i++) {
      out[i] = (a[i] as number) * (b[i] as number);
    }

    return out;
  }

  /**
   * Multiplies this vector by another.
   * @param v The multiplier.
   * @returns The product.
   */
  public multiplyVectors(v: Vector): this {
    return Vector.multiply(this, v, this);
  }

  /**
   * Negates the components of a vector.
   * @param v The vector.
   * @param out The vector to store the negated vector in.
   * @returns The negated vector.
   */
  public static negate<T extends Vector>(v: Vector, out: T): T {
    if (v.height != out.height) { throw new Error("Vector size mismatch."); }

    for (let i = 0; i < v.height; i++) {
      out[i] = -(v[i] as number);
    }

    return out;
  }

  /**
   * Negates the components of this vector.
   * @returns The negated vector.
   */
  public negate(): this {
    return Vector.negate(this, this);
  }

  /**
   * Normalizes a vector.
   * @param v The vector.
   * @param out The vector to store the normalized vector in.
   * @returns The normalized vector.
   */
  public static normalize<T extends Vector>(v: Vector, out: T): T {
    if (v.height != out.height) { throw new Error("Vector size mismatch."); }

    const magnitude = v.magnitude;
    for (let i = 0; i < v.height; i++) {
      out[i] = (v[i] as number) / magnitude;
    }

    return out;
  }

  /**
   * Normalizes a vector.
   * @returns The normalized vector.
   */
  public normalize(): this {
    return Vector.normalize(this, this);
  }

  /**
   * Calculates the squared distance between two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @returns The squared distance.
   */
  public static squaredDistance(a: Vector, b: Vector): number {
    if (a.height != b.height) { throw new Error("Vector size mismatch."); }

    let out = 0;

    for (let i = 0; i < a.height; i++) {
      const di = (a[i] as number) - (b[i] as number);
      out += di * di;
    }

    return out;
  }

  /**
   * Calculates the squared distance between this vector and another.
   * @param v The other vector.
   * @returns The squared distance.
   */
  public squaredDistance(v: Vector): number {
    return Vector.squaredDistance(this, v);
  }

  /**
   * Calculates the squared length of a vector.
   * @param v The vector.
   * @returns The squared length.
   */
  public static squaredLength(v: Vector): number {
    let out = 0;

    for (let i = 0; i < v.height; i++) {
      const vi = v[i] as number;
      out += vi * vi;
    }

    return out;
  }

  /** The squared length of this vector. */
  public get squaredLength(): number {
    return Vector.squaredLength(this);
  }

  /**
   * Sets the components of a vector to zero.
   * @param v The vector.
   * @returns The vector.
   */
  public static zero<T extends Vector>(v: T): T {
    for (let i = 0; i < v.height; i++) {
      v[i] = 0;
    }

    return v;
  }

  /** Sets the components of this vector to zero. */
  public zero(): this {
    return Vector.zero(this);
  }
}
