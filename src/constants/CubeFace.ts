/**
 * Faces of a cubemapped texture.
 * @public
 */
enum CubeFace {
	/** The face on the X-axis in the positive direction. */
	POSITIVE_X = 0,

	/** The face on the Y-axis in the positive direction. */
	POSITIVE_Y = 1,

	/** The face on the Z-axis in the positive direction. */
	POSITIVE_Z = 2,

	/** The face on the X-axis in the negative direction. */
	NEGATIVE_X = 3,

	/** The face on the Y-axis in the negative direction. */
	NEGATIVE_Y = 4,

	/** The face on the Z-axis in the negative direction. */
	NEGATIVE_Z = 5
}

export default CubeFace;
