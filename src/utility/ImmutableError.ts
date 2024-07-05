/** An error resulting from attempting to modify an immutable value. */
export default class ImmutableError extends Error {
	/**
	 * Creates a texture format error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(message = "Attempted to modify an immutable value.") {
		super(message);
		this.name = "ImmutableError";
	}
}
