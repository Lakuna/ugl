/**
 * Non-color framebuffer attachments.
 * @public
 */
enum FramebufferAttachment {
	/** The depth attachment. */
	DEPTH = -1,

	/** The stencil attachment. */
	STENCIL = -2,

	/** The depth stencil attachment. */
	DEPTH_STENCIL = -3
}

export default FramebufferAttachment;
