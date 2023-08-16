import type TestFunction from "#TestFunction";

/**
 * Parameters for stencil testing.
 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
 */
export default interface StencilTestParameters {
	/** The test function. */
	func: TestFunction;

	/** The reference value for the stencil test. */
	ref: number;

	/** A bit-wise mask that is combined with the reference value and the stored stencil value when the test is done. */
	mask: number;
}
