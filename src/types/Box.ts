/** A rectangle or rectangular prism. */
export default interface Box {
	/** The X-coordinate of the box. */
	x: number;

	/** The Y-coordinate of the box. */
	y: number;

	/** The Z-coordinate of the box if it is a prism. */
	z?: number;

	/** The width of the box. */
	width: number;

	/** The height of the box. */
	height: number;

	/** The depth of the box if it is a prism. */
	depth?: number;
}
