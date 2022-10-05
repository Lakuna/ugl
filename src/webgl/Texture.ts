import { TextureTarget, TextureFormat, TextureDataType, TextureFilter, TextureWrapFunction, TEXTURE0, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, UNPACK_ALIGNMENT } from "./WebGLConstant.js";
import type TypedArray from "../types/TypedArray.js";

/** An array of data that can be randomly accessed in a shader program. */
export default abstract class Texture {
	/**
	 * Creates a texture.
	 * @param gl The rendering context of the texture.
	 * @param target The target binding point of the texture.
	 */
	public constructor(gl: WebGL2RenderingContext, target: TextureTarget) {
		this.gl = gl;
		this.target = target;

		const texture: WebGLTexture | null = gl.createTexture();
		if (!texture) { throw new Error("Failed to create a texture."); }
		this.texture = texture;
	}

	/** The rendering context of this texture. */
	public readonly gl: WebGL2RenderingContext;

	/** The target binding point of this texture. */
	public readonly target: TextureTarget;

	/** The WebGL API interface of this texture. */
	public readonly texture: WebGLTexture;

	/** Binds this texture to its target. */
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

	/** Updates the texels of this texture. */
	public abstract update(): void;

	/** Generates a mipmap for this texture. */
	public generateMipmap(): void {
		this.bind();
		this.gl.generateMipmap(this.target);
	}
}

/** Pixel sources for 2D textures. */
export type Texture2DPixelSource =
	TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** Parameters for 2D textures. */
export interface Texture2DParameters {
	/** The rendering context of the texture. */
	gl: WebGL2RenderingContext;

	/** The target of the texture. */
	target: TextureTarget;

	/** The level of detail of the texture. */
	lod: number;

	/** The format of the color components in the texture. */
	internalFormat: TextureFormat;

	/** The width of the texture. */
	width?: number;

	/** The height of the texture. */
	height?: number;

	/** The format of the texel data of the texture. */
	format?: TextureFormat;

	/** The data type of the components in this texture. */
	type?: TextureDataType;

	/** The pixel source for the texture. */
	pixels: Texture2DPixelSource;

	/** The magnification filter for the texture. */
	magFilter?: TextureFilter;

	/** The minification filter for the texture. */
	minFilter?: TextureFilter;

	/** The wrapping function of the texture in the S direction. */
	wrapSFunction?: TextureWrapFunction;

	/** The wrapping function of the texture in the T direction. */
	wrapTFunction?: TextureWrapFunction;
}

/** A two-dimensional texture. */
export class Texture2D extends Texture {
	/**
	 * Creates a two-dimensional texture.
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
		pixels,
		magFilter,
		minFilter,
		wrapSFunction,
		wrapTFunction
	}: Texture2DParameters) {
		super(gl, target);
		this.lod = lod;
		this.internalFormat = internalFormat;
		this.width = width;
		this.height = height;
		this.format = format;
		this.type = type;
		this.pixels = pixels;
		if (magFilter) { this.magFilter = magFilter; }
		if (minFilter) { this.minFilter = minFilter; }
		if (wrapSFunction) { this.wrapSFunction = wrapSFunction; }
		if (wrapTFunction) { this.wrapTFunction = wrapTFunction; }
		this.update();
	}

	/** The level of detail of this texture. */
	public lod: number;

	/** The format of the color components in this texture. */
	public internalFormat: TextureFormat;

	/** The width of this texture. */
	public width: number | undefined;

	/** The height of this texture. */
	public height: number | undefined;

	/** The format of the texel data. */
	private formatPrivate: TextureFormat | undefined;

	/** The format of the texel data. */
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
	}

	/** The data type of the components in this texture. */
	private typePrivate: TextureDataType | undefined;

	/** The data type of the components in this texture. */
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
	}

	/** The pixel source for this texture. */
	public pixels: Texture2DPixelSource;

	/** The magnification filter for this texture. */
	public get magFilter(): TextureFilter {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_MAG_FILTER);
	}

	public set magFilter(value: TextureFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
	}

	/** The minification filter for this texture. */
	public get minFilter(): TextureFilter {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_MIN_FILTER);
	}

	public set minFilter(value: TextureFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
	}

	/** The wrapping function of this texture in the S direction. */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_WRAP_S);
	}

	public set wrapSFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
	}

	/** The wrapping function of this texture in the T direction. */
	public get wrapTFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_WRAP_T);
	}

	public set wrapTFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
	}

	/** Updates the texels of this texture. */
	public update(): void {
		this.bind();

		if (this.width && this.height) {
			if (this.height > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						this.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.pixels as ArrayBufferView);
		} else {
			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.format, this.type, this.pixels as ImageData);
		}

		if (this.minFilter != TextureFilter.LINEAR && this.minFilter != TextureFilter.NEAREST) {
			this.generateMipmap();
		}
	}
}
