/**
 * A sized object.
 * @public
 */
export default interface Sized {
	/** The vertical size of the sized object. */
	get height(): number;

	/** The horizontal size of the sized object. */
	get width(): number;
}
