import { GameObject } from "../core/GameObject.js";

/** Parameters for creating a camera. */
export type CameraParameters = {
	/** The parent of the camera. */
	parent?: GameObject;

	/** The nearest that the camera can see. */
	near?: number;

	/** The farthest that the camera can see. */
	far?: number;

	/** The field of view of the camera in radians. */
	fov?: number;

	/** The aspect ratio override of the output of the camera. */
	aspectRatioOverride?: number;

	/** The left boundary of the output. Makes the camera orthographic. */
	left?: number;

	/** The right boundary of the output. Makes the camera orthographic. */
	right?: number;

	/** The bottom boundary of the output. Makes the camera orthographic. */
	bottom?: number;

	/** The top boundary of the output. Makes the camera orthographic. */
	top?: number;

	/** The zoom appplied to the camera if it is orthographic. */
	zoom?: number;
}