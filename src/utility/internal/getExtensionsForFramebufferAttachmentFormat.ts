import Extension from "../../constants/Extension.js";
import TextureFormat from "../../constants/TextureFormat.js";

/**
 * Get the extension that is associated with the given framebuffer attachment format.
 * @param format - The framebuffer attachment format.
 * @returns The extension that is associated with the framebuffer attachment format.
 * @internal
 */
export default function getExtensionsForFramebufferAttachmentFormat(
	format: TextureFormat
): Extension[] {
	switch (format) {
		case TextureFormat.R16F:
		case TextureFormat.RG16F:
		case TextureFormat.RGBA16F:
		case TextureFormat.R32F:
		case TextureFormat.RG32F:
		case TextureFormat.RGBA32F:
		case TextureFormat.R11F_G11F_B10F:
			return [Extension.ExtColorBufferFloat, Extension.FloatBlend];
		default:
			return [];
	}
}
