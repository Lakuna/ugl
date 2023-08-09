import Texture, {
	Mip, Mipmap, MipmapTarget, type MipSource, TextureInternalFormat, TextureMagFilter,
	TextureMinFilter, TextureTarget, TextureWrapFunction, UNPACK_ALIGNMENT
} from "#textures/Texture";
import type Context from "#webgl/Context";

/**
 * A 2D texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture2D extends Texture<Texture2DMip> {
	/**
	 * Creates a basic 2D texture from a pixel source.
	 * @param context The rendering context of the texture.
	 * @param source The pixel source.
	 * @returns A basic 2D texture.
	 */
	public static fromSource(context: Context, source: MipSource): Texture2D {
		return new Texture2D(
			context,
			new Mipmap(new Texture2DMip(source))
		);
	}

	/**
	 * Creates a basic 2D texture from an image URL. The texture will appear magenta until the image loads.
	 * @param context The rendering context of the texture.
	 * @param url The URL of the image.
	 * @returns A basic 2D texture.
	 */
	public static fromImageUrl(context: Context, url: string): Texture2D {
		const out = new Texture2D(
			context,
			new Mipmap(
				new Texture2DMip(
					new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
					undefined,
					1,
					1
				)
			)
		)

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
	 * @param wrapSFunction The function to use when wrapping the texture across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture across the T-axis.
	 */
	public constructor(
		context: Context,
		face: Mipmap<Texture2DMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			context,
			TextureTarget.TEXTURE_2D,
			new Map([
				[MipmapTarget.TEXTURE_2D, face]
			]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The face of this texture. */
	public get face(): Mipmap<Texture2DMip> {
		return this.getFace(MipmapTarget.TEXTURE_2D) as Mipmap<Texture2DMip>;
	}

	/** The face of this texture. */
	public set face(value: Mipmap<Texture2DMip>) {
		this.setFace(MipmapTarget.TEXTURE_2D, value);
	}
}

/** A mip of a 2D texture. */
export class Texture2DMip extends Mip {
	/**
	 * Creates a mip of a 2D texture.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param width The width of the mip.
	 * @param height The height of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		width?: number,
		height?: number
	) {
		super(source, internalFormat, [width, height]);
	}

	/** The width of this mip. */
	public get width(): number | undefined {
		return this.dims[0];
	}

	/** The width of this mip. */
	public set width(value: number | undefined) {
		this.dims = [value, this.dims[1]];
	}

	/** The height of this mip. */
	public get height(): number | undefined {
		return this.dims[1];
	}

	/** The height of this mip. */
	public set height(value: number | undefined) {
		this.dims = [this.dims[0], value];
	}

	/**
	 * Updates this texture face level.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected override updateInternal(texture: Texture<Texture2DMip>, target: MipmapTarget, lod: number): void {
		if (this.width && this.height) {
			if (!this.unpackAlignment && this.height > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						texture.context.internal.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			texture.context.internal.texImage2D(target, lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			texture.context.internal.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
