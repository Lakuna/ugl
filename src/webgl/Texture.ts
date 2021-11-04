import { Color } from "../utility/Color";
import { Vector } from "../math/Vector";
import { WebGLConstant } from "../webgl/WebGLConstant";

/** Types of data that can be stored in a texture. */
export type TextureData = ArrayBuffer | ArrayBufferView | BufferSource | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;

/** Bind targets for textures. */
export enum TextureTarget {
	TEXTURE_2D = WebGLConstant.TEXTURE_2D,
	TEXTURE_CUBE_MAP = WebGLConstant.TEXTURE_CUBE_MAP,
	TEXTURE_3D = WebGLConstant.TEXTURE_3D,
	TEXTURE_2D_ARRAY = WebGLConstant.TEXTURE_2D_ARRAY,
	TEXTURE_CUBE_MAP_POSITIVE_X = WebGLConstant.TEXTURE_CUBE_MAP_POSITIVE_X,
	TEXTURE_CUBE_MAP_NEGATIVE_X = WebGLConstant.TEXTURE_CUBE_MAP_NEGATIVE_X,
	TEXTURE_CUBE_MAP_POSITIVE_Y = WebGLConstant.TEXTURE_CUBE_MAP_POSITIVE_Y,
	TEXTURE_CUBE_MAP_NEGATIVE_Y = WebGLConstant.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	TEXTURE_CUBE_MAP_POSITIVE_Z = WebGLConstant.TEXTURE_CUBE_MAP_POSITIVE_Z,
	TEXTURE_CUBE_MAP_NEGATIVE_Z = WebGLConstant.TEXTURE_CUBE_MAP_NEGATIVE_Z,
}

/** Filters for textures. */
export enum TextureFilter {
	LINEAR = WebGLConstant.LINEAR,
	NEAREST = WebGLConstant.NEAREST,
	NEAREST_MIPMAP_NEAREST = WebGLConstant.NEAREST_MIPMAP_NEAREST,
	LINEAR_MIPMAP_NEAREST = WebGLConstant.LINEAR_MIPMAP_NEAREST,
	NEAREST_MIPMAP_LINEAR = WebGLConstant.NEAREST_MIPMAP_LINEAR,
	LINEAR_MIPMAP_LINEAR = WebGLConstant.LINEAR_MIPMAP_LINEAR
}

/** Wrap modes for textures. */
export enum TextureWrapMode {
	REPEAT = WebGLConstant.REPEAT,
	CLAMP_TO_EDGE = WebGLConstant.CLAMP_TO_EDGE,
	MIRRORED_REPEAT = WebGLConstant.MIRRORED_REPEAT
}

