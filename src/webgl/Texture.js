import { TEXTURE_2D, UNSIGNED_BYTE, RGBA, CLAMP_TO_EDGE, NEAREST_MIPMAP_LINEAR, LINEAR, UNPACK_FLIP_Y_WEBGL, UNPACK_PREMULTIPLY_ALPHA_WEBGL, TEXTURE_MIN_FILTER,
	TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T, TEXTURE_MAX_ANISOTROPY_EXT, TEXTURE_CUBE_MAP, TEXTURE_CUBE_MAP_POSITIVE_X } from "./constants.js";

// const isPowerOfTwo = (value) => !(value & (value - 1));

// TODO: Can be replaced with a static private variable when Bundlephobia supports it.
let nextTextureId = 0;

export class Texture {
	constructor({ renderer, image, target = TEXTURE_2D, type = UNSIGNED_BYTE, format = RGBA, internalFormat = format, wrapS = CLAMP_TO_EDGE,
		wrapT = CLAMP_TO_EDGE, generateMipmaps = true, minFilter = generateMipmaps ? NEAREST_MIPMAP_LINEAR : LINEAR, magFilter = LINEAR,
		premultiplyAlpha = false, unpackAlignment = 4, flipY = target == TEXTURE_2D, anisotropy = 0, level = 0, width, height = width } = {}) {

		Object.assign(this, { gl: renderer.gl, renderer, id: nextTextureId++, image, target, type, format, internalFormat, wrapS, wrapT, generateMipmaps, minFilter,
			magFilter, premultiplyAlpha, unpackAlignment, flipY, anisotropy: Math.min(anisotropy, renderer.parameters.maxAnisotropy), level,
			width, height, texture: renderer.gl.createTexture() });
	}

	bind() {
		this.gl.bindTexture(this.target, this.texture);
		this.renderer.state.textureUnits[this.renderer.state.activeTextureUnit] = this.id;
	}

	update(textureUnit = 0) {
		// Make sure that the texture is bound to its texture unit.
		this.gl.activeTexture(textureUnit);
		this.bind();

		this.gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, this.flipY);
		this.gl.pixelStorei(UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, this.minFilter);
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, this.magFilter);
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, this.wrapS);
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, this.wrapT);
		this.gl.texParameterf(this.target, TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);

		if (this.image) {
			if (this.image.width) {
				this.width = this.image.width;
				this.height = this.image.height;
			}

			if (this.target == TEXTURE_CUBE_MAP) {
				// Cube map.
				for (let i = 0; i < 6; i++) {
					this.gl.texImage2D(TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
				}
			} else if (ArrayBuffer.isView(this.image)) {
				// Data texture.
				this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
			} else if (this.image.isCompressedTexture) {
				// Compressed texture.
				for (let level = 0; level < this.image.length; level++) {
					this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
				}
			} else {
				// Regular texture.
				this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
			}

			if (this.generateMipmaps) { this.gl.generateMipmap(this.target); }
		} else {
			if (this.target == TEXTURE_CUBE_MAP) {
				// Upload empty pixel for each side to avoid errors while loading.
				for (let i = 0; i < 6; i++) {
					this.gl.texImage2D(TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, RGBA, 1, 1, 0, RGBA, UNSIGNED_BYTE, new Uint8Array(4));
				}
			} else if (this.width) {
				this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
			} else {
				this.gl.texImage2D(this.target, 0, RGBA, 1, 1, 0, RGBA, UNSIGNED_BYTE, new Uint8Array(4));
			}
		}
	}
}