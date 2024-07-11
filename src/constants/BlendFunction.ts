/**
 * Blending functions.
 * @public
 */
const enum BlendFunction {
	/** Multiply all colors by zero. */
	ZERO = 0,

	/** Multiply all colors by one. */
	ONE = 1,

	/** Multiply all colors by the source colors. */
	SRC_COLOR = 0x0300,

	/** Multiply all colors by one minus each source color. */
	ONE_MINUS_SRC_COLOR = 0x0301,

	/** Multiply all colors by the destination color. */
	DST_COLOR = 0x0306,

	/** Multiply all colors by one minus the destination color. */
	ONE_MINUS_DST_COLOR = 0x0307,

	/** Multiply all colors by the source alpha value. */
	SRC_ALPHA = 0x0302,

	/** Multiply all colors by one minus the source alpha value. */
	ONE_MINUS_SRC_ALPHA = 0x0303,

	/** Multiply all colors by the destination alpha value. */
	DST_ALPHA = 0x0304,

	/** Multiply all colors by one minus the destination alpha value. */
	ONE_MINUS_DST_ALPHA = 0x0305,

	/** Multiply all colors by a constant color. */
	CONSTANT_COLOR = 0x8001,

	/** Multiply all colors by one minus a constant color. */
	ONE_MINUS_CONSTANT_COLOR = 0x8002,

	/** Multiply all colors by a constant alpha value. */
	CONSTANT_ALPHA = 0x8003,

	/** Multiply all colors by one minus a constant alpha value. */
	ONE_MINUS_CONSTANT_ALPHA = 0x8004,

	/** Multiply the RGB colors by the smaller of either the source alpha value or the value of one minus the destination alpha value. Multiply the alpha value by one. */
	SRC_ALPHA_SATURATE = 0x0308
}

export default BlendFunction;
