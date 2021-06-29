export class Uniform {
	constructor(program, index) {
		const activeInfo = program.gl.getActiveUniform(program, index);
		const location = program.gl.getUniformLocation(program, activeInfo.name);

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

		Object.assign(this, { program, index, gl: program.gl, activeInfo, location, name,
			isStructArray, structIndex, structProperty, isStruct });
	}
}