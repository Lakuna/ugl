import { Component } from "../core/Component.js";
import { Matrix } from "../math/Matrix.js";
import { GameObject } from "../core/GameObject.js";
import { Vector } from "../math/Vector.js";

/** The position of an object. */
export class Transform extends Component {
  /**
   * Creates a transform.
   * @param gameObject - The object to attach the transform to.
   * @param priority - The order to trigger the component's events relative to other components.
   */
  constructor(gameObject?: GameObject, priority?: number) {
    super(gameObject, priority);

    this.translation = new Vector(0, 0, 0);
    this.rotation = new Vector(0, 0, 0);
    this.scale = new Vector(1, 1, 1);
    this.origin = new Vector(0, 0, 0);
  }

  /** The translation of this transform. */
  translation: Vector;

  /** The rotation of this transform. */
  rotation: Vector;

  /** The scale of this transform. */
  scale: Vector;

  /** The origin for this transform to rotate and scale about. */
  origin: Vector;

  /** The target for this transform to rotate towards. */
  target: Vector | undefined;

  /** The transformation matrix of this transform relative to its parent. */
  get matrix(): Matrix {
    return this.target
      ? new Matrix()
        .lookAt(this.translation, this.target, new Vector(0, 1, 0))
        .translate(this.origin?.[0] ?? 0, this.origin?.[1] ?? 0, this.origin?.[2] ?? 0)
        .scale(this.scale?.[0] ?? 0, this.scale?.[1] ?? 0,this.scale?.[2] ?? 0)
        .translate(-(this.origin?.[0] ?? 0), -(this.origin?.[1] ?? 0), -(this.origin?.[2] ?? 0))
      : new Matrix()
        .translate(this.translation?.[0] ?? 0, this.translation?.[1] ?? 0, this.translation?.[2] ?? 0)
        .translate(this.origin?.[0] ?? 0, this.origin?.[1] ?? 0, this.origin?.[2] ?? 0)
        .rotate(this.rotation?.[0] ?? 0, this.rotation?.[1] ?? 0,this.rotation?.[2] ?? 0)
        .scale(this.scale?.[0] ?? 0, this.scale?.[1] ?? 0,this.scale?.[2] ?? 0)
        .translate(-(this.origin?.[0] ?? 0), -(this.origin?.[1] ?? 0), -(this.origin?.[2] ?? 0));
  }

  /** The transform component of the parent object of the object that this transform is attached to. */
  get parent(): Transform | undefined {
    return this.gameObject.parent?.components.find((component: Component): boolean => component instanceof Transform) as Transform;
  }

  /** The transformation matrix of this transform relative to the origin. */
  get worldMatrix(): Matrix {
    return (this.parent
      ? this.parent.worldMatrix.multiply(this.matrix)
      : this.matrix);
  }
}
