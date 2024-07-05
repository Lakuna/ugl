import CubemapFace from "#CubemapFace";
import MipmapTarget from "#MipmapTarget";
import TextureTarget from "#TextureTarget";

/**
 * Get a mipmap target for the given cubemap face.
 * @param face - The cubemap face.
 * @param target - The texture target.
 * @returns The mipmap target.
 * @internal
 */
export default function getMipmapTargetForCubemapFace(
	face?: CubemapFace,
	target: TextureTarget = TextureTarget.TEXTURE_CUBE_MAP
) {
	switch (target) {
		case TextureTarget.TEXTURE_2D_ARRAY:
			return MipmapTarget.TEXTURE_2D_ARRAY;
		case TextureTarget.TEXTURE_3D:
			return MipmapTarget.TEXTURE_3D;
		case TextureTarget.TEXTURE_CUBE_MAP:
			switch (face) {
				case CubemapFace.NegativeX:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X;
				case CubemapFace.NegativeY:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y;
				case CubemapFace.NegativeZ:
					return MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z;
				case CubemapFace.PositiveX:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X;
				case CubemapFace.PositiveY:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y;
				case CubemapFace.PositiveZ:
				default:
					return MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z;
			}
		case TextureTarget.TEXTURE_2D:
		default:
			return MipmapTarget.TEXTURE_2D;
	}
}
