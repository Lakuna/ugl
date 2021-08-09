import { TEXTURE_2D, NEAREST_MIPMAP_LINEAR, LINEAR, CLAMP_TO_EDGE, UNSIGNED_BYTE, UNPACK_FLIP_Y_WEBGL, UNPACK_PREMULTIPLY_ALPHA_WEBGL,
	UNPACK_ALIGNMENT, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, RGBA } from "./constants.js";
import { Vector } from "../math/Vector.js";

export class Texture {
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

	constructor(gl, {
		target = TEXTURE_2D,

		generateMipmap = true,

		flipY = target == TEXTURE_2D,
		premultiplyAlpha = false,
		unpackAlignment = 4,
		
		minFilter = generateMipmap ? NEAREST_MIPMAP_LINEAR : LINEAR,
		magFilter = LINEAR,
		wrapS = CLAMP_TO_EDGE,
		wrapT = CLAMP_TO_EDGE,

		size = new Vector(), // width, height, depth.
		offset = new Vector(), // Coordinate offset for sub-images.
		copyStart = new Vector(), // Starting coordinates for copying images (bottom-left).
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
		Object.defineProperties(this, {
			gl: { value: gl },

			target: { value: target },

			texture: { value: gl.createTexture() },

			generateMipmap: { value: generateMipmap, writable: true },

			flipY: { value: flipY, writable: true },
			premultiplyAlpha: { value: premultiplyAlpha, writable: true },
			unpackAlignment: { value: unpackAlignment, writable: true },
			
			minFilter: { value: minFilter, writable: true },
			magFilter: { value: magFilter, writable: true },
			wrapS: { value: wrapS, writable: true },
			wrapT: { value: wrapT, writable: true },

			size: { value: size, writable: true },
			offset: { value: offset, writable: true },
			copyStart: { value: copyStart, writable: true },
			format: { value: format, writable: true },
			internalFormat: { value: internalFormat, writable: true },
			type: { value: type, writable: true },
			level: { value: level, writable: true },

			sourceLength: { value: sourceLength, writable: true },
			sourceOffset: { value: sourceOffset, writable: true },
			sourceLengthOverride: { value: sourceLengthOverride, writable: true },

			updateMode: { value: updateMode, writable: true }
		});
	}

	bind() {
		this.gl.bindTexture(this.target, this.texture);
	}

	update(textureUnit) {
		this.gl.activeTexture(textureUnit);
		this.bind();

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