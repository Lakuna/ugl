import { TextureData } from "./TextureData.js";
import { TextureMode } from "./TextureMode.js";
import { WebGLConstant } from "./WebGLConstant.js";
import { Color } from "../utility/Color.js";
import { TextureDataType } from "./TextureDataType.js";
import { TextureFilter } from "./TextureFilter.js";
import { TextureFormat } from "./TextureFormat.js";
import { TextureTarget } from "./TextureTarget.js";
import { TextureWrapMode } from "./TextureWrapMode.js";
import { TextureParameters } from "./TextureParameters.js";
import { Vector } from "../math/Vector.js";

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

	constructor({
		gl,
		data,
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
		if (data) {
			this.data = data;
		}
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
		if (sourceLength) {
			this.sourceLength = sourceLength;
		}
		this.sourceOffset = sourceOffset;
		if (sourceLengthOverride) {
			this.sourceLengthOverride = sourceLengthOverride;
		}
		this.updateMode = updateMode;
		const texture: WebGLTexture | null = gl.createTexture();
		if (texture) {
			this.texture = texture;
		} else {
			throw new Error("Failed to create a WebGL texture.");
		}
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
	size: Vector;

	/** The coordinate offset of this texture if it is a sub-image. */
	offset: Vector;

	/** The starting coordinates (bottom-left) of this texture if it is a copy of a sub-image. */
	copyStart: Vector;

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
						this.sourceOffset ?? 0);
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
						this.sourceOffset ?? 0);
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
						this.sourceOffset ?? 0);
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
						this.sourceOffset ?? 0);
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