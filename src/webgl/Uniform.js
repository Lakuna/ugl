export class Uniform {
	constructor(gl, program, index) {
		const activeInfo = gl.getActiveUniform(program, index);
		const location = gl.getUniformLocation(program, activeInfo.name);

		// Split name to separate array and struct declarations.
		// Implementation by the authors of OGL.
		const split = activeInfo.name.match(/(\w+)/g);
		const name = split[0];
		let isStructArray;
		let structIndex;
		let structProperty;
		let isStruct;
		if (split.length == 3) {
			isStructArray = true;
			structIndex = Number(split[1]);
			structProperty = split[2];
		} else if (split.length == 2 && isNaN(Number(split[1]))) {
			isStruct = true;
			structProperty = split[1];
		}

		Object.assign(this, { gl, program, index, activeInfo, location, name,
			isStructArray, structIndex, structProperty, isStruct });
	}
}