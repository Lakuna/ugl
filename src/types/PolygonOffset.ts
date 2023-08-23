/** Modifiers applied before the depth test is performed. */
export default interface PolygonOffset {
	/** The scale factor for the variable depth offset for each polygon. */
	factor: number;

	/**
	 * The multiplier by which an implementation-specific value is multiplied
	 * to create a constant depth offset.
	 */
	units: number;
}
