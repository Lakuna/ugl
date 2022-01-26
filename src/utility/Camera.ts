import { Event } from "../core/Event.js";
import { CameraParameters } from "./CameraParameters.js";
import { GameObject } from "../core/GameObject.js";
import { Umbra } from "../core/Umbra.js";
import { Component } from "../core/Component.js";
import { Matrix } from "../math/Matrix.js";
import { Transform } from "./Transform.js";
import { Mesh } from "./Mesh.js";

/** A camera. */
export class Camera extends GameObject {
	/** Creates a camera. */
	constructor({
		parent,
		near = 0.1,
		far = 100,
		fov = Math.PI / 4,
		aspectRatioOverride,
		left,
		right,
		bottom,
		top,
		zoom = 1
	}: CameraParameters) {
		super(parent);

		this.near = near;
		this.far = far;
		this.fov = fov;
		if (aspectRatioOverride) {
			this.aspectRatioOverride = aspectRatioOverride;
		}
		this.aspectRatio = aspectRatioOverride ?? 0;
		if (left || right || top || bottom) {
			this.left = left ?? 0;
			this.right = right ?? 0;
			this.bottom = bottom ?? 0;
			this.top = top ?? 0;
			this.zoom = zoom ?? 1;
		}
		this.transform = new Transform(this);

		new Component(this).events.set(Event.Update, (umbra: Umbra): void => {
			this.aspectRatio =
				this.aspectRatioOverride
				?? umbra.gl.canvas.clientWidth / umbra.gl.canvas.clientHeight;
		});
	}

	/** The nearest that this camera can see. */
	near: number;

	/** The farthest that this camera can see. */
	far: number;

	/** The field of view of this camera in radians. */
	fov?: number;

	/** The aspect ratio override of the output of this camera. */
	aspectRatioOverride?: number;

	/** The aspect ratio of the output of this camera. */
	aspectRatio: number;

	/** The left boundary of the output of this camera. Makes this camera orthographic. */
	left?: number;

	/** The right boundary of the output of this camera. Makes this camera orthographic. */
	right?: number;

	/** The bottom boundary of the output of this camera. Makes this camera orthographic. */
	bottom?: number;

	/** The top boundary of the output of this camera. Makes this camera orthographic. */
	top?: number;

	/** The zoom appplied to this camera if it is orthographic. */
	zoom?: number;

	/** The transform of this camera. */
	transform: Transform;

	/** Whether this camera is orthographic. */
	get orthographic(): boolean {
		return !!(this.left || this.right || this.bottom || this.top);
	}

	/** The projection matrix of this camera. */
	get projectionMatrix(): Matrix {
		return this.orthographic
			? new Matrix().orthographic(
				(this.left ?? 0) / (this.zoom ?? 1),
				(this.right ?? 0) / (this.zoom ?? 1),
				(this.bottom ?? 0) / (this.zoom ?? 1),
				(this.top ?? 0) / (this.zoom ?? 1),
				this.near,
				this.far)
			: new Matrix().perspective(
				this.fov ?? (Math.PI / 4),
				this.aspectRatio,
				this.near,
				this.far);
	}

	/** The view matrix of this camera. */
	get viewMatrix(): Matrix {
		return this.transform.worldMatrix.invert();
	}

	/** The view projection matrix of the camera. */
	get viewProjectionMatrix(): Matrix {
		return this.projectionMatrix.multiply(this.viewMatrix);
	}

	/**
	 * Calculates the world view projection matrix of a mesh.
	 * @param mesh - The mesh.
	 * @returns The world view projection matrix of the mesh.
	 */
	worldViewProjectionMatrix(mesh: Mesh): Matrix {
		return this.viewProjectionMatrix.multiply(mesh.worldMatrix);
	}
}