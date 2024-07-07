import type BlendFunction from "../constants/BlendFunction.js";

/** A set of a source and a destination blend function. */
export default interface BlendFunctionSet {
	/** The source blend function. */
	0: BlendFunction;

	/** The destination blend function. */
	1: BlendFunction;
}
