/** @external {WebGLProgram} https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram */

import { SEPARATE_ATTRIBS, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, TRANSFORM_FEEDBACK_VARYINGS, SAMPLER_2D, SAMPLER_3D,
	SAMPLER_CUBE, SAMPLER_2D_SHADOW, SAMPLER_2D_ARRAY, SAMPLER_2D_ARRAY_SHADOW, SAMPLER_CUBE_SHADOW, INT_SAMPLER_2D, INT_SAMPLER_3D,
	INT_SAMPLER_CUBE, INT_SAMPLER_2D_ARRAY, UNSIGNED_INT_SAMPLER_2D, UNSIGNED_INT_SAMPLER_3D, UNSIGNED_INT_SAMPLER_CUBE,
	UNSIGNED_INT_SAMPLER_2D_ARRAY, VERTEX_SHADER, FRAGMENT_SHADER } from "./constants.js";
import { Variable } from "./Variable.js";
import { Shader } from "./Shader.js";

/** Class representing a WebGL shader program. */
export class Program {
	static #nextProgramId = 0;

	/**
	 * Create a shader program from vertex shader and fragment shader source code.
	 * @param {WebGLRenderingContext} gl - The rendering context of both shaders and the shader program.
	 * @param {string} vertexSource - The source code of the vertex shader.
	 * @param {string} fragmentSource - The source code of the fragment shader.
	 * @return {Program} A new shader program from the source code supplied.
	 */
	static fromSource(gl, vertexSource, fragmentSource) {
		return new Program(new Shader(gl, VERTEX_SHADER, vertexSource), new Shader(gl, FRAGMENT_SHADER, fragmentSource));
	}

	/**
	 * Create a shader program.
	 * @param {Shader} vertexShader - The vertex shader of the shader program.
	 * @param {Shader} fragmentShader - The fragment shader of the shader program.
	 * @param {string[]} [transformFeedbackVaryingNames=[]] - A list of the names of varyings which will be used for transform feedback.
	 * @param {number} [transformFeedbackBufferMode=SEPARATE_ATTRIBS] - The mode to use when buffering transform feedback.
	 */
	constructor(vertexShader, fragmentShader, transformFeedbackVaryingNames = [], transformFeedbackBufferMode = SEPARATE_ATTRIBS) {
		const gl = vertexShader.gl;

		/**
		 * The rendering context of the shader program.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = gl;

		/**
		 * The vertex shader of the shader program.
		 * @type {Shader}
		 */
		this.vertexShader = vertexShader;

		/**
		 * The fragment shader of the shader program.
		 * @type {Shader}
		 */
		this.fragmentShader = fragmentShader;

		/**
		 * The shader program used by WebGL.
		 * @type {WebGLProgram}
		 */
		this.program = gl.createProgram();

		/**
		 * The ID of this shader program.
		 * @type {number}
		 */
		this.id = Program.#nextProgramId++;

		/**
		 * A map of uniform names to uniform data.
		 * @type {Map<string, Variable>}
		 */
		this.uniforms = new Map();

		/**
		 * A map of attribute names to attribute data.
		 * @type {Map<string, Variable>}
		 */
		this.attributes = new Map();

		/**
		 * A map of varying names to varying data. Only contains varyings which are declared as transform feedback varyings in the constructor.
		 * @type {Map<string, Variable>}
		 */
		this.varyings = new Map();

		/**
		 * A map of sampler uniforms to their texture units.
		 * @type {Map<Variable, number>}
		 */
		this.textureUnits = new Map();

		/**
		 * Whether this program will be used to draw transparent shapes. Rendering is faster if this is set to false.
		 * @type {boolean}
		 */
		this.allowTransparent = true;

		/**
		 * Whether this program will be used to draw shapes with depth. Rendering is faster if this is set to false.
		 * @type {boolean}
		 */
		this.allowDepth = true;

		[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(this.program, shader.shader));
		gl.transformFeedbackVaryings(this.program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
		gl.linkProgram(this.program);

		if (!gl.getProgramParameter(this.program, LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(this.program));
		}

		let nextTextureUnit = 0;
		const uniformCount = gl.getProgramParameter(this.program, ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniform = new Variable(this, Variable.TYPES.UNIFORM, i);
			this.uniforms.set(uniform.name, uniform);

			switch (uniform.type) {
				case SAMPLER_2D:
				case SAMPLER_3D:
				case SAMPLER_CUBE:
				case SAMPLER_2D_SHADOW:
				case SAMPLER_2D_ARRAY:
				case SAMPLER_2D_ARRAY_SHADOW:
				case SAMPLER_CUBE_SHADOW:
				case INT_SAMPLER_2D:
				case INT_SAMPLER_3D:
				case INT_SAMPLER_CUBE:
				case INT_SAMPLER_2D_ARRAY:
				case UNSIGNED_INT_SAMPLER_2D:
				case UNSIGNED_INT_SAMPLER_3D:
				case UNSIGNED_INT_SAMPLER_CUBE:
				case UNSIGNED_INT_SAMPLER_2D_ARRAY:
					this.textureUnits.set(uniform, nextTextureUnit);
					nextTextureUnit += uniform.size;
					break;
			}
		}

		const attributeCount = gl.getProgramParameter(this.program, ACTIVE_ATTRIBUTES);
		for (let i = 0; i < attributeCount; i++) {
			const attribute = new Variable(this, Variable.TYPES.ATTRIBUTE, i);
			this.attributes.set(attribute.name, attribute);
		}

		const varyingCount = gl.getProgramParameter(this.program, TRANSFORM_FEEDBACK_VARYINGS);
		for (let i = 0; i < varyingCount; i++) {
			const varying = new Variable(this, Variable.TYPES.VARYING, i);
			this.varyings.set(varying.name, varying);
		}
	}

	/**
	 * Sets this program as part of the current rendering state.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
	 */
	use() {
		this.gl.useProgram(this.program);
	}
}