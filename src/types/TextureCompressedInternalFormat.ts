import type TextureCompressedSizedInternalFormat from "../constants/TextureCompressedSizedInternalFormat.js";
import type TextureCompressedUnsizedInternalFormat from "../constants/TextureCompressedUnsizedInternalFormat.js";

/**
 * Compressed formats for the color components in a texture.
 * @see [`compressedTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D)
 */
export type TextureCompressedInternalFormat =
	| TextureCompressedSizedInternalFormat
	| TextureCompressedUnsizedInternalFormat;
