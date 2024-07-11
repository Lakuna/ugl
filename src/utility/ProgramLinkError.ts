/**
 * An error that occurs when attempting to link a shader program.
 * @public
 */
export default class ProgramLinkError extends Error {
	/**
	 * Creates a program link error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(message = "Failed to link the shader program.") {
		super(message);
		this.name = "ProgramLinkError";
	}
}
