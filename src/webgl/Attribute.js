export class Attribute {
	constructor(program, index) {
		const activeInfo = program.gl.getActiveAttrib(program, index);
		const location = program.gl.getAttribLocation(program, activeInfo.name);

		Object.assign(this, { program, index, gl: program.gl, activeInfo, location });
	}
}