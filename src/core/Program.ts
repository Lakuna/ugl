import {
	ACTIVE_ATTRIBUTES,
	ACTIVE_UNIFORMS,
	CURRENT_PROGRAM,
	DELETE_STATUS,
	LINK_STATUS,
	TRANSFORM_FEEDBACK_VARYINGS,
	VALIDATE_STATUS
} from "#constants";
import type Attribute from "#Attribute";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import ProgramLinkError from "#ProgramLinkError";
import Shader from "#Shader";
import ShaderType from "#ShaderType";
import TransformFeedbackBufferMode from "#TransformFeedbackBufferMode";
import type Uniform from "#Uniform";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Varying from "#Varying";
import createAttribute from "#createAttribute";
import createUniform from "#createUniform";

/**
 * A WebGL2 shader program.
 * @see [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram)
 */
export default class Program extends ContextDependent {
	/**
	 * The currently-bound program cache.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		WebGLProgram | null
	>;

	/**
	 * Get the program bindings cache.
	 * @returns The program bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Program.bindingsCache ??= new Map());
	}

	/**
	 * Get the currently-bound program.
	 * @param gl - The rendering context.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	public static getBound(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = Program.getBindingsCache();

		// Get the bound program.
		let boundProgram = bindingsCache.get(gl);
		if (typeof boundProgram === "undefined") {
			boundProgram = gl.getParameter(CURRENT_PROGRAM) as WebGLProgram | null;
			bindingsCache.set(gl, boundProgram);
		}
		return boundProgram;
	}

	/**
	 * Bind a program.
	 * @param gl - The rendering context.
	 * @param program - The program.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	public static bindGl(
		gl: WebGL2RenderingContext,
		program: WebGLProgram | null
	) {
		// Do nothing if the binding is already correct.
		if (Program.getBound(gl) === program) {
			return;
		}

		// Bind the program.
		gl.bindVertexArray(program);
		Program.getBindingsCache().set(gl, program);
	}

	/**
	 * Unbind the program that is bound.
	 * @param gl - The rendering context.
	 * @param program - The program to unbind, or `undefined` to unbind any program.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	public static unbindGl(gl: WebGL2RenderingContext, program?: WebGLProgram) {
		// Do nothing if the program is already unbound.
		if (typeof program !== "undefined" && Program.getBound(gl) !== program) {
			return;
		}

		// Unbind the VAO.
		Program.bindGl(gl, null);
	}

	/**
	 * Create a shader program from the given shader source code.
	 * @param context - The rendering context.
	 * @param vertexShaderSource - The vertex shader's source code.
	 * @param fragmentShaderSource - The fragment shader's source code.
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
	 * Create a shader program.
	 * @param context - The rendering context.
	 * @param vertexShader - The vertex shader.
	 * @param fragmentShader - The fragment shader.
	 * @param attributeLocations - A map of attribute names to their desired locations.
	 * @param feedbackVaryings - The names of the varyings that should be tracked for transform feedback.
	 * @param feedbackMode - The mode to use when capturing transform feedback varyings.
	 * @see [`createProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram)
	 * @see [`attachShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/attachShader)
	 * @see [`bindAttribLocation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindAttribLocation)
	 * @see [`linkProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram)
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link ProgramLinkError}
	 */
	public constructor(
		context: Context,
		vertexShader: Shader,
		fragmentShader: Shader,
		attributeLocations?: Map<string, number>,
		feedbackVaryings: Iterable<string> = [],
		feedbackMode = TransformFeedbackBufferMode.SEPARATE_ATTRIBS
	) {
		if (vertexShader.gl !== fragmentShader.gl) {
			throw new ProgramLinkError(
				"The shaders in a program cannot have different contexts."
			);
		}
		if (vertexShader.type !== ShaderType.VERTEX_SHADER) {
			throw new ProgramLinkError(
				"A vertex shader is required to make a program."
			);
		}
		if (fragmentShader.type !== ShaderType.FRAGMENT_SHADER) {
			throw new ProgramLinkError(
				"A fragment shader is required to make a program."
			);
		}

		super(context);

		// Create the shader program.
		const program = this.gl.createProgram();
		if (program === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = program;

		// Attach the vertex shader.
		this.gl.attachShader(program, vertexShader.internal);
		this.vertexShader = vertexShader;

		// Attach the fragment shader.
		this.gl.attachShader(program, fragmentShader.internal);
		this.fragmentShader = fragmentShader;

		// Bind the attributes to their specified locations, if any.
		if (typeof attributeLocations !== "undefined") {
			for (const [name, location] of attributeLocations) {
				this.gl.bindAttribLocation(program, location, name);
			}
		}

		// Specify the transform feedback varying names, if any.
		this.gl.transformFeedbackVaryings(program, feedbackVaryings, feedbackMode);

		// Link the shader program.
		this.gl.linkProgram(program);
		if (!this.linkStatus) {
			throw new ProgramLinkError(this.infoLog ?? void 0);
		}

		// Create wrappers for every uniform.
		const uniforms = new Map<string, Uniform>();
		const uniformCount = this.gl.getProgramParameter(
			program,
			ACTIVE_UNIFORMS
		) as number;
		for (let i = 0; i < uniformCount; i++) {
			const uniform = createUniform(this, i);
			uniforms.set(uniform.name, uniform);
		}
		this.uniforms = uniforms;

		// Create wrappers for every attribute.
		const attributes = new Map<string, Attribute>();
		const attributeCount = this.gl.getProgramParameter(
			program,
			ACTIVE_ATTRIBUTES
		) as number;
		for (let i = 0; i < attributeCount; i++) {
			const attribute = createAttribute(this, i);
			attributes.set(attribute.name, attribute);
		}
		this.attributes = attributes;

		// Create wrappers for every transform feedback varying.
		const varyings = new Map<string, Varying>();
		const varyingCount = this.gl.getProgramParameter(
			program,
			TRANSFORM_FEEDBACK_VARYINGS
		) as number;
		for (let i = 0; i < varyingCount; i++) {
			const varying = new Varying(this, i);
			varyings.set(varying.name, varying);
		}
		this.varyings = varyings;
	}

	/**
	 * The API interface of this shader program.
	 * @see [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram)
	 * @internal
	 */
	public readonly internal;

	/** The vertex shader of this shader program. */
	public readonly vertexShader;

	/** The fragment shader of this shader program. */
	public readonly fragmentShader;

	/** The uniforms in this shader program. */
	public readonly uniforms;

	/** The attributes in this shader program. */
	public readonly attributes;

	/** The transform feedback varyings in this shader program. */
	public readonly varyings;

	/** Get the linking status of this shader program. */
	public get linkStatus() {
		return this.gl.getProgramParameter(this.internal, LINK_STATUS) as boolean;
	}

	/** Get the deletion status of this shader program. */
	public get deleteStatus() {
		return this.gl.getProgramParameter(this.internal, DELETE_STATUS) as boolean;
	}

	/** Get the validation status of this shader program. */
	public get validateStatus() {
		return this.gl.getProgramParameter(
			this.internal,
			VALIDATE_STATUS
		) as boolean;
	}

	/**
	 * Get the information log of this shader program.
	 * @see [`getProgramInfoLog`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog)
	 */
	public get infoLog() {
		return this.gl.getProgramInfoLog(this.internal);
	}

	/**
	 * Delete this shader program.
	 * @see [`deleteProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteProgram)
	 */
	public delete() {
		this.gl.deleteProgram(this.internal);
	}

	/**
	 * Bind this program.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	public bind() {
		Program.bindGl(this.gl, this.internal);
	}

	/**
	 * Unbind this program.
	 * @see [`useProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram)
	 * @internal
	 */
	public unbind() {
		Program.unbindGl(this.gl, this.internal);
	}
}
