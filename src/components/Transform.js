import { Component } from "../core/Component.js";
import { Vector } from "../math/Vector.js";
import { Euler } from "../math/Euler.js";
import { Matrix } from "../math/Matrix.js";

/** Class representing a transform (position). */
export class Transform extends Component {
	#parent;

	/** Create a transform. */
	constructor() {
		super();

		/**
		 * The translation (position) of this object.
		 * @type {Vector}
		 */
		this.translation = new Vector(0, 0, 0);

		/**
		 * The rotation of this object.
		 * @type {Euler}
		 */
		this.rotation = new Euler(0, 0, 0);

		/**
		 * The scale of this object.
		 * @type {Vector}
		 */
		this.scale = new Vector(1, 1, 1);
	}

	/**
	 * The transform of the parent of this transform's object.
	 * @type {Transform}
	 */
	get parent() {
		/** @ignore */ this.#parent ||= this.gameObject.parent?.getComponent(Transform);
		return this.#parent;
	}

	/**
	 * The matrix of this transform relative to its parent.
	 * @type {Matrix}
	 */
	get matrix() {
		return new Matrix()
			.translate(...this.translation)
			.rotate(...this.rotation)
			.scale(...this.scale);
	}

	/**
	 * The matrix of this transform relative to the origin.
	 * @type {Matrix}
	 */
	get worldMatrix() {
		return this.parent ? this.matrix.multiply(this.parent.worldMatrix) : this.matrix;
	}
}