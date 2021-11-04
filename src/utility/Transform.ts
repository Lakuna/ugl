import { Component, Euler, GameObject, Matrix, Vector } from "../index";

/** A transform of a gameobject. */
export class Transform extends Component {
	#parentObject?: GameObject;
	#parent?: Transform;

	/**
	 * Creates a transform.
	 * @param gameObject - The object to attach the transform to.
	 * @param priority - The order to trigger the transform's events relative to other components (lower is earlier).
	 */
	constructor(gameObject?: GameObject, priority?: number) {
		super(gameObject, priority);

		this.translation = new Vector(0, 0, 0);
		this.rotation = new Euler(0, 0, 0);
		this.scale = new Vector(1, 1, 1);
	}

	/** The translation of this transform. */
	translation: Vector;

	/** The rotation of this transform. */
	rotation: Euler;

	/** The scale of this transform. */
	scale: Vector;

	/** The target for this transform to rotate towards. Overrides rotation. */
	target?: Vector;

	/** The transform of this transform's parent. */
	get parent(): Transform {
		if (this.#parentObject == this.gameObject.parent) {
			this.#parent ||= this.gameObject.parent?.components.find((component: Component): boolean => component instanceof Transform) as Transform;
		} else {
			this.#parentObject = this.gameObject.parent;
			this.#parent = this.gameObject.parent?.components.find((component: Component): boolean => component instanceof Transform) as Transform;
		}
		return this.#parent;
	}

	/** The transformation matrix of this transform relative to its parent. */
	get matrix(): Matrix {
		return (this.target
			? new Matrix()
				.lookAt(this.translation, this.target)
			: new Matrix()
				.translate(this.translation)
				.rotate(this.rotation)
			).scale(this.scale);
	}

	/** The transformation matrix of this transform relative to the origin. */
	get worldMatrix(): Matrix {
		return this.parent
			? this.parent.worldMatrix.multiply(this.matrix)
			: this.matrix;
	}
}