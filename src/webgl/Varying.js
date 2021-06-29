export class Varying {
	constructor(gl, program, index) {
		const activeInfo = gl.getTransformFeedbackVarying(program, index);

		Object.assign(this, { gl, program, index, activeInfo });
	}
}