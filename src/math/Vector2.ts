import { Vector } from "./Vector.js";

/** A collection of numbers arranged in one column with two rows. */
export class Vector2 extends Vector {
  /**
   * Creates a 2x1 vector with the given values.
   * @param x The first value.
   * @param y The second value.
   */
  public constructor(x = 0, y = 0) {
    super(x, y);
  }
}
