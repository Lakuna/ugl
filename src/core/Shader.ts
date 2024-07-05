import { COMPILE_STATUS } from "#constants";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import ShaderCompileError from "#ShaderCompileError";
import type ShaderType from "#ShaderType";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * A WebGL2 shader.
 * @see [`WebGLShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
 */
export default class Shader extends ContextDependent {
	/**
	 * Create a shader.
	 * @param context - The rendering context.
	 * @param type - The type.
	 * @param source - The source code.
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link ShaderCompileError}
	 * @see [`createShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader)
	 * @see [`shaderSource`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource)
	 * @see [`compileShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader)
	 */
	public constructor(context: Context, type: ShaderType, source: string) {
		super(context);

		const shader = this.gl.createShader(type);
		if (shader === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = shader;
		this.type = type;

		this.gl.shaderSource(shader, source);
		this.source = source;

		this.gl.compileShader(shader);

		if (!this.compileStatus) {
			throw new ShaderCompileError(this.infoLog ?? void 0);
		}
	}

	/**
	 * The API interface of this shader.
	 * @see [`WebGLShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
	 * @internal
	 */
	public readonly internal;

	/** The type of this shader. */
	public readonly type;

	/** The source code of this shader. */
	public readonly source;

	/** Get the compilation status of this shader. */
	public get compileStatus() {
		return this.gl.getShaderParameter(this.internal, COMPILE_STATUS) as boolean;
	}

	/**
	 * Get the information log of this shader.
	 * @see [`getShaderInfoLog`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog)
	 */
	public get infoLog() {
		return this.gl.getShaderInfoLog(this.internal);
	}

	/**
	 * Delete this shader.
	 * @see [`deleteShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader)
	 */
	public delete() {
		this.gl.deleteShader(this.internal);
	}
}
