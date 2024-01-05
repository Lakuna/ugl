/**
 * WebGL error codes.
 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
 */
enum ErrorCode {
	/** No error has been recorded. */
	NO_ERROR = 0,

	/** An unacceptable value has been specified for an enumerated argument. */
	INVALID_ENUM = 0x0500,

	/** A numeric argument is out of range. */
	INVALID_VALUE = 0x0501,

	/** The specified command is not allowed for the current state. */
	INVALID_OPERATION = 0x0502,

	/** The currently-bound framebuffer is not framebuffer complete. */
	INVALID_FRAMEBUFFER_OPERATION = 0x0506,

	/** Not enough memory is left to execute the command. */
	OUT_OF_MEMORY = 0x0505,

	/** The context is lost. */
	CONTEXT_LOST_WEBGL = 0x9242
}

export default ErrorCode;
