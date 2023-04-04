import type Context from "../Context.js";
import Texture, { type Mipmap, Mip, type MipSource, TextureMagFilter, TextureMinFilter, TextureWrapFunction, TextureInternalFormat, UNPACK_ALIGNMENT, MipmapTarget, TextureTarget } from "./Texture.js";

/**
 * A cubemap texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/cubemaps)
 */
export default class Cubemap extends Texture<CubemapMip> {
	/**
	 * Creates a 2D texture.
	 * @param gl The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param nxFace The negative X-axis face of the texture.
	 * @param pxFace The positive X-axis face of the texture.
	 * @param nyFace The negative Y-axis face of the texture.
	 * @param pyFace The positive Y-axis face of the texture.
	 * @param nzFace The negative Z-axis face of the texture.
	 * @param pzFace The positive Z-axis face of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture across the T-axis.
	 */
	public constructor(
		gl: Context,
		nxFace: Mipmap<CubemapMip>,
		pxFace: Mipmap<CubemapMip>,
		nyFace: Mipmap<CubemapMip>,
		pyFace: Mipmap<CubemapMip>,
		nzFace: Mipmap<CubemapMip>,
		pzFace: Mipmap<CubemapMip>,
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			gl,
			TextureTarget.TEXTURE_CUBE_MAP,
			new Map([
				[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, nxFace],
				[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X, pxFace],
				[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, nyFace],
				[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, pyFace],
				[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, nzFace],
				[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, pzFace]
			]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The negative X-axis face of this texture. */
	public get nxFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X) as Mipmap<CubemapMip>;
	}

	public set nxFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, value);
	}

	/** The positive X-axis face of this texture. */
	public get pxFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X) as Mipmap<CubemapMip>;
	}

	public set pxFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X, value);
	}

	/** The negative Y-axis face of this texture. */
	public get nyFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y) as Mipmap<CubemapMip>;
	}

	public set nyFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, value);
	}

	/** The positive Y-axis face of this texture. */
	public get pyFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y) as Mipmap<CubemapMip>;
	}

	public set pyFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, value);
	}

	/** The negative Z-axis face of this texture. */
	public get nzFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z) as Mipmap<CubemapMip>;
	}

	public set nzFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, value);
	}

	/** The positive Z-axis face of this texture. */
	public get pzFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z) as Mipmap<CubemapMip>;
	}

	public set pzFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, value);
	}
}

/** A level of a face of a cubemap. */
export class CubemapMip extends Mip {
	/**
	 * Creates a level of a texture face.
	 * @param source The pixel source of the texture.
	 * @param internalFormat The format of the color components in the texture.
	 * @param dim The width and height of the texture face level.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		dim?: number,
	) {
		super(source, internalFormat, [dim]);
	}

	/** The width and height of this texture face level. */
	public get dim(): number | undefined {
		return this.dims[0];
	}

	public set dim(value: number | undefined) {
		this.dims = [value];
	}

	/**
	 * Updates this texture face level.
	 * @param gl The rendering context of this texture face level.
	 * @param texture The WebGL texture.
	 * @param lod The level of detail of this texture face level.
	 */
	protected override updateInternal(gl: Context, target: MipmapTarget, lod: number): void {
		if (this.dim) {
			if (this.dim > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.dim % alignment == 0) {
						gl.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			gl.gl.texImage2D(target, lod, this.internalFormat, this.dim, this.dim, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			gl.gl.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
