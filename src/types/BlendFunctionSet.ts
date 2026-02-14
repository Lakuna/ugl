import type BlendFunction from "../constants/BlendFunction.js";

/**
 * A set of a source and a destination blend function.
 * @public
 */
export default interface BlendFunctionSet {
	/** The source blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: BlendFunction;

	/** The destination blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: BlendFunction;
}
