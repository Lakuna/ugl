/**
 * An error resulting from attempting to create more than one `Context` for a single canvas.
 * @public
 */
export default class DuplicateContextError extends Error {
	/**
	 * Creates a duplicate context error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(message = "Attempted to create a duplicate context.") {
		super(message);
		this.name = "DuplicateContextError";
	}
}
