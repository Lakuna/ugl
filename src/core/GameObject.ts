import { Component } from "../index";

/** A "thing" in an Umbra program. */
export class GameObject {
	#children: GameObject[];
	#parent?: GameObject;

	/**
	 * Creates a gameobject.
	 * @param parent - The parent of the gameobject.
	 * @param enabled - Whether the components on the gameobject should trigger.
	 */
	constructor(parent?: GameObject, enabled = true) {
		this.parent = parent;
		this.enabled = enabled;
		this.components = [];
		this.#children = [];
	}

	/** A list of components attached to this gameobject. */
	components: Component[];

	/** Whether the components on this gameobject should trigger. */
	enabled: boolean;

	/** A list of child gameobjects of this gameobject. */
	get children(): ReadonlyArray<GameObject> {
		return this.#children;
	}

	/** The parent gameobject of this gameobject. */
	get parent(): GameObject {
		return this.#parent;
	}

	set parent(value: GameObject) {
		if (this.parent != value) {
			if (this.parent) {
				this.parent.removeChild(this);
			}

			this.#parent = value;

			if (this.parent) {
				this.parent.addChild(this);
			}
		}
	}

	/**
	 * Adds a child to this gameobject.
	 * @param child - The child.
	 */
	addChild(child: GameObject): void {
		child.parent = this;
		this.#children.push(child);
	}

	/**
	 * Removes a child from this gameobject.
	 * @param child - The child.
	 */
	removeChild(child: GameObject): void {
		child.parent = null;
		this.#children.splice(this.#children.indexOf(child));
	}

	/**
	 * Executes a callback on this gameobject and each of its children recursively until a callback returns true.
	 * @param callback - The function to execute on each gameobject.
	 */
	traverse(callback: (gameObject: GameObject) => boolean): void {
		if (callback(this)) {
			return;
		}

		this.children.forEach((child: GameObject): void => {
			child.traverse(callback);
		});
	}
}