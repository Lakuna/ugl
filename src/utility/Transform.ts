import { GameObject } from "../core/GameObject.js";
import { Component } from "../core/Component.js";
import { Matrix } from "../math/Matrix.js";
import { Vector } from "../math/Vector.js";

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
		this.rotation = new Vector(0, 0, 0);
		this.scale = new Vector(1, 1, 1);
	}

	/** The translation of this transform. */
	translation: Vector;

	/** The rotation of this transform. */
	rotation: Vector;

	/** The scale of this transform. */
	scale: Vector;

	/** The target for this transform to rotate towards. Overrides rotation. */
	target?: Vector;

	/** The transform of this transform's parent. */
	get parent(): Transform | undefined {
		const findParent = (): Component | undefined =>
			this.gameObject.parent?.components.find((component: Component): boolean => component instanceof Transform);
			
		if (this.#parentObject == this.gameObject.parent) {
			if (!this.#parent) {
				const found: Component | undefined = findParent();
				if (found) {
					this.#parent = found as Transform;
				}
			}
		} else {
			if (this.gameObject.parent) {
				this.#parentObject = this.gameObject.parent;
			}
			const found: Component | undefined = findParent();
			if (found) {
				this.#parent = found as Transform;
			}
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