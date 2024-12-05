import CubeFace from "../../constants/CubeFace.js";
import MipmapTarget from "../../constants/MipmapTarget.js";
import TextureTarget from "../../constants/TextureTarget.js";

/**
 * Get a mipmap target for the given cubemap face.
 * @param face - The cubemap face.
 * @param target - The texture target.
 * @returns The mipmap target.
 * @internal
 */
export default function getMipmapTargetForCubeFace(
	face?: CubeFace,
	target: TextureTarget = TextureTarget.TEXTURE_CUBE_MAP
): MipmapTarget {
	switch (target) {
		case TextureTarget.TEXTURE_2D_ARRAY:
			return MipmapTarget.TEXTURE_2D_ARRAY;
		case TextureTarget.TEXTURE_3D:
			return MipmapTarget.TEXTURE_3D;
		case TextureTarget.TEXTURE_CUBE_MAP:
			switch (face) {
				case CubeFace.NegativeX:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X;
				case CubeFace.NegativeY:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y;
				case CubeFace.NegativeZ:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z;
				case CubeFace.PositiveX:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X;
				case CubeFace.PositiveY:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y;
				case CubeFace.PositiveZ:
				default:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z;
			}
		case TextureTarget.TEXTURE_2D:
		default:
			return MipmapTarget.TEXTURE_2D;
	}
}
