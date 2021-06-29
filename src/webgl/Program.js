import { BACK, CCW, LESS, SEPARATE_ATTRIBS, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, TRANSFORM_FEEDBACK_VARYINGS, ONE, SRC_ALPHA,
	ONE_MINUS_SRC_ALPHA, DEPTH_TEST, CULL_FACE, CCW, CW, FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, BOOL, INT, SAMPLER_2D, SAMPLER_CUBE,
	BOOL_VEC2, INT_VEC2, BOOL_VEC3, INT_VEC3, BOOL_VEC4, INT_VEC4, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4 } from "./constants.js";
import { Uniform } from "./Uniform.js";
import { Attribute } from "./Attribute.js";
import { Varying } from "./Varying.js";
import { BlendFunction } from "./BlendFunction.js";

// Can be replaced with a static private variable when Bundlephobia supports it.
let nextProgramId = 0;

export class Program {
	constructor({ renderer, vertexShader, fragmentShader, uniformValues = {}, transparent = false, cullFace = BACK, frontFace = CCW, depthTest = true,
		depthWrite = true, depthFunction = LESS, transformFeedbackVaryingNames = [], transformFeedbackBufferMode = SEPARATE_ATTRIBS } = {}) {
		
		const gl = renderer.gl;

		const program = gl.createProgram();
		[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(program, shader.shader));
		gl.transformFeedbackVaryings(program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program));
		}

		// TODO: Change uniformValues to be more object-oriented.
		Object.assign(this, { gl, renderer, uniforms: new Map(), attributes: new Map(), varyings: new Map(), uniformValues, id: nextProgramId++,
			transparent, cullFace, frontFace, depthTest, depthWrite, depthFunction, /* blendEquation: null, */ program, vertexShader, fragmentShader,
			blendFunction: transparent ? new BlendFunction({ gl, source: renderer.premultipliedAlpha ? ONE : SRC_ALPHA, destination: ONE_MINUS_SRC_ALPHA }) : null });

		// Get uniforms.
		const uniformCount = gl.getProgramParameter(program, ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i++) {
			const uniform = new Uniform(program, i);
			this.uniforms.set(uniform.name, uniform);
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

	applyState() {
		this.renderer.setFeatureEnabled(DEPTH_TEST, this.depthTest);
		this.renderer.setFeatureEnabled(CULL_FACE, !!this.cullFace);
		this.renderer.setFeatureEnabled(BLEND, !!this.blendFunction);

		if (this.cullFace) { this.renderer.cullFace = this.cullFace; };
		this.renderer.frontFace = this.frontFace;
		this.renderer.depthMask = this.depthWrite;
		this.renderer.depthFunction = this.depthFunction;
		if (this.blendFunction) { this.renderer.blendFunction = this.blendFunction; }
		this.renderer.blendEquation = this.blendEquation;
	}

	use(flipFaces = false) {
		// This can be a private method once Bundlephobia supports them.
		const setUniform = (type, location, value) => {
			// Flatten the value.
			// TODO: Can be compressed with optional chaining once Bundlephobia supports it.
			if (value.length && value[0].length) {
				const temp = new Float32Array(value.length * value[0].length);
				for (let i = 0; i < value.length; i++) { temp.set(value[i], i * value[0].length); }
				value = temp;
			}

			switch(type) {
				case FLOAT:			return value.length ? this.gl.uniform1fv(location, value) : this.gl.uniform1f(location, value);
				case FLOAT_VEC2:	return this.gl.uniform2fv(location, value);
				case FLOAT_VEC3:	return this.gl.uniform3fv(location, value);
				case FLOAT_VEC4:	return this.gl.uniform4fv(location, value);
				case BOOL:
				case INT:
				case SAMPLER_2D:
				case SAMPLER_CUBE:	return value.length ? this.gl.uniform1iv(location, value) : this.gl.uniform1i(location, value);
				case BOOL_VEC2:
				case INT_VEC2:		return this.gl.uniform2iv(location, value);
				case BOOL_VEC3:
				case INT_VEC3:		return this.gl.uniform3iv(location, value);
				case BOOL_VEC4:
				case INT_VEC4:		return this.gl.uniform4iv(location, value);
				case FLOAT_MAT2:	return this.gl.uniformMatrix2fv(location, false, value);
				case FLOAT_MAT3:	return this.gl.uniformMatrix3fv(location, false, value);
				case FLOAT_MAT4:	return this.gl.uniformMatrix4fv(location, false, value);
			}
		};

		let textureUnit = -1;

		this.gl.useProgram(this.program);
		this.renderer.currentProgram = this.id;

		// Set uniforms from values.
		this.uniforms.values().forEach((uniform) => {
			// Get supplied value.
			let name = uniform.name;
			let value = this.uniformValues[uniform.name];

			// For structs, get the specific property instead of the entire object.
			if (uniform.isStruct) {
				name += `.${uniform.structProperty}`;
				value = value[uniform.structProperty];
			}
			if (uniform.isStructArray) {
				name += `[${uniform.structIndex}].${uniform.structProperty}`;
				value = value[uniform.structIndex][uniform.structProperty];
			}

			// Can be minified with optional chaining and a nullish coalescing operator once Bundlephobia supports them.
			if (!value) {
				throw new Error(`Uniform ${name} was not supplied.`);
			}
			if (value.value == undefined) {
				throw new Error(`Uniform ${name} has no value.`);
			}

			// Textures.
			if (value.value.texture) {
				textureUnit++;

				value.value.update(textureUnit);
				return setUniform(uniform.activeInfo.type, uniform.location, textureUnit);
			}

			// Texture arrays.
			if (value.value.length && uniform.value[0].texture) {
				const textureUnits = [];
				value.value.forEach((value) => {
					textureUnit++;
					value.update(textureUnit);
					textureUnits.push(textureUnit);
				});
				return setUniform(uniform.activeInfo.type, uniform.location, textureUnit);
			}

			// Other uniforms.
			return setUniform(uniform.activeInfo.type, uniform.location, uniform.value);
		});

		this.applyState();
		if (flipFaces) { this.renderer.setFrontFace(this.frontFace == CCW ? CW : CCW); }
	}
}