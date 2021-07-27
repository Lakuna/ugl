import { Texture } from "./Texture.js";
import { FRAMEBUFFER, CLAMP_TO_EDGE, LINEAR, UNSIGNED_BYTE, RGBA, COLOR_ATTACHMENT0, TEXTURE_2D, NEAREST, DEPTH_COMPONENT, DEPTH_COMPONENT16,
	UNSIGNED_INT, DEPTH_ATTACHMENT, RENDERBUFFER, STENCIL_INDEX8, STENCIL_ATTACHMENT, DEPTH_STENCIL, DEPTH_STENCIL_ATTACHMENT } from "./constants.js";

export class RenderTarget {
	constructor({ renderer, width = renderer.gl.canvas.width, height = renderer.gl.canvas.height, target = FRAMEBUFFER, colorAttachmentCount = 1, depth = true, stencil = false,
		depthTexture = false, wrapS = CLAMP_TO_EDGE, wrapT = CLAMP_TO_EDGE, minFilter = LINEAR, magFilter = minFilter, type = UNSIGNED_BYTE,
		format = RGBA, internalFormat = format, unpackAlignment, premultiplyAlpha } = {}) {

		const gl = renderer.gl;

		Object.assign(this, { renderer, width, height, depth, buffer: gl.createFramebuffer(), target, textures: [], drawBuffers: [] });

		gl.bindFramebuffer(target, this.buffer);

		// Create and attach the required number of color textures.
		for (let i = 0; i < colorAttachmentCount; i++) {
			this.textures.push(new Texture({ gl, width, height, wrapS, wrapT, minFilter, magFilter, type, format, internalFormat, unpackAlignment,
				premultiplyAlpha, flipY: false, generateMipmaps: false }));
			this.textures[i].update();
			gl.framebufferTexture2D(target, COLOR_ATTACHMENT0 + i, TEXTURE_2D, this.textures[i].texture, 0 /* level */);
			this.drawBuffers.push(COLOR_ATTACHMENT0 + i);
		}

		// For multi-render targets shader access.
		if (this.drawBuffers.length > 1) { renderer.drawBuffers(this.drawBuffers); }

		this.texture = this.textures[0];

		// Depth textures break stencil, so they can't be used together.
		if (depthTexture) {
			this.depthTexture = new Texture({ renderer, width, height, minFilter: NEAREST, magFilter: NEAREST, format: DEPTH_COMPONENT,
				internalFormat: DEPTH_COMPONENT16, type: UNSIGNED_INT });
			this.depthTexture.update();
			gl.framebufferTexture2D(target, DEPTH_ATTACHMENT, TEXTURE_2D, this.depthTexture.texture, 0 /* level */);
		} else {
			if (depth && !stencil) {
				this.depthBuffer = gl.createRenderbuffer();
				gl.bindRenderbuffer(RENDERBUFFER, this.depthBuffer);
				gl.renderbufferStorage(RENDERBUFFER, DEPTH_COMPONENT16, width, height);
				gl.framebufferRenderbuffer(target, DEPTH_ATTACHMENT, RENDERBUFFER, this.depthBuffer);
			}

			if (stencil && !depth) {
				this.stencilBuffer = gl.createRenderbuffer();
				gl.bindRenderbuffer(RENDERBUFFER, this.stencilBuffer);
				gl.renderbufferStorage(RENDERBUFFER, STENCIL_INDEX8, width, height);
				gl.framebufferRenderbuffer(target, STENCIL_ATTACHMENT, RENDERBUFFER, this.stencilBuffer);
			}

			if (depth && stencil) {
				this.depthStencilBuffer = gl.createRenderbuffer();
				gl.bindRenderbuffer(RENDERBUFFER, this.depthStencilBuffer);
				gl.renderbufferStorage(RENDERBUFFER, DEPTH_STENCIL, width, height);
				gl.framebufferRenderbuffer(target, DEPTH_STENCIL_ATTACHMENT, RENDERBUFFER, this.depthStencilBuffer);
			}
		}

		gl.bindFramebuffer(target, null);
	}
}