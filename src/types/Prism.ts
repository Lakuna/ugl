import type Rectangle from "./Rectangle.js";

/**
 * A rectangular prism.
 * @public
 */
export default interface Prism extends Rectangle {
	/** The Z-coordinate of the prism. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 4: number;

	/** The depth of the prism. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 5: number;
}
