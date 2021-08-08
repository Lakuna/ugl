import { SEPARATE_ATTRIBS, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, TRANSFORM_FEEDBACK_VARYINGS, SAMPLER_2D, SAMPLER_3D,
	SAMPLER_CUBE, SAMPLER_2D_SHADOW, SAMPLER_2D_ARRAY, SAMPLER_2D_ARRAY_SHADOW, SAMPLER_CUBE_SHADOW, INT_SAMPLER_2D, INT_SAMPLER_3D,
	INT_SAMPLER_CUBE, INT_SAMPLER_2D_ARRAY, UNSIGNED_INT_SAMPLER_2D, UNSIGNED_INT_SAMPLER_3D, UNSIGNED_INT_SAMPLER_CUBE,
	UNSIGNED_INT_SAMPLER_2D_ARRAY } from "./constants.js";
import { Variable } from "./Variable.js";

export class Program {
	constructor(gl, vertexShader, fragmentShader, transformFeedbackVaryingNames = [], transformFeedbackBufferMode = SEPARATE_ATTRIBS) {
		Object.defineProperties(this, {
			gl: { value: gl },
			vertexShader: { value: vertexShader },
			fragmentShader: { value: fragmentShader },
			program: { value: gl.createProgram() },
			uniforms: { value: new Map() },
			attributes: { value: new Map() },
			varyings: { value: new Map() },
			textureUnits: { value: new Map() }
		});

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

	use() {
		this.gl.useProgram(this.program);
	}
}