import { Numbers4x4 } from "../../types/Numbers.js";

/** The interface for vectors. */
export interface IVector extends Iterable<number> {
  /** A clone of this vector. */
  get clone(): IVector;

  /**
   * Copies the values from another vector into this vector.
   * @param v - The other vector.
   * @returns This.
   */
  copy(v: Iterable<number>): this;

  /**
   * Adds another vector to this one.
   * @param v - The other vector.
   * @returns This.
   */
  add(v: Iterable<number>): this;

  /**
   * Subtracts another vector from this one.
   * @param v - The other vector.
   * @returns This.
   */
  subtract(v: Iterable<number>): this;

  /**
   * Multiplies another vector with this one.
   * @param v - The other vector.
   * @returns This.
   */
  multiply(v: Iterable<number>): this;

  /**
   * Divides this vector by another.
   * @param v - The other vector.
   * @returns This.
   */
  divide(v: Iterable<number>): this;

  /**
   * Rounds up all of the components of this vector.
   * @returns This.
   */
  ceil(): this;

  /**
   * Rounds down all of the components of this vector.
   * @returns This.
   */
  floor(): this;

  /**
   * Gets the smallest of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  min(v: Iterable<number>): this;

  /**
   * Gets the largest of two vectors.
   * @param v - The other vector.
   * @returns This.
   */
  max(v: Iterable<number>): this;

  /**
   * Rounds all of the components of this vector.
   * @returns This.
   */
  round(): this;

  /**
   * Scales this vector by a scalar number.
   * @param s - The scalar number.
   * @returns This.
   */
  scale(s: number): this;

  /**
   * Calculates the Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The Euclidean distance between the vectors.
   */
  distance(v: Iterable<number>): number;

  /**
   * Calculates the squared Euclidean distance between two vectors.
   * @param v - The other vector.
   * @returns The squared Euclidean distance between the vectors.
   */
  squaredDistance(v: Iterable<number>): number;

  /** The length of this vector. */
  get magnitude(): number;

  /** The squared length of this vector. */
  get squaredMagnitude(): number;

  /**
   * Negates this vector.
   * @returns This.
   */
  negate(): this;

 /**
  * Inverts the components of this vector.
  * @returns This.
  */
 inverse(): this;

 /**
  * Normalizes this vector.
  * @returns This.
  */
 normalize(): this;

 /**
  * Calculates the dot product of two vectors.
  * @param v - The other vector.
  * @returns The dot product of the vectors.
  */
 dot(v: Iterable<number>): number;

 /**
  * Performs a linear interpolation between two vectors.
  * @param v - The other vector.
  * @param t - The interpolation amount. Must be between 0 and 1.
  * @returns This.
  */
 lerp(v: Iterable<number>, t: number): this;

 /**
  * Generates a random vector.
  * @param m - The magnitude of the vector.
  * @returns This.
  */
 random(m: number): this;

 /**
  * Transforms this vector by a 4x4 matrix.
  * @param m - The matrix.
  * @returns This.
  */
 transformMatrix4(m: Numbers4x4): this;

 /**
  * Sets the components of this vector to 0.
  * @returns This.
  */
 zero(): this;

 /**
  * Whether two vectors have approximately the same elements in the same positions.
  * @param v - The other vector.
  * @returns Whether the vectors are approximately equal.
  */
 equals(v: Iterable<number>): boolean;
}
