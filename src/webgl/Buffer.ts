import { Matrix, Vector, WebGLConstant } from "../index";

/** Data that can be stored in a buffer. */
export type BufferData = number[] | Vector[] | Matrix[] | ArrayBuffer | ArrayBufferView | BufferSource;

/** Bind targets for buffers. */
export enum BufferTarget {
	ARRAY_BUFFER = WebGLConstant.ARRAY_BUFFER,
	ELEMENT_ARRAY_BUFFER = WebGLConstant.ELEMENT_ARRAY_BUFFER,
	COPY_READ_BUFFER = WebGLConstant.COPY_READ_BUFFER,
	COPY_WRITE_BUFFER = WebGLConstant.COPY_WRITE_BUFFER,
	TRANSFORM_FEEDBACK_BUFFER = WebGLConstant.TRANSFORM_FEEDBACK_BUFFER,
	UNIFORM_BUFFER = WebGLConstant.UNIFORM_BUFFER,
	PIXEL_PACK_BUFFER = WebGLConstant.PIXEL_PACK_BUFFER,
	PIXEL_UNPACK_BUFFER = WebGLConstant.PIXEL_UNPACK_BUFFER
}

/** Usage modes for buffers. */
export enum BufferMode {
	STATIC_DRAW = WebGLConstant.STATIC_DRAW,
	DYNAMIC_DRAW = WebGLConstant.DYNAMIC_DRAW,
	STREAM_DRAW = WebGLConstant.STREAM_DRAW,
	STATIC_READ = WebGLConstant.STATIC_READ,
	DYNAMIC_READ = WebGLConstant.DYNAMIC_READ,
	STREAM_READ = WebGLConstant.STREAM_READ,
	STATIC_COPY = WebGLConstant.STATIC_COPY,
	DYNAMIC_COPY = WebGLConstant.DYNAMIC_COPY,
	STREAM_COPY = WebGLConstant.STREAM_COPY
}

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
		this.buffer = gl.createBuffer();
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