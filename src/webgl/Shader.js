import { COMPILE_STATUS } from "./constants.js";

export class Shader {
	constructor(gl, type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(shader));
		}

		Object.assign(this, { gl, type, source, shader });
	}
}