/** Represents a key on a keyboard. */
export class Key {
	static #keys = [];

	static #addKey(key) {
		if (typeof window == "undefined") { throw new Error("Cannot use window events in a headless environment."); }

		if (!Key.#keys.length) {
			addEventListener("keydown", (event) => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) { continue; }
					if (!key.isDown) { key.onDown?.(event); }
					key.isDown = true;
					event.preventDefault();
				}
			});

			addEventListener("keyup", (event) => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) { continue; }
					if (key.isDown) { key.onUp?.(event); }
					key.isDown = false;
					event.preventDefault();
				}
			});
		}

		Key.#keys.push(key);
	}

	/**
	 * Create a handler for a specific key.
	 * @param {number} code - The ASCII key code of the key.
	 */
	constructor(code) {
		/**
		 * The ASCII key code of the key.
		 * @type {number}
		 */
		this.code = code;

		/**
		 * Whether the key is currently being held down.
		 * @type {boolean}
		 */
		this.isDown = false;

		/**
		 * A function to call when the key is pressed.
		 * @type {function<Event>}
		 */
		this.onDown = undefined;

		/**
		 * A function to call when the key is released.
		 * @type {function<Event>}
		 */
		this.onUp = undefined;

		Key.#addKey(this);
	}
}