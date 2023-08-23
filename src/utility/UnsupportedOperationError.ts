/** An error resulting from attempting to use an unsupported function. */
export default class UnsupportedOperationError extends Error {
	/**
	 * Creates an error resulting from attempting to use an unsupported
	 * function.
	 * @param message The message of the error.
	 */
	public constructor(message = "Attempted to use an unsupported function.") {
		super(message);
		this.name = "UnsupportedOperationError";
	}
}
