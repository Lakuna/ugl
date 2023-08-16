/** An error resulting from a shader failing to compile. */
export default class ShaderCompileError extends Error {
	/**
	 * Creates an error resulting from a shader failing to compile.
	 * @param message The message of the error.
	 */
	public constructor(message = "The shader failed to compile.") {
		super(message);
		this.name = "ShaderCompileError";
	}
}
