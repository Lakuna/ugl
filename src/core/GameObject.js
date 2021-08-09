export class GameObject {
	#children;
	#parent;

	constructor(parent, enabled = true) {
		Object.defineProperties(this, {
			components: { value: [] }
		});

		this.#children = [];
		this.parent = parent; // Use setter.
	}

	get children() {
		return [...this.#children]; // Return a copy so that pushing to the children array directly won't cause issues.
	}

	get parent() {
		return this.#parent;
	}

	set parent(value) {
		if (this.parent && this.parent != value) {
			parent.removeChild(this);
		}

		this.#parent = value;

		if (this.parent) {
			parent.addChild(this);
		}
	}

	addChild(child) {
		child.parent = this;
		this.#children.push(child);
	}

	removeChild(child) {
		child.parent = null;
		this.#children.remove(child);
	}

	getComponent(type) {
		return this.components.find((component) => component instanceof type);
	}
}