/** An error resulting from attempting to use an attribute that doesn't exist. */
export default class UnknownAttributeError extends Error {
	/**
	 * Creates an error resulting from attempting to use an attribute that doesn't exist.
	 * @param message The message of the error.
	 */
	public constructor(message = "Attempted to use an unknown attribute.") {
		super(message);
		this.name = "UnknownAttributeError";
	}
}
