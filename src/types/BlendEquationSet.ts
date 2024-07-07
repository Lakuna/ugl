import type BlendEquation from "../constants/BlendEquation.js";

/** A set of an RGB and an alpha blend equation. */
export default interface BlendEquationSet {
	/** The RGB blend equation. */
	0: BlendEquation;

	/** The alpha blend equation. */
	1: BlendEquation;
}
