/**
 * Restricts a number to a range.
 * @param number - The number to clamp.
 * @param min - The lower bound of the range.
 * @param max - The upper bound of the range.
 * @returns The nearest number to `number` within the range.
 */
export function clamp(number: number, min: number, max: number): number {
	return Math.min(Math.max(number, min), max);
}