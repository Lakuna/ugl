import Texture from "#Texture";
import Texture3dMip from "#Texture3dMip";
import type Context from "#Context";
import type { MipSource } from "#MipSource";
import Mipmap from "#Mipmap";
import TextureMagFilter from "#TextureMagFilter";
import TextureMinFilter from "#TextureMinFilter";
import TextureWrapFunction from "#TextureWrapFunction";
import TextureTarget from "#TextureTarget";
import MipmapTarget from "#MipmapTarget";

/**
 * A 3D texture.
 * @see [Textures](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture3d extends Texture<Texture3dMip> {
	/**
	 * Creates a basic 3D texture from a pixel source.
	 * @param context The rendering context of the texture.
	 * @param source The pixel source.
	 * @returns A basic 3D texture.
	 */
	public static fromSource(context: Context, source: MipSource): Texture3d {
		return new Texture3d(context, new Mipmap(new Texture3dMip(source)));
	}

	/**
	 * Creates a 3D texture.
	 * @param context The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param face The face of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture
	 * across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture
	 * across the T-axis.
	 */
	public constructor(
		context: Context,
		face: Mipmap<Texture3dMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			context,
			TextureTarget.TEXTURE_3D,
			new Map([[MipmapTarget.TEXTURE_3D, face]]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The face of this texture. */
	public get face(): Mipmap<Texture3dMip> {
		// TODO: Optional caching.
		return this.getFace(MipmapTarget.TEXTURE_3D) as Mipmap<Texture3dMip>;
	}

	/** The face of this texture. */
	public set face(value: Mipmap<Texture3dMip>) {
		// TODO: Optional caching.
		this.setFace(MipmapTarget.TEXTURE_3D, value);
	}
}
