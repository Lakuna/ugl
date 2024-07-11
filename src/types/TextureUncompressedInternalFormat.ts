// TODO: Remove.

import type TextureUncompressedSizedInternalFormat from "../constants/TextureUncompressedSizedInternalFormat.js";
import type TextureUncompressedUnsizedInternalFormat from "../constants/TextureCompressedUnsizedInternalFormat.js";

/**
 * Compressed formats for the color components in a texture.
 * @public
 */
export type TextureUncompressedInternalFormat =
	| TextureUncompressedSizedInternalFormat
	| TextureUncompressedUnsizedInternalFormat;
