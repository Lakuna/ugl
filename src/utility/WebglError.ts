import type ErrorCode from "#ErrorCode";
import getErrorCodeMessage from "#getErrorCodeMessage";

/**
 * A WebGL error.
 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
 */
export default class WebglError extends Error {
	/**
	 * Creates a WebGL error.
	 * @param code The code of the error.
	 */
	public constructor(code: ErrorCode);

	/**
	 * Creates a WebGL error.
	 * @param message The message of the error.
	 */
	public constructor(message: string);

	public constructor(
		value: ErrorCode | string = "A WebGL error has occurred."
	) {
		super(typeof value === "string" ? value : getErrorCodeMessage(value));
		this.name = "WebglError";
	}
}
