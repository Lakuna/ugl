import type ErrorCode from "../constants/ErrorCode.js";
import getErrorCodeMessage from "./internal/getErrorCodeMessage.js";

/**
 * A WebGL error.
 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
 */
export default class WebglError extends Error {
	/**
	 * Creates a WebGL error.
	 * @param value - The code or message of the error.
	 * @internal
	 */
	public constructor(
		value: ErrorCode | string = "A WebGL error has occurred."
	) {
		super(typeof value === "string" ? value : getErrorCodeMessage(value));
		this.name = "WebglError";
	}
}
