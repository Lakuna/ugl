import { GameObject } from "./GameObject.js";
import { Umbra } from "./Umbra.js";

export const enum Event {
  Update,
  FixedUpdate,
  Load
}

/** A script which attaches to an object in an Umbra scene. */
export class Component {
  /**
   * Creates a component.
   * @param gameObject - The object to attach the component to.
   * @param priority - The order to trigger the component's events relative to other components. A lower value makes the event trigger earlier.
   */
  constructor(gameObject: GameObject = new GameObject(), priority = 0) {
    this.gameObject = gameObject;
    this.gameObject.components.push(this);
    this.priority = priority;
    this.events = new Map();
  }

  /** The object that this component is attached to. */
  readonly gameObject: GameObject;

  /** The order that this component's events are triggered relative to other components. A lower value makes the event trigger earlier. */
  priority: number;

  /** Events attached to this component. */
  events: Map<Event, (umbra: Umbra) => void>
}
