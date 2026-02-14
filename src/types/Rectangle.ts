/**
 * A rectangle.
 * @public
 */
export default interface Rectangle {
	/** The X-coordinate of the rectangle. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: number;

	/** The Y-coordinate of the rectangle. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: number;

	/** The width of the rectangle. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 2: number;

	/** The height of the rectangle. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 3: number;
}
