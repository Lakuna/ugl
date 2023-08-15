import type StencilTestParameters from "#StencilTestParameters";

/**
 * A set of stencil test parameters.
 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
 */
export default interface StencilTestSet {
    /** The parameters for the front stencil test. */
    front: StencilTestParameters;

    /** The parameters for the back stencil test. */
    back: StencilTestParameters;
}
