import {
	TEXTURE_BINDING_2D,
	TEXTURE_BINDING_2D_ARRAY,
	TEXTURE_BINDING_3D,
	TEXTURE_BINDING_CUBE_MAP
} from "../../constants/constants.js";
import TextureTarget from "../../constants/TextureTarget.js";

/**
 * Get the constant value representing the context property of the given texture binding point.
 * @param target - The texture binding point.
 * @returns The constant value.
 * @internal
 */
export default function getParameterForTextureTarget(target: TextureTarget) {
	// TODO: Add `@throws` documentation.

	switch (target) {
		case TextureTarget.TEXTURE_2D:
			return TEXTURE_BINDING_2D;
		case TextureTarget.TEXTURE_2D_ARRAY:
			return TEXTURE_BINDING_2D_ARRAY;
		case TextureTarget.TEXTURE_3D:
			return TEXTURE_BINDING_3D;
		case TextureTarget.TEXTURE_CUBE_MAP:
			return TEXTURE_BINDING_CUBE_MAP;
		default:
			throw new RangeError("Unknown texture target.");
	}
}
