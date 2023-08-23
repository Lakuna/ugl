import Texture from "#Texture";
import Texture2dMip from "#Texture2dMip";
import type Context from "#Context";
import type { MipSource } from "#MipSource";
import Mipmap from "#Mipmap";
import TextureMagFilter from "#TextureMagFilter";
import TextureMinFilter from "#TextureMinFilter";
import TextureWrapFunction from "#TextureWrapFunction";
import TextureTarget from "#TextureTarget";
import MipmapTarget from "#MipmapTarget";

/**
 * A 2D texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture2d extends Texture<Texture2dMip> {
	/**
	 * Creates a basic 2D texture from a pixel source.
	 * @param context The rendering context of the texture.
	 * @param source The pixel source.
	 * @returns A basic 2D texture.
	 */
	public static fromSource(context: Context, source: MipSource): Texture2d {
		return new Texture2d(context, new Mipmap(new Texture2dMip(source)));
	}

	/**
	 * Creates a basic 2D texture from an image URL. The texture will appear
	 * magenta until the image loads.
	 * @param context The rendering context of the texture.
	 * @param url The URL of the image.
	 * @returns A basic 2D texture.
	 */
	public static fromImageUrl(context: Context, url: string): Texture2d {
		const out = new Texture2d(
			context,
			new Mipmap(
				new Texture2dMip(
					new Uint8Array([0xff, 0x00, 0xff, 0xff]),
					undefined,
					1,
					1
				)
			)
		);

		const image: HTMLImageElement = new Image();
		image.addEventListener("load", () => {
			out.face.top.source = image;
			out.face.top.width = undefined;
			out.face.top.height = undefined;
		});
		image.crossOrigin = "";
		image.src = url;

		return out;
	}

	/**
	 * Creates a 2D texture.
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
		face: Mipmap<Texture2dMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			context,
			TextureTarget.TEXTURE_2D,
			new Map([[MipmapTarget.TEXTURE_2D, face]]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The face of this texture. */
	public get face(): Mipmap<Texture2dMip> {
		return this.getFace(MipmapTarget.TEXTURE_2D) as Mipmap<Texture2dMip>;
	}

	/** The face of this texture. */
	public set face(value: Mipmap<Texture2dMip>) {
		this.setFace(MipmapTarget.TEXTURE_2D, value);
	}
}
