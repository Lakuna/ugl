/** A type of error that is thrown when an operation is attempted on a WebGL rendering context which has been lost. */
export class ContextLostError extends Error {
	constructor(message = "The rendering context has been lost.") {
		super(message);
		this.name = "ContextLostError";
	}
}