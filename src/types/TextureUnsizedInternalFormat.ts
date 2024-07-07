import type TextureCompressedUnsizedInternalFormat from "../constants/TextureCompressedUnsizedInternalFormat.js";
import type TextureUncompressedUnsizedInternalFormat from "../constants/TextureUncompressedUnsizedInternalFormat.js";

/** Sized formats for the color components in a texture. */
export type TextureUnsizedInternalFormat =
	| TextureCompressedUnsizedInternalFormat
	| TextureUncompressedUnsizedInternalFormat;
