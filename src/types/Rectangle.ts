/** A rectangle. */
export class Rectangle extends Float32Array {
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
	set x(value: number) {
		this[0] = value;
	}

	/** The vertical coordinate of the origin. */
	get y(): number {
		return this[1] as number;
	}
	set y(value: number) {
		this[1] = value;
	}

	/** The horizontal size of the rectangle. */
	get width(): number {
		return this[2] as number;
	}
	set width(value: number) {
		this[2] = value;
	}

	/** The vertical size of the rectangle. */
	get height(): number {
		return this[3] as number;
	}
	set height(value: number) {
		this[3] = value;
	}
}
