import { BACK, CCW, LESS, SEPARATE_ATTRIBS, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, TRANSFORM_FEEDBACK_VARYINGS } from "./constants.js";

// Can be replaced with a static private variable when Bundlephobia supports it.
let nextProgramId = 0;

export class Program {
	constructor({ gl, vertexShader, fragmentShader, uniforms = {}, transparent = false, cullFace = BACK, frontFace = CCW,
		depthTest = true, depthWrite = true, depthFunction = LESS, transformFeedbackVaryingNames = [], transformFeedbackBufferMode = SEPARATE_ATTRIBS } = {}) {
		
		const program = gl.createProgram();
		[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(program, shader.shader));
		gl.transformFeedbackVaryings(program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program));
		}

		Object.assign(this, { gl, uniforms, id: nextProgramId++, transparent, cullFace, frontFace, depthTest,
			depthWrite, depthFunction, blendFunction: {}, blendEquation: {}, program, vertexShader, fragmentShader,
			uniformLocations: new Map(), attributeLocations: new Map(), transformFeedbackVaryings: new Map() });

		// Get uniform locations.
		const uniformCount = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniform = gl.getActiveUniform(program, i);
			this.uniformLocations.set(uniform, gl.getUniformLocation(program, uniform.name));

			// Separate array and struct declarations.
			// Implementation from the developers of OGL.
			const nameParts = uniform.name.match(/(\w+)/g);

			// TODO: Create a Uniform class to hold this data to avoid modifying WebGL variables.

			uniform.uniformName = nameParts[0];

			if (nameParts.length == 3) {
				uniform.isStructArray = true;
				uniform.structIndex = Number(nameParts[1]);
				uniform.structProperty = nameParts[2];
			} else if (nameParts.length == 2 && isNaN(Number(nameParts[1]))) {
				uniform.isStruct = true;
				uniform.structProperty = nameParts[1];
			}
		}

		// Get attribute locations.
		const attributeCount = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
		const locations = []; // Implementation from the developers of OGL.
		for (let i = 0; i < attributeCount; i++) {
			// TODO: Create an Attribute class to hold this data to avoid modifying WebGL variables.

			const attribute = gl.getActiveAttrib(program, i);
			const location = gl.getAttribLocation(program, attribute.name);
			locations[location] = attribute.name;
			this.attributeLocations.set(attribute, location);
		}
		this.attributeOrder = locations.join('');

		// Get varying locations (transform feedback only).
		const varyingCount = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
		for (let i = 0; i < varyingCount; i++) {
			// TODO: Create a Varying class to hold this data to avoid modifying WebGL variables.

			const activeInfo = gl.getTransformFeedbackVarying(program, i);
			this.transformFeedbackVaryings.set(activeInfo.name, activeInfo);
		}
	}
}