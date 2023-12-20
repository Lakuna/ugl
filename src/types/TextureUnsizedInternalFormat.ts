import type TextureCompressedUnsizedInternalFormat from "#TextureCompressedUnsizedInternalFormat";
import type TextureUncompressedUnsizedInternalFormat from "#TextureUncompressedUnsizedInternalFormat";

/** Sized formats for the color components in a texture. */
export type TextureUnsizedInternalFormat =
	| TextureCompressedUnsizedInternalFormat
	| TextureUncompressedUnsizedInternalFormat;
