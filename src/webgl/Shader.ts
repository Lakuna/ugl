import type Context from "./Context.js";

/** Types of shaders. */
export const enum ShaderType {
	/** A fragment shader, which calculates a color for each pixel of a primitive. */
	FRAGMENT_SHADER = 0x8B30,

	/** A vertex shader, which calculates a position for each vertex of a primitive. */
	VERTEX_SHADER = 0x8B31
}

/** The deletion status of a shader or shader program. */
export const DELETE_STATUS = 0x8B80;

/** The compilation status of a shader. */
export const COMPILE_STATUS = 0x8B81;

/** A function which runs on the GPU. */
export default class Shader {
	/**
	 * Creates a shader from source code.
	 * @param type The type of the shader.
	 * @param source The source code of the shader.
	 */
	public constructor(gl: Context, type: ShaderType, source: string) {
		this.gl = gl;
		this.type = type;
		this.source = source;

		const shader: WebGLShader | null = gl.gl.createShader(type);
		if (!shader) { throw new Error("Unable to create a shader."); }
		this.shader = shader;

		gl.gl.shaderSource(shader, source);
		gl.gl.compileShader(shader);

		if (!this.compileStatus) {
			console.error(this.infoLog);
			this.delete();
			throw new Error("Shader failed to compile.");
		}
	}

	/** The rendering context of this shader. */
	public readonly gl: Context;

	/** The type of this shader. */
	public readonly type: ShaderType;

	/** The source code of this shader. */
	public readonly source: string;

	/** The WebGL API interface of this shader. */
	public readonly shader: WebGLShader;

	/** Whether this shader is flagged for deletion. */
	public get deleteStatus(): boolean {
		return this.gl.gl.getShaderParameter(this.shader, DELETE_STATUS);
	}

	/** Whether the last shader compilation was successful. */
	public get compileStatus(): boolean {
		return this.gl.gl.getShaderParameter(this.shader, COMPILE_STATUS);
	}

	/** The information log for this shader. */
	public get infoLog(): string {
		return this.gl.gl.getShaderInfoLog(this.shader) ?? "";
	}

	/** Deletes this shader. */
	public delete(): void {
		this.gl.gl.deleteShader(this.shader);
	}
}
