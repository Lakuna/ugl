import { FramebufferTarget, TextureDataType, TextureFilter, TextureFormat, TextureWrapMode, Vector } from "../index.js";

/** Parameters for creating a framebuffer. */
export type FramebufferParameters = {
	/** The rendering context of the framebuffer. */
	gl: WebGL2RenderingContext;

	/** The bind point of the framebuffer. */
	target?: FramebufferTarget;

	/** The width and height of the framebuffer. */
	size?: Vector;

	/** The number of color textures to add to the framebuffer. */
	colorTextureCount?: number;

	/** Whether to add a depth buffer to the framebuffer. */
	depth?: boolean;

	/** Whether to add a stencil buffer to the framebuffer. */
	stencil?: boolean;

	/** Whether to add a depth texture to the framebuffer. This overrides any depth and stencil buffers. */
	depthTexture?: boolean;

	/** The wrappig behavior of textures attached to the framebuffer on the S axis. */
	wrapS?: TextureWrapMode;

	/** The wrappig behavior of textures attached to the framebuffer on the T axis. */
	wrapT?: TextureWrapMode;

	/** The minimum mip filter of textures attached to the framebuffer. */
	minFilter?: TextureFilter;

	/** The maximum mip filter of textures attached to the framebuffer. */
	magFilter?: TextureFilter;

	/** The data type of the values in textures attached to the framebuffer. */
	type?: TextureDataType;

	/** The format of the data supplied to textures attached to the framebuffer. */
	format?: TextureFormat;

	/** The format of the data in textures attached to the framebuffer. */
	internalFormat?: TextureFormat;

	/** The unpack alignment of the textures attached to the framebuffer. */
	unpackAlignment?: number;

	/** Whether to multiply the alpha channel into the other channels. */
	premultiplyAlpha?: boolean;
}