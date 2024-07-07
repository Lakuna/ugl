import TextureCompressedSizedInternalFormat from "#TextureCompressedSizedInternalFormat";
import TextureCompressedUnsizedInternalFormat from "#TextureCompressedUnsizedInternalFormat";
import type TextureFormat from "#TextureFormat";

/**
 * Determine whether the given texture format is compressed.
 * @param format - The texture format.
 * @returns Whether or not the given texture format is compressed.
 * @see [Compressed texture formats](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Compressed_texture_formats)
 * @internal
 */
export default function isTextureFormatCompressed(format: TextureFormat) {
	return (
		format in TextureCompressedSizedInternalFormat ||
		format in TextureCompressedUnsizedInternalFormat
	);
}
