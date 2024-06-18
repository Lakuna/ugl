import type ErrorCode from "#ErrorCode";
import getErrorCodeMessage from "#getErrorCodeMessage";

/**
 * A WebGL error.
 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
 */
export default class WebglError extends Error {
	/**
	 * Creates a WebGL error.
	 * @param value - The code or message of the error.
	 */
	public constructor(
		value: ErrorCode | string = "A WebGL error has occurred."
	) {
		super(typeof value === "string" ? value : getErrorCodeMessage(value));
		this.name = "WebglError";
	}
}
