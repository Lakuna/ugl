/**
 * Binding points for buffers.
 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
 * @internal
 */
enum BufferTarget {
	/** A buffer containing vertex attributes. */
	ARRAY_BUFFER = 0x8892,

	/** A buffer containing element indices. Not compatible with the rest of the buffer targets. */
	ELEMENT_ARRAY_BUFFER = 0x8893,

	/** A buffer for copying from one buffer to another. */
	COPY_READ_BUFFER = 0x8f36,

	/** A buffer for copying from one buffer to another. */
	COPY_WRITE_BUFFER = 0x8f37,

	/** A buffer for transform feedback operations. */
	TRANSFORM_FEEDBACK_BUFFER = 0x8c8e,

	/** A buffer used for storing uniform blocks. */
	UNIFORM_BUFFER = 0x8a11,

	/** A buffer used for pixel transfer operations. */
	PIXEL_PACK_BUFFER = 0x88eb,

	/** A buffer used for pixel transfer operations. */
	PIXEL_UNPACK_BUFFER = 0x88ec
}

export default BufferTarget;
