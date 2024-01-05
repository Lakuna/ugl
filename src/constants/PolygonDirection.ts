/**
 * Directions that a polygon can face relative to the camera.
 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
 */
enum PolygonDirection {
	/** A front-facing polygon. */
	FRONT = 0x0404,

	/** A back-facing polygon. */
	BACK = 0x0405,

	/** A polygon that is facing in any direction. */
	FRONT_AND_BACK = 0x0408
}

export default PolygonDirection;
