import type BlendEquation from "../constants/BlendEquation.js";

/**
 * A set of an RGB and an alpha blend equation.
 * @public
 */
export default interface BlendEquationSet {
	/** The RGB blend equation. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: BlendEquation;

	/** The alpha blend equation. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: BlendEquation;
}
