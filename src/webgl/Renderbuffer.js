/** @external {WebGLRenderbuffer} https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer */

import { RENDERBUFFER, DEPTH_COMPONENT16 } from "./constants.js";
import { Vector } from "../math/Vector.js";

/** Class representing a WebGL renderbuffer. */
export class Renderbuffer {
	/**
	 * Create a renderbuffer.
	 * @param {WebGLRenderingContext} gl - The rendering context of the renderbuffer.
	 * @param {number} [format=DEPTH_COMPONENT16] - The format of the renderbuffer.
	 * @param {Vector} [size=new Vector()] - The width and height of the renderbuffer.
	 */
	constructor(gl, format = DEPTH_COMPONENT16, size = new Vector()) {
		/**
		 * The rendering context of the renderbuffer.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The renderbuffer that this object wraps.
		 * @type {WebGLRenderbuffer}
		 */
		this.renderbuffer = gl.createRenderbuffer();

		/**
		 * The format of the renderbuffer.
		 * @type {number}
		 */
		this.format = format;

		/**
		 * The size of the renderbuffer.
		 * @type {Vector}
		 */
		this.size = size;

		this.bind();
		gl.renderbufferStorage(RENDERBUFFER, format, size.x, size.y);
	}

	/** Binds this renderbuffer. */
	bind() {
		this.gl.bindRenderbuffer(RENDERBUFFER, this.renderbuffer);
	}
}