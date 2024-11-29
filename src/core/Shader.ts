import { COMPILE_STATUS } from "../constants/constants.js";
import type Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import ShaderCompileError from "../utility/ShaderCompileError.js";
import type ShaderType from "../constants/ShaderType.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";

/**
 * A WebGL2 shader.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader | WebGLShader}
 * @public
 */
export default class Shader extends ContextDependent {
	/**
	 * Create a shader.
	 * @param context - The rendering context.
	 * @param type - The type.
	 * @param source - The source code.
	 * @throws {@link UnsupportedOperationError} if a shader cannot be created.
	 * @throws {@link ShaderCompileError} if the shader fails to compile.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader | createShader}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource | shaderSource}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader | compileShader}
	 */
	public constructor(context: Context, type: ShaderType, source: string) {
		super(context);

		const shader = this.gl.createShader(type);
		if (!shader) {
			throw new UnsupportedOperationError(
				"The environment does not support shaders."
			);
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader | WebGLShader}
	 * @internal
	 */
	public readonly internal;

	/** The type of this shader. */
	public readonly type: ShaderType;

	/** The source code of this shader. */
	public readonly source: string;

	/** The compilation status of this shader. */
	public get compileStatus() {
		return this.gl.getShaderParameter(this.internal, COMPILE_STATUS) as boolean;
	}

	/**
	 * The information log of this shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog | getShaderInfoLog}
	 */
	public get infoLog(): string | null {
		return this.gl.getShaderInfoLog(this.internal);
	}

	/**
	 * Delete this shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader | deleteShader}
	 */
	public delete(): void {
		this.gl.deleteShader(this.internal);
	}
}
