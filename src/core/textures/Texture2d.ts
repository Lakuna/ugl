import Texture from "#Texture";
import TextureTarget from "#TextureTarget";
import type Context from "#Context";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";

/** A two-dimensional texture. */
export default class Texture2d extends Texture {
	// TODO: `fromSource`.

	// TODO: `fromUrl`.

	/**
	 * Creates a two-dimensional texture.
	 * @param context The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
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
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureSizedInternalFormat,
		width: number,
		height: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureSizedInternalFormat,
		width?: number,
		height?: number
	) {
		super(context, TextureTarget.TEXTURE_2D, levels!, format!, [
			width!,
			height!
		]);
	}

	/**
	 * Makes this into an immutable-format texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param dims The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D).
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 * @internal
	 */
	protected makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: Array<number>
	): void {
		this.gl.texStorage2D(this.target, levels, format, dims[0]!, dims[1]!);
	}
}
