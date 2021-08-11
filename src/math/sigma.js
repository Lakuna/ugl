/**
 * Performs a summation.
 * @param {number} min - The minimum value of the index of summation.
 * @param {number} max - The maximum value of the index of summation.
 * @param {function<number>} expression - The expression to execute for each index of summation.
 * @param {number} [output=0] - The output value which each expression's result is added to recursively.
 * @return {number} The sum.
 */
export const sigma = (min, max, expression, output = 0) => output += expression(min) + (min < max ? sigma(min + 1, max, expression, output) : 0);