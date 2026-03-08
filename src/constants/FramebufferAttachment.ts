/**
 * Non-color framebuffer attachments.
 * @public
 */
enum FramebufferAttachment {
	/** The depth stencil attachment. */
	DEPTH_STENCIL = -3,

	/** The stencil attachment. */
	STENCIL = -2,

	/** The depth attachment. */
	DEPTH = -1
}

export default FramebufferAttachment;
