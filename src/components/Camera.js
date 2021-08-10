import { Transform } from "./Transform.js";
import { Matrix } from "../math/Matrix.js";

/** Class representing a camera. */
export class Camera extends Transform {
	/**
	 * Create a camera.
	 * @param {Object} [arguments] - An object containing the arguments.
	 * @param {number} [arguments.near=0.1] - The nearest that the camera can see.
	 * @param {number} [arguments.far=100] - The farthest that the camera can see.
	 * @param {number} [arguments.fieldOfView=45 * (Math.PI / 180)] - The field of view of the camera in radians.
	 * @param {number} [arguments.aspectRatio=1] - The aspect ratio of the output.
	 * @param {number} [arguments.left] - The left boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.right] - The right boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.bottom] - The bottom boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.top] - The top boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.zoom=1] - The zoom applied to the camera if it is orthographic.
	 */
	constructor({ near = 0.1, far = 100, fieldOfView = 45 * (Math.PI / 180), aspectRatio = 1, left, right, bottom, top, zoom = 1 } = {}) {
		super();

		/**
		 * The nearest that the camera can see.
		 * @type {number}
		 */
		this.near = near;

		/**
		 * The farthest that the camera can see.
		 * @type {number}
		 */
		this.far = far;

		/**
		 * The field of view of the camera in radians.
		 * @type {number}
		 */
		this.fieldOfView = fieldOfView;

		/**
		 * The aspect ratio of the output.
		 * @type {number}
		 */
		this.aspectRatio = aspectRatio;

		/**
		 * The left boundary of the output. Makes the camera orthographic if given a value.
		 * @type {number}
		 */
		this.left = left;

		/**
		 * The right boundary of the output. Makes the camera orthographic if given a value.
		 * @type {number}
		 */
		this.right = right;

		/**
		 * The bottom boundary of the output. Makes the camera orthographic if given a value.
		 * @type {number}
		 */
		this.bottom = bottom;

		/**
		 * The top boundary of the output. Makes the camera orthographic if given a value.
		 * @type {number}
		 */
		this.top = top;

		/**
		 * The zoom applied to the camera if it is orthographic.
		 * @type {number}
		 */
		this.zoom = zoom;
	}

	/**
	 * Whether this camera is orthographic. Read-only.
	 * @type {boolean}
	 */
	get orthographic() {
		return this.left || this.right || this.bottom || this.top;
	}

	/**
	 * The projection matrix of the camera. Read-only.
	 * @type {Matrix}
	 */
	get projectionMatrix() {
		return this.orthographic
			? new Matrix().orthographic(this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near, this.far)
			: new Matrix().perspective(this.fieldOfView, this.aspectRatio, this.near, this.far);
	}

	/**
	 * The view matrix of the camera. Read-only.
	 * @type {Matrix}
	 */
	get viewMatrix() {
		return this.worldMatrix().invert();
	}

	/**
	 * The projection view matrix of the camera. Read-only.
	 * @type {Matrix}
	 */
	get projectionViewMatrix() {
		return this.projectionMatrix.multiply(this.viewMatrix);
	}
}