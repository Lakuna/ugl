// TODO: Remove.

import type { TextureSizedInternalFormat } from "./TextureSizedInternalFormat.js";
import type { TextureUnsizedInternalFormat } from "./TextureUnsizedInternalFormat.js";

/**
 * Formats for the color components in a texture.
 * @public
 */
export type TextureInternalFormat =
	| TextureSizedInternalFormat
	| TextureUnsizedInternalFormat;
