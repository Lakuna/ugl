import { Vector } from "../math/Vector.js";
import { Matrix } from "../math/Matrix.js";
import { Euler } from "../math/Euler.js";

export class Transform {
	constructor() {
		// TODO: Make children get-only once Bundlephobia supports private properties.
		Object.assign(this, { children: [], visible: true, position: new Vector(0, 0, 0),
			scale: new Vector(1, 1, 1), rotation: new Euler(0, 0, 0), up: new Vector(0, 1, 0) });

		// TODO: This can be cleaned up once Bundlephobia supports private properties.
		let parent;
		Object.defineProperties(this, {
			parent: {
				get: () => parent,
				set: (value) => {
					// TODO: Can be compressed with optional chaining once Bundlephobia supports them.
					if (parent && parent != value) { parent.removeChild(this); }
					parent = value;
					if (parent) { parent.addChild(this); }
				}
			}
		});
	}

	get quaternion() {
		return this.rotation.toQuaternion();
	}

	get matrix() {
		return new Matrix()
			.rotate(...this.rotation)
			.scale(...this.scale)
			.transform(...this.position);
	}

	get worldMatrix() {
		return this.parent ? this.matrix.multiply(this.parent.worldMatrix) : this.matrix;
	}

	lookAt(target) {
		this.rotation = new Matrix().lookAt(this.position, target, this.up).toEuler();
	}

	addChild(child) {
		if (!~this.children.indexOf(child)) {
			this.children.push(child);
			child.parent = this;
		}
	}

	removeChild(child) {
		if (~this.children.indexOf(child)) {
			this.children.splice(this.children.indexOf(child), 1);
			child.parent = null;
		}
	}

	traverse(callback) {
		// Stop if callback returns true.
		if (callback(this)) { return; }
		this.children.forEach((child) => child.traverse(callback));
	}
}