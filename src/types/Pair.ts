/**
 * A pair of numbers.
 * @public
 */
export default interface Pair {
	/** The first number in the pair, typically representing the width of a rectangle or the lower end of a range. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: number;

	/** The second number in the pair, typically representing the height of a rectangle or the upper end of a range. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: number;
}
