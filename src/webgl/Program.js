import { BACK, CCW, LESS } from "./constants.js";

let nextProgramId = 0;

export class Program {
	constructor({ gl, vertexShader, fragmentShader, uniforms = {}, isTransparent = false, cullFace = BACK,
		frontFace = CCW, doDepthTest = true, doDepthWrite = true, depthFunction = LESS } = {}) {

		Object.assign(this, { gl, vertexShader, fragmentShader, uniforms, isTransparent, cullFace, frontFace,
			doDepthTest, doDepthWrite, depthFunction, id: nextProgramId++, blendFunction: {}, blendEquation: {} });

		// TODO
	}
}