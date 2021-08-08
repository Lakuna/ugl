import { Attribute } from "./Attribute.js";
import { Buffer } from "./Buffer.js";
import { ELEMENT_ARRAY_BUFFER, UNSIGNED_BYTE, TRIANGLES } from "./constants.js";

export class VAO {
	constructor(program, attributes, indices) {
		Object.defineProperties(this, {
			program: { value: program },
			attributes: { value: attributes },
			gl: { value: program.gl },
			vao: { value: program.gl.createVertexArray() }
		});

		this.gl.bindVertexArray(this.vao);
		attributes.forEach((attribute) => attribute.use(program));

		if (indices) {
			Object.defineProperty(this, "indices", {
				value: new Attribute(null, new Buffer(this.gl, new Uint8Array(indices), ELEMENT_ARRAY_BUFFER), 1, UNSIGNED_BYTE)
			});
		}
	}

	draw(mode = TRIANGLES, offset = 0) {
		this.gl.bindVertexArray(this.vao);

		if (this.indices) {
			this.gl.drawElements(mode, this.indices.buffer.data.length, this.indices.type, this.indices.offset);
		} else {
			this.gl.drawArrays(mode, offset, this.attributes?.[0].buffer.data.length / this.attributes?.[0].size ?? 0);
		}
	}
}