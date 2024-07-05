/** An error resulting from attempting to use a data format or type that is not compatible with a texture format. */
export default class TextureFormatError extends Error {
	/**
	 * Creates a texture format error.
	 * @param message - The message of the error.
	 * @internal
	 */
	public constructor(
		message = "Attempted to use a data format or type that is not compatible with a texture format."
	) {
		super(message);
		this.name = "TextureFormatError";
	}
}
