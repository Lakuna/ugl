/** Class representing a component which attaches to an object. */
export class Component {
	/**
	 * An enumeration of events which can trigger on a component.
	 * 
	 * UPDATE
	 * FIXED_UPDATE
	 * LOAD
	 * @type {Object}
	 */
	static events = {
		UPDATE: Symbol("Update"),
		FIXED_UPDATE: Symbol("Fixed update"),
		LOAD: Symbol("Load")
	};

	#gameObject;

	/**
	 * Create a component.
	 * @param {GameObject} gameObject - The object to attach this component to.
	 * @param {number} [priority=0] - The order this component's events should trigger in relative to other components.
	 */
	constructor(gameObject, priority = 0) {
		/** @ignore */ this.#gameObject = gameObject;
		this.gameObject.components.push(this);

		/**
		 * The order this component's events should trigger in relative to other components.
		 * @type {number}
		 */
		this.priority = priority;
	}

	/**
	 * The object which this component is attached to.
	 * @type {GameObject}
	 */
	get gameObject() {
		return this.#gameObject;
	}
}