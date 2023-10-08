/** A color mask. */
export default interface ColorMask {
	/** Whether to write to the red component. */
	0: boolean;

	/** Whether to write to the green component. */
	1: boolean;

	/** Whether to write to the blue component. */
	2: boolean;

	/** Whether to write to the alpha component. */
	3: boolean;
}
