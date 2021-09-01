/** @external {WebGLFramebuffer} https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer */

import { FRAMEBUFFER, COLOR_ATTACHMENT0, RENDERBUFFER } from "./constants.js";
import { Vector } from "../math/Vector.js";

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
	#data;

	/**
	 * Create a framebuffer.
	 * @param {WebGLRenderingContext} gl - The rendering context of the framebuffer.
	 * @param {number} [target=FRAMEBUFFER] - The bind point of the framebuffer.
	 * @param {Vector} [size] - The width and height of the framebuffer. Gets values from data if not set.
	 */
	constructor(gl, target = FRAMEBUFFER, size) {
		/**
		 * The rendering context of the framebuffer.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The bind point of the framebuffer.
		 * @type {number}
		 */
		this.target = target;

		/** @ignore */ this.#size = size;
		/** @ignore */ this.#data = [];

		/**
		 * The WebGL framebuffer that this object represents.
		 * @type {WebGLFramebuffer}
		 */
		this.framebuffer = gl.createFramebuffer();
	}

	/**
	 * The width and height of the framebuffer. Gets values from data if not set.
	 * @type {Vector}
	 */
	get size() {
		return this.#size ?? new Vector(
			this.data?.size?.x ?? this.data?.data?.width ?? 0,
			this.data?.size?.y ?? this.data?.data?.height ?? 0);
	}

	/**
	 * The width and height of the framebuffer. Gets values from data if not set.
	 * @type {Vector}
	 */
	set size(value) {
		this.#size = new Vector(...(value ?? []));
	}

	/**
	 * The data attached to the framebuffer. Note that this returns a copy of the array, so modifying this value will not affect the framebuffer.
	 * @type {Texture[]|Renderbuffer[]}
	 */
	get data() {
		return [...this.#data];
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

		this.#data.push(data);
	}
}