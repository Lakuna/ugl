import { Number4 } from "./Array.js";

/** A rectangle. Immutable. */
// @ts-ignore impossible to "correctly implement" Number4
export class Rectangle extends Float32Array implements Number4 {
  /**
   * Creates a rectangle.
   * @param x - The horizontal coordinate of the origin.
   * @param y - The vertical coordinate of the origin.
   * @param width - The horizontal size of the rectangle.
   * @param height - The vertical size of the rectangle.
   */
  constructor(x: number, y: number, width: number, height: number) {
    super([x, y, width, height]);
  }

  /** The horizontal coordinate of the origin. */
  get x(): number {
    return this[0] as number;
  }

  /** The vertical coordinate of the origin. */
  get y(): number {
    return this[1] as number;
  }

  /** The horizontal size of the rectangle. */
  get width(): number {
    return this[2] as number;
  }

  /** The vertical size of the rectangle. */
  get height(): number {
    return this[3] as number;
  }
}
