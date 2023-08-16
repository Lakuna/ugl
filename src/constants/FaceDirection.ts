/** Directions that a face can point. */
const enum FaceDirection {
	/** The front of a face. */
	FRONT = 0x0404,

	/** The back of a face. */
	BACK = 0x0405,

	/** Both sides of a face. */
	FRONT_AND_BACK = 0x0408
}

export default FaceDirection;
