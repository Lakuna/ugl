import type Rectangle from "./Rectangle.js";

/** A rectangular prism. */
export default interface Prism extends Rectangle {
	/** The Z-coordinate of the prism. */
	4: number;

	/** The depth of the prism. */
	5: number;
}
