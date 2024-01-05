import ErrorCode from "#ErrorCode";

/**
 * Gets the message for an error code.
 * @param code The error code.
 * @returns The message.
 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
 * @internal
 */
export default function getErrorCodeMessage(code: ErrorCode): string {
	switch (code) {
		case ErrorCode.CONTEXT_LOST_WEBGL:
			return "The context is lost.";
		case ErrorCode.INVALID_ENUM:
			return "An unacceptable value has been specified for an enumerated argument.";
		case ErrorCode.INVALID_FRAMEBUFFER_OPERATION:
			return "The currently-bound framebuffer is not framebuffer complete.";
		case ErrorCode.INVALID_OPERATION:
			return "The specified command is not allowed for the current state.";
		case ErrorCode.INVALID_VALUE:
			return "A numeric argument is out of range.";
		case ErrorCode.NO_ERROR:
			return "No error has been recorded.";
		case ErrorCode.OUT_OF_MEMORY:
			return "Not enough memory is left to execute the command.";
	}
}
