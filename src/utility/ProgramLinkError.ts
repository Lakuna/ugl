/** An error that occurs when attempting to link a shader program. */
export default class ProgramLinkError extends Error {
	/**
	 * Creates a program link error.
	 * @param message - The message of the error.
	 * @see [`linkProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram)
	 */
	public constructor(message = "Failed to link the shader program.") {
		super(message);
		this.name = "ProgramLinkError";
	}
}
