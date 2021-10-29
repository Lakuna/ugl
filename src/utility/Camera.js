import { GameObject } from "../core/GameObject";
import { Component } from "../core/Component";
import { Transform } from "../components/Transform.js";
import { Matrix } from "../math/Matrix.js";

/** Class representing a camera. */
export class Camera extends GameObject {
	/**
	 * Create a camera.
	 * @param {Object} [arguments={}] - An object containing the arguments.
	 * @param {GameObject} [arguments.parent] - The parent of this camera.
	 * @param {number} [arguments.near=0.1] - The nearest that the camera can see.
	 * @param {number} [arguments.far=100] - The farthest that the camera can see.
	 * @param {number} [arguments.fov=Math.PI / 4] - The field of view of the camera in radians.
	 * @param {number} [arguments.aspectRatioOverride] - The aspect ratio of the output. If not set, automatically updates with canvas.
	 * @param {number} [arguments.left] - The left boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.right] - The right boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.bottom] - The bottom boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.top] - The top boundary of the output. Makes the camera orthographic if given a value.
	 * @param {number} [arguments.zoom=1] - The zoom applied to the camera if it is orthographic.
	 */
	constructor({ parent, near = 0.1, far = 100, fov = Math.PI / 4, aspectRatioOverride, left, right, bottom, top, zoom = 1 } = {}) {
		super(parent);

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
		this.fov = fov;

		/**
		 * The aspect ratio of the output. If not set, automatically updates with canvas.
		 * @type {number}
		 */
		this.aspectRatioOverride = aspectRatioOverride;

		/**
		 * The aspect ratio of the output.
		 * @type {number}
		 */
		this.aspectRatio = aspectRatioOverride;

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

		/**
		 * The transform component of the camera.
		 * @type {Transform}
		 */
		this.transform = new Transform(this);

		new Component(this)[Component.events.UPDATE] = (umbra) => {
			this.aspectRatio = this.aspectRatioOverride ?? umbra.gl.canvas.clientWidth / umbra.gl.canvas.clientHeight;
		};
	}

	/**
	 * Whether this camera is orthographic.
	 * @type {boolean}
	 */
	get orthographic() {
		return this.left || this.right || this.bottom || this.top;
	}

	/**
	 * The projection matrix of the camera.
	 * @type {Matrix}
	 */
	get projectionMatrix() {
		return this.orthographic
			? new Matrix().orthographic(this.left / this.zoom, this.right / this.zoom, this.bottom / this.zoom, this.top / this.zoom, this.near, this.far)
			: new Matrix().perspective(this.fov, this.aspectRatio, this.near, this.far);
	}

	/**
	 * The view matrix of the camera.
	 * @type {Matrix}
	 */
	get viewMatrix() {
		return this.transform.worldMatrix.invert();
	}

	/**
	 * The view projection matrix of the camera.
	 * @type {Matrix}
	 */
	get viewProjectionMatrix() {
		return this.projectionMatrix.multiply(this.viewMatrix);
	}

	/**
	 * The world view projection matrix for a mesh.
	 * @param {Mesh} mesh - The mesh to get the world view projection matrix for with this camera.
	 * @return {Matrix} The world view projection matrix of the mesh.
	 */
	worldViewProjectionMatrix(mesh) {
		return this.viewProjectionMatrix.multiply(mesh.worldMatrix);
	}
}