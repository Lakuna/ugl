import type Context from "../Context.js";
import Texture, { Mipmap, Mip, type MipSource, TextureMagFilter, TextureMinFilter, TextureWrapFunction, TextureTarget, MipmapTarget, TextureInternalFormat, UNPACK_ALIGNMENT } from "./Texture.js";

/**
 * A 2D texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture2D extends Texture<Texture2DMip> {
	/**
	 * Creates a basic 2D texture from a pixel source.
	 * @param gl The rendering context of the texture.
	 * @param source The pixel source.
	 * @returns A basic 2D texture.
	 */
	public static fromSource(gl: Context, source: MipSource): Texture2D {
		return new Texture2D(
			gl,
			new Mipmap(
				new Map([
					[0, new Texture2DMip(source)]
				])
			)
		);
	}

	/**
	 * Creates a 2D texture.
	 * @param gl The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param face The face of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture across the T-axis.
	 */
	public constructor(
		gl: Context,
		face: Mipmap<Texture2DMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			gl,
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
		return this.faces.get(MipmapTarget.TEXTURE_2D) as Mipmap<Texture2DMip>;
	}

	public set face(value: Mipmap<Texture2DMip>) {
		this.faces.set(MipmapTarget.TEXTURE_2D, value);
	}
}

/** A level of a face of a 2D texture. */
export class Texture2DMip extends Mip {
	/**
	 * Creates a level of a texture face.
	 * @param source The pixel source of the texture.
	 * @param internalFormat The format of the color components in the texture.
	 * @param width The width of the texture face level.
	 * @param height The height of the texture face level.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		width?: number,
		height?: number
	) {
		super(source, internalFormat, [width, height]);
	}

	/** The width of this texture face level. */
	public get width(): number | undefined {
		return this.dims[0];
	}

	public set width(value: number | undefined) {
		this.dims = [value, this.dims[1]];
	}

	/** The height of this texture face level. */
	public get height(): number | undefined {
		return this.dims[1];
	}

	public set height(value: number | undefined) {
		this.dims = [this.dims[0], value];
	}

	/**
	 * Updates this texture face level.
	 * @param gl The rendering context of this texture face level.
	 * @param texture The WebGL texture.
	 * @param lod The level of detail of this texture face level.
	 */
	protected override updateInternal(gl: Context, target: MipmapTarget, lod: number): void {
		if (this.width && this.height) {
			if (this.height > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						gl.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			gl.gl.texImage2D(target, lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			gl.gl.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
