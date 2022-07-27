import { TextureTarget, TextureFormat, TextureDataType, TextureFilter, TextureWrapFunction, TEXTURE0, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, UNPACK_ALIGNMENT } from "./WebGLConstant.js";

/** An array of data that can be randomly accessed in a shader program. */
abstract class Texture {
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
	public target: TextureTarget;

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

	/**
	 * Updates the texture parameters of this texture.
	 * @param textureUnit - The texture unit of this texture in the current shader program.
	 */
	public abstract update(textureUnit: number): void;

	/** Generates a mipmap for this texture. */
	public generateMipmap(): void {
		this.bind();
		this.gl.generateMipmap(this.target);
	}
}

export default Texture;

/** Pixel sources for 2D textures. */
export type Texture2DPixelSource =
	ArrayBufferView
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** A two-dimensional texture. */
export class Texture2D extends Texture {
	/**
	 * Creates a two-dimensional texture.
	 * @param gl The rendering context of the texture.
	 * @param pixels The pixel source for the texture.
	 * @param size The width and height of the pixel source.
	 * @param internalFormat The internal format of the texture.
	 * @param lod The level of detail of the texture.
	 */
	public constructor(gl: WebGL2RenderingContext, pixels: Texture2DPixelSource, size?: [number, number], internalFormat: TextureFormat = TextureFormat.RGBA, lod = 0) {
		super(gl, TextureTarget.TEXTURE_2D);
		this.pixelsPrivate = pixels;
		this.sizePrivate = size;
		this.internalFormatPrivate = internalFormat;
		this.lodPrivate = lod;
		this.update();
	}

	/** The level of detail of this texture. */
	private lodPrivate: number;

	/** The level of detail of this texture. */
	public get lod(): number {
		return this.lodPrivate;
	}

	public set lod(value: number) {
		this.lodPrivate = value;
		this.update();
	}

	/** The color components in the texture. */
	private internalFormatPrivate: TextureFormat;

	/** The color components in the texture. */
	public get internalFormat(): TextureFormat {
		return this.internalFormatPrivate;
	}

	public set internalFormat(value: TextureFormat) {
		this.internalFormatPrivate = value;
		this.update();
	}

	/** The data type of the components in the texture. */
	private typePrivate?: TextureDataType;

	/** The data type of the components in the texture. */
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

	public set type(value: TextureDataType) {
		this.typePrivate = value;
		this.update();
	}

	/** The format of the texel data. */
	private formatPrivate?: TextureFormat;

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

	public set format(value: TextureFormat) {
		this.formatPrivate = value;
		this.update();
	}

	/** The width and height of this texture. */
	private sizePrivate: [number, number] | undefined;

	/** The width and height of this texture. */
	public get size(): [number, number] | undefined {
		return this.sizePrivate;
	}

	/** The pixel source for this texture. */
	private pixelsPrivate: Texture2DPixelSource;

	/** The pixel source for this texture. */
	public get pixels(): Texture2DPixelSource {
		return this.pixelsPrivate;
	}

	/**
	 * Sets the pixels source for this texture.
	 * @param pixels The new pixel source for this texture.
	 * @param size The new width and height for this texture.
	 */
	public setPixels(pixels: Texture2DPixelSource, size?: [number, number]): void {
		this.pixelsPrivate = pixels;
		this.sizePrivate = size;
		this.update();
	}

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

	/** The wrapping function for the S coordinate. */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.getTexParameter(this.target, TEXTURE_WRAP_S);
	}

	public set wrapSFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
	}

	/** The wrapping function for the T coordinate. */
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

		if (this.size) {
			if (this.size[1] > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.size[0] % alignment == 0) {
						this.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.size[0], this.size[1], 0, this.format, this.type, this.pixels as ArrayBufferView);
		} else {
			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.format, this.type, this.pixels as ImageData);
		}

		if (this.minFilter != TextureFilter.LINEAR && this.minFilter != TextureFilter.NEAREST) {
			this.generateMipmap();
		}
	}
}
