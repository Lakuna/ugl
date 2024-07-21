import type Vbo from "../core/buffers/Vbo.js";

/**
 * An object that contains information about how to read the data in a buffer.
 * @public
 */
export default interface AttributeValue {
	/** The buffer. */
	readonly buffer: Vbo;

	/** The number of components to read per vertex attribute. Three components are read per vertex attribute if this is not defined.  */
	readonly size?: 1 | 2 | 3 | 4;

	/** Whether or not to normalize the data after getting it from the buffer. The data is not normalized if this is `false` or not defined. */
	readonly normalized?: boolean;

	/** The offset in bytes between the beginnings of consecutive vertex attributes. Must not exceed `0xFF`. The data is treated as being tightly-packed if this is zero or not defined. */
	readonly stride?: number;

	/** The offset in bytes of the first component in the buffer. The data is treated as starting at the beginning of the buffer if this is zero or not defined. */
	readonly offset?: number;
}
