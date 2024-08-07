import type TestFunction from "../constants/TestFunction.js";

/**
 * A stencil function, reference value, and mask.
 * @public
 */
export default interface Stencil {
	/** The test function. */
	0: TestFunction;

	/** The reference value for the stencil test. */
	1: number;

	/** A bitwise mask that is combined with the reference value and the stored stencil value when the test is performed. */
	2: number;
}
