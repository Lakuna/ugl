import { BufferMode } from "./BufferMode.js";
import { BufferTarget } from "./BufferTarget.js";
import { BufferData } from "./BufferData.js";

/** A data structure that supplies per-vertex data to the GPU. */
export class Buffer {
	#data: BufferData;

	/**
	 * Creates a buffer.
	 * @param gl - The rendering context of the buffer.
	 * @param data - The data to pass to the buffer.
	 * @param target - The target of the buffer.
	 * @param usage - The usage mode of the buffer.
	 */
	constructor(gl: WebGL2RenderingContext, data: BufferData, target: BufferTarget = BufferTarget.ARRAY_BUFFER,
		usage: BufferMode = BufferMode.STATIC_DRAW) {
		this.gl = gl;
		this.target = target;
		this.usage = usage;
		const buffer = gl.createBuffer();
		if (buffer) {
			this.buffer = buffer;
		} else {
			throw new Error("Failed to create a WebGL buffer.");
		}
		this.#data = [];
		this.data = data;
	}

	/** The data stored in this buffer. */
	get data(): BufferData {
		return this.#data;
	}

	set data(value: BufferData) {
		this.#data = value;

		this.bind();
		this.gl.bufferData(this.target, this.#data as BufferSource, this.usage);
	}

	/** The rendering context of this buffer. */
	readonly gl: WebGL2RenderingContext;

	/** The target of this buffer. */
	target: BufferTarget;

	/** The usage mode of this buffer. */
	usage: BufferMode;

	/** The buffer used by WebGL that this buffer represents. */
	readonly buffer: WebGLBuffer;

	/** Binds this buffer to its target. */
	bind(): void {
		this.gl.bindBuffer(this.target, this.buffer);
	}
}