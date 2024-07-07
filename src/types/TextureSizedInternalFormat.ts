import type TextureCompressedSizedInternalFormat from "../constants/TextureCompressedSizedInternalFormat.js";
import type TextureUncompressedSizedInternalFormat from "../constants/TextureUncompressedSizedInternalFormat.js";

/**
 * Sized formats for the color components in a texture.
 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D)
 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
 */
export type TextureSizedInternalFormat =
	| TextureCompressedSizedInternalFormat
	| TextureUncompressedSizedInternalFormat;
