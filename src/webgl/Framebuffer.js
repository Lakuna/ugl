/** @external {WebGLFramebuffer} https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer */

import { FRAMEBUFFER, COLOR_ATTACHMENT0, RENDERBUFFER, CLAMP_TO_EDGE, LINEAR, UNSIGNED_BYTE, RGBA, NEAREST,
	DEPTH_COMPONENT, DEPTH_COMPONENT16, UNSIGNED_INT, DEPTH_ATTACHMENT, STENCIL_INDEX8, STENCIL_ATTACHMENT,
	DEPTH_STENCIL, DEPTH_STENCIL_ATTACHMENT } from "./constants.js";
import { Vector } from "../math/Vector.js";
import { Texture } from "./Texture.js";
import { Renderbuffer } from "./Renderbuffer.js";

/** Class representing a WebGL framebuffer. */
export class Framebuffer {
	/**
	 * Unbinds all framebuffers to draw to the canvas.
	 * @param {WebGLRenderingContext} gl - The rendering context of the canvas.
	 */
	static unbind(gl) {
		gl.bindFramebuffer(FRAMEBUFFER, null);
	}

	/**
	 * An enumeration of update modes for a framebuffer.
	 * 
	 * MODE_RENDERBUFFER
	 * MODE_2D
	 * MODE_LAYER
	 * @type {Object<Symbol>}
	 */
	static updateModes = {
		MODE_RENDERBUFFER: Symbol("Renderbuffer"),
		MODE_2D: Symbol("2D"),
		MODE_LAYER: Symbol("Layer")
	};

	#size;

	/**
	 * Create a framebuffer.
	 * @param {Object} [arguments={}] - An object containing the arguments.
	 * @param {WebGLRenderingContext} arguments.gl - The rendering context of the framebuffer.
	 * @param {number} [arguments.target=FRAMEBUFFER] - The bind point of the framebuffer.
	 * @param {Vector} [arguments.size=new Vector(gl.canvas.width, gl.canvas.height)] - The width and height of the framebuffer. Gets values from data if not set.
	 * @param {number} [arguments.colorTextureCount=1] - The number of color textures to add to this framebuffer.
	 * @param {boolean} [arguments.depth=false] - Whether to use a depth buffer.
	 * @param {boolean} [arguments.stencil=false] - Whether to use a stencil buffer.
	 * @param {boolean} [arguments.depthTexture=false] - Whether to use a depth texture. This overrides depth and stencil buffers.
	 * @param {number} [arguments.wrapS=CLAMP_TO_EDGE] - The wrapping behavior of the textures on the S axis.
	 * @param {number} [arguments.wrapT=CLAMP_TO_EDGE] - The wrapping behavior of the textures on the T axis.
	 * @param {number} [arguments.minFilter=LINEAR] - The minimum mip filter of the texture.
	 * @param {number} [arguments.magFilter=minFilter] - The maximum mip filter of the texture.
	 * @param {number} [arguments.type=UNSIGNED_BYTE] - The data type of the values in the textures.
	 * @param {number} [arguments.format=RGBA] - The format of the data supplied to the textures.
	 * @param {number} [arguments.internalFormat=format] - The format of the data in the textures.
	 * @param {number} [arguments.unpackAlignment=4] - Unpack alignment of the textures.
	 * @param {boolean} [arguments.premultiplyAlpha=false] - Whether to multiply the alpha channel into the other color channels.
	 */
	constructor({
		gl,
		target = FRAMEBUFFER,
		size = new Vector(gl.canvas.width, gl.canvas.height),

		colorTextureCount = 1,
		depth = false,
		stencil = false,
		depthTexture = false,

		wrapS = CLAMP_TO_EDGE,
		wrapT = CLAMP_TO_EDGE,
		minFilter = LINEAR,
		magFilter = minFilter,
		type = UNSIGNED_BYTE,
		format = RGBA,
		internalFormat = format,
		unpackAlignment,
		premultiplyAlpha
	} = {}) {
		/**
		 * The rendering context of the framebuffer.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		this.size = size; // Use setter.

		/**
		 * Whether this framebuffer has a depth buffer.
		 * @type {boolean}
		 */
		this.depth = depth;

		/**
		 * The WebGL framebuffer that this object represents.
		 * @type {WebGLFramebuffer}
		 */
		this.framebuffer = gl.createFramebuffer();

		/**
		 * The bind point of the framebuffer.
		 * @type {number}
		 */
		this.target = target;

		this.bind();

		/**
		 * A list of textures attached to this framebuffer.
		 * @type {Texture[]}
		 */
		this.textures = [];
		const drawBuffers = [];

		// Create and attach the requested number of color textures.
		for (let i = 0; i < colorTextureCount; i++) {
			this.textures.push(new Texture({
				gl,

				generateMipmaps: false,

				flipY: false,
				premultiplyAlpha,
				unpackAlignment,

				minFilter,
				magFilter,
				wrapS,
				wrapT,

				size,
				format,
				internalFormat,
				type
			}));

			this.add(this.textures[i]);
			drawBuffers.push(COLOR_ATTACHMENT0 + i);
		}

		if (drawBuffers.length > 1) { gl.drawBuffers(drawBuffers); }

		if (depthTexture) {
			/**
			 * The depth texture attached to this framebuffer, if any.
			 * @type {Texture}
			 */
			this.depthTexture = new Texture({
				gl,

				minFilter: NEAREST,
				magFilter: NEAREST,

				size,
				format: DEPTH_COMPONENT,
				internalFormat: DEPTH_COMPONENT16,
				type: UNSIGNED_INT
			});

			this.add(this.depthTexture, DEPTH_ATTACHMENT);
		} else {
			if (depth && !stencil) {
				/**
				 * The depth buffer attached to this framebuffer, if any.
				 * @type {Renderbuffer}
				 */
				this.depthBuffer = new Renderbuffer(gl, DEPTH_COMPONENT16, size);
				this.add(this.depthBuffer, DEPTH_ATTACHMENT, Framebuffer.updateModes.MODE_RENDERBUFFER);
			} else if (stencil && !depth) {
				/**
				 * The stencil buffer attached to this framebuffer, if any.
				 * @type {Renderbuffer}
				 */
				this.stencilBuffer = new Renderbuffer(gl, STENCIL_INDEX8, size);
				this.add(this.stencilBuffer, STENCIL_ATTACHMENT, Framebuffer.updateModes.MODE_RENDERBUFFER);
			} else if (depth && stencil) {
				/**
				 * The depth stencil buffer attached to this framebuffer, if any.
				 * @type {Renderbuffer}
				 */
				this.depthStencilBuffer = new Renderbuffer(gl, DEPTH_STENCIL, size);
				this.add(this.depthStencilBuffer, DEPTH_STENCIL_ATTACHMENT, Framebuffer.updateModes.MODE_RENDERBUFFER);
			}
		}

		Framebuffer.unbind(gl);
	}

