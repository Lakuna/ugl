import { Component } from "../core/Component.js";
import { Vector } from "../math/Vector.js";
import { Euler } from "../math/Euler.js";
import { Matrix } from "../math/Matrix.js";

export class Transform extends Component {
	#parent; // Cache parent transform.

	constructor() {
		Object.defineProperties(this, {
			translation: { value: new Vector(0, 0, 0) },
			rotation: { value: new Euler(0, 0, 0) },
			scale: { value: new Vector(1, 1, 1) }
		});
	}

	get parent() {
		this.#parent ||= this.gameObject.parent?.getComponent(Transform);
		return this.#parent;
	}

	get matrix() {
		return new Matrix()
			.translate(...this.translation)
			.rotate(...this.rotation)
			.scale(...this.scale);
	}

	get globalMatrix() {
		return this.parent ? this.matrix.multiply(this.parent.globalMatrix) : this.matrix;
	}
}