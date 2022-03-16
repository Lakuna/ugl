import { Component } from "./Component.js";

/** Represents any "thing" in an Umbra instance. */
export class GameObject {
  /**
   * Creates an object.
   * @param parent - The parent object.
   * @param enabled - Whether events should trigger for components attached to this object.
   */
  constructor(parent?: GameObject, enabled = true) {
    if (parent) { this.parent = parent; }
    this.enabled = enabled;
    this.components = [];
    this.#children = [];
  }

  /** A list of components attached to this object. */
  components: Component[];

  /** Whether events should trigger for components attached to this object. */
  enabled: boolean;

  /** A list of children of this object. */
  #children: GameObject[];

  /** A list of children of this object. */
  get children(): ReadonlyArray<GameObject> {
    return this.#children;
  }

  /** The parent of this object. */
  #parent: GameObject | undefined;

  /** The parent of this object. */
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
   * Adds a child to this object.
   * @param child - The child.
   */
  addChild(child: GameObject): void {
    child.parent = this;
    this.#children.push(child);
  }

  /**
   * Removes a child from this object.
   * @param child - The child.
   */
  removeChild(child: GameObject): void {
    if (this.#children.indexOf(child) < 0) { throw new Error("Object is not a child of this object."); }
    child.parent = undefined;
    this.#children.splice(this.#children.indexOf(child));
  }

  /**
   * Executes a function on this object and each of its children recursively, ending when an object returns true.
   * @param f - The function to execute on the objects.
   */
  traverse(f: (gameObject: GameObject) => boolean): void {
    if (f(this)) { return; }
    for (const child of this.#children) { child.traverse(f); }
  }
}
