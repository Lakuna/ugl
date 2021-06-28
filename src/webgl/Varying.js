export class Varying {
	constructor(program, index) {
		const activeInfo = program.gl.getTransformFeedbackVarying(program, index);

		Object.assign(this, { program, index, gl: program.gl, activeInfo });
	}
}