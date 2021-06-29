export class Attribute {
	constructor(gl, program, index) {
		const activeInfo = gl.getActiveAttrib(program, index);
		const location = gl.getAttribLocation(program, activeInfo.name);

		Object.assign(this, { gl, program, index, activeInfo, location });
	}
}