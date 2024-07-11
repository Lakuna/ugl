// TODO: Remove.

import type TextureCompressedSizedInternalFormat from "../constants/TextureCompressedSizedInternalFormat.js";
import type TextureCompressedUnsizedInternalFormat from "../constants/TextureCompressedUnsizedInternalFormat.js";

/**
 * Compressed formats for the color components in a texture.
 * @public
 */
export type TextureCompressedInternalFormat =
	| TextureCompressedSizedInternalFormat
	| TextureCompressedUnsizedInternalFormat;