/** Data formats for textures. */
export enum TextureFormat {
	RGBA = WebGLConstant.RGBA,
	RGB = WebGLConstant.RGB,
	LUMINANCE_ALPHA = WebGLConstant.LUMINANCE_ALPHA,
	LUMINANCE = WebGLConstant.LUMINANCE,
	ALPHA = WebGLConstant.ALPHA,
	R8 = WebGLConstant.R8,
	R8_SNORM = WebGLConstant.R8_SNORM,
	RG8 = WebGLConstant.RG8,
	RG8_SNORM = WebGLConstant.RG8_SNORM,
	RGB8 = WebGLConstant.RGB8,
	RGB8_SNORM = WebGLConstant.RGB8_SNORM,
	RGB565 = WebGLConstant.RGB565,
	RGBA4 = WebGLConstant.RGBA4,
	RGB5_A1 = WebGLConstant.RGB5_A1,
	RGBA8 = WebGLConstant.RGBA8,
	RGBA8_SNORM = WebGLConstant.RGBA8_SNORM,
	RGB10_A2 = WebGLConstant.RGB10_A2,
	RGB10_A2UI = WebGLConstant.RGB10_A2UI,
	SRGB8 = WebGLConstant.SRGB8,
	SRGB8_ALPHA8 = WebGLConstant.SRGB8_ALPHA8,
	R16F = WebGLConstant.R16F,
	RG16F = WebGLConstant.RG16F,
	RGB16F = WebGLConstant.RGB16F,
	RGBA16F = WebGLConstant.RGBA16F,
	R32F = WebGLConstant.R32F,
	RG32F = WebGLConstant.RG32F,
	RGB32F = WebGLConstant.RGB32F,
	RGBA32F = WebGLConstant.RGBA32F,
	R11F_G11F_B10F = WebGLConstant.R11F_G11F_B10F,
	RGB9_E5 = WebGLConstant.RGB9_E5,
	R8I = WebGLConstant.R8I,
	R8UI = WebGLConstant.R8UI,
	R16I = WebGLConstant.R16I,
	R16UI = WebGLConstant.R16UI,
	R32I = WebGLConstant.R32I,
	R32UI = WebGLConstant.R32UI,
	RG8I = WebGLConstant.RG8I,
	RG8UI = WebGLConstant.RG8UI,
	RG16I = WebGLConstant.RG16I,
	RG16UI = WebGLConstant.RG16UI,
	RG32I = WebGLConstant.RG32I,
	RG32UI = WebGLConstant.RG32UI,
	RGB8I = WebGLConstant.RGB8I,
	RGB8UI = WebGLConstant.RGB8UI,
	RGB16I = WebGLConstant.RGB16I,
	RGB16UI = WebGLConstant.RGB16UI,
	RGB32I = WebGLConstant.RGB32I,
	RGB32UI = WebGLConstant.RGB32UI,
	RGBA8I = WebGLConstant.RGBA8I,
	RGBA8UI = WebGLConstant.RGBA8UI,
	RGBA16I = WebGLConstant.RGBA16I,
	RGBA16UI = WebGLConstant.RGBA16UI,
	RGBA32I = WebGLConstant.RGBA32I,
	RGBA32UI = WebGLConstant.RGBA32UI,
	DEPTH_COMPONENT = WebGLConstant.DEPTH_COMPONENT,
	DEPTH_STENCIL = WebGLConstant.DEPTH_STENCIL,
	SRGB_EXT = WebGLConstant.SRGB_EXT,
	SRGB_ALPHA_EXT = WebGLConstant.SRGB_ALPHA_EXT,
	RED = WebGLConstant.RED,
	RG = WebGLConstant.RG,
	RED_INTEGER = WebGLConstant.RED_INTEGER,
	RG_INTEGER = WebGLConstant.RG_INTEGER,
	RGB_INTEGER = WebGLConstant.RGB_INTEGER,
	RGBA_INTEGER = WebGLConstant.RGBA_INTEGER,
	COMPRESSED_RGB_S3TC_DXT1_EXT = WebGLConstant.COMPRESSED_RGB_S3TC_DXT1_EXT,
	COMPRESSED_RGBA_S3TC_DXT1_EXT = WebGLConstant.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	COMPRESSED_RGBA_S3TC_DXT3_EXT = WebGLConstant.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	COMPRESSED_RGBA_S3TC_DXT5_EXT = WebGLConstant.COMPRESSED_RGBA_S3TC_DXT5_EXT,
	// COMPRESSED_SRGB_S3TC_DXT1_EXT = WebGLConstant.COMPRESSED_SRGB_S3TC_DXT1_EXT,
	// COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = WebGLConstant.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
	// COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = WebGLConstant.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
	// COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = WebGLConstant.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT,
	COMPRESSED_R11_EAC = WebGLConstant.COMPRESSED_R11_EAC,
	COMPRESSED_SIGNED_R11_EAC = WebGLConstant.COMPRESSED_SIGNED_R11_EAC,
	COMPRESSED_RG11_EAC = WebGLConstant.COMPRESSED_RG11_EAC,
	COMPRESSED_SIGNED_RG11_EAC = WebGLConstant.COMPRESSED_SIGNED_RG11_EAC,
	COMPRESSED_RGB8_ETC2 = WebGLConstant.COMPRESSED_RGB8_ETC2,
	COMPRESSED_RGBA8_ETC2_EAC = WebGLConstant.COMPRESSED_RGBA8_ETC2_EAC,
	COMPRESSED_SRGB8_ETC2 = WebGLConstant.COMPRESSED_SRGB8_ETC2,
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = WebGLConstant.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = WebGLConstant.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
	COMPRESSED_RGB_PVRTC_4BPPV1_IMG = WebGLConstant.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = WebGLConstant.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG = WebGLConstant.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = WebGLConstant.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
	COMPRESSED_RGB_ETC1_WEBGL = WebGLConstant.COMPRESSED_RGB_ETC1_WEBGL,
	// COMPRESSED_RGBA_ASTC_4x4_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_4x4_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
	// COMPRESSED_RGBA_ASTC_5x4_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_5x4_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
	// COMPRESSED_RGBA_ASTC_5x5_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_5x5_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
	// COMPRESSED_RGBA_ASTC_6x5_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_6x5_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
	// COMPRESSED_RGBA_ASTC_6x6_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_6x6_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
	// COMPRESSED_RGBA_ASTC_8x5_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_8x5_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
	// COMPRESSED_RGBA_ASTC_8x6_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_8x6_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
	// COMPRESSED_RGBA_ASTC_8x8_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_8x8_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
	// COMPRESSED_RGBA_ASTC_10x5_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_10x5_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
	// COMPRESSED_RGBA_ASTC_10x6_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_10x6_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
	// COMPRESSED_RGBA_ASTC_10x10_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_10x10_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
	// COMPRESSED_RGBA_ASTC_12x10_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_12x10_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
	// COMPRESSED_RGBA_ASTC_12x12_KHR = WebGLConstant.COMPRESSED_RGBA_ASTC_12x12_KHR,
	// COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = WebGLConstant.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR,
	// COMPRESSED_RGBA_BPTC_UNORM_EXT = WebGLConstant.COMPRESSED_RGBA_BPTC_UNORM_EXT,
	// COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = WebGLConstant.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT,
	// COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = WebGLConstant.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
	// COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = WebGLConstant.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
	// COMPRESSED_RED_RGTC1_EXT = WebGLConstant.COMPRESSED_RED_RGTC1_EXT,
	// COMPRESSED_SIGNED_RED_RGTC1_EXT = WebGLConstant.COMPRESSED_SIGNED_RED_RGTC1_EXT,
	// COMPRESSED_RED_GREEN_RGTC2_EXT = WebGLConstant.COMPRESSED_RED_GREEN_RGTC2_EXT,
	// COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = WebGLConstant.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT,
	// RGUI = WebGLConstant.RGUI,
	// RGBA4444 = WebGLConstant.RGBA4444,
	DEPTH_COMPONENT16 = WebGLConstant.DEPTH_COMPONENT16
}

