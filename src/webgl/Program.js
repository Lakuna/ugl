import { BACK, CCW, LESS, SEPARATE_ATTRIBS, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, TRANSFORM_FEEDBACK_VARYINGS } from "./constants.js";
import { Uniform } from "./Uniform.js";
import { Attribute } from "./Attribute.js";
import { Varying } from "./Varying.js";

// Can be replaced with a static private variable when Bundlephobia supports it.
let nextProgramId = 0;

export class Program {
	constructor({ gl, vertexShader, fragmentShader, transparent = false, cullFace = BACK, frontFace = CCW, depthTest = true,
		depthWrite = true, depthFunction = LESS, transformFeedbackVaryingNames = [], transformFeedbackBufferMode = SEPARATE_ATTRIBS } = {}) {
		
		const program = gl.createProgram();
		[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(program, shader.shader));
		gl.transformFeedbackVaryings(program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program));
		}

		Object.assign(this, { gl, uniforms: new Map(), attributes: new Map(), varyings: new Map(), id: nextProgramId++,
			transparent, cullFace, frontFace, depthTest, depthWrite, depthFunction, blendFunction: {}, blendEquation: {},
			program, vertexShader, fragmentShader });

		// Get uniforms.
		const uniformCount = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniform = new Uniform(program, i);
			this.uniforms.set(uniform.activeInfo.name, uniform);
		}

		// Get attributes.
		const attributeCount = gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
		const locations = []; // Implementation from the developers of OGL.
		for (let i = 0; i < attributeCount; i++) {
			const attribute = new Attribute(program, i);
			this.attributes.set(attribute.activeInfo.name, attribute);
			locations[attribute.location] = attribute.activeInfo.name;
		}
		this.attributeOrder = locations.join("");

		// Get varyings (transform feedback only).
		const varyingCount = gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
		for (let i = 0; i < varyingCount; i++) {
			const varying = new Varying(program, i);
			this.varyings.set(varying.activeInfo.name, varying);
		}
	}
}