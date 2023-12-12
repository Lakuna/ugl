import Texture from "#Texture";
import TextureTarget from "#TextureTarget";
import type Context from "#Context";
import type TextureInternalFormat from "#TextureInternalFormat";

/** A two-dimensional texture. */
export default class Texture2d extends Texture {
	/**
	 * Creates a two-dimensional texture.
	 * @param context The rendering context of the texture.
	 */
	public constructor(context: Context);

	/**
	 * Creates a two-dimensional texture with a fixed size. This has better
	 * performance than a variable-sized texture.
	 * @param context The rendering context of the texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param width The width of the texture.
	 * @param height The height of the texture.
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureInternalFormat,
		width: number,
		height: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureInternalFormat,
		width?: number,
		height?: number
	) {
		super(context, TextureTarget.TEXTURE_2D);

		if (typeof levels == "number") {
			this.gl.texStorage2D(
				TextureTarget.TEXTURE_2D,
				levels,
				format!,
				width!,
				height!
			);
		}
	}
}
