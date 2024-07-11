/**
 * Non-color framebuffer attachments.
 * @public
 */
enum FramebufferAttachment {
	/** The depth attachment. */
	Depth = -1,

	/** The stencil attachment. */
	Stencil = -2,

	/** The depth stencil attachment. */
	DepthStencil = -3
}

export default FramebufferAttachment;
