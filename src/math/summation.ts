// Internal version to hide the "output" parameter from users.
function summationInternal(min: number, max: number, expression: (i: number) => number, output = 0): number {
	return output += expression(min) + (min < max ? summationInternal(min + 1, max, expression, output) : 0);
}

/**
 * Performs a summation.
 * @param min - The starting value of the index of summation.
 * @param max - The ending value of the index of summation.
 * @param expression - The expression to execute for each index of summation.
 * @returns The result of the summation.
 */
export function summation(min: number, max: number, expression: (i: number) => number): number {
	return summationInternal(min, max, expression);
}