import { COMPILE_STATUS } from "./constants.js";

export class Shader {
	constructor(gl, type, source) {
		Object.defineProperties(this, {
			gl: { value: gl },
			type: { value: type },
			source: { value: source },
			shader: { value: gl.createShader(type) }
		});
		
		gl.shaderSource(this.shader, source);
		gl.compileShader(this.shader);

		if (!gl.getShaderParameter(this.shader, COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(this.shader));
		}
	}
}