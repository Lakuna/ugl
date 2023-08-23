import type Context from "#Context";
import type ShaderType from "#ShaderType";
import UnsupportedOperationError from "#UnsupportedOperationError";
import ShaderCompileError from "#ShaderCompileError";
import { DELETE_STATUS, COMPILE_STATUS } from "#constants";

/**
 * A function which runs on the GPU.
 * @see [Shaders](https://www.lakuna.pw/a/webgl/shaders)
 */
export default class Shader {
	/**
	 * Creates a shader from source code.
	 * @param type The type of the shader.
	 * @param source The source code of the shader.
	 */
	public constructor(context: Context, type: ShaderType, source: string) {
		this.context = context;
		this.type = type;
		this.source = source;

		const shader: WebGLShader | null = context.internal.createShader(type);
		if (!shader) {
			throw new UnsupportedOperationError();
		}
		this.internal = shader;

		context.internal.shaderSource(shader, source);
		context.internal.compileShader(shader);

		if (!this.compileStatus) {
			const message: string = this.infoLog;
			this.delete();
			throw new ShaderCompileError(message);
		}
	}

	/** The rendering context of this shader. */
	public readonly context: Context;

	/** The type of this shader. */
	public readonly type: ShaderType;

	/** The source code of this shader. */
	public readonly source: string;

	/** The WebGL API interface of this shader. */
	public readonly internal: WebGLShader;

	/** Whether this shader is flagged for deletion. */
	public get deleteStatus(): boolean {
		return this.context.internal.getShaderParameter(
			this.internal,
			DELETE_STATUS
		);
	}

	/** Whether the last shader compilation was successful. */
	public get compileStatus(): boolean {
		return this.context.internal.getShaderParameter(
			this.internal,
			COMPILE_STATUS
		);
	}

	/** The information log for this shader. */
	public get infoLog(): string {
		return this.context.internal.getShaderInfoLog(this.internal) ?? "";
	}

	/** Deletes this shader. */
	public delete(): void {
		this.context.internal.deleteShader(this.internal);
	}
}
