import BufferUsage from "../constants/BufferUsage.js";

/**
 * Determine whether or not the given buffer usage pattern is readable.
 * @param usage - The buffer usage pattern.
 * @returns Whether or not the given buffer usage pattern is readable.
 * @public
 */
export default function isReadable(usage: BufferUsage): boolean {
	return (
		usage === BufferUsage.DYNAMIC_READ ||
		usage === BufferUsage.STATIC_READ ||
		usage === BufferUsage.STREAM_READ
	);
}
