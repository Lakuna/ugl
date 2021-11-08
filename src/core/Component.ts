import { GameObject } from "./GameObject.js";
import { Umbra } from "./Umbra.js";

/** Events which can be triggered on components. */
export enum ComponentEvent {
	Update = "Update",
	FixedUpdate = "Fixed update",
	Load = "Load"
}

/** A script which attaches to a gameobject in an Umbra program. */
export class Component {
	readonly #gameObject: GameObject;

	/**
	 * Creates a component.
	 * @param gameObject - The object to attach the component to.
	 * @param priority - The order to trigger the component's events relative to other components (lower is earlier).
	 */
	constructor(gameObject: GameObject = new GameObject(), priority = 0) {
		this.#gameObject = gameObject;
		this.gameObject.components.push(this);
		this.priority = priority;
		this.events = new Map();
	}

	/** The order this component's events are triggered in relative to other components (lower is earlier). */
	priority: number;

	/** Events attached to this component. */
	events: Map<ComponentEvent, (umbra: Umbra) => void>

	/** The gameobject that this component is attached to. */
	get gameObject(): GameObject {
		return this.#gameObject;
	}
}