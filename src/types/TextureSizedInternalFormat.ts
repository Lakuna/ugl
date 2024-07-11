// TODO: Remove.

import type TextureCompressedSizedInternalFormat from "../constants/TextureCompressedSizedInternalFormat.js";
import type TextureUncompressedSizedInternalFormat from "../constants/TextureUncompressedSizedInternalFormat.js";

/**
 * Sized formats for the color components in a texture.
 * @public
 */
export type TextureSizedInternalFormat =
	| TextureCompressedSizedInternalFormat
	| TextureUncompressedSizedInternalFormat;
