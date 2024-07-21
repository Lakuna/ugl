/**
 * Directions that a polygon can face relative to the camera.
 * @public
 */
enum Face {
	/** A front-facing polygon. */
	FRONT = 0x0404,

	/** A back-facing polygon. */
	BACK = 0x0405,

	/** A polygon that is facing in any direction. */
	FRONT_AND_BACK = 0x0408
}

export default Face;