/** Data types for texel data in textures. */
export enum TextureDataType {
	UNSIGNED_BYTE = WebGLConstant.UNSIGNED_BYTE,
	UNSIGNED_SHORT_5_6_5 = WebGLConstant.UNSIGNED_SHORT_5_6_5,
	UNSIGNED_SHORT_4_4_4_4 = WebGLConstant.UNSIGNED_SHORT_4_4_4_4,
	UNSIGNED_SHORT_5_5_5_1 = WebGLConstant.UNSIGNED_SHORT_5_5_5_1,
	UNSIGNED_SHORT = WebGLConstant.UNSIGNED_SHORT,
	UNSIGNED_INT = WebGLConstant.UNSIGNED_INT,
	UNSIGNED_INT_24_8_WEBGL = WebGLConstant.UNSIGNED_INT_24_8_WEBGL,
	FLOAT = WebGLConstant.FLOAT,
	HALF_FLOAT_OES = WebGLConstant.HALF_FLOAT_OES,
	BYTE = WebGLConstant.BYTE,
	SHORT = WebGLConstant.SHORT,
	INT = WebGLConstant.INT,
	HALF_FLOAT = WebGLConstant.HALF_FLOAT,
	UNSIGNED_INT_2_10_10_10_REV = WebGLConstant.UNSIGNED_INT_2_10_10_10_REV,
	UNSIGNED_INT_10F_11F_11F_REV = WebGLConstant.UNSIGNED_INT_10F_11F_11F_REV,
	UNSIGNED_INT_5_9_9_9_REV = WebGLConstant.UNSIGNED_INT_5_9_9_9_REV,
	UNSIGNED_INT_24_8 = WebGLConstant.UNSIGNED_INT_24_8,
	FLOAT_32_UNSIGNED_INT_24_8_REV = WebGLConstant.FLOAT_32_UNSIGNED_INT_24_8_REV
}

