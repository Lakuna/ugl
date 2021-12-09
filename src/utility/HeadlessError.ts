/** A type of error that is thrown when an operation that requires a DOM is executed in a headless environment. */
export class HeadlessError extends Error {
	constructor(message = "Operation requires a DOM, but none is available.") {
		super(message);
		this.name = "HeadlessError";
	}
}