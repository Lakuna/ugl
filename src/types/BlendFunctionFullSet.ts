import type BlendFunction from "../constants/BlendFunction.js";

/**
 * A set of source and destination RGB and alpha blend functions.
 * @public
 */
export default interface BlendFunctionFullSet {
	/** The source RGB blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: BlendFunction;

	/** The destination RGB blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: BlendFunction;

	/** The source alpha blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 2: BlendFunction;

	/** The destination alpha blend function. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 3: BlendFunction;
}
