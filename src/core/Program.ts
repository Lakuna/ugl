import type Context from "#Context";
import Shader from "#Shader";
import ShaderType from "#ShaderType";
import TransformFeedbackBufferMode from "#TransformFeedbackBufferMode";
import ProgramLinkError from "#ProgramLinkError";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type Uniform from "#Uniform";
import type SamplerUniform from "#SamplerUniform";
import {
	ACTIVE_UNIFORMS,
	ACTIVE_ATTRIBUTES,
	TRANSFORM_FEEDBACK_VARYINGS,
	DELETE_STATUS,
	LINK_STATUS,
	VALIDATE_STATUS
} from "#constants";
import Attribute from "#Attribute";
import Varying from "#Varying";
import UniformFactory from "#UniformFactory";
import AttributeFactory from "#AttributeFactory";

/**
 * A vertex shader and a fragment shader which are used together to rasterize
 * primitives.
 * @see [Shaders](https://www.lakuna.pw/a/webgl/shaders)
 */
export default class Program {
	/**
	 * Creates a shader program from source code.
	 * @param context The rendering context of the shader program.
	 * @param vertexShaderSource The source code of the vertex shader.
	 * @param fragmentShaderSource The source code of the fragment shader.
	 * @returns A shader program.
	 */
	public static fromSource(
		context: Context,
		vertexShaderSource: string,
		fragmentShaderSource: string
	): Program {
		return new Program(
			new Shader(context, ShaderType.VERTEX_SHADER, vertexShaderSource),
			new Shader(context, ShaderType.FRAGMENT_SHADER, fragmentShaderSource)
		);
	}

	/**
	 * Creates a shader program.
	 * @param vertexShader The vertex shader.
	 * @param fragmentShader The fragment shader.
	 * @param transformFeedbackVaryingNames The names of the varyings which
	 * should be tracked for transform feedback.
	 * @param transformFeedbackBufferMode The mode to use when capturing
	 * transform feedback varyings.
	 */
	public constructor(
		vertexShader: Shader,
		fragmentShader: Shader,
		transformFeedbackVaryingNames: Array<string> = [],
		transformFeedbackBufferMode = TransformFeedbackBufferMode.SEPARATE_ATTRIBS
	) {
		if (vertexShader.context != fragmentShader.context) {
			throw new ProgramLinkError("The shaders have different contexts.");
		}
		if (vertexShader.type != ShaderType.VERTEX_SHADER) {
			throw new ProgramLinkError("The vertex shader is of the wrong type.");
		}
		if (fragmentShader.type != ShaderType.FRAGMENT_SHADER) {
			throw new ProgramLinkError("The fragment shader is of the wrong type.");
		}

		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
		this.transformFeedbackBufferMode = transformFeedbackBufferMode;

		this.context = vertexShader.context;

		const program: WebGLProgram | null = this.context.internal.createProgram();
		if (!program) {
			throw new UnsupportedOperationError();
		}
		this.internal = program;

		this.context.internal.attachShader(program, vertexShader.internal);
		this.context.internal.attachShader(program, fragmentShader.internal);
		this.context.internal.transformFeedbackVaryings(
			program,
			transformFeedbackVaryingNames,
			transformFeedbackBufferMode
		);
		this.context.internal.linkProgram(program);

		if (!this.linkStatus) {
			const message: string = this.infoLog;
			this.delete();
			throw new ProgramLinkError(message);
		}

		const uniforms: Map<string, Uniform> = new Map();
		let nextTextureUnit = 0;
		const numUniforms: number = this.context.internal.getProgramParameter(
			program,
			ACTIVE_UNIFORMS
		);
		for (let i = 0; i < numUniforms; i++) {
			const uniform: Uniform = UniformFactory.create(this, i, nextTextureUnit);
			uniforms.set(uniform.name, uniform);
			if (typeof (uniform as SamplerUniform).textureUnit == "number") {
				nextTextureUnit++; // Increment texture unit if it gets used.
			}
		}
		this.uniforms = uniforms;

		const attributes: Map<string, Attribute> = new Map();
		const numAttributes: number = this.context.internal.getProgramParameter(
			program,
			ACTIVE_ATTRIBUTES
		);
		for (let i = 0; i < numAttributes; i++) {
			const attribute: Attribute = AttributeFactory.create(this, i);
			attributes.set(attribute.name, attribute);
		}
		this.attributes = attributes;

		const transformFeedbackVaryings: Map<string, Varying> = new Map();
		const numTransformFeedbackVaryings: number =
			this.context.internal.getProgramParameter(
				program,
				TRANSFORM_FEEDBACK_VARYINGS
			);
		for (let i = 0; i < numTransformFeedbackVaryings; i++) {
			const transformFeedbackVarying: Varying = new Varying(this, i);
			transformFeedbackVaryings.set(
				transformFeedbackVarying.name,
				transformFeedbackVarying
			);
		}
		this.varyings = transformFeedbackVaryings;

		this.allowTransparent = true;
		this.allowDepth = true;
	}

	/** The vertex shader of this shader program. */
	public readonly vertexShader: Shader;

	/** The fragment shader of this shader program. */
	public readonly fragmentShader: Shader;

	/**
	 * The mode this program uses when capturing transform feedback varyings.
	 */
	public readonly transformFeedbackBufferMode: TransformFeedbackBufferMode;

	/** The rendering context of this shader program. */
	public readonly context: Context;

	/** The WebGL API interface of this shader program. */
	public readonly internal: WebGLProgram;

	/** A map of uniform names to uniforms. */
	public readonly uniforms: ReadonlyMap<string, Uniform>;

	/** A map of attribute names to attributes. */
	public readonly attributes: ReadonlyMap<string, Attribute>;

	/**
	 * A map of varying names to varyings. Only includes varyings that are used
	 * for transform feedback.
	 */
	public readonly varyings: ReadonlyMap<string, Varying>;

	/**
	 * Whether this program is allowed to draw transparent objects. Used for
	 * optimization only.
	 */
	public allowTransparent: boolean;

	/**
	 * Whether this program is allowed to draw with depth. Used for
	 * optimization only.
	 */
	public allowDepth: boolean;

	/** Whether this program is flagged for deletion. */
	public get deleteStatus(): boolean {
		return this.context.internal.getProgramParameter(
			this.internal,
			DELETE_STATUS
		);
	}

	/** Whether the last link operation was successful. */
	public get linkStatus(): boolean {
		return this.context.internal.getProgramParameter(
			this.internal,
			LINK_STATUS
		);
	}

	/** Whether the last validation operation was successful. */
	public get validateStatus(): boolean {
		return this.context.internal.getProgramParameter(
			this.internal,
			VALIDATE_STATUS
		);
	}

	/** The information log for this shader program. */
	public get infoLog(): string {
		return this.context.internal.getProgramInfoLog(this.internal) ?? "";
	}

	/** Deletes this shader program. */
	public delete(): void {
		this.context.internal.deleteProgram(this.internal);
	}

	/** Sets this as the active shader program. */
	public use(): void {
		this.context.internal.useProgram(this.internal);
	}
}
