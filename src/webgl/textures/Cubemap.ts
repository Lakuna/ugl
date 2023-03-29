import { TextureFaceTarget, TextureTarget } from "../../index.js";
import { TextureFilter, TextureFormat, TextureWrapFunction, UNPACK_ALIGNMENT } from "../Constant.js";
import Texture, { TextureFace, TextureFaceLevel, type TextureSource } from "./Texture.js";

/** A cubemap texture. */
export default class Cubemap extends Texture<CubemapFaceLevel> {
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
		gl: WebGL2RenderingContext,
		nxFace: TextureFace<CubemapFaceLevel>,
		pxFace: TextureFace<CubemapFaceLevel>,
		nyFace: TextureFace<CubemapFaceLevel>,
		pyFace: TextureFace<CubemapFaceLevel>,
		nzFace: TextureFace<CubemapFaceLevel>,
		pzFace: TextureFace<CubemapFaceLevel>,
		magFilter: TextureFilter = TextureFilter.NEAREST,
		minFilter: TextureFilter = TextureFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			gl,
			TextureTarget.TEXTURE_CUBE_MAP,
			new Map([
				[TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, nxFace],
				[TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_X, pxFace],
				[TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, nyFace],
				[TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, pyFace],
				[TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, nzFace],
				[TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, pzFace]
			]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The negative X-axis face of this texture. */
	public get nxFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_X) as TextureFace<CubemapFaceLevel>;
	}

	public set nxFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, value);
	}

	/** The positive X-axis face of this texture. */
	public get pxFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_X) as TextureFace<CubemapFaceLevel>;
	}

	public set pxFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_X, value);
	}

	/** The negative Y-axis face of this texture. */
	public get nyFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y) as TextureFace<CubemapFaceLevel>;
	}

	public set nyFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, value);
	}

	/** The positive Y-axis face of this texture. */
	public get pyFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Y) as TextureFace<CubemapFaceLevel>;
	}

	public set pyFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, value);
	}

	/** The negative Z-axis face of this texture. */
	public get nzFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z) as TextureFace<CubemapFaceLevel>;
	}

	public set nzFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, value);
	}

	/** The positive Z-axis face of this texture. */
	public get pzFace(): TextureFace<CubemapFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Z) as TextureFace<CubemapFaceLevel>;
	}

	public set pzFace(value: TextureFace<CubemapFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, value);
	}
}

/** A level of a face of a cubemap. */
export class CubemapFaceLevel extends TextureFaceLevel {
	/**
	 * Creates a level of a texture face.
	 * @param source The pixel source of the texture.
	 * @param internalFormat The format of the color components in the texture.
	 * @param dim The width and height of the texture face level.
	 */
	public constructor(
		source: TextureSource,
		internalFormat: TextureFormat = TextureFormat.RGBA,
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
	protected override updateInternal(gl: WebGL2RenderingContext, target: TextureFaceTarget, lod: number): void {
		if (this.dim) {
			if (this.dim > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.dim % alignment == 0) {
						gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			gl.texImage2D(target, lod, this.internalFormat, this.dim, this.dim, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			gl.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
