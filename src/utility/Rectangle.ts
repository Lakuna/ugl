/** A rectangle. */
export class Rectangle {
  /**
   * Creates a rectangle.
   * @param x - The horizontal coordinate of the origin of the rectangle.
   * @param y - The vertical coordinate of the origin of the rectangle.
   * @param width - The horizontal size of the rectangle.
   * @param height - The vertical size of the rectangle.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /** The horizontal coordinate of the origin of this rectangle. */
  x: number;

  /** The vertical coordinate of the origin of this rectangle. */
  y: number;

  /** The horizontal size of the rectangle. */
  width: number;

  /** The vertical size of the rectangle. */
  height: number;
}
