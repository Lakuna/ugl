/**
 * A color.
 * @public
 */
export default interface Color {
	/** The red component of the color in the range `[0,1]`. */
	0: number;

	/** The green component of the color in the range `[0,1]`. */
	1: number;

	/** The blue component of the color in the range `[0,1]`. */
	2: number;

	/** The alpha component of the color in the range `[0,1]`. */
	3: number;
}
