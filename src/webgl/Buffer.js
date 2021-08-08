import { ARRAY_BUFFER, STATIC_DRAW } from "./constants.js";

export class Buffer {
	#data;

	constructor(gl, data, target = ARRAY_BUFFER, usage = STATIC_DRAW) {
		Object.defineProperties(this, {
			gl: { value: gl },
			target: { value: target, writable: true },
			usage: { value: usage, writable: true },
			buffer: { value: gl.createBuffer() }
		});

		this.data = data; // Use setter.
	}

	get data() {
		return this.#data;
	}

	set data(value) {
		this.#data = value;

		this.bind();
		this.gl.bufferData(this.target, this.#data, this.usage);
	}

	bind() {
		this.gl.bindBuffer(this.target, this.buffer);
	}
}