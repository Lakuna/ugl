import { COMPILE_STATUS, SHADER_TYPE } from "../constants/constants.js";
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
	 * A map of WebGL shaders to existing `Shaders`. Used by `Program.prototype.getAttachedShaders`.
	 * @internal
	 */
	public static existingShaders = new Map<WebGLShader, Shader>();

	/**
	 * The API interface of this shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader | WebGLShader}
	 * @internal
	 */
	public readonly internal: WebGLShader;

	/**
	 * The type of this shader.
	 * @internal
	 */
	private typeCache?: ShaderType;

	/**
	 * The source code of this shader.
	 * @internal
	 */
	private sourceCache?: string | null;

	/**
	 * Create a shader.
	 * @param context - The rendering context.
	 * @param shader - The raw WebGL API shader object.
	 * @throws {@link UnsupportedOperationError} if a shader cannot be created.
	 * @throws {@link ShaderCompileError} if the shader fails to compile.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader | createShader}
	 * @internal
	 */
	public constructor(context: Context, shader: WebGLShader);

	/**
	 * Create a shader.
	 * @param context - The rendering context.
	 * @param type - The type.
	 * @param source - The source code of the shader. If supplied, the shader will automatically be compiled.
	 * @throws {@link UnsupportedOperationError} if a shader cannot be created.
	 * @throws {@link ShaderCompileError} if the shader fails to compile.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader | createShader}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource | shaderSource}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader | compileShader}
	 */
	public constructor(context: Context, type: ShaderType, source?: string);

	public constructor(
		context: Context,
		type: ShaderType | WebGLShader,
		source?: string
	) {
		super(context);

		if (type instanceof WebGLShader) {
			this.internal = type;
		} else {
			const shader = this.gl.createShader(type);
			if (!shader) {
				throw new UnsupportedOperationError(
					"The environment does not support shaders."
				);
			}

			this.internal = shader;
			this.typeCache = type;

			// Compile the shader only if source code was given.
			if (!source) {
				return;
			}

			this.source = source;
			this.compile();
		}

		Shader.existingShaders.set(this.internal, this);
	}

	/** The type of this shader. */
	public get type(): ShaderType {
		return (this.typeCache ??= this.gl.getShaderParameter(
			this.internal,
			SHADER_TYPE
		));
	}

	/** The compilation status of this shader. */
	public get compileStatus(): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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
	 * The source code of this shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource | shaderSource}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderSource | getShaderSource}
	 */
	public get source(): string {
		return (this.sourceCache ??= this.gl.getShaderSource(this.internal) ?? "");
	}

	public set source(value: string) {
		this.gl.shaderSource(this.internal, value);
		this.sourceCache = value;
	}

	/**
	 * Create a `Shader` or get an existing `Shader` if one already exists for the given `WebGLShader`.
	 * @param context - The rendering context of the new shader if one must be created.
	 * @param shader - The raw WebGL API shader.
	 * @returns The corresponding `Shader`.
	 * @internal
	 */
	public static get(context: Context, shader: WebGLShader): Shader {
		return Shader.existingShaders.get(shader) ?? new Shader(context, shader);
	}

	/**
	 * Compile this shader.
	 * @throws {@link ShaderCompileError} if the shader fails to compile.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader | compileShader}
	 */
	public compile(): void {
		this.gl.compileShader(this.internal);
		if (!this.compileStatus) {
			throw new ShaderCompileError(this.infoLog ?? void 0);
		}
	}

	/**
	 * Delete this shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader | deleteShader}
	 */
	public delete(): void {
		this.gl.deleteShader(this.internal);
	}
}
