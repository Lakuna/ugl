import type { TypedArray } from "../../types/TypedArray.js";
import type Context from "../Context.js";

/** Binding points for textures. */
export const enum TextureTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0DE1,

	/** A cube-mapped texture. */
	TEXTURE_CUBE_MAP = 0x8513,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806F,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8C1A
}

/** Binding points for texture faces. */
export const enum MipmapTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0DE1,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806F,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8C1A,

	/** The positive X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,

	/** The negative X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,

	/** The positive Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,

	/** The negative Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,

	/** The positive Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,

	/** The negative Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A
}

/**
 * Internal formats for the color components in a texture.
 * @see [OpenGL ES 3 reference](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage3D.xhtml)
 */
export const enum TextureInternalFormat {
	/** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. Color renderable and texture filterable. */
	RGB = 0x1907,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. Color renderable and texture filterable. */
	RGBA = 0x1908,

	/** `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
	LUMINANCE_ALPHA = 0x190A,

	/** `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
	LUMINANCE = 0x1909,

	/** `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
	ALPHA = 0x1906,

	/** `format` must be `RED`. `type` must be `UNSIGNED_BYTE`. Takes an 8-bit number for the red channel, normalized to `[0,1]`. Color renderable and texture filterable. */
	R8 = 0x8229,

	/** `format` must be `RED`. `type` must be `BYTE`. Takes a signed 8-bit number for the red channel, normalized to `[-1,1]`. Texture filterable. */
	R8_SNORM = 0x8F94,

	/** `format` must be `RED`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes a 16-bit floating-point number for the red channel. Texture filterable. */
	R16F = 0x822D,

	/** `format` must be `RED`. `type` must be `FLOAT`. Takes a 32-bit floating-point number for the red channel. */
	R32F = 0x822E,

	/** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes an 8-bit unsigned integer for the red channel. Color renderable. */
	R8UI = 0x8232,

	/** `format` must be `RED_INTEGER`. `type` must be `BYTE`. Takes an 8-bit integer for the red channel. Color renderable. */
	R8I = 0x8231,

	/** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes a 16-bit unsigned integer for the red channel. Color renderable. */
	R16UI = 0x8234,

	/** `format` must be `RED_INTEGER`. `type` must be `SHORT`. Takes a 16-bit integer for the red channel. Color renderable. */
	R16I = 0x8233,

	/** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_INT`. Takes a 32-bit unsigned integer for the red channel. Color renderable. */
	R32UI = 0x8236,

	/** `format` must be `RED_INTEGER`. `type` must be `INT`. Takes a 32-bit integer for the red channel. Color renderable. */
	R32I = 0x8235,

	/** `format` must be `RG`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red and green channels, normalized to `[0,1]`. Color renderable and texture filterable. */
	RG8 = 0x822B,

	/** `format` must be `RG`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red and green channels, normalized to `[-1,1]`. Texture filterable. */
	RG8_SNORM = 0x8F95,

	/** `format` must be `RG`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red and green channels. Texture filterable. */
	RG16F = 0x822F,

	/** `format` must be `RG`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red and green channels. */
	RG32F = 0x8230,

	/** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red and green channels. Color renderable. */
	RG8UI = 0x8238,

	/** `format` must be `RG_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red and green channels. Color renderable. */
	RG8I = 0x8237,

	/** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red and green channels. Color renderable. */
	RG16UI = 0x823A,

	/** `format` must be `RG_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red and green channels. Color renderable. */
	RG16I = 0x8239,

	/** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red and green channels. Color renderable. */
	RG32UI = 0x823C,

	/** `format` must be `RG_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red and green channels. Color renderable. */
	RG32I = 0x823B,

	/** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGB8 = 0x8051,

	/** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Texture filterable. */
	SRGB8 = 0x8C41,

	/** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. Takes 5-bit numbers for the red and blue channels and a 6-bit number for the green channel, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGB565 = 0x8D62,

	/** `format` must be `RGB`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red, green, and blue channels, normalized to `[-1,1]`. Texture filterable. */
	RGB8_SNORM = 0x8F96,

	/** `format` must be `RGB`. `type` must be `UNSIGNED_INT_10F_11F_11F_REV`, `HALF_FLOAT`, or `FLOAT`. Takes 11-bit floating-point numbers for the red and green channels, and a 10-bit floating-point number for the blue channel. Texture filterable. */
	R11F_G11F_B10F = 0x8C3A,

	/** `format` must be `RGB`. `type` must be `UNSIGNED_INT_5_9_9_9_REV`, `HALF_FLOAT`, or `FLOAT`. Takes 9-bit numbers for the red, green, and blue channels, normalized to `[0,1]`, with 5 shared bits. Texture filterable. */
	RGB9_E5 = 0x8C3D,

	/** `format` must be `RGB`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red, green, and blue channels. Texture filterable. */
	RGB16F = 0x881B,

	/** `format` must be `RGB`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red, green, and blue channels. */
	RGB32F = 0x8815,

	/** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red, green, and blue channels. */
	RGB8UI = 0x8D7D,

	/** `format` must be `RGB_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red, green, and blue channels. */
	RGB8I = 0x8D8F,

	/** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red, green, and blue channels. */
	RGB16UI = 0x8D77,

	/** `format` must be `RGB_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red, green, and blue channels. */
	RGB16I = 0x8D89,

	/** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red, green, and blue channels. */
	RGB32UI = 0x8D71,

	/** `format` must be `RGB_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red, green, and blue channels. */
	RGB32I = 0x8D83,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGBA8 = 0x8058,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
	SRGB8_ALPHA8 = 0x8C43,

	/** `format` must be `RGBA`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[-1,1]`. Texture filterable. */
	RGBA8_SNORM = 0x8F97,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_5_5_5_1`, or `UNSIGNED_INT_2_10_10_10_REV`. Takes 5-bit numbers for the red, green, and blue channels and a 1-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGB5_A1 = 0x8057,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_4_4_4_4`. Takes 4-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGBA4 = 0x8056,

	/** `format` must be `RGBA`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. Takes 10-bit numbers for the red, green, and blue channels and a 2-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. */
	RGB10_A2 = 0x8059,

	/** `format` must be `RGBA`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red, green, blue, and alpha channels. Texture filterable. */
	RGBA16F = 0x881A,

	/** `format` must be `RGBA`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red, green, blue, and alpha channels. */
	RGBA32F = 0x8814,

	/** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA8UI = 0x8D7C,

	/** `format` must be `RGBA_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA8I = 0x8D8E,

	/** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. Takes unsigned 10-bit integers for the red, green, and blue channels and a 2-bit unsigned integer for the alpha channel. Color renderable. */
	RGB10_A2UI = 0x906F,

	/** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA16UI = 0x8D76,

	/** `format` must be `RGBA_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA16I = 0x8D88,

	/** `format` must be `RGBA_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA32I = 0x8D82,

	/** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
	RGBA32UI = 0x8D70
}

/** Formats for the color components in a texture. */
export const enum TextureBaseFormat {
	/** Indicates that a texture uses only the red, green, and blue channels. */
	RGB = 0x1907,

	/** Indicates that a texture uses the red, green, blue, and alpha channels. */
	RGBA = 0x1908,

	/** Indicates that the color components are luminance components. */
	LUMINANCE_ALPHA = 0x190A,

	/** Indicates that the color components are luminance components and the alpha component is `1`. */
	LUMINANCE = 0x1909,

	/** Indicates that a texture uses only the alpha channel. */
	ALPHA = 0x1906,

	/** Indicates that a texture uses only the red channel. */
	RED = 0x1903,

	/** Indicates that a texture uses only the red channel and stores integers. */
	RED_INTEGER = 0x8D94,

	/** Indicates that a texture uses only the red and green channels. */
	RG = 0x8227,

	/** Indicates that a texture uses only the red and green channels and stores integers. */
	RG_INTEGER = 0x8228,

	/** Indicates that a texture uses only the red, green, and blue channels and stores integers. */
	RGB_INTEGER = 0x8D98,

	/** Indicates that a texture uses the red, green, blue, and alpha channels and stores integers. */
	RGBA_INTEGER = 0x8D99
}

/** Data types for texel data. */
export const enum TextureDataType {
	/** Indicates that data must come from a `Uint8Array` or a `Uint8ClampedArray`. */
	UNSIGNED_BYTE = 0x1401,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_5_6_5 = 0x8363,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_4_4_4_4 = 0x8033,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_5_5_5_1 = 0x8034,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT = 0x1403,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT = 0x1405,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_24_8_WEBGL = 0x84FA,

	/** Indicates that data must come from a `Float32Array`. */
	FLOAT = 0x1406,

	/** Indicates that data must come from a `Uint16Array`. */
	HALF_FLOAT_OES = 0x8D61,

	/** Indicates that data must come from an `Int8Array`. */
	BYTE = 0x1400,

	/** Indicates that data must come from an `Int16Array`. */
	SHORT = 0x1402,

	/** Indicates that data must come from an `Int32Array`. */
	INT = 0x1404,

	/** Indicates that data must come from a `Uint16Array`. */
	HALF_FLOAT = 0x140B,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_2_10_10_10_REV = 0x8368,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_5_9_9_9_REV = 0x8C3E,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_24_8 = 0x84FA,

	/** Indicates that data must be null. */
	FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD
}

/** Magnification filters for textures. */
export const enum TextureMagFilter {
	/** Chooses one pixel from the largest mip. */
	NEAREST = 0x2600,

	/** Chooses four pixels from the largest mip and blends them. */
	LINEAR = 0x2601
}

/** Minification filters for textures. */
export const enum TextureMinFilter {
	/** Chooses one pixel from the largest mip. */
	NEAREST = 0x2600,

	/** Chooses four pixels from the largest mip and blends them. */
	LINEAR = 0x2601,

	/** Chooses the best mip, then picks one pixel from that mip. */
	NEAREST_MIPMAP_NEAREST = 0x2700,

	/** Chooses the best mip, then blends four pixels from that mip. */
	LINEAR_MIPMAP_NEAREST = 0x2701,

	/** Chooses the best two mips, then chooses one pixel from each and blends them. */
	NEAREST_MIPMAP_LINEAR = 0x2702,

	/** Chooses the best two mips, then chooses four pixels from each and blends them. */
	LINEAR_MIPMAP_LINEAR = 0x2703
}

/** Wrapping functions for textures. */
export const enum TextureWrapFunction {
	/** The texture repeats after it ends. */
	REPEAT = 0x2901,

	/** The last pixel of the texture repeats after it ends. */
	CLAMP_TO_EDGE = 0x812F,

	/** The texture repeats after it ends, mirroring on each repetition. */
	MIRRORED_REPEAT = 0x8370
}

/** The first texture unit. */
export const TEXTURE0 = 0x84C0;

/** The magnification filter for a texture. */
export const TEXTURE_MAG_FILTER = 0x2800;

/** The minification filter for a texture. */
export const TEXTURE_MIN_FILTER = 0x2801;

/** The wrapping mode for a texture on the S axis. */
export const TEXTURE_WRAP_S = 0x2802;

/** The wrapping mode for a texture on the T axis. */
export const TEXTURE_WRAP_T = 0x2803;

/** The number of texels to unpack at a time in each row of a texture. */
export const UNPACK_ALIGNMENT = 0x0CF5;

/**
 * An array of data that can be randomly accessed in a shader program.
 * @see [Textures](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture<MipType extends Mip> {
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
		gl: Context,
		target: TextureTarget,
		faces: Map<MipmapTarget, Mipmap<MipType>> = new Map(),
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		this.gl = gl;
		this.target = target;

		const texture: WebGLTexture | null = gl.gl.createTexture();
		if (!texture) { throw new Error("Failed to create a texture."); }
		this.texture = texture;

		this.faces = faces;

		this.magFilter = magFilter;
		this.minFilter = minFilter;
		this.wrapSFunction = wrapSFunction;
		this.wrapTFunction = wrapTFunction;
	}

	/** The rendering context of this texture. */
	public gl: Context;

	/** The binding point of this texture. */
	public target: TextureTarget;

	/** The WebGL texture represented by this object. */
	public texture: WebGLTexture;

	/** The faces of this texture. */
	public faces: Map<MipmapTarget, Mipmap<MipType>>;

	/** The magnification filter for this texture. */
	public get magFilter(): TextureMagFilter {
		this.bind();
		return this.gl.gl.getTexParameter(this.target, TEXTURE_MAG_FILTER);
	}

	public set magFilter(value: TextureMagFilter) {
		this.bind();
		this.gl.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
		this.setAllNeedsUpdate();
	}

	/** The minification filter for this texture. */
	public get minFilter(): TextureMinFilter {
		this.bind();
		return this.gl.gl.getTexParameter(this.target, TEXTURE_MIN_FILTER);
	}

	public set minFilter(value: TextureMinFilter) {
		this.bind();
		this.gl.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the S direction. */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.gl.getTexParameter(this.target, TEXTURE_WRAP_S);
	}

	public set wrapSFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the T direction. */
	public get wrapTFunction(): TextureWrapFunction {
		this.bind();
		return this.gl.gl.getTexParameter(this.target, TEXTURE_WRAP_T);
	}

	public set wrapTFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
		this.setAllNeedsUpdate();
	}

	/** Binds this texture to its target binding point. */
	public bind(): void {
		this.gl.gl.bindTexture(this.target, this.texture);
	}

	/**
	 * Assigns this texture to a texture unit.
	 * @param textureUnit The texture unit.
	 */
	public assign(textureUnit: number): void {
		this.bind();
		this.gl.gl.activeTexture(TEXTURE0 + textureUnit);
	}

	/** Generates a mipmap for this texture. */
	public generateMipmap(): void {
		this.bind();
		this.gl.gl.generateMipmap(this.target);
	}

	/** Updates the texels of this texture. */
	public update(): void {
		this.bind();

		for (const [target, face] of this.faces) {
			face.update(this.gl, target);
		}

		for (const face of this.faces.values()) {
			if (!face.isTextureComplete && this.minFilter != TextureMinFilter.LINEAR && this.minFilter != TextureMinFilter.NEAREST) {
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

/** Pixel data sources for mips. */
export type MipSource =
	TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** A mipmap. */
export class Mipmap<MipType extends Mip> {
	/**
	 * Creates a mipmap.
	 * @param mips A map of the mips to their level of detail.
	 */
	public constructor(mips: Map<number, MipType>) {
		this.mips = mips;
	}

	/** A map of the mips to their level of detail. */
	public mips: Map<number, MipType>;

	/** Whether this mipmap is texture complete. */
	public get isTextureComplete(): boolean {
		const baseMip: MipType | undefined = this.mips.get(0);
		if (!baseMip) {
			return false;
		}

		const dims: Array<number> = [];
		for (const dim of baseMip.dims) {
			if (typeof dim == "undefined") {
				return false;
			}

			dims.push(dim);
		}

		let lod = 1;
		while (dims.some((dim: number) => dim > 1)) {
			const mip: MipType | undefined = this.mips.get(lod);
			if (!mip) {
				return false;
			}

			for (let i = 0; i < dims.length; i++) {
				if (typeof mip.dims[i] == "number" && Math.floor((dims[i] as number) / 2) == mip.dims[i]) {
					dims[i] = mip.dims[i] as number;
				} else {
					return false;
				}
			}

			lod++;
		}

		return true;
	}

	/**
	 * Updates this mipmap.
	 * @param gl The rendering context of this mipmap.
	 * @param target The target of this this mipmap.
	 */
	public update(gl: Context, target: MipmapTarget): void {
		for (const [lod, level] of this.mips) {
			level.update(gl, target, lod);
		}
	}

	/** Sets all of the mips as outdated. */
	public setAllNeedsUpdate(): void {
		for (const level of this.mips.values()) {
			level.setNeedsUpdate();
		}
	}
}

/** A mip. */
export abstract class Mip {
	/**
	 * Creates a mip.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param dims The dimensions of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		dims: Array<number | undefined> = []
	) {
		this.sourcePrivate = source;
		this.internalFormatPrivate = internalFormat;
		this.dimsPrivate = dims;

		this.needsUpdate = true;
	}

	/** The source data of this mip. */
	private sourcePrivate: MipSource;

	/** The source data of this mip. */
	public get source(): MipSource {
		return this.sourcePrivate;
	}

	public set source(value: MipSource) {
		this.sourcePrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the color components in this mip. */
	private internalFormatPrivate: TextureInternalFormat;

	/** The format of the color components in this mip. */
	public get internalFormat(): TextureInternalFormat {
		return this.internalFormatPrivate;
	}

	public set internalFormat(value: TextureInternalFormat) {
		this.internalFormatPrivate = value;
		this.needsUpdate = true;
	}

	/** The dimensions of this mip. */
	private dimsPrivate: ReadonlyArray<number | undefined>;

	/** The dimensions of this mip. */
	public get dims(): ReadonlyArray<number | undefined> {
		return this.dimsPrivate;
	}

	public set dims(value: ReadonlyArray<number | undefined>) {
		this.dimsPrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the texel data in this mip. */
	private formatPrivate: TextureBaseFormat | undefined;

	/** The format of the texel data in this mip. */
	public get format(): TextureBaseFormat {
		if (this.formatPrivate) { return this.formatPrivate; }

		switch (this.internalFormat) {
			case TextureInternalFormat.RGB:
			case TextureInternalFormat.RGB8:
			case TextureInternalFormat.SRGB8:
			case TextureInternalFormat.RGB565:
			case TextureInternalFormat.R11F_G11F_B10F:
			case TextureInternalFormat.RGB9_E5:
			case TextureInternalFormat.RGB16F:
			case TextureInternalFormat.RGB32F:
				return TextureBaseFormat.RGB;
			case TextureInternalFormat.RGBA:
			case TextureInternalFormat.RGBA8:
			case TextureInternalFormat.SRGB8_ALPHA8:
			case TextureInternalFormat.RGB5_A1:
			case TextureInternalFormat.RGB10_A2:
			case TextureInternalFormat.RGBA4:
			case TextureInternalFormat.RGBA16F:
			case TextureInternalFormat.RGBA32F:
				return TextureBaseFormat.RGBA;
			case TextureInternalFormat.LUMINANCE_ALPHA:
				return TextureBaseFormat.LUMINANCE_ALPHA;
			case TextureInternalFormat.LUMINANCE:
				return TextureBaseFormat.LUMINANCE;
			case TextureInternalFormat.ALPHA:
				return TextureBaseFormat.ALPHA;
			case TextureInternalFormat.R8:
			case TextureInternalFormat.R16F:
			case TextureInternalFormat.R32F:
				return TextureBaseFormat.RED;
			case TextureInternalFormat.R8UI:
				return TextureBaseFormat.RED_INTEGER;
			case TextureInternalFormat.RG8:
			case TextureInternalFormat.RG16F:
			case TextureInternalFormat.RG32F:
				return TextureBaseFormat.RG;
			case TextureInternalFormat.RG8UI:
				return TextureBaseFormat.RG_INTEGER;
			case TextureInternalFormat.RGB8UI:
				return TextureBaseFormat.RGB_INTEGER;
			case TextureInternalFormat.RGBA8UI:
				return TextureBaseFormat.RGBA_INTEGER;
			default:
				throw new Error("Unknown default format pair.");
		}
	}

	public set format(value: TextureBaseFormat | undefined) {
		this.formatPrivate = value;
		this.needsUpdate = true;
	}

	/** The data type of the components in this mip. */
	private typePrivate: TextureDataType | undefined;

	/** The data type of the components in this mip. */
	public get type(): TextureDataType {
		if (this.typePrivate) { return this.typePrivate; }

		switch (this.internalFormat) {
			case TextureInternalFormat.RGB:
			case TextureInternalFormat.RGBA:
			case TextureInternalFormat.LUMINANCE_ALPHA:
			case TextureInternalFormat.LUMINANCE:
			case TextureInternalFormat.ALPHA:
			case TextureInternalFormat.R8:
			case TextureInternalFormat.R8UI:
			case TextureInternalFormat.RG8:
			case TextureInternalFormat.RG8UI:
			case TextureInternalFormat.RGB8:
			case TextureInternalFormat.SRGB8:
			case TextureInternalFormat.RGB565:
			case TextureInternalFormat.RGB8UI:
			case TextureInternalFormat.RGBA8:
			case TextureInternalFormat.SRGB8_ALPHA8:
			case TextureInternalFormat.RGB5_A1:
			case TextureInternalFormat.RGBA4:
			case TextureInternalFormat.RGBA8UI:
				return TextureDataType.UNSIGNED_BYTE;
			case TextureInternalFormat.R16F:
			case TextureInternalFormat.R32F:
			case TextureInternalFormat.RG16F:
			case TextureInternalFormat.RG32F:
			case TextureInternalFormat.R11F_G11F_B10F:
			case TextureInternalFormat.RGB9_E5:
			case TextureInternalFormat.RGB16F:
			case TextureInternalFormat.RGB32F:
			case TextureInternalFormat.RGBA16F:
			case TextureInternalFormat.RGBA32F:
				return TextureDataType.FLOAT;
			case TextureInternalFormat.RGB10_A2:
				return TextureDataType.UNSIGNED_INT_2_10_10_10_REV;
			default:
				throw new Error("Unknown default data type-format pair.");
		}
	}

	public set type(value: TextureDataType | undefined) {
		this.typePrivate = value;
		this.needsUpdate = true;
	}

	/** Whether this mip requires an update. */
	private needsUpdate: boolean;

	/**
	 * Updates this mip.
	 * @param gl The rendering context of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	public update(gl: Context, target: MipmapTarget, lod: number): void {
		if (!this.needsUpdate) {
			return;
		}

		this.updateInternal(gl, target, lod);

		this.needsUpdate = false;
	}

	/**
	 * Updates this mip.
	 * @param gl The rendering context of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected abstract updateInternal(gl: Context, target: MipmapTarget, lod: number): void;

	/** Sets this mip as outdated. */
	public setNeedsUpdate(): void {
		this.needsUpdate = true;
	}
}
