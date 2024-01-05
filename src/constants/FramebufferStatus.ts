/**
 * Framebuffer statuses.
 * @see [`checkFramebufferStatus`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus)
 */
enum FramebufferStatus {
	/** The framebuffer is ready to display. */
	FRAMEBUFFER_COMPLETE = 0x8cd5,

	/**
	 * The attachment types are mismatched or not all of the framebuffer
	 * attachment points are framebuffer attachment complete.
	 */
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8cd6,

	/** There is no attachment. */
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8cd7,

	/** The height and width of the attachments are not the same. */
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8cd9,

	/**
	 * The format of the attachment is not supported or the depth and stencil
	 * attachments are not the same renderbuffer.
	 */
	FRAMEBUFFER_UNSUPPORTED = 0x8cdd,

	/**
	 * The values of the renderbuffer samples are different among attached
	 * renderbuffers, or are non-zero if the attached images are a mix of
	 * renderbuffers and textures.
	 */
	FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8d56,

	/**
	 * The base view index is not the same for all framebuffer attachment
	 * points where the object type is not none.
	 */
	FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = 0x9633
}

export default FramebufferStatus;
