/**
 * Performs a summation.
 * @param min - The starting value of the index of summation.
 * @param max - The maximum value of the index of summation.
 * @param expression - The expression to execute for each index of summation.
 * @returns The result of the summation.
 */
export function sigma(min: number, max: number, expression: (number: number) => number, output = 0): number {
	return output += expression(min) + (min < max ? sigma(min + 1, max, expression, output) : 0);
}