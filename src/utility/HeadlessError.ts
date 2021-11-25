/** A type of error that is thrown when an operation that requires a DOM is executed in a headless environment. */
export class HeadlessError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "HeadlessError";
	}
}