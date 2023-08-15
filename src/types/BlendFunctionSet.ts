import type BlendFunction from "#BlendFunction";

/** A pair of blending functions. */
export default interface BlendFunctionSet {
    /** The multiplier for the RGB source blending factors. */
    srcRgb: BlendFunction;

    /** The multiplier for the RGB destination blending factors. */
    dstRgb: BlendFunction;

    /** The multiplier for the alpha source blending factors. */
    srcAlpha: BlendFunction;

    /** The multiplier for the alpha destination blending factors. */
    dstAlpha: BlendFunction;
}
