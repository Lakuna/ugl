/** Class representing an object. */
export class GameObject {
	#children;
	#parent;

	/**
	 * Create an object.
	 * @param {GameObject} [parent] - The parent object of this object.
	 * @param {boolean} [enabled=true] - Whether the components on this object should recieve event triggers.
	 */
	constructor(parent, enabled = true) {
		/**
		 * A list of components attached to this object.
		 * @type {Component[]}
		 */
		this.components = [];

		/**
		 * Whether the components on this object should recieve event triggers.
		 * @type {boolean}
		 */
		this.enabled = enabled;

		/** @ignore */ this.#children = [];

		this.parent = parent; // Use setter.
	}

	/**
	 * A list of child objects of this object. Note that modifying this list does not have any effect; one should instead modify the parent value of the child objects.
	 * @type {GameObject[]}
	 */
	get children() {
		return [...this.#children]; // Return a copy so that pushing to the children array directly won't cause issues.
	}

	/**
	 * The parent object of this object.
	 * @type {GameObject}
	 */
	get parent() {
		return this.#parent;
	}

	/**
	 * The parent object of this object.
	 * @type {GameObject}
	 */
	set parent(value) {
		if (this.parent && this.parent != value) {
			this.parent.removeChild(this);
		}

		this.#parent = value;

		if (this.parent) {
			this.parent.addChild(this);
		}
	}

	/**
	 * Adds a child to this object.
	 * @param {GameObject} child - The child to add.
	 */
	addChild(child) {
		if (child.parent != this) {
			child.parent = this;
			this.#children.push(child);
		}
	}

	/**
	 * Removes a child from this object.
	 * @param {GameObject} child - The child to add.
	 */
	removeChild(child) {
		if (child.parent == this) {
			child.parent = null;
			this.#children.splice(this.#children.indexOf(child));
		}
	}

	/**
	 * Gets the first component of the matching type attached to this object.
	 * @param {function} type - The class of the component.
	 * @return {?*} The found component.
	 */
	getComponent(type) {
		return this.components.find((component) => component instanceof type);
	}

	/**
	 * Executes a callback on this object and each of its children. Stops if a callback returns true.
	 * @param {function<GameObject>} callback - The function to execute on each object.
	 */
	traverse(callback) {
		if (callback(this)) { return; } // Stop traversing if callback returns true.
		this.children.forEach((child) => child.traverse(callback));
	}
}