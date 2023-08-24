import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import type ShaderType from "#ShaderType";
import UnsupportedOperationError from "#UnsupportedOperationError";
import { COMPILE_STATUS } from "#constants";
import ShaderCompileError from "#ShaderCompileError";

/**
 * A WebGL2 shader.
 * @see [`WebGLShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
 */
export default class Shader extends ContextDependent {
	/**
	 * Creates a shader.
	 * @param context The rendering context.
	 * @param type The type.
	 * @param source The source code.
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link ShaderCompileError}
	 * @see [`createShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader)
	 * @see [`shaderSource`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource)
	 * @see [`compileShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader)
	 */
	public constructor(context: Context, type: ShaderType, source: string) {
		super(context);

		const shader: WebGLShader | null = this.gl.createShader(type);
		if (shader == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = shader;
		this.type = type;

		this.gl.shaderSource(shader, source);
		this.source = source;

		this.gl.compileShader(shader);

		if (!this.compileStatus) {
			throw new ShaderCompileError(this.infoLog ?? undefined);
		}
	}

	/**
	 * The API interface of this shader.
	 * @internal
	 * @see [`WebGLShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
	 */
	protected readonly internal: WebGLShader;

	/** The type of this shader. */
	public readonly type: ShaderType;

	/** The source code of this shader. */
	public readonly source: string;

	/** The compilation status of this shader. */
	public get compileStatus(): boolean {
		return this.gl.getShaderParameter(this.internal, COMPILE_STATUS);
	}

	/**
	 * The information log of this shader.
	 * @see [`getShaderInfoLog`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog)
	 */
	public get infoLog(): string | null {
		return this.gl.getShaderInfoLog(this.internal);
	}
}
