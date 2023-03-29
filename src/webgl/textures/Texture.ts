import type { TypedArray } from "../../types/TypedArray.js";
import { TextureFilter, TextureWrapFunction, type TextureTarget, TEXTURE0, TEXTURE_MAG_FILTER, TEXTURE_MIN_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, TextureFaceTarget, TextureFormat, TextureDataType } from "../Constant.js";

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

/** Pixel data sources for textures. */
export type TextureSource =
	TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** A face of a texture. */
export class TextureFace<FaceType extends TextureFaceLevel> {
	/**
	 * Creates a texture face.
	 * @param levels A map of the levels of the texture face to their level of detail.
	 */
	public constructor(levels: Map<number, FaceType>) {
		this.levels = levels;
	}

	/** The source data of each level of this texture face. */
	public levels: Map<number, FaceType>;

	/** Whether this texture face is texture complete. */
	public get isTextureComplete(): boolean {
		const baseLevel: FaceType | undefined = this.levels.get(0);
		if (!baseLevel) {
			return false;
		}

		const dims: Array<number> = [];
		for (const dim of baseLevel.dims) {
			if (typeof dim == "undefined") {
				return false;
			}

			dims.push(dim);
		}

		let lod = 1;
		while (dims.some((dim: number) => dim > 1)) {
			const level: FaceType | undefined = this.levels.get(lod);
			if (!level) {
				return false;
			}

			for (let i = 0; i < dims.length; i++) {
				if (typeof level.dims[i] == "number" && Math.floor((dims[i] as number) / 2) == level.dims[i]) {
					dims[i] = level.dims[i] as number;
				} else {
					return false;
				}
			}

			lod++;
		}

		return true;
	}

	/**
	 * Updates this texture face.
	 * @param gl The rendering context of this texture face.
	 * @param target The target of this this texture face.
	 */
	public update(gl: WebGL2RenderingContext, target: TextureFaceTarget): void {
		for (const [lod, level] of this.levels) {
			level.update(gl, target, lod);
		}
	}

	/** Sets all of the levels of this face as outdated. */
	public setAllNeedsUpdate(): void {
		for (const level of this.levels.values()) {
			level.setNeedsUpdate();
		}
	}
}

/** A level of a face of a texture. */
export abstract class TextureFaceLevel {
	/**
	 * Creates a level of a texture face.
	 * @param source The pixel source of the texture.
	 * @param internalFormat The format of the color components in the texture.
	 * @param dims The dimensions of the texture face level.
	 */
	public constructor(
		source: TextureSource,
		internalFormat: TextureFormat = TextureFormat.RGBA,
		dims: Array<number | undefined>
	) {
		this.sourcePrivate = source;
		this.internalFormatPrivate = internalFormat;
		this.dimsPrivate = dims;

		this.needsUpdate = true;
	}

	/** The source data of this texture face level. */
	private sourcePrivate: TextureSource;

	/** The source data of this texture face level. */
	public get source(): TextureSource {
		return this.sourcePrivate;
	}

