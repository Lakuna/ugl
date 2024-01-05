import type BlendFunction from "#BlendFunction";

/** A set of source and destination RGB and alpha blend functions. */
export default interface BlendFunctionFullSet {
	/** The source RGB blend function. */
	0: BlendFunction;

	/** The destination RGB blend function. */
	1: BlendFunction;

	/** The source alpha blend function. */
	2: BlendFunction;

	/** The destination alpha blend function. */
	3: BlendFunction;
}
