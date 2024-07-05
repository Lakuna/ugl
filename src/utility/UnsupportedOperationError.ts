/** An error resulting from attempting to use a feature that is not supported by the current environment. */
export default class UnsupportedOperationError extends Error {
	/**
	 * Creates an unsupported operation error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(
		message = "Attempted to use a feature that is not supported by the current environment."
	) {
		super(message);
		this.name = "UnsupportedOperationError";
	}
}
