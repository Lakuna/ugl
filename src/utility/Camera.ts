import { GameObject } from "../core/GameObject.js";
import { Matrix } from "../math/Matrix.js";
import { Mesh } from "./Mesh.js";
import { Component, Event } from "../core/Component.js";
import { Umbra } from "../core/Umbra.js";
import { Transform } from "./Transform.js";

/** A viewpoint for a scene. */
export abstract class Camera extends GameObject {
  /**
   * Creates a camera.
   * @param parent - The parent object of the camera.
   * @param near - The nearest that the camera can see.
   * @param far - The farthest that the camera can see.
   */
  constructor(parent?: GameObject, near = 0.1, far = 1000) {
    super(parent);
    this.near = near;
    this.far = far;
    this.transform = new Transform(this);
  }

  /** The nearest that this camera can see. */
  near: number;

  /** The farthest that this camera can see. */
  far: number;

  /** The transform component of this camera. */
  transform: Transform;

  /** The projection matrix of this camera. */
  abstract get projectionMatrix(): Matrix;

  /** The view matrix of this camera. */
  get viewMatrix(): Matrix {
    return this.transform.worldMatrix.invert();
  }

  /** The view projection matrix of this camera. */
  get viewProjectionMatrix(): Matrix {
    return this.projectionMatrix.multiply(this.viewMatrix);
  }

  /**
   * Calculates the world view projection matrix of a mesh when viewed by this camera.
   * @param mesh - The mesh.
   * @returns The world view projection matrix of the mesh.
   */
  worldViewProjectionMatrix(mesh: Mesh): Matrix {
    return this.viewProjectionMatrix.multiply(mesh.worldMatrix);
  }
}

/** A viewpoint for a scene with perspective. */
export class PerspectiveCamera extends Camera {
  /**
   * Creates a perspective camera.
   * @param parent - The parent object of the camera.
   * @param near - The nearest that the camera can see.
   * @param far - The farthest that the camera can see.
   * @param fov - The field of view of the camera in radians.
   * @param aspectRatio - The aspect ratio of the camera. Updates automatically to the canvas' aspect ratio if not set.
   */
  constructor(parent?: GameObject, near = 0.1, far = 1000, fov = Math.PI / 4, aspectRatio?: number) {
    super(parent, near, far);
    this.fov = fov;
    if (aspectRatio) {
      this.aspectRatio = aspectRatio;
    } else {
      this.aspectRatio = 1;

      // Create a component to automatically update the aspect ratio.
      new Component(this).events.set(Event.Update, (umbra: Umbra): void => {
        this.aspectRatio = umbra.gl.canvas.width / umbra.gl.canvas.height;
      });
    }
  }

  /** The field of view of this camera in radians. */
  fov: number;

  /** The aspect ratio of this camera. */
  aspectRatio: number;

  /** The projection matrix of this camera. */
  get projectionMatrix(): Matrix {
    return Matrix.fromPerspective(this.fov, this.aspectRatio, this.near, this.far);
  }
}

/** A viewpoint for a scene without perspective. */
export class OrthographicCamera extends Camera {
  /**
   * Creates an orthographic camera.
   * @param left - The left boundary of the viewport.
   * @param right - The right boundary of the viewport.
   * @param bottom - The bottom boundary of the viewport.
   * @param top - The top boundary of the viewport.
   * @param near - The near boundary of the viewport.
   * @param far - The far boundary of the viewport.
   * @param zoom - The zoom to apply to the camera.
   * @param parent - The parent object of the camera.
   */
  constructor(left: number, right: number, bottom: number, top: number, near: number, far: number, zoom = 1, parent?: GameObject) {
    super(parent, near, far);
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.zoom = zoom;
  }

  /** The left boundary of the viewport. */
  left: number;

  /** The right boundary of the viewport. */
  right: number;

  /** The bottom boundary of the viewport. */
  bottom: number;

  /** The top boundary of the viewport. */
  top: number;

  /** The zoom to apply to this camera. */
  zoom: number;

  /** The projection matrix of this camera. */
  get projectionMatrix(): Matrix {
    return Matrix.fromOrthographic(
      this.left / this.zoom,
      this.right / this.zoom,
      this.bottom / this.zoom,
      this.top / this.zoom,
      this.near, this.far);
  }
}
