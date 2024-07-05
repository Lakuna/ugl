/** An error that occurs when attempting to use an invalid value for an operation. */
export default class BadValueError extends Error {
	/**
	 * Creates a bad value error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(message = "Attempted to use an invalid value.") {
		super(message);
		this.name = "BadValue";
	}
}
