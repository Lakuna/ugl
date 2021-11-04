import { Component, ComponentEvent } from "../core/Component";
import { GameObject } from "../core/GameObject";
import { Matrix } from "../math/Matrix";
import { Mesh } from "./Mesh";
import { Transform } from "./Transform";
import { Umbra } from "../core/Umbra";

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
		this.aspectRatioOverride = aspectRatioOverride;
		this.aspectRatio = aspectRatioOverride;
		this.left = left;
		this.right = right;
		this.bottom = bottom;
		this.top = top;
		this.zoom = zoom;
		this.transform = new Transform(this);

		new Component(this).events.set(ComponentEvent.Update, (umbra: Umbra): void => {
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
				this.left / this.zoom,
				this.right / this.zoom,
				this.bottom / this.zoom,
				this.top / this.zoom,
				this.near,
				this.far)
			: new Matrix().perspective(
				this.fov,
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