/** Update modes for textures. */
export enum TextureMode {
	Compressed = "Compressed 2D",
	CompressedSub = "Compressed sub-image 2D",
	Copy = "Copy 2D",
	CopySub = "Copy sub-image 2D",
	Texture = "2D",
	Sub = "Sub-image 2D",
	Texture3D = "3D",
	Sub3D = "Sub-image 3D",
	CopySub3D = "Copy sub-image 3D",
	Compressed3D = "Compressed 3D",
	CompressedSub3D = "Compressed sub-image 3D"
}

/** Parameters for creating a texture. */
export type TextureParameters = {
	/** The rendering context of the texture. */
	gl: WebGL2RenderingContext;

	/** The data contained within the texture. */
	data?: TextureData;

	/** The bind target of the texture. */
	target?: TextureTarget;

	/** Whether to generate a mipmap for the texture. */
	generateMipmap?: boolean;

	/** Whether to flip the Y axis of the texture. */
	flipY?: boolean;

	/** Whether to multiply the alpha channel into the other color channels in the texture. */
	premultiplyAlpha?: boolean;

	/** The unpack alignment of the texture. */
	unpackAlignment?: number;

	/** The minimum mip filter of the texture. */
	minFilter?: TextureFilter;

	/** The maximum mip filter of the texture. */
	magFilter?: TextureFilter;

	/** The wrapping behavior of the texture on the S axis. */
	wrapS?: TextureWrapMode;

	/** The wrapping behavior of the texture on the T axis. */
	wrapT?: TextureWrapMode;

	/** The width, height, and depth of the texture. */
	size?: Vector;

	/** The coordinate offset of the texture if it is a sub-image. */
	offset?: Vector;

	/** The starting coordinates (bottom-left) of the texture if it is a copy of a sub-image. */
	copyStart?: Vector;

	/** The format of the data supplied to the texture. */
	format?: TextureFormat;

	/** The format of the data in the texture. */
	internalFormat?: TextureFormat;

	/** The data type of the values in the texture. */
	type?: TextureDataType;

	/** The mip level of the texture. */
	level?: number;

	/** The length of the source of the texture when reading from the pixel unpack buffer. */
	sourceLength?: number;

	/** The offset of the source of the texture when reading from the pixel unpack buffer. */
	sourceOffset?: number;

	/** The length override of the source of the texture when reading from the pixel unpack buffer. */
	sourceLengthOverride?: number;

	/** The update mode of the texture. */
	updateMode?: TextureMode;
}

/** An array of data that can be randomly accessed in a shader program. Usually used to store image data. */
export class Texture {
	/**
	 * Creates a texture from a color.
	 * @param gl - The rendering context of the texture.
	 * @param color - The color of the texture.
	 * @returns A monocolored texture.
	 */
	static fromColor(gl: WebGL2RenderingContext, color: Color): Texture {
		return new Texture({
			gl,
			data: new Uint8Array([color.r * 0xFF, color.g * 0xFF, color.b * 0xFF, color.a * 0xFF]),
			size: new Vector(1, 1)
		});
	}

	/**
	 * Creates a texture from an image.
	 * @param gl - The rendering context of the texture.
	 * @param source - The source URL or Base64 of the image.
	 * @returns A texture containing the image.
	 */
	static fromImage(gl: WebGL2RenderingContext, source: string): Texture {
		const texture: Texture = Texture.fromColor(gl, new Color(0xFF00FF));

		const image: HTMLImageElement = new Image();
		if ((new URL(source, location.href)).origin != location.origin) {
			image.crossOrigin = "";
		}

		image.addEventListener("load", (): void => {
			texture.data = image;
			texture.size.set();
		});

		image.src = source;

		return texture;
	}

	#cache: TextureParameters;

