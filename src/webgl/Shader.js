/** @external {WebGLShader} https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader */

import { COMPILE_STATUS } from "./constants.js";

/** Class representing a WebGL shader. */
export class Shader {
	/**
	 * Create a shader.
	 * @param {WebGLRenderingContext} gl - The rendering context of the shader.
	 * @param {number} type - The type of this shader.
	 * @param {string} source - The source code of this shader.
	 */
	constructor(gl, type, source) {
		/**
		 * The rendering context of the shader.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The type of this shader.
		 * @type {number}
		 */
		this.type = type;

		/**
		 * The source code of this shader.
		 * @type {string}
		 */
		this.source = source;

		/**
		 * The shader used by WebGL.
		 * @type {WebGLShader}
		 */
		this.shader = gl.createShader(type);
		
		gl.shaderSource(this.shader, source);
		gl.compileShader(this.shader);

		if (!gl.getShaderParameter(this.shader, COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(this.shader));
		}
	}
}