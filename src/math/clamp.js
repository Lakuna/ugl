/**
 * Clamps a number to a range.
 * @param {number} number - The number to clamp.
 * @param {number} min - The lower end of the range.
 * @param {number} max - The upper end of the range.
 * @return {number} The number clamped to the range.
 */
export const clamp = (number, min, max) => Math.min(Math.max(number, min), max);