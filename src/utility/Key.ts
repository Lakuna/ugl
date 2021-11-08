/** Common ASCII key codes. */
export enum KeyCode {
	Backspace = 8,
	Tab = 9,
	Enter = 13,
	Shift = 16,
	Control = 17,
	Alternate = 18,
	Pause = 19,
	CapsLock = 20,
	Escape = 27,
	Space = 32,
	PageUp = 33,
	PageDown = 34,
	End = 35,
	Home = 36,
	Left = 37,
	Up = 38,
	Right = 39,
	Down = 40,
	Insert = 45,
	Delete = 46,
	Zero = 48,
	One = 49,
	Two = 50,
	Three = 51,
	Four = 52,
	Five = 53,
	Six = 54,
	Seven = 55,
	Eight = 56,
	Nine = 57,
	A = 65,
	B = 66,
	C = 67,
	D = 68,
	E = 69,
	F = 70,
	G = 71,
	H = 72,
	I = 73,
	J = 74,
	K = 75,
	L = 76,
	M = 77,
	N = 78,
	O = 79,
	P = 80,
	Q = 81,
	R = 82,
	S = 83,
	T = 84,
	U = 85,
	V = 86,
	W = 87,
	X = 88,
	Y = 89,
	Z = 90,
	LeftWindows = 91,
	RightWindows = 92,
	Select = 93,
	Numpad0 = 96,
	Numpad1 = 97,
	Numpad2 = 98,
	Numpad3 = 99,
	Numpad4 = 100,
	Numpad5 = 101,
	Numpad6 = 102,
	Numpad7 = 103,
	Numpad8 = 104,
	Numpad9 = 105,
	Multiply = 106,
	Add = 107,
	Subtract = 109,
	Decimal = 110,
	Divide = 111,
	F1 = 112,
	F2 = 113,
	F3 = 114,
	F4 = 115,
	F5 = 116,
	F6 = 117,
	F7 = 118,
	F8 = 119,
	F9 = 120,
	F10 = 121,
	F11 = 122,
	F12 = 123,
	NumLock = 144,
	ScrollLock = 145,
	SemiColon = 186,
	Equal = 187,
	Comma = 188,
	Dash = 189,
	Period = 190,
	Slash = 191,
	Grave = 192,
	OpenBracket = 219,
	Backslash = 220,
	CloseBracket = 221,
	SingleQuote = 222
}

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