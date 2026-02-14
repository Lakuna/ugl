/**
 * A color mask.
 * @public
 */
export default interface ColorMask {
	/** Whether or not to write to the red component. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 0: boolean;

	/** Whether or not to write to the green component. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 1: boolean;

	/** Whether or not to write to the blue component. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 2: boolean;

	/** Whether or not to write to the alpha component. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly 3: boolean;
}