	constructor({
		gl,
		data = null,
		target = TextureTarget.TEXTURE_2D,
		generateMipmap = true,
		flipY = target == TextureTarget.TEXTURE_2D,
		premultiplyAlpha = false,
		unpackAlignment = 4,
		minFilter = generateMipmap ? TextureFilter.NEAREST_MIPMAP_LINEAR : TextureFilter.LINEAR,
		magFilter = TextureFilter.LINEAR,
		wrapS = TextureWrapMode.CLAMP_TO_EDGE,
		wrapT = TextureWrapMode.CLAMP_TO_EDGE,
		size = new Vector(),
		offset = new Vector(),
		copyStart = new Vector(),
		format = TextureFormat.RGBA,
		internalFormat = format,
		type = TextureDataType.UNSIGNED_BYTE,
		level = 0,
		sourceLength,
		sourceOffset = 0,
		sourceLengthOverride,
		updateMode = TextureMode.Texture
	}: TextureParameters) {
		this.gl = gl;
		this.data = data;
		this.target = target;
		this.generateMipmap = generateMipmap;
		this.flipY = flipY;
		this.premultiplyAlpha = premultiplyAlpha;
		this.unpackAlignment = unpackAlignment;
		this.minFilter = minFilter;
		this.magFilter = magFilter;
		this.wrapS = wrapS;
		this.wrapT = wrapT;
		this.size = size;
		this.offset = offset;
		this.copyStart = copyStart;
		this.format = format;
		this.internalFormat = internalFormat;
		this.type = type;
		this.level = level;
		this.sourceLength = sourceLength;
		this.sourceOffset = sourceOffset;
		this.sourceLengthOverride = sourceLengthOverride;
		this.updateMode = updateMode;
		this.texture = gl.createTexture();

		this.update();
	}

	/** The rendering context of this texture. */
	readonly gl: WebGL2RenderingContext;

	/** The data contained within this texture. */
	data?: TextureData;

	/** The bind target of this texture. */
	target: TextureTarget;

	/** The WebGL texture that this texture represents. */
	readonly texture: WebGLTexture;

	/** Whether to generate a mipmap for this texture. */
	generateMipmap: boolean;

	/** Whether to flip the Y axis of this texture. */
	flipY: boolean;

	/** Whether to multiply the alpha channel into the other color channels in this texture. */
	premultiplyAlpha: boolean;

	/** The unpack alignment of this texture. */
	unpackAlignment: number;

	/** The minimum mip filter of this texture. */
	minFilter: TextureFilter;

	/** The maximum mip filter of this texture. */
	magFilter: TextureFilter;

	/** The wrapping behavior of this texture on the S axis. */
	wrapS: TextureWrapMode;

	/** The wrapping behavior of this texture on the T axis. */
	wrapT: TextureWrapMode;

	/** The width, height, and depth of this texture. */
	size?: Vector;

	/** The coordinate offset of this texture if it is a sub-image. */
	offset?: Vector;

	/** The starting coordinates (bottom-left) of this texture if it is a copy of a sub-image. */
	copyStart?: Vector;

	/** The format of the data supplied to this texture. */
	format: TextureFormat;

	/** The format of the data in this texture. */
	internalFormat: TextureFormat;

	/** The data type of the value in this texture. */
	type: TextureDataType;

	/** The mip level of this texture. */
	level: number;

	/** The length of the source of this texture when reading from the pixel unpack buffer. */
	sourceLength?: number;

	/** The offset of the source of this texture when reading from the pixel unpack buffer. */
	sourceOffset?: number;

	/** The length override of the source of this texture when reading from the pixel unpack buffer. */
	sourceLengthOverride?: number;

	/** The update mode of this texture. */
	updateMode: TextureMode;

	/** Binds this texture to its target. */
	bind(): void {
		this.gl.bindTexture(this.target, this.texture);
	}

