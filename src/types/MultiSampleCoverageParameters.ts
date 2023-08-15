/** Multi-sample coverage parameters for anti-aliasing effects. */
export default interface MultiSampleCoverageParameters {
    /** A single floating-point coverage value clamped to the range `[0,1]`. */
    value: number;

    /** Whether or not the coverage masks should be inverted. */
    invert: boolean;
}
