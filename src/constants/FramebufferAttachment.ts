/**
 * Non-color framebuffer attachments.
 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
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
