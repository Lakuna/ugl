import type Context from "../Context.js";
import Texture, { Mipmap, Mip, type MipSource, TextureMagFilter, TextureMinFilter, TextureWrapFunction, TextureInternalFormat, UNPACK_ALIGNMENT, MipmapTarget, TextureTarget } from "./Texture.js";

/**
 * A cubemap texture.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/cubemaps)
 */
export default class Cubemap extends Texture<CubemapMip> {
	/**
	 * Creates a basic cubemap from pixel sources.
	 * @param gl The rendering context of the cubemap.
	 * @param px The pixel source of the positive X-axis face.
	 * @param nx The pixel source of the negative X-axis face.
	 * @param py The pixel source of the positive Y-axis face.
	 * @param ny The pixel source of the negative Y-axis face.
	 * @param pz The pixel source of the positive Z-axis face.
	 * @param nz The pixel source of the negative Z-axis face.
	 * @returns A basic cubemap.
	 */
	public static fromSources(gl: Context, px: MipSource, nx: MipSource, py: MipSource, ny: MipSource, pz: MipSource, nz: MipSource): Cubemap {
		return new Cubemap(
			gl,
			new Mipmap(new CubemapMip(px)),
			new Mipmap(new CubemapMip(nx)),
			new Mipmap(new CubemapMip(py)),
			new Mipmap(new CubemapMip(ny)),
			new Mipmap(new CubemapMip(pz)),
			new Mipmap(new CubemapMip(nz))
		);
	}

	/**
	 * Creates a basic cubemap from image URLs. The cubemap will appear magenta until the images load.
	 * @param gl The rendering context of the cubemap.
	 * @param px The URL of the image on the positive X-axis face.
	 * @param nx The URL of the image on the negative X-axis face.
	 * @param py The URL of the image on the positive Y-axis face.
	 * @param ny The URL of the image on the negative Y-axis face.
	 * @param pz The URL of the image on the positive Z-axis face.
	 * @param nz The URL of the image on the negative Z-axis face.
	 * @returns A basic 2D texture.
	 */
	public static fromImageUrls(gl: Context, px: string, nx: string, py: string, ny: string, pz: string, nz: string): Cubemap {
		const out = new Cubemap(
			gl,
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1)),
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1)),
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1)),
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1)),
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1)),
			new Mipmap(new CubemapMip(new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]), undefined, 1))
		)

		const loadedImages: Map<MipmapTarget, HTMLImageElement> = new Map();
		for (const [target, src] of [
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X, px],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, nx],
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, py],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, ny],
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, pz],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, nz]
		] as Array<[MipmapTarget, string]>) {
			const image: HTMLImageElement = new Image();
			image.addEventListener("load", () => {
				loadedImages.set(target, image);

				// Switch out the sources only once all of the images are loaded so that face sizes remain consistent.
				if (loadedImages.size >= 6) {
					for (const [target, image] of loadedImages) {
						const face: Mipmap<CubemapMip> = out.getFace(target) as Mipmap<CubemapMip>;
						face.top.source = image;
						face.top.dim = undefined;
					}
				}
			});
			image.crossOrigin = "";
			image.src = src;
		}

		return out;
	}

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

	/** The negative X-axis face of this texture. */
	public set nxFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, value);
	}

	/** The positive X-axis face of this texture. */
	public get pxFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X) as Mipmap<CubemapMip>;
	}

	/** The positive X-axis face of this texture. */
	public set pxFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X, value);
	}

	/** The negative Y-axis face of this texture. */
	public get nyFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y) as Mipmap<CubemapMip>;
	}

	/** The negative Y-axis face of this texture. */
	public set nyFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, value);
	}

	/** The positive Y-axis face of this texture. */
	public get pyFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y) as Mipmap<CubemapMip>;
	}

	/** The positive Y-axis face of this texture. */
	public set pyFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, value);
	}

	/** The negative Z-axis face of this texture. */
	public get nzFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z) as Mipmap<CubemapMip>;
	}

	/** The negative Z-axis face of this texture. */
	public set nzFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, value);
	}

	/** The positive Z-axis face of this texture. */
	public get pzFace(): Mipmap<CubemapMip> {
		return this.getFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z) as Mipmap<CubemapMip>;
	}

	/** The positive Z-axis face of this texture. */
	public set pzFace(value: Mipmap<CubemapMip>) {
		this.setFace(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, value);
	}
}

/** A mip of a cubemap. */
export class CubemapMip extends Mip {
	/**
	 * Creates a mip of a cubemap.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param dim The width and height of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		dim?: number,
	) {
		super(source, internalFormat, [dim]);
	}

	/** The width and height of this mip. */
	public get dim(): number | undefined {
		return this.dims[0];
	}

	/** The width and height of this mip. */
	public set dim(value: number | undefined) {
		this.dims = [value];
	}

	/**
	 * Updates this mip.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this texture face level.
	 */
	protected override updateInternal(texture: Texture<CubemapMip>, target: MipmapTarget, lod: number): void {
		if (this.dim) {
			if (this.dim > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.dim % alignment == 0) {
						texture.gl.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			texture.gl.gl.texImage2D(target, lod, this.internalFormat, this.dim, this.dim, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			texture.gl.gl.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
