import Texture, {
	Mip, Mipmap, MipmapTarget, type MipSource, TextureInternalFormat, TextureMagFilter,
	TextureMinFilter, TextureTarget, TextureWrapFunction, UNPACK_ALIGNMENT
} from "#textures/Texture";
import type Context from "#webgl/Context";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";

/**
 * A 3D texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture3d extends Texture<Texture3dMip> {
	/**
	 * Creates a basic 3D texture from a pixel source.
	 * @param context The rendering context of the texture.
	 * @param source The pixel source.
	 * @returns A basic 3D texture.
	 */
	public static fromSource(context: Context, source: MipSource): Texture3d {
		return new Texture3d(
			context,
			new Mipmap(new Texture3dMip(source))
		);
	}

	/**
	 * Creates a 3D texture.
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
		face: Mipmap<Texture3dMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			context,
			TextureTarget.TEXTURE_3D,
			new Map([
				[MipmapTarget.TEXTURE_3D, face]
			]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The face of this texture. */
	public get face(): Mipmap<Texture3dMip> {
		return this.getFace(MipmapTarget.TEXTURE_3D) as Mipmap<Texture3dMip>;
	}

	/** The face of this texture. */
	public set face(value: Mipmap<Texture3dMip>) {
		this.setFace(MipmapTarget.TEXTURE_3D, value);
	}
}

/** A mip of a 3D texture. */
export class Texture3dMip extends Mip {
	/**
	 * Creates a mip of a 3D texture.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param width The width of the mip.
	 * @param height The height of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		width?: number,
		height?: number,
		depth?: number
	) {
		super(source, internalFormat, [width, height, depth]);
	}

	/** The width of this mip. */
	public get width(): number | undefined {
		return this.dims[0];
	}

	/** The width of this mip. */
	public set width(value: number | undefined) {
		this.dims = [value, this.dims[1], this.dims[2]];
	}

	/** The height of this mip. */
	public get height(): number | undefined {
		return this.dims[1];
	}

	/** The height of this mip. */
	public set height(value: number | undefined) {
		this.dims = [this.dims[0], value, this.dims[2]];
	}

	/** The depth of this mip. */
	public get depth(): number | undefined {
		return this.dims[2];
	}

	/** The depth of this mip. */
	public set depth(value: number | undefined) {
		this.dims = [this.dims[0], this.dims[1], value];
	}

	/**
	 * Updates this texture face level.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected override updateInternal(texture: Texture<Texture3dMip>, target: MipmapTarget, lod: number): void {
		if (typeof this.width == "undefined" || typeof this.height == "undefined" || typeof this.depth == "undefined") {
			throw new UnsupportedOperationError("The dimensions of the texture are not defined.");
		}

		if (!this.unpackAlignment && this.height > 1) { // Unpack alignment doesn't apply to the last row.
			for (const alignment of [8, 4, 2, 1]) {
				if (this.width % alignment == 0) {
					texture.context.internal.pixelStorei(UNPACK_ALIGNMENT, alignment);
					break;
				}
			}
		}

		texture.context.internal.texImage3D(target, lod, this.internalFormat, this.width, this.height, this.depth, 0, this.format, this.type, this.source as ArrayBufferView);
	}
}
