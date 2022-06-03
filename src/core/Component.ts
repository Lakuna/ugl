import { GameObject } from "./GameObject.js";
import { Umbra } from "./Umbra.js";

/** Events that components can listen for. */
export enum Event {
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
  public constructor(gameObject: GameObject, priority = 0) {
    this.gameObject = gameObject;
    this.gameObject.components.push(this);
    this.priority = priority;
    this.events = new Map();
  }

  /** The object that this component is attached to. */
  public readonly gameObject: GameObject;

  /** The order that this component's events are triggered relative to other components. A lower value makes the event trigger earlier. */
  public priority: number;

  /** A map of functions to the events that trigger them for this component. */
  public events: Map<Event, (umbra: Umbra) => void>
}
