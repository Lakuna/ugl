/** An error resulting from attempting to use a buffer with the wrong target. */
export default class BufferTargetError extends Error {
	/**
	 * Creates an error resulting from attempting to use a buffer with the wrong target.
	 * @param message The message of the error.
	 */
	public constructor(
		message = "Attempted to use a buffer with the wrong target."
	) {
		super(message);
		this.name = "BufferTargetError";
	}
}
