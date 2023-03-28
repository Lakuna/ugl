import { TextureTarget, TextureFormat } from "../WebGLConstant.js";
import type { TextureParameters, TextureSource } from "./Texture.js";
import Texture from "./Texture.js";

/** Parameters for single-source textures. */
export interface SingleSourceTextureParameters extends TextureParameters {
	/** The pixel source for the texture. */
	source: TextureSource;
}

/** A texture with only one source. */
export default abstract class SingleSourceTexture extends Texture {
	/**
	 * Creates a texture.
	 * @param parameters The parameters of the texture.
	 */
	public constructor({
		gl,
		target = TextureTarget.TEXTURE_2D,
		lod = 0,
		internalFormat = TextureFormat.RGBA,
		width,
		height,
		format,
		type,
		source,
		magFilter,
		minFilter,
		wrapSFunction,
		wrapTFunction
	}: SingleSourceTextureParameters) {
		super({
			gl,
			target,
			lod,
			internalFormat,
			width,
			height,
			format,
			type,
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		});

		this.sourcePrivate = source;
	}

	/** The pixel source for this texture. */
	private sourcePrivate: TextureSource;

	/** The pixel source for this texture. */
	public get source(): TextureSource {
		return this.sourcePrivate;
	}

	public set source(value: TextureSource) {
		this.sourcePrivate = value;
		this.needsUpdate = true;
	}
}
