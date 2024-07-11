/**
 * A two- or three-dimensional vector.
 * @public
 */
export default interface Vector {
	/** The value of this vector on the X-axis. */
	0: number;

	/** The value of this vector on the Y-axis. */
	1: number;

	/** The value of this vector on the Z-axis. */
	2?: number;
}
