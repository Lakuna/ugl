import type VertexBuffer from "../core/buffers/VertexBuffer.js";

/**
 * An object that contains information about how to write data to a buffer.
 * @public
 */
export default interface VaryingValue {
	/** The vertex buffer object to push components to. */
	readonly vbo: VertexBuffer;

	/** The offset in bytes of the first component in the buffer. */
	readonly offset?: number;

	/** The amount of data that can be read from the buffer.  */
	readonly size?: number;
}
