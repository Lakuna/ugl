/** Blending functions. */
const enum BlendFunction {
    /** Multiplies all colors by zero. */
    ZERO = 0,

    /** Multiplies all colors by one. */
    ONE = 1,

    /** Multiplies all colors by the source colors. */
    SRC_COLOR = 0x0300,

    /** Multiplies all colors by one minus each source color. */
    ONE_MINUS_SRC_COLOR = 0x0301,

    /** Multiplies all colors by the destination color. */
    DST_COLOR = 0x0306,

    /** Multiplies all colors by one minus the destination color. */
    ONE_MINUS_DST_COLOR = 0x0307,

    /** Multiplies all colors by the source alpha value. */
    SRC_ALPHA = 0x0302,

    /** Multiplies all colors by one minus the source alpha value. */
    ONE_MINUS_SRC_ALPHA = 0x0303,

    /** Multiplies all colors by the destination alpha value. */
    DST_ALPHA = 0x0304,

    /** Multiplies all colors by one minus the destination alpha value. */
    ONE_MINUS_DST_ALPHA = 0x0305,

    /** Multiplies all colors by a constant color. */
    CONSTANT_COLOR = 0x8001,

    /** Multiplies all colors by one minus a constant color. */
    ONE_MINUS_CONSTANT_COLOR = 0x8002,

    /** Multiplies all colors by a constant alpha value. */
    CONSTANT_ALPHA = 0x8003,

    /** Multiplies all colors by one minus a constant alpha value. */
    ONE_MINUS_CONSTANT_ALPHA = 0x8004,

    /** Multiplies the RGB colors by the smaller of either the source alpha value or the value of one minus the destination alpha value. The alpha value is multiplied by one. */
    SRC_ALPHA_SATURATE = 0x0308
}

export default BlendFunction;
