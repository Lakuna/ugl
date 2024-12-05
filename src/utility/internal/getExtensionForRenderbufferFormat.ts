import Extension from "../../constants/Extension.js";
import RenderbufferFormat from "../../constants/RenderbufferFormat.js";

/**
 * Get the extension that is associated with the given renderbuffer format.
 * @param format - The renderbuffer format.
 * @returns The extension that is associated with the renderbuffer format.
 * @internal
 */
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
