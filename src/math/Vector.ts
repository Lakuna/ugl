import { Matrix } from "./Matrix.js";
import { MatrixSizeError } from "./MatrixSizeError.js";

/** A collection of numbers arranged in one column. */
export class Vector extends Matrix {
  /**
   * Creates a vector with the given height.
   * @param height The height of the vector.
   */
  public constructor(height: number) {
    super(1, height);
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Vector {
    const out: Vector = new Vector(this.length);

    for (let i = 0; i < this.length; i++) {
      out[i] = this[i] as number;
    }

    return out;
  }

  /**
   * Calculates the Euclidean distance between this vector and another.
   * @param b The other vector.
   * @returns The distance.
   */
  public distance(b: Vector): number {
    if (this.height != b.height) { throw new MatrixSizeError(); }

    return Math.hypot(...this.clone().subtract(b));
  }

  /**
   * Divides this vector by another.
   * @param b The other vector.
   * @returns The quotient.
   */
  public divide(b: Vector): this {
    if (this.height != b.height) { throw new MatrixSizeError(); }

    for (let i = 0; i < this.height; i++) {
      this[i] /= b[i] as number;
    }

    return this;
  }

  /**
   * Calculates the dot product of this and another vector.
   * @param b The other vector.
   * @returns The dot product.
   */
  public dot(b: Vector): number {
    if (this.height != b.height) { throw new MatrixSizeError(); }

    let out = 0;
    for (let i = 0; i < this.height; i++) {
      out += (this[i] as number) * (b[i] as number);
    }

    return out;
  }

  /**
   * Returns the inverse of the components of this vector.
   * @returns The inverse.
   */
  public inverse(): this {
    for (let i = 0; i < this.height; i++) {
      this[i] = 1 / (this[i] as number);
    }

    return this;
  }

  /**
   * Performs a linear interpolation between two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @param t The interpolation amount.
   * @returns The interpolated value.
   */
  public static lerp(a: Vector, b: Vector, t: number): Vector {
    if (a.height != b.height) { throw new MatrixSizeError(); }

    const out: Vector = new Vector(a.height);

    for (let i = 0; i < out.height; i++) {
      out[i] = (a[i] as number) + t * ((b[i] as number) - (a[i] as number));
    }

    return out;
  }

  /** The length/magnitude of this vector. */
  public get magnitude(): number {
    return Math.hypot(...this);
  }

  /**
   * Multiplies a matrix by this vector.
   * @param a The matrix.
   * @returns The product.
   */
  public override multiply(a: Matrix): Vector {
    if (a.width != this.height) { throw new MatrixSizeError(); }

    const n: number = a.height;
    const m: number = a.width;

    const out: Vector = new Vector(m);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += (a[k * a.height + i] as number) * (this[k] as number);
      }

      out[i] = sum;
    }

    return out;
  }

  /**
   * Multiplies this vector by another.
   * @param b The multiplier.
   * @returns The product.
   */
  public multiplyVector(b: Vector): this {
    if (this.height != b.height) { throw new MatrixSizeError(); }

    for (let i = 0; i < this.height; i++) {
      this[i] *= b[i] as number;
    }

    return this;
  }

  /**
   * Negates the components of this vector.
   * @returns The negated vector.
   */
  public negate(): this {
    for (let i = 0; i < this.height; i++) {
      this[i] = -(this[i] as number);
    }

    return this;
  }

  /**
   * Normalizes a vector.
   * @returns The normalized vector.
   */
  public normalize(): this {
    const magnitude = this.magnitude;

    for (let i = 0; i < this.height; i++) {
      this[i] /= magnitude;
    }

    return this;
  }

  /**
   * Calculates the squared distance between this vector and another.
   * @param b The other vector.
   * @returns The squared distance.
   */
  public squaredDistance(b: Vector): number {
    if (this.height != b.height) { throw new MatrixSizeError(); }

    let out = 0;

    for (let i = 0; i < this.height; i++) {
      const di = (this[i] as number) - (b[i] as number);
      out += di * di;
    }

    return out;
  }

  /** The squared length of this vector. */
  public get squaredLength(): number {
    let out = 0;

    for (let i = 0; i < this.height; i++) {
      const vi = this[i] as number;
      out += vi * vi;
    }

    return out;
  }

  /** Sets the components of this vector to zero. */
  public zero(): this {
    for (let i = 0; i < this.height; i++) {
      this[i] = 0;
    }

    return this;
  }
}
