import { FLOAT } from "./constants.js";

/** Class containing information about a WebGL attribute. */
export class Attribute {
	/**
	 * Create an attribute.
	 * @param {string} name - The name of the attribute in a WebGL program.
	 * @param {Buffer} buffer - The buffer which supplies data to this attribute.
	 * @param {number} [size=3] - The number of elements to pull from the buffer on each pull.
	 * @param {number} [type=FLOAT] - The type of data in the buffer.
	 * @param {boolean} [normalized=false] - Whether to normalize the data after pulling it from the buffer.
	 * @param {number} [stride=0] - The number of elements to move forward on each pull from the buffer. Automatically calculated if set to 0 (assuming tightly-packed data).
	 * @param {number} [offset=0] - The number of elements to skip when starting to pull data from the buffer.
	 */
	constructor(name, buffer, size = 3, type = FLOAT, normalized = false, stride = 0, offset = 0) {
		/**
		 * The name of the attribute in a WebGL program.
		 * @type {string}
		 */
		this.name = name;

		/**
		 * The buffer which supplies data to this attribute.
		 * @type {Buffer}
		 */
		this.buffer = buffer;

		/**
		 * The number of elements to pull from the buffer on each pull.
		 * @type {number}
		 */
		this.size = size;

		/**
		 * The type of data in the buffer.
		 * @type {number}
		 */
		this.type = type;

		/**
		 * Whether to normalize the data after pulling it from the buffer.
		 * @type {boolean}
		 */
		this.normalized = normalized;

		/**
		 * The number of elements to move forward on each pull from the buffer. Automatically calculated if set to 0 (assuming tightly-packed data).
		 * @type {number}
		 */
		this.stride = stride;

		/**
		 * The number of elements to skip when starting to pull data from the buffer.
		 * @type {number}
		 */
		this.offset = offset;

		/**
		 * The rendering context of the attribute.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = buffer.gl;
	}

	/**
	 * Uses this attribute in a program.
	 * @param {Program} program - The program which will utilize this attribute.
	 */
	use(program) {
		program.attributes.get(this.name).value = this;
	}
}