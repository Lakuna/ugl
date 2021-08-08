import { FLOAT } from "./constants.js";

export class Attribute {
	constructor(name, buffer, size = 3, type = FLOAT, normalized = false, stride = 0, offset = 0) {
		Object.defineProperties(this, {
			name: { value: name },
			buffer: { value: buffer },
			size: { value: size },
			type: { value: type },
			normalized: { value: normalized },
			stride: { value: stride },
			offset: { value: offset },
			gl: { value: buffer.gl }
		});
	}

	use(program) {
		program.attributes.get(this.name).value = this;
	}
}