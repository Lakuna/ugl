import { WebGLConstant } from "./WebGLConstant.js";
import { ShaderType } from "./ShaderType.js";

/** A program that runs on the GPU. */
export class Shader {
	/**
	 * Creates a shader.
	 * @param gl - The rendering context of this shader.
	 * @param type - The type of this shader.
	 * @param source - The source code of this shader.
	 */
	constructor(gl: WebGL2RenderingContext, type: ShaderType, source: string) {
		this.gl = gl;
		this.type = type;
		this.source = source;

		const shader: WebGLShader | null = gl.createShader(type);
		if (shader) {
			this.shader = shader;
		} else {
			throw new Error("Failed to create a WebGL shader.");
		}
		gl.shaderSource(this.shader, source);
		gl.compileShader(this.shader);
		if (!gl.getShaderParameter(this.shader, WebGLConstant.COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(this.shader) ?? "");
		}
	}

	/** The rendering context of this shader. */
	readonly gl: WebGL2RenderingContext;

	/** The type of this shader. */
	readonly type: ShaderType;

	/** The source code of this shader. */
	readonly source: string;

	/** The shader used by WebGL that this shader represents. */
	readonly shader: WebGLShader;
}