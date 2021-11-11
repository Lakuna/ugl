/** A key on a keyboard. */
export class Key {
	static #keys: Key[];

	static #addKey(key: Key): void {
		if (typeof window == "undefined") {
			throw new Error("Cannot use window events in a headless environment.");
		}

		if (!Key.#keys) {
			Key.#keys = [];
		}

		if (!Key.#keys.length) {
			addEventListener("keydown", (event: KeyboardEvent): void => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) {
						continue;
					}

					if (!key.isDown) {
						key.onDown?.(event);
					}

					key.isDown = true;
					event.preventDefault();
				}
			});

			addEventListener("keyup", (event: KeyboardEvent): void => {
				for (const key of Key.#keys) {
					if (event.keyCode != key.code) {
						continue;
					}

					if (key.isDown) {
						key.onUp?.(event);
					}

					key.isDown = false;

					event.preventDefault();
				}
			});
		}

		Key.#keys.push(key);
	}

	/**
	 * Creates a key.
	 * @param code - The ASCII key code of the key.
	 */
	constructor(code: number, onDown: (event: KeyboardEvent) => void, onUp: (event: KeyboardEvent) => void) {
		this.code = code;
		this.isDown = false;
		this.onDown = onDown;
		this.onUp = onUp;

		Key.#addKey(this);
	}

	/** The ASCII key code of this key. */
	code: number;

	/** Whether this key is currently being held down. */
	isDown: boolean;

	/** A function to call when the key is pressed. */
	onDown?: (event: KeyboardEvent) => void;

	/** A function to call when the key is released. */
	onUp?: (event: KeyboardEvent) => void;
}