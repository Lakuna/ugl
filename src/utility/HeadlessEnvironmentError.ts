/**
 * An error resulting from attempting to use a headed function in a headless
 * environment.
 */
export default class HeadlessEnvironmentError extends Error {
	/**
	 * Creates an error resulting from attempting to use a headed function in a
	 * headless environment.
	 * @param message The message of the error.
	 */
	public constructor(
		message = "Attempted to use a headed function in headless environment."
	) {
		super(message);
		this.name = "HeadlessEnvironmentError";
	}
}
