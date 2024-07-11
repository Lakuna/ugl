/**
 * A color mask.
 * @public
 */
export default interface ColorMask {
	/** Whether or not to write to the red component. */
	0: boolean;

	/** Whether or not to write to the green component. */
	1: boolean;

	/** Whether or not to write to the blue component. */
	2: boolean;

	/** Whether or not to write to the alpha component. */
	3: boolean;
}
