import { Vector } from "./Vector.js";

/** A collection of numbers arranged in one column with two rows. */
export class Vector2 extends Vector {
  /**
   * Creates a 2x1 vector with the given values.
   * @param x The first value.
   * @param y The second value.
   */
  public constructor(x = 0, y = 0) {
    super(2);
    this[0] = x;
    this[1] = y;
  }

  /**
   * Calculates the angle in radians between this vector and another.
   * @param b The other vector.
   * @returns The angle in radians.
   */
  public angle(b: Vector2): number {
    const x1: number = this[0] as number;
    const y1: number = this[1] as number;
    const x2: number = b[0] as number;
    const y2: number = b[1] as number;

    const mag: number = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);

    const cosine: number = mag && (x1 * x2 + y1 * y2) / mag;

    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Vector2 {
    return new Vector2(...(this as ArrayLike<number> as [number, number]));
  }

  /**
   * Rotates this vector.
   * @param b The origin of the rotation.
   * @param r The angle of rotation in radians.
   * @returns The rotated vector.
   */
  public rotate(b: Vector2, r: number): this {
    const p0: number = (this[0] as number) - (b[0] as number);
    const p1: number = (this[1] as number) - (b[0] as number);

    const sin: number = Math.sin(r);
    const cos: number = Math.cos(r);

    this[0] = p0 * cos - p1 * sin + (b[0] as number);
    this[1] = p0 * sin + p1 * cos + (b[1] as number);

    return this;
  }
}
