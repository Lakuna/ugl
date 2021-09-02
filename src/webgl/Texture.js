/** @external {WebGLTexture} https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture */

import { TEXTURE_2D, NEAREST_MIPMAP_LINEAR, LINEAR, CLAMP_TO_EDGE, UNSIGNED_BYTE, UNPACK_FLIP_Y_WEBGL, UNPACK_PREMULTIPLY_ALPHA_WEBGL,
	UNPACK_ALIGNMENT, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, RGBA, TEXTURE0 } from "./constants.js";
import { Vector } from "../math/Vector.js";
import { Color } from "../utility/Color.js";

/** Class representing a WebGL texture. */
export class Texture {
	/**
	 * Creates a texture from a color.
	 * @param {WebGLRenderingContext} gl - The rendering context of the texture.
	 * @param {Color} color - The color of the texture.
	 * @return {Texture} A monocolored texture.
	 */
	static fromColor(gl, color) {
		return new Texture({ gl, data: new Uint8Array([color.r * 0xFF, color.g * 0xFF, color.b * 0xFF, color.a * 0xFF]), size: new Vector(1, 1) });
	}

	/**
	 * Creates a texture from an image.
	 * @param {WebGLRenderingContext} gl - The rendering context of the texture.
	 * @param {string} imageSource - The source URL or Base64 of the image.
	 * @return {Texture} A texture containing the image.
	 */
	static fromImage(gl, imageSource) {
		const texture = Texture.fromColor(gl, new Color(0xFF00FF));

		// Create an image.
		const image = new Image();
		if ((new URL(imageSource, location.href)).origin != location.origin) {
			image.crossOrigin = ""; // Request CORS.
		}

		// Update the texture once the image loads.
		image.addEventListener("load", () => {
			texture.data = image;
			texture.size.set();
		});

		image.src = imageSource; // Start loading the image.

		return texture; // Return the texture with a default color right away.
	}

	/**
	 * An enumeration of update modes for a texture.
	 * 
	 * MODE_COMPRESSED_2D
	 * MODE_COMPRESSED_SUB_2D
	 * MODE_COPY_2D
	 * MODE_COPY_SUB_2D
	 * MODE_2D
	 * MODE_SUB_2D
	 * MODE_3D
	 * MODE_SUB_3D
	 * MODE_COPY_SUB_3D
	 * MODE_COMPRESSED_3D
	 * MODE_COMPRESSED_SUB_3D
	 * @type {Object<Symbol>}
	 */
	static updateModes = {
		MODE_COMPRESSED_2D: Symbol("Compressed 2D"),
		MODE_COMPRESSED_SUB_2D: Symbol("Compressed sub-image 2D"),
		MODE_COPY_2D: Symbol("Copy 2D"),
		MODE_COPY_SUB_2D: Symbol("Copy sub-image 2D"),
		MODE_2D: Symbol("2D"),
		MODE_SUB_2D: Symbol("Sub-image 2D"),
		MODE_3D: Symbol("3D"),
		MODE_SUB_3D: Symbol("Sub-image 3D"),
		MODE_COPY_SUB_3D: Symbol("Copy sub-image 3D"),
		MODE_COMPRESSED_3D: Symbol("Compressed 3D"),
		MODE_COMPRESSED_SUB_3D: Symbol("Compressed sub-image 3D")
	};

	#cache;

