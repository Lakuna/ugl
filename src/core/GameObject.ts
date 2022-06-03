import { Component } from "./Component.js";
import { mat4 } from "gl-matrix";

/** Represents any "thing" in an Umbra instance. */
export class GameObject {
  /**
   * Creates an object.
   * @param parent - The parent object.
   * @param enabled - Whether events should trigger for components attached to this object.
   */
  public constructor(parent?: GameObject, enabled = true) {
    if (parent) { this.parent = parent; }
    this.enabled = enabled;
    this.components = [];
    this.childrenPrivate = [];
    this.matrix = mat4.create();
  }

  /** A list of components attached to this object. */
  public components: Array<Component>;

  /** Whether events should trigger for components attached to this object. */
  public enabled: boolean;

  /** The transformation matrix of this object. */
  public matrix: mat4;

  /** The world matrix of this object. */
  public get worldMatrix(): mat4 {
    return this.parent ? mat4.multiply(mat4.create(), this.matrix, this.parent.matrix) : this.matrix;
  }

  /** A list of children of this object. */
  private childrenPrivate: Array<GameObject>;

  /** A list of children of this object. */
  public get children(): ReadonlyArray<GameObject> {
    return this.childrenPrivate;
  }

  /** The parent of this object. */
  private parentPrivate: GameObject | undefined;

  /** The parent of this object. */
  public get parent(): GameObject | undefined {
    return this.parentPrivate;
  }

  public set parent(value: GameObject | undefined) {
    if (this.parentPrivate != value) {
      if (this.parentPrivate) { this.parentPrivate.removeChild(this); }
      this.parentPrivate = value;
      if (value) { value.addChild(this); }
    }
  }

  /**
   * Adds a child to this object.
   * @param child - The child.
   */
  public addChild(child: GameObject): void {
    child.parent = this;
    this.childrenPrivate.push(child);
  }

  /**
   * Removes a child from this object.
   * @param child - The child.
   */
  public removeChild(child: GameObject): void {
    if (this.childrenPrivate.indexOf(child) < 0) { throw new Error("Object is not a child of this object."); }
    child.parent = undefined;
    this.childrenPrivate.splice(this.childrenPrivate.indexOf(child));
  }

  /**
   * Executes a function on this object and each of its children recursively, ending when an object returns true.
   * @param f - The function to execute on the objects.
   */
  public traverse(f: (gameObject: GameObject) => boolean): void {
    if (f(this)) { return; }
    for (const child of this.childrenPrivate) { child.traverse(f); }
  }
}
