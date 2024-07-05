/**
 * Binding points for framebuffers.
 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
 * @internal
 */
enum FramebufferTarget {
	/** Used as a destination for drawing, rendering, clearing, and writing operations, and as a source for reading operations. */
	FRAMEBUFFER = 0x8d40,

	/** Used as a destination for drawing, rendering, clearing, and writing operations. */
	DRAW_FRAMEBUFFER = 0x8ca9,

	/** Used as a source for reading operations. */
	READ_FRAMEBUFFER = 0x8ca8
}

export default FramebufferTarget;