	/**
	 * The width and height of the framebuffer. Gets values from data if not set.
	 * @type {Vector}
	 */
	get size() {
		return this.#size ?? new Vector(
			this.data?.[0]?.size?.x ?? this.data?.[0]?.data?.width ?? 0,
			this.data?.[0]?.size?.y ?? this.data?.[0]?.data?.height ?? 0);
	}

	/**
	 * The width and height of the framebuffer. Gets values from data if not set.
	 * @type {Vector}
	 */
	set size(value) {
		/** @ignore */ this.#size = new Vector(...(value ?? []));
	}

	/** Binds this framebuffer to its target. */
	bind() {
		this.gl.bindFramebuffer(this.target, this.framebuffer);
	}

	/**
	 * Add an attachment to this framebuffer.
	 * @param {Texture|Renderbuffer} data - The data to add to the framebuffer.
	 * @param {number} [attachmentPoint=COLOR_ATTACHMENT0] - The attachment point of the data.
	 * @param {Symbol} [updateMode=Framebuffer.updateModes.MODE_2D] - The update mode of the data.
	 * @param {number} [level=0] - The mipmap level of the texture image to attach to the framebuffer if using the layer update mode.
	 * @param {number} [layer=0] - The layer of the texture image to attach to the framebuffer if using the layer update mode.
	 */
	add(data, attachmentPoint = COLOR_ATTACHMENT0, updateMode = Framebuffer.updateModes.MODE_2D, level = 0, layer = 0) {
		data.bind?.();
		this.bind();

		switch (updateMode) {
			case Framebuffer.updateModes.MODE_RENDERBUFFER:
				this.gl.framebufferRenderbuffer(this.target, attachmentPoint, RENDERBUFFER, data.renderbuffer);
				break;
			case Framebuffer.updateModes.MODE_2D:
				this.gl.framebufferTexture2D(this.target, attachmentPoint, data.target, data.texture, 0);
				break;
			case Framebuffer.updateModes.MODE_LAYER:
				this.gl.framebufferTextureLayer(this.target, attachmentPoint, data.texture, level, layer);
				break;
			default:
				throw new Error("Invalid update mode.");
		}

		Framebuffer.unbind(this.gl);
	}
}