	/**
	 * Create a texture.
	 * @param {Object} [arguments={}] - An object containing the arguments.
	 * @param {WebGLRenderingContext} arguments.gl - The rendering context of the texture.
	 * @param {*} [arguments.data=null] - The data contained within the texture.
	 * @param {number} [arguments.target=TEXTURE_2D] - The bind target of the texture.
	 * @param {boolean} [arguments.generateMipmap=true] - Whether to generate a mipmap for the texture.
	 * @param {boolean} [arguments.flipY=target==TEXTURE_2D] - Whether to flip the Y axis of the texture.
	 * @param {boolean} [arguments.premultiplyAlpha=false] - Whether to multiply the alpha channel into the other color channels.
	 * @param {number} [arguments.unpackAlignment=4] - Unpack alignment of the texture.
	 * @param {number} [arguments.minFilter=generateMipmap ? NEAREST_MIPMAP_LINEAR : LINEAR] - The minimum mip filter of the texture.
	 * @param {number} [arguments.magFilter=LINEAR] - The maximum mip filter of the texture.
	 * @param {number} [arguments.wrapS=CLAMP_TO_EDGE] - The wrapping behavior of the texture on the S axis.
	 * @param {number} [arguments.wrapT=CLAMP_TO_EDGE] - The wrapping behavior of the texture on the T axis.
	 * @param {Vector} [arguments.size=new Vector()] - The width, height, and depth of the texture.
	 * @param {Vector} [arguments.offset=new Vector()] - The coordinate offset for sub-images.
	 * @param {Vector} [arguments.copyStart=new Vector()] - The starting coordinates for copying images (bottom-left).
	 * @param {number} [arguments.format=RGBA] - The format of the data supplied to the texture.
	 * @param {number} [arguments.internalFormat=format] - The format of the data in the texture.
	 * @param {number} [arguments.type=UNSIGNED_BYTE] - The data type of the values in the texture.
	 * @param {number} [arguments.level=0] - The level of the texture.
	 * @param {number} [arguments.sourceLength] - The length of the source when reading from the PIXEL_UNPACK_BUFFER.
	 * @param {number} [arguments.sourceOffset=0] - The offset of the source when reading from the PIXEL_UNPACK_BUFFER.
	 * @param {number} [arguments.sourceLengthOverride] - The length override of the source when reading from the PIXEL_UNPACK_BUFFER.
	 * @param {Symbol} [arguments.updateMode=Texture.updateModes.MODE_2D] - The symbol of the update mode to use for this texture.
	 */
	constructor({
		gl,
		data = null,
		target = TEXTURE_2D,

		generateMipmap = true,

		flipY = target == TEXTURE_2D,
		premultiplyAlpha = false,
		unpackAlignment = 4,
		
		minFilter = generateMipmap ? NEAREST_MIPMAP_LINEAR : LINEAR,
		magFilter = LINEAR,
		wrapS = CLAMP_TO_EDGE,
		wrapT = CLAMP_TO_EDGE,

		size = new Vector(),
		offset = new Vector(),
		copyStart = new Vector(),
		format = RGBA,
		internalFormat = format,
		type = UNSIGNED_BYTE,
		level = 0,

		// For reading from the PIXEL_UNPACK_BUFFER.
		sourceLength,
		sourceOffset = 0,
		sourceLengthOverride,

		updateMode = Texture.updateModes.MODE_2D
	} = {}) {
		/**
		 * The rendering context of the texture.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The data contained within the texture.
		 * @type {*}
		 */
		this.data = data;

		/**
		 * The bind target of the texture.
		 * @type {number}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture
		 */
		this.target = target;

		/**
		 * The texture used by WebGL.
		 * @type {WebGLTexture}
		 */
		this.texture = gl.createTexture();

		/**
		 * Whether to generate a mipmap for the texture.
		 * @type {boolean}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap
		 */
		this.generateMipmap = generateMipmap;

		/**
		 * Whether to flip the Y axis of the texture.
		 * @type {boolean}
		 */
		this.flipY = flipY;

		/**
		 * Whether to multiply the alpha channel into the other color channels.
		 * @type {boolean}
		 */
		this.premultiplyAlpha = premultiplyAlpha;

		/**
		 * Unpack alignment of the texture.
		 * @type {number}
		 */
		this.unpackAlignment = unpackAlignment;

		/**
		 * The minimum mip filter of the texture.
		 * @type {number}
		 */
		this.minFilter = minFilter;

		/**
		 * The maximum mip filter of the texture.
		 * @type {number}
		 */
		this.magFilter = magFilter;

		/**
		 * The wrapping behavior of the texture on the S axis.
		 * @type {number}
		 */
		this.wrapS = wrapS;

		/**
		 * The wrapping behavior of the texture on the T axis.
		 * @type {number}
		 */
		this.wrapT = wrapT;

		/**
		 * The width, height, and depth of the texture.
		 * @type {Vector}
		 */
		this.size = size;

		/**
		 * The coordinate offset for sub-images.
		 * @type {Vector}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texSubImage3D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D
		 */
		this.offset = offset;

		/**
		 * The starting coordinates for copying images (bottom-left).
		 * @type {Vector}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexSubImage2D
		 */
		this.copyStart = copyStart;

		/**
		 * The format of the data supplied to the texture.
		 * @type {number}
		 */
		this.format = format;

		/**
		 * The format of the texture.
		 * @type {number}
		 */
		this.internalFormat = internalFormat;

		/**
		 * The data type of the values in the texture.
		 * @type {number}
		 */
		this.type = type;

		/**
		 * The level of the texture.
		 * @type {number}
		 */
		this.level = level;

		/**
		 * The length of the source when reading from the PIXEL_UNPACK_BUFFER.
		 * @type {number}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D
		 */
		this.sourceLength = sourceLength;

		/**
		 * The offset of the source when reading from the PIXEL_UNPACK_BUFFER.
		 * @type {number}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D
		 */
		this.sourceOffset = sourceOffset;

		/**
		 * The length override of the source when reading from the PIXEL_UNPACK_BUFFER.
		 * @type {number}
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D
		 */
		this.sourceLengthOverride = sourceLengthOverride;

		/**
		 * The symbol of the update mode to use for this texture.
		 * @type {Symbol}
		 */
		this.updateMode = updateMode;

		this.update();
	}

	/**
	 * Binds this texture to its target.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture
	 */
	bind() {
		this.gl.bindTexture(this.target, this.texture);
	}

