/** Represents a key on a keyboard. */
export class Key {
	static #keys = [];

	static #addKey(key) {
		if (typeof addEventListener == "undefined") { throw new Error("Cannot use keys in a headless environment."); }

		if (!Key.#keys.length) {
			addEventListener("keydown", (event) => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) { continue; }
					key.onDown?.();
					key.isDown = true;
					event.preventDefault();
				}
			});

			addEventListener("keyup", (event) => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) { continue; }
					key.onUp?.();
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
		 * @type {?function}
		 */
		this.onDown = undefined;

		/**
		 * A function to call when the key is released.
		 * @type {?function}
		 */
		this.onUp = undefined;

		Key.#addKey(this);
	}
}