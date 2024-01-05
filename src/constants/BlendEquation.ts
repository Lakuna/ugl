/**
 * Blend equations.
 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
 */
enum BlendEquation {
	/** Add the destination to the source. */
	FUNC_ADD = 0x8006,

	/** Subtract the destination from the source. */
	FUNC_SUBTRACT = 0x800a,

	/** Subtract the source from the destination. */
	FUNC_REVERSE_SUBTRACT = 0x800b,

	/** Use the minimum color components of the source and destination. */
	MIN = 0x8007,

	/** Use the maximum color components of the source and destination. */
	MAX = 0x8008
}

export default BlendEquation;
