import { AttributeType } from "./AttributeType.js";
import { Buffer } from "./Buffer.js";
import { Variable } from "./Variable.js";
import { Program } from "./Program.js";

/** Information about how to access the data in a buffer. */
export class Attribute {
	/**
	 * Creates an attribute.
	 * @param name - The name of the attribute in a WebGL program.
	 * @param buffer - The buffer which supplies data to the attribute.
	 * @param size - The number of elements to pull from the buffer on each pull.
	 * @param type - The type of data stored in the buffer.
	 * @param normalized - Whether to normalize the data after pulling it from the buffer.
	 * @param stride - The number of elements to move forward on each pull from the buffer.
	 * @param offset - The number of elements to skip when starting to pull data from the buffer.
	 */
	constructor(name: string, buffer: Buffer, size = 3, type: AttributeType = AttributeType.FLOAT,
		normalized = false, stride = 0, offset = 0) {
		this.name = name;
		this.buffer = buffer;
		this.size = size;
		this.type = type;
		this.normalized = normalized;
		this.stride = stride;
		this.offset = offset;
		this.gl = buffer.gl;
	}

	/** The name of this attribute in a WebGL program. */
	readonly name: string;

	/** The buffer which supplies data to this attribute. */
	readonly buffer: Buffer;

	/** The number of elements to pull from this buffer on each pull. */
	size: number;

	/** The type of data stored in this buffer. */
	type: AttributeType;

	/** Whether to normalize the data after pulling it from this buffer. */
	normalized: boolean;

	/** The number of elements to move forward on each pull from this buffer. */
	stride: number;

	/** The number of elements to skip when starting to pull data from this buffer. */
	offset: number;

	/** The rendering context of this attribute. */
	readonly gl: WebGL2RenderingContext;

	/**
	 * Uses this attribute in a program.
	 * @param program - The program which will utilize this attribute.
	 */
	use(program: Program): void {
		const attribute: Variable | undefined = program.attributes.get(this.name);
		if (attribute) {
			attribute.value = this;
		}
	}
}