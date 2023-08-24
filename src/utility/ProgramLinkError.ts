/**
 * An error that occurs when attempting to link two shaders into a shader
 * program.
 */
export default class ProgramLinkError extends Error {
	/**
	 * Creates a program link error.
	 * @param message The message of the error.
	 */
	public constructor(message = "Failed to link the shader program.") {
		super(message);
		this.name = "ProgramLinkError";
	}
}
