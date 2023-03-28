import { TextureFilter, TextureWrapFunction, type TextureTarget, TEXTURE0, TEXTURE_MAG_FILTER, TEXTURE_MIN_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, TextureFaceTarget } from "../../WebGLConstant.js";
import TextureFace, { TextureFaceLevel } from "./TextureFace.js";

/** An array of data that can be randomly accessed in a shader program. */
export default class Texture<FaceType extends TextureFaceLevel> {
	/**
	 * Creates a texture.
	 * @param gl The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param faces The faces of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture across the T-axis.
	 */
	public constructor(
		gl: WebGL2RenderingContext,
		target: TextureTarget,
		faces: Map<TextureFaceTarget, TextureFace<FaceType>> = new Map(),
		magFilter: TextureFilter = TextureFilter.NEAREST,
		minFilter: TextureFilter = TextureFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		this.gl = gl;
		this.target = target;

		const texture: WebGLTexture | null = gl.createTexture();
		if (!texture) { throw new Error("Failed to create a texture."); }
		this.texture = texture;

		this.faces = faces;

		this.magFilter = magFilter;
		this.minFilter = minFilter;
		this.wrapSFunction = wrapSFunction;
		this.wrapTFunction = wrapTFunction;
	}

	/** The rendering context of this texture. */
	public gl: WebGL2RenderingContext;

	/** The binding point of this texture. */
	public target: TextureTarget;

	/** The WebGL texture represented by this object. */
	public texture: WebGLTexture;

	/** The faces of this texture. */
	public faces: Map<TextureFaceTarget, TextureFace<FaceType>>;

	/** The magnification filter for this texture. */
	public get magFilter(): TextureFilter {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_MAG_FILTER);
	}

	public set magFilter(value: TextureFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
		this.setAllNeedsUpdate();
	}

	/** The minification filter for this texture. */
	public get minFilter(): TextureFilter {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_MIN_FILTER);
	}

	public set minFilter(value: TextureFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the S direction. */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_WRAP_S);
	}

	public set wrapSFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the T direction. */
	public get wrapTFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_WRAP_T);
	}

	public set wrapTFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
		this.setAllNeedsUpdate();
	}

	/** Binds this texture to its target binding point. */
	public bind(): void {
		this.gl.bindTexture(this.target, this.texture);
	}

	/**
	 * Assigns this texture to a texture unit.
	 * @param textureUnit The texture unit.
	 */
	public assign(textureUnit: number): void {
		this.bind();
		this.gl.activeTexture(TEXTURE0 + textureUnit);
	}

	/** Generates a mipmap for this texture. */
	public generateMipmap(): void {
		this.bind();
		this.gl.generateMipmap(this.target);
	}

	/** Updates the texels of this texture. */
	public update(): void {
		this.bind();

		for (const [target, face] of this.faces) {
			face.update(this.gl, target);
		}

		for (const face of this.faces.values()) {
			if (!face.isTextureComplete && this.minFilter != TextureFilter.LINEAR && this.minFilter != TextureFilter.NEAREST) {
				this.generateMipmap();
				break;
			}
		}
	}

	/** Sets all of the faces of this texture as outdated. */
	public setAllNeedsUpdate(): void {
		for (const face of this.faces.values()) {
			face.setAllNeedsUpdate();
		}
	}
}
