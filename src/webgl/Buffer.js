/** @external {WebGLRenderingContext} https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext */
/** @external {ArrayBufferView} https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView */
/** @external {WebGLBuffer} https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer */

import { ARRAY_BUFFER, STATIC_DRAW } from "./constants.js";

/** Class representing a WebGL buffer. */
export class Buffer {
	#data;

	/**
	 * Create a buffer.
	 * @param {WebGLRenderingContext} gl - The rendering context of the buffer.
	 * @param {number|ArrayBuffer|ArrayBufferView} data - The data to pass into the buffer.
	 * @param {number} [target=ARRAY_BUFFER] - The target of the buffer.
	 * @param {number} [usage=STATIC_DRAW] - The usage mode of the buffer.
	 */
	constructor(gl, data, target = ARRAY_BUFFER, usage = STATIC_DRAW) {
		/**
		 * The rendering context of the buffer.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The target of the buffer.
		 * @type {number}
		 */
		this.target = target;

		/**
		 * The usage mode of the buffer.
		 * @type {number}
		 */
		this.usage = usage;

		/**
		 * The buffer used by WebGL.
		 * @type {WebGLBuffer}
		 */
		this.buffer = gl.createBuffer();

		this.data = data; // Use setter.
	}

	/**
	 * The data to pass into the buffer.
	 * @type {number|ArrayBuffer|ArrayBufferView}
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
	 */
	get data() {
		return this.#data;
	}

	/**
	 * The data to pass into the buffer.
	 * @type {number|ArrayBuffer|ArrayBufferView}
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
	 */
	set data(value) {
		/** @ignore */ this.#data = value;

		this.bind();
		this.gl.bufferData(this.target, this.#data, this.usage);
	}

	/**
	 * Binds the buffer to its target.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
	 */
	bind() {
		this.gl.bindBuffer(this.target, this.buffer);
	}
}