	/**
	 * Updates texture parameters.
	 * @param {number} [textureUnit] - The texture unit of the texture in the current WebGL shader program.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexSubImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texSubImage3D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap
	 */
	update(textureUnit = null) {
		if (typeof textureUnit == "number") { this.gl.activeTexture(TEXTURE0 + textureUnit); }
		this.bind();

		// Check if an update is required.
		const current = Object.assign({}, this);
		if (Object.keys(this.#cache ?? {}).length == Object.keys(current).length) {
			let needsUpdate = false;
			for (const key of Object.keys(current)) {
				if (current[key] != this.#cache[key]) {
					needsUpdate = true;
					break;
				}
			}
			if (!needsUpdate) { return; }
		}
		/** @ignore */ this.#cache = current;

		this.gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, this.flipY);
		this.gl.pixelStorei(UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
		this.gl.pixelStorei(UNPACK_ALIGNMENT, this.unpackAlignment);

		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, this.minFilter);
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, this.magFilter);
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, this.wrapS);
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, this.wrapT);

		// TODO: Anisotropic filtering requires the EXT_texture_filter_anisotropic extension to be enabled on the rendering context.
		// Recommended default for this.anisotropy is 0.
		// this.gl.texParameterf(this.target, TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);

		switch (this.updateMode) {
			case Texture.updateModes.MODE_COMPRESSED_2D:
				if (this.sourceLength) {
					this.gl.compressedTexImage2D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, 0, this.sourceLength, this.sourceOffset);
				} else {
					this.gl.compressedTexImage2D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, 0, this.data, this.sourceOffset, this.sourceLengthOverride);
				}
				break;
			case Texture.updateModes.MODE_COMPRESSED_SUB_2D:
				if (this.sourceLength) {
					this.gl.compressedTexSubImage2D(this.target, this.level, this.offset.x, this.offset.y, this.size.x, this.size.y, this.format, this.sourceLength, this.sourceOffset);
				} else {
					this.gl.compressedTexSubImage2D(this.target, this.level, this.offset.x, this.offset.y, this.size.x, this.size.y, this.format, this.data, this.sourceOffset, this.sourceLengthOverride);
				}
				break;
			case Texture.updateModes.MODE_COPY_2D:
				this.gl.copyTexImage2D(this.target, this.level, this.internalFormat, this.copyStart.x, this.copyStart.y, this.size.x, this.size.y, 0);
				break;
			case Texture.updateModes.MODE_COPY_SUB_2D:
				this.gl.copyTexSubImage2D(this.target, this.level, this.offset.x, this.offset.y, this.copyStart.x, this.copyStart.y, this.size.x, this.size.y);
				break;
			case Texture.updateModes.MODE_2D:
				if (this.size.x || this.size.y) {
					this.gl.texImage2D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, 0, this.format, this.type, this.data);
				} else {
					this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.data);
				}
				break;
			case Texture.updateModes.MODE_SUB_2D:
				if (this.size.x || this.size.y) {
					this.texSubImage2D(this.target, this.level, this.offset.x, this.offset.y, this.size.x, this.size.y, this.format, this.type, this.data);
				} else {
					this.texSubImage2D(this.target, this.level, this.offset.x, this.offset.y, this.format, this.type, this.data);
				}
				break;
			case Texture.updateModes.MODE_3D:
				if (this.sourceOffset) {
					this.gl.texImage3D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, this.size.z, 0, this.format, this.type, this.sourceOffset);
				} else {
					this.gl.texImage3D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, this.size.z, 0, this.format, this.type, this.data);
				}
				break;
			case Texture.updateModes.MODE_COPY_SUB_3D:
				this.gl.texSubImage3D(this.target, this.level, this.offset.x, this.offset.y, this.offset.z, this.size.x, this.size.y, this.size.z, this.format, this.type, this.data);
				break;
			case Texture.updateModes.MODE_COMPRESSED_3D:
				if (this.sourceLength) {
					this.gl.compressedTexImage3D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, this.size.z, 0, this.sourceLength, this.sourceOffset);
				} else {
					this.gl.compressedTexImage3D(this.target, this.level, this.internalFormat, this.size.x, this.size.y, this.size.z, 0, this.data, this.sourceOffset, this.sourceLengthOverride);
				}
				break;
			case Texture.updateModes.MODE_COMPRESSED_SUB_3D:
				if (this.sourceLength) {
					this.gl.compressedTexSubImage3D(this.target, this.level, this.offset.x, this.offset.y, this.offset.z, this.size.x, this.size.y, this.size.z, this.format, this.sourceLength, this.sourceOffset);
				} else {
					this.gl.compressedTexSubImage3D(this.target, this.level, this.offset.x, this.offset.y, this.offset.z, this.size.x, this.size.y, this.size.z, this.format, this.data, this.sourceOffset, this.sourceLengthOverride);
				}
				break;
			default:
				throw new Error("Unknown update mode.");
		}

		if (this.generateMipmap) { this.gl.generateMipmap(this.target); }
	}
}