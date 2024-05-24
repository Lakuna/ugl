import type Buffer from "#Buffer";

/** A portion of a buffer starting at byte `offset`. */
export default interface OffsetBuffer {
	/** The buffer. */
	buffer: Buffer;

	/** The offset in bytes. */
	offset: number;

	/** The number of bytes to read. */
	size: number;
}
