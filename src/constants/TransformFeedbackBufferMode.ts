/**
 * Modes for capturing transform feedback varyings.
 * @see [`transformFeedbackVaryings`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/transformFeedbackVaryings)
 */
enum TransformFeedbackBufferMode {
	/**
	 * All of the varyings will be written to the same buffer, interleaved in
	 * the specified order.
	 */
	INTERLEAVED_ATTRIBS = 0x8c8c,

	/** Each varying will be written to a different buffer. */
	SEPARATE_ATTRIBS = 0x8c8d
}

export default TransformFeedbackBufferMode;
