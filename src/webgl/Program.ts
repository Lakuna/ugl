import { Shader, ShaderType } from "./Shader";
import { Variable, VariableType, VariableValueType } from "./Variable";
import { WebGLConstant } from "./WebGLConstant";

export enum TransformFeedbackMode {
	INTERLEAVED_ATTRIBS = WebGLConstant.INTERLEAVED_ATTRIBS,
	SEPARATE_ATTRIBS = WebGLConstant.SEPARATE_ATTRIBS
}

/** A pair of a vertex shader and a fragment shader which is used to render primitives. */
export class Program {
	static #nextProgramId = 0;

	/**
	 * Creates a shader program from source code.
	 * @param gl - The rendering context of the program.
	 * @param vertexSource - The source code of the vertex shader.
	 * @param fragmentSource - The source code of the fragment shader.
	 * @returns A program.
	 */
	static fromSource(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): Program {
		return new Program(
			new Shader(gl, ShaderType.VERTEX_SHADER, vertexSource),
			new Shader(gl, ShaderType.FRAGMENT_SHADER, fragmentSource));
	}

	/**
	 * Creates a program.
	 * @param vertexShader - The vertex shader.
	 * @param fragmentShader - The fragment shader.
	 * @param transformFeedbackVaryingNames - A list of the names of varyings which will be used for transform feedback.
	 * @param transformFeedbackBufferMode - The mode to use when buffering transform feedback.
	 */
	constructor(vertexShader: Shader, fragmentShader: Shader,
		transformFeedbackVaryingNames: string[] = [],
		transformFeedbackBufferMode: TransformFeedbackMode = TransformFeedbackMode.SEPARATE_ATTRIBS) {
		const gl: WebGL2RenderingContext = vertexShader.gl;

		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;

		this.gl = gl;
		this.id = Program.#nextProgramId++;
		this.allowTransparent = true;
		this.allowDepth = true;

		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader.shader);
		gl.attachShader(this.program, fragmentShader.shader);
		gl.transformFeedbackVaryings(this.program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, WebGLConstant.LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(this.program));
		}

		const uniforms: Map<string, Variable> = new Map();
		const textureUnits: Map<Variable, number> = new Map();
		let nextTextureUnit = 0;
		const uniformCount: number = gl.getProgramParameter(this.program, WebGLConstant.ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniform: Variable = new Variable(this, VariableType.Uniform, i);
			uniforms.set(uniform.name, uniform);

			if ([
				VariableValueType.SAMPLER_2D,
				VariableValueType.SAMPLER_3D,
				VariableValueType.SAMPLER_CUBE,
				VariableValueType.SAMPLER_2D_SHADOW,
				VariableValueType.SAMPLER_2D_ARRAY,
				VariableValueType.SAMPLER_2D_ARRAY_SHADOW,
				VariableValueType.SAMPLER_CUBE_SHADOW,
				VariableValueType.INT_SAMPLER_2D,
				VariableValueType.INT_SAMPLER_3D,
				VariableValueType.INT_SAMPLER_CUBE,
				VariableValueType.INT_SAMPLER_2D_ARRAY,
				VariableValueType.INT_SAMPLER_3D,
				VariableValueType.INT_SAMPLER_CUBE,
				VariableValueType.INT_SAMPLER_2D_ARRAY,
				VariableValueType.UNSIGNED_INT_SAMPLER_2D,
				VariableValueType.UNSIGNED_INT_SAMPLER_3D,
				VariableValueType.UNSIGNED_INT_SAMPLER_CUBE,
				VariableValueType.UNSIGNED_INT_SAMPLER_2D_ARRAY
			].indexOf(uniform.type) != -1) {
				textureUnits.set(uniform, nextTextureUnit);
				nextTextureUnit += uniform.size;
			}
		}
		this.uniforms = uniforms;
		this.textureUnits = textureUnits;

		const attributes: Map<string, Variable> = new Map();
		const attributeCount: number = gl.getProgramParameter(this.program, WebGLConstant.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < attributeCount; i++) {
			const attribute: Variable = new Variable(this, VariableType.Attribute, i);
			attributes.set(attribute.name, attribute);
		}
		this.attributes = attributes;

		const varyings: Map<string, Variable> = new Map();
		const varyingCount: number = gl.getProgramParameter(this.program, WebGLConstant.TRANSFORM_FEEDBACK_VARYINGS);
		for (let i = 0; i < varyingCount; i++) {
			const varying: Variable = new Variable(this, VariableType.Varying, i);
			varyings.set(varying.name, varying);
		}
		this.varyings = varyings;
	}

	/** The rendering context of this program. */
	readonly gl: WebGL2RenderingContext;

	/** The ID of this program. */
	readonly id: number;

	/** The vertex shader of this shader program. */
	readonly vertexShader: Shader;

	/** The fragment shader of this shader program. */
	readonly fragmentShader: Shader;

	/** The shader program used by WebGL that this program represents. */
	readonly program: WebGLProgram;

	/** A map of uniforms to their names for this program. */
	readonly uniforms: ReadonlyMap<string, Variable>

	/** A map of attributes to their names for this program. */
	readonly attributes: ReadonlyMap<string, Variable>

	/** A map of transform feedback varyings to their names for this program. */
	readonly varyings: ReadonlyMap<string, Variable>

	/** A map of sampler uniforms to their texture units for this program. */
	readonly textureUnits: ReadonlyMap<Variable, number>

	/** Whether this program will be used to draw transparent shapes. */
	allowTransparent: boolean;

	/** Whether this program will be used to draw shapes with depth. */
	allowDepth: boolean;

	/** Sets this program as part of the current rendering state. */
	use(): void {
		this.gl.useProgram(this.program);
	}
}