/**
 * A color.
 * @public
 */
export default interface Color {
	/** The red component of the color in the range `[0,1]`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: number;

	/** The green component of the color in the range `[0,1]`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: number;

	/** The blue component of the color in the range `[0,1]`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 2: number;

	/** The alpha component of the color in the range `[0,1]`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 3: number;
}
