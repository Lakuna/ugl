import TextureFormat from "#TextureFormat";
import type { TextureInternalFormat } from "#TextureInternalFormat";
import type { TextureUncompressedInternalFormat } from "#TextureUncompressedInternalFormat";
import type { TextureCompressedInternalFormat } from "#TextureCompressedInternalFormat";
import TextureUncompressedSizedInternalFormat from "#TextureUncompressedSizedInternalFormat";
import TextureUncompressedUnsizedInternalFormat from "#TextureUncompressedUnsizedInternalFormat";

/**
 * Gets the corresponding texture format for an internal format.
 * @param internalFormat The internal format.
 * @returns The texture format.
 * @see [`glTexImage2D`](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml)
 * @internal
 */
export default function getTextureFormatForTextureInternalFormat(
	internalFormat: TextureCompressedInternalFormat
): null;

/**
 * Gets the corresponding texture format for an internal format.
 * @param internalFormat The internal format.
 * @returns The texture format.
 * @see [`glTexImage2D`](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml)
 * @internal
 */
export default function getTextureFormatForTextureInternalFormat(
	internalFormat: TextureUncompressedInternalFormat
): TextureFormat;

/**
 * Gets the corresponding texture format for an internal format.
 * @param internalFormat The internal format.
 * @returns The texture format.
 * @see [`glTexImage2D`](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml)
 * @internal
 */
export default function getTextureFormatForTextureInternalFormat(
	internalFormat: TextureInternalFormat
): TextureFormat | null;

export default function getTextureFormatForTextureInternalFormat(
	internalFormat: TextureInternalFormat
): TextureFormat | null {
	switch (internalFormat) {
		case TextureUncompressedUnsizedInternalFormat.RGB:
		case TextureUncompressedSizedInternalFormat.RGB8:
		case TextureUncompressedSizedInternalFormat.SRGB8:
		case TextureUncompressedSizedInternalFormat.RGB565:
		case TextureUncompressedSizedInternalFormat.RGB8_SNORM:
		case TextureUncompressedSizedInternalFormat.R11F_G11F_B10F:
		case TextureUncompressedSizedInternalFormat.RGB9_E5:
		case TextureUncompressedSizedInternalFormat.RGB16F:
		case TextureUncompressedSizedInternalFormat.RGB32F:
			return TextureFormat.RGB;
		case TextureUncompressedUnsizedInternalFormat.RGBA:
		case TextureUncompressedSizedInternalFormat.RGBA8:
		case TextureUncompressedSizedInternalFormat.SRGB8_ALPHA8:
		case TextureUncompressedSizedInternalFormat.RGBA8_SNORM:
		case TextureUncompressedSizedInternalFormat.RGB5_A1:
		case TextureUncompressedSizedInternalFormat.RGBA4:
		case TextureUncompressedSizedInternalFormat.RGB10_A2:
		case TextureUncompressedSizedInternalFormat.RGBA16F:
		case TextureUncompressedSizedInternalFormat.RGBA32F:
			return TextureFormat.RGBA;
		case TextureUncompressedUnsizedInternalFormat.LUMINANCE_ALPHA:
			return TextureFormat.LUMINANCE_ALPHA;
		case TextureUncompressedUnsizedInternalFormat.LUMINANCE:
			return TextureFormat.LUMINANCE;
		case TextureUncompressedUnsizedInternalFormat.ALPHA:
			return TextureFormat.ALPHA;
		case TextureUncompressedSizedInternalFormat.R8:
		case TextureUncompressedSizedInternalFormat.R8_SNORM:
		case TextureUncompressedSizedInternalFormat.R16F:
		case TextureUncompressedSizedInternalFormat.R32F:
			return TextureFormat.RED;
		case TextureUncompressedSizedInternalFormat.R8UI:
		case TextureUncompressedSizedInternalFormat.R8I:
		case TextureUncompressedSizedInternalFormat.R16UI:
		case TextureUncompressedSizedInternalFormat.R16I:
		case TextureUncompressedSizedInternalFormat.R32UI:
		case TextureUncompressedSizedInternalFormat.R32I:
			return TextureFormat.RED_INTEGER;
		case TextureUncompressedSizedInternalFormat.RG8:
		case TextureUncompressedSizedInternalFormat.RG8_SNORM:
		case TextureUncompressedSizedInternalFormat.RG16F:
		case TextureUncompressedSizedInternalFormat.RG32F:
			return TextureFormat.RG;
		case TextureUncompressedSizedInternalFormat.RG8UI:
		case TextureUncompressedSizedInternalFormat.RG8I:
		case TextureUncompressedSizedInternalFormat.RG16UI:
		case TextureUncompressedSizedInternalFormat.RG16I:
		case TextureUncompressedSizedInternalFormat.RG32UI:
		case TextureUncompressedSizedInternalFormat.RG32I:
			return TextureFormat.RG_INTEGER;
		case TextureUncompressedSizedInternalFormat.RGB8UI:
		case TextureUncompressedSizedInternalFormat.RGB8I:
		case TextureUncompressedSizedInternalFormat.RGB16UI:
		case TextureUncompressedSizedInternalFormat.RGB16I:
		case TextureUncompressedSizedInternalFormat.RGB32UI:
		case TextureUncompressedSizedInternalFormat.RGB32I:
			return TextureFormat.RGB_INTEGER;
		case TextureUncompressedSizedInternalFormat.RGBA8UI:
		case TextureUncompressedSizedInternalFormat.RGBA8I:
		case TextureUncompressedSizedInternalFormat.RGB10_A2UI:
		case TextureUncompressedSizedInternalFormat.RGBA16UI:
		case TextureUncompressedSizedInternalFormat.RGBA16I:
		case TextureUncompressedSizedInternalFormat.RGBA32UI:
		case TextureUncompressedSizedInternalFormat.RGBA32I:
			return TextureFormat.RGBA_INTEGER;
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT16:
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT24:
		case TextureUncompressedSizedInternalFormat.DEPTH_COMPONENT32F:
			return TextureFormat.DEPTH_COMPONENT;
		case TextureUncompressedSizedInternalFormat.DEPTH24_STENCIL8:
		case TextureUncompressedSizedInternalFormat.DEPTH32F_STENCIL8:
			return TextureFormat.DEPTH_STENCIL;
		default:
			return null;
	}
}
