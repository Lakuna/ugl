import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import type { TextureUnsizedInternalFormat } from "#TextureUnsizedInternalFormat";

/**
 * Formats for the color components in a texture.
 * @see [`copyTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D)
 * @see [`texImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)
 * @see [`texImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D)
 */
export type TextureInternalFormat =
	| TextureSizedInternalFormat
	| TextureUnsizedInternalFormat;