	public set source(value: TextureSource) {
		this.sourcePrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the color components in this texture. */
	private internalFormatPrivate: TextureFormat;

	/** The format of the color components in this texture. */
	public get internalFormat(): TextureFormat {
		return this.internalFormatPrivate;
	}

	public set internalFormat(value: TextureFormat) {
		this.internalFormatPrivate = value;
		this.needsUpdate = true;
	}

	/** The dimensions of this texture face level. */
	private dimsPrivate: ReadonlyArray<number | undefined>;

	/** The dimensions of this texture face level. */
	public get dims(): ReadonlyArray<number | undefined> {
		return this.dimsPrivate;
	}

	public set dims(value: ReadonlyArray<number | undefined>) {
		this.dimsPrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the texel data in this texture face level. */
	private formatPrivate: TextureFormat | undefined;

	/** The format of the texel data in this texture face level. */
	public get format(): TextureFormat {
		if (this.formatPrivate) { return this.formatPrivate; }

		switch (this.internalFormat) {
			case TextureFormat.RGB:
			case TextureFormat.RGB8:
			case TextureFormat.SRGB8:
			case TextureFormat.RGB565:
			case TextureFormat.R11F_G11F_B10F:
			case TextureFormat.RGB9_E5:
			case TextureFormat.RGB16F:
			case TextureFormat.RGB32F:
				return TextureFormat.RGB;
			case TextureFormat.RGBA:
			case TextureFormat.RGBA8:
			case TextureFormat.SRGB8_ALPHA8:
			case TextureFormat.RGB5_A1:
			case TextureFormat.RGB10_A2:
			case TextureFormat.RGBA4:
			case TextureFormat.RGBA16F:
			case TextureFormat.RGBA32F:
				return TextureFormat.RGBA;
			case TextureFormat.LUMINANCE_ALPHA:
				return TextureFormat.LUMINANCE_ALPHA;
			case TextureFormat.LUMINANCE:
				return TextureFormat.LUMINANCE;
			case TextureFormat.ALPHA:
				return TextureFormat.ALPHA;
			case TextureFormat.R8:
			case TextureFormat.R16F:
			case TextureFormat.R32F:
				return TextureFormat.RED;
			case TextureFormat.R8UI:
				return TextureFormat.RED_INTEGER;
			case TextureFormat.RG8:
			case TextureFormat.RG16F:
			case TextureFormat.RG32F:
				return TextureFormat.RG;
			case TextureFormat.RG8UI:
				return TextureFormat.RG_INTEGER;
			case TextureFormat.RGB8UI:
				return TextureFormat.RGB_INTEGER;
			case TextureFormat.RGBA8UI:
				return TextureFormat.RGBA_INTEGER;
			default:
				return this.internalFormat;
		}
	}

	public set format(value: TextureFormat | undefined) {
		this.formatPrivate = value;
		this.needsUpdate = true;
	}

	/** The data type of the components in this texture face level. */
	private typePrivate: TextureDataType | undefined;

	/** The data type of the components in this texture face level. */
	public get type(): TextureDataType {
		if (this.typePrivate) { return this.typePrivate; }

		switch (this.internalFormat) {
			case TextureFormat.RGB:
			case TextureFormat.RGBA:
			case TextureFormat.LUMINANCE_ALPHA:
			case TextureFormat.LUMINANCE:
			case TextureFormat.ALPHA:
			case TextureFormat.R8:
			case TextureFormat.R8UI:
			case TextureFormat.RG8:
			case TextureFormat.RG8UI:
			case TextureFormat.RGB8:
			case TextureFormat.SRGB8:
			case TextureFormat.RGB565:
			case TextureFormat.RGB8UI:
			case TextureFormat.RGBA8:
			case TextureFormat.SRGB8_ALPHA8:
			case TextureFormat.RGB5_A1:
			case TextureFormat.RGBA4:
			case TextureFormat.RGBA8UI:
				return TextureDataType.UNSIGNED_BYTE;
			case TextureFormat.R16F:
			case TextureFormat.R32F:
			case TextureFormat.RG16F:
			case TextureFormat.RG32F:
			case TextureFormat.R11F_G11F_B10F:
			case TextureFormat.RGB9_E5:
			case TextureFormat.RGB16F:
			case TextureFormat.RGB32F:
			case TextureFormat.RGBA16F:
			case TextureFormat.RGBA32F:
				return TextureDataType.FLOAT;
			case TextureFormat.RGB10_A2:
				return TextureDataType.UNSIGNED_INT_2_10_10_10_REV;
			default:
				throw new Error("Unset data type without default for selected format.");
		}
	}

	public set type(value: TextureDataType | undefined) {
		this.typePrivate = value;
		this.needsUpdate = true;
	}

	/** Whether this texture face level requires an update. */
	private needsUpdate: boolean;

	/**
	 * Updates this texture face level.
	 * @param gl The rendering context of this texture face level.
	 * @param target The target of this texture face level.
	 * @param lod The level of detail of this texture face level.
	 */
	public update(gl: WebGL2RenderingContext, target: TextureFaceTarget, lod: number): void {
		if (!this.needsUpdate) {
			return;
		}

		this.updateInternal(gl, target, lod);

		this.needsUpdate = false;
	}

	/**
	 * Updates this texture face level.
	 * @param gl The rendering context of this texture face level.
	 * @param target The target of this texture face level.
	 * @param lod The level of detail of this texture face level.
	 */
	protected abstract updateInternal(gl: WebGL2RenderingContext, target: TextureFaceTarget, lod: number): void;

	/** Sets this texture face level as outdated. */
	public setNeedsUpdate(): void {
		this.needsUpdate = true;
	}
}
