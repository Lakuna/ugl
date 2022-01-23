/**
 * Clamps a number to a range.
 * @param i - The number.
 * @param min - The minimum value to clamp to.
 * @param max - The maximum value to clamp to.
 * @returns The number, clamped to the range.
 */
export function clamp(i: number, min: number, max: number): number {
	return Math.min(Math.max(i, min), max);
}