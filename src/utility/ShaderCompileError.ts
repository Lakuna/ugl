/**
 * An error that occurs when attempting to compile a shader.
 * @public
 */
export default class ShaderCompileError extends Error {
	/**
	 * Creates a shader compile error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(message = "Failed to compile the shader.") {
		super(message);
		this.name = "ShaderCompileError";
	}
}
