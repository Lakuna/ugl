import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Shader from "#Shader";
import ShaderType from "#ShaderType";
import ProgramLinkError from "#ProgramLinkError";
import type { DangerousExposedShader } from "#DangerousExposedShader";
import { LINK_STATUS } from "#constants";

/**
 * A WebGL2 shader program.
 * @see [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram)
 */
export default class Program extends ContextDependent {
	/**
	 * Creates a shader program from the given shader source code.
	 * @param context The rendering context.
	 * @param vertexShaderSource The vertex shader's source code.
	 * @param fragmentShaderSource The fragment shader's source code.
	 * @returns The shader program.
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link ProgramLinkError}
	 * @throws {@link ShaderCompileError}
	 */
	public static fromSource(
		context: Context,
		vertexShaderSource: string,
		fragmentShaderSource: string
	) {
		return new Program(
			context,
			new Shader(context, ShaderType.VERTEX_SHADER, vertexShaderSource),
			new Shader(context, ShaderType.FRAGMENT_SHADER, fragmentShaderSource)
		);
	}

	/**
	 * Creates a shader program.
	 * @param context The rendering context.
	 * @param vertexShader The vertex shader.
	 * @param fragmentShader The fragment shader.
	 * @param attributeLocations A map of attribute names to their desired
	 * locations.
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link ProgramLinkError}
	 * @see [`createProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram)
	 * @see [`attachShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/attachShader)
	 * @see [`bindAttribLocation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindAttribLocation)
	 * @see [`linkProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram)
	 */
	public constructor(
		context: Context,
		vertexShader: Shader,
		fragmentShader: Shader,
		attributeLocations?: Map<string, number>
	) {
		super(context);

		const program: WebGLProgram | null = this.gl.createProgram();
		if (program === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = program;

		this.gl.attachShader(
			program,
			(vertexShader as DangerousExposedShader).internal
		);
		this.vertexShader = vertexShader;

		this.gl.attachShader(
			program,
			(fragmentShader as DangerousExposedShader).internal
		);
		this.fragmentShader = fragmentShader;

		if (typeof attributeLocations !== "undefined") {
			for (const [name, location] of attributeLocations) {
				this.gl.bindAttribLocation(program, location, name);
			}
		}

		this.gl.linkProgram(program);

		if (!this.linkStatus) {
			throw new ProgramLinkError(this.infoLog ?? undefined);
		}
	}

	/**
	 * The API interface of this shader program.
	 * @see [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram)
	 * @internal
	 */
	protected readonly internal: WebGLProgram;

	/** The vertex shader of this shader program. */
	public readonly vertexShader: Shader;

	/** The fragment shader of this shader program. */
	public readonly fragmentShader: Shader;

	/** The linking status of this shader program. */
	public get linkStatus(): boolean {
		return this.gl.getProgramParameter(this.internal, LINK_STATUS) as boolean;
	}

	/**
	 * The information log of this shader program.
	 * @see [`getProgramInfoLog`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog)
	 */
	public get infoLog(): string | null {
		return this.gl.getProgramInfoLog(this.internal);
	}

	/**
	 * Deletes this shader program.
	 * @see [`deleteProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteProgram)
	 */
	public delete(): void {
		this.gl.deleteProgram(this.internal);
	}
}
