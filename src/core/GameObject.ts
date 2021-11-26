import { Component } from "./Component.js";

/** An object in an Umbra program. */
export class GameObject {
	#children: GameObject[];
	#parent: GameObject | undefined;

	/**
	 * Creates a game object.
	 * @param parent - The parent of this game object.
	 * @param enabled - Whether the components of the game object should run their functions when events are triggered.
	 */
	constructor(parent?: GameObject, enabled = true) {
		if (parent) { this.parent = parent; }
		this.enabled = enabled;
		this.components = [];
		this.#children = [];
	}

	/** A list of components attached to this game object. */
	components: Component[];

	/** Whether the components of this game object should run their functions when events are triggered. */
	enabled: boolean;

	/** The children of this game object. */
	get children(): ReadonlyArray<GameObject> {
		return this.#children;
	}

	/** The parent of this game object. */
	get parent(): GameObject | undefined {
		return this.#parent;
	}

	set parent(value: GameObject | undefined) {
		if (this.#parent != value) {
			if (this.#parent) { this.#parent.removeChild(this); }
			this.#parent = value;
			if (value) { value.addChild(this); }
		}
	}

	/**
	 * Adds a child to this game object.
	 * @param child - The child.
	 */
	addChild(child: GameObject): void {
		child.parent = this;
		this.#children.push(child);
	}

	/**
	 * Removes a child from this game object.
	 * @param child - The child.
	 */
	removeChild(child: GameObject): void {
		child.parent = undefined;
		this.#children.splice(this.#children.indexOf(child));
	}

	/**
	 * Executes a function on this game object and each of its children recursively unless the function returns true.
	 * @param f - The function to execute on this game object.
	 */
	traverse(f: (gameObject: GameObject) => boolean): void {
		if (f(this)) { return; }
		this.children.forEach((child: GameObject): void => { child.traverse(f); })
	}
}