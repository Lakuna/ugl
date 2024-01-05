import RenderbufferFormat from "#RenderbufferFormat";
import Extension from "#Extension";

/**
 * Gets the extension that is associated with the given renderbuffer format.
 * @param format The renderbuffer format.
 * @returns The extension that is associated with the renderbuffer format.
 * @internal
 */
export default function getExtensionForRenderbufferFormat(
	format:
		| RenderbufferFormat.R16F
		| RenderbufferFormat.RG16F
		| RenderbufferFormat.RGBA16F
		| RenderbufferFormat.R32F
		| RenderbufferFormat.RG32F
		| RenderbufferFormat.RGBA32F
		| RenderbufferFormat.R11F_G11F_B10F
): Extension.ExtColorBufferFloat;

/**
 * Gets the extension that is associated with the given renderbuffer format.
 * @param format The renderbuffer format.
 * @returns The extension that is associated with the renderbuffer format.
 * @internal
 */
export default function getExtensionForRenderbufferFormat(
	format:
		| RenderbufferFormat.RGBA4
		| RenderbufferFormat.RGB565
		| RenderbufferFormat.RGB5_A1
		| RenderbufferFormat.DEPTH_COMPONENT16
		| RenderbufferFormat.STENCIL_INDEX8
		| RenderbufferFormat.DEPTH_STENCIL
		| RenderbufferFormat.R8
		| RenderbufferFormat.R8UI
		| RenderbufferFormat.R8I
		| RenderbufferFormat.R16UI
		| RenderbufferFormat.R16I
		| RenderbufferFormat.R32UI
		| RenderbufferFormat.R32I
		| RenderbufferFormat.RG8
		| RenderbufferFormat.RG8UI
		| RenderbufferFormat.RG8I
		| RenderbufferFormat.RG16UI
		| RenderbufferFormat.RG16I
		| RenderbufferFormat.RG32UI
		| RenderbufferFormat.RG32I
		| RenderbufferFormat.RGB8
		| RenderbufferFormat.RGBA8
		| RenderbufferFormat.SRGB8_ALPHA8
		| RenderbufferFormat.RGB10_A2
		| RenderbufferFormat.RGBA8UI
		| RenderbufferFormat.RGBA8I
		| RenderbufferFormat.RGB10_A2UI
		| RenderbufferFormat.RGBA16UI
		| RenderbufferFormat.RGBA16I
		| RenderbufferFormat.RGBA32I
		| RenderbufferFormat.RGBA32UI
		| RenderbufferFormat.DEPTH_COMPONENT24
		| RenderbufferFormat.DEPTH_COMPONENT32F
		| RenderbufferFormat.DEPTH24_STENCIL8
		| RenderbufferFormat.DEPTH32F_STENCIL8
		| RenderbufferFormat.RGB32F_EXT
): null;

/**
 * Gets the extension that is associated with the given renderbuffer format.
 * @param format The renderbuffer format.
 * @returns The extension that is associated with the renderbuffer format.
 * @internal
 */
export default function getExtensionForRenderbufferFormat(
	format: RenderbufferFormat
): Extension | null;

export default function getExtensionForRenderbufferFormat(
	format: RenderbufferFormat
): Extension | null {
	switch (format) {
		case RenderbufferFormat.R16F:
		case RenderbufferFormat.RG16F:
		case RenderbufferFormat.RGBA16F:
		case RenderbufferFormat.R32F:
		case RenderbufferFormat.RG32F:
		case RenderbufferFormat.RGBA32F:
		case RenderbufferFormat.R11F_G11F_B10F:
			return Extension.ExtColorBufferFloat;
		default:
			return null;
	}
}
