/** A type of error that is thrown when an operation is unsupported by the environment. */
export class UnsupportedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnsupportedError";
	}
}