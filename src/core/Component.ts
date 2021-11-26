import { Event } from "./Event.js";
import { GameObject } from "./GameObject.js";
import { Umbra } from "./Umbra.js";

/** A behavior or property that can be added to a game object. */
export class Component {
	/**
	 * Creates a component.
	 * @param gameObject - The game object to attach the component to.
	 * @param priority - The order to trigger this component's events relative to other components. Lower is earlier.
	 */
	constructor(gameObject: GameObject, priority = 0) {
		this.gameObject = gameObject;
		gameObject.components.push(this);
		this.priority = priority;
		this.events = new Map();
	}

	/** The game object that this component is attached to. */
	readonly gameObject: GameObject;

	/** The order that this component's events are triggered relative to other components. */
	priority: number;

	/** Functions to be called by this component when events are triggered. */
	events: Map<Event, (umbra: Umbra) => void>
}