	/**
	 * Updates texture parameters.
	 * @param textureUnit - The texture unit of the texture in the current WebGL shader program.
	 */
	update(textureUnit?: number): void {
		if (textureUnit) {
			this.gl.activeTexture(WebGLConstant.TEXTURE0 + textureUnit);
		}
		this.bind();

		// Check if an update is required.
		const current: TextureParameters = Object.assign({}, this);
		if (Object.keys(this.#cache ?? {}).length == Object.keys(current).length) {
			let needsUpdate = false;
			for (const key of Object.keys(current)) {
				if (current[key] != this.#cache[key]) {
					needsUpdate = true;
					break;
				}
			}

			if (!needsUpdate) {
				return;
			}
		}
		this.#cache = current;

		this.gl.pixelStorei(WebGLConstant.UNPACK_FLIP_Y_WEBGL, this.flipY);
		this.gl.pixelStorei(WebGLConstant.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
		this.gl.pixelStorei(WebGLConstant.UNPACK_ALIGNMENT, this.unpackAlignment);
		this.gl.texParameteri(this.target, WebGLConstant.TEXTURE_MIN_FILTER, this.minFilter);
		this.gl.texParameteri(this.target, WebGLConstant.TEXTURE_MAG_FILTER, this.magFilter);
		this.gl.texParameteri(this.target, WebGLConstant.TEXTURE_WRAP_S, this.wrapS);
		this.gl.texParameteri(this.target, WebGLConstant.TEXTURE_WRAP_T, this.wrapT);

		switch (this.updateMode) {
			case TextureMode.Compressed:
				if (this.sourceLength) {
					this.gl.compressedTexImage2D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						0,
						this.sourceLength,
						this.sourceOffset);
				} else {
					this.gl.compressedTexImage2D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						0,
						this.data as ArrayBufferView,
						this.sourceOffset,
						this.sourceLengthOverride);
				}
				break;
			case TextureMode.CompressedSub:
				if (this.sourceLength) {
					this.gl.compressedTexSubImage2D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.size.x,
						this.size.y,
						this.format,
						this.sourceLength,
						this.sourceOffset);
				} else {
					this.gl.compressedTexSubImage2D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.size.x,
						this.size.y,
						this.format,
						this.data as ArrayBufferView,
						this.sourceOffset,
						this.sourceLengthOverride);
				}
				break;
			case TextureMode.Copy:
				this.gl.copyTexImage2D(
					this.target,
					this.level,
					this.internalFormat,
					this.copyStart.x,
					this.copyStart.y,
					this.size.x,
					this.size.y,
					0);
				break;
			case TextureMode.CopySub:
				this.gl.copyTexSubImage2D(
					this.target,
					this.level,
					this.offset.x,
					this.offset.y,
					this.copyStart.x,
					this.copyStart.y,
					this.size.x,
					this.size.y);
				break;
			case TextureMode.Texture:
				if (this.size.x || this.size.y) {
					this.gl.texImage2D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						0,
						this.format,
						this.type,
						this.data as ArrayBufferView);
				} else {
					this.gl.texImage2D(
						this.target,
						this.level,
						this.internalFormat,
						this.format,
						this.type,
						this.data as ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap);
				}
				break;
			case TextureMode.Sub:
				if (this.size.x || this.size.y) {
					this.gl.texSubImage2D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.size.x,
						this.size.y,
						this.format,
						this.type,
						this.data as ArrayBufferView);
				} else {
					this.gl.texSubImage2D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.format,
						this.type,
						this.data as ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap);
				}
				break;
			case TextureMode.Texture3D:
				if (this.sourceOffset) {
					this.gl.texImage3D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						this.size.z,
						0,
						this.format,
						this.type,
						this.sourceOffset);
				} else {
					this.gl.texImage3D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						this.size.z,
						0,
						this.format,
						this.type,
						this.data as HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | ImageData);
				}
				break;
			case TextureMode.CopySub3D:
				this.gl.texSubImage3D(
					this.target,
					this.level,
					this.offset.x,
					this.offset.y,
					this.offset.z,
					this.size.x,
					this.size.y,
					this.size.z,
					this.format,
					this.type,
					this.data as ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement);
				break;
			case TextureMode.Compressed3D:
				if (this.sourceLength) {
					this.gl.compressedTexImage3D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						this.size.z,
						0,
						this.sourceLength,
						this.sourceOffset);
				} else {
					this.gl.compressedTexImage3D(
						this.target,
						this.level,
						this.internalFormat,
						this.size.x,
						this.size.y,
						this.size.z,
						0,
						this.data as ArrayBufferView,
						this.sourceOffset,
						this.sourceLengthOverride);
				}
				break;
			case TextureMode.CompressedSub3D:
				if (this.sourceLength) {
					this.gl.compressedTexSubImage3D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.offset.z,
						this.size.x,
						this.size.y,
						this.size.z,
						this.format,
						this.sourceLength,
						this.sourceOffset);
				} else {
					this.gl.compressedTexSubImage3D(
						this.target,
						this.level,
						this.offset.x,
						this.offset.y,
						this.offset.z,
						this.size.x,
						this.size.y,
						this.size.z,
						this.format,
						this.data as ArrayBufferView,
						this.sourceOffset,
						this.sourceLengthOverride);
				}
				break;
			default:
				throw new Error("Unknown update mode.");
		}

		if (this.generateMipmap) {
			this.gl.generateMipmap(this.target);
		}
	}
}