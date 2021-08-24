/** Class representing a color. */
export class Color extends Array {
	/**
	 * Create a color.
	 * @param {string|number|number[]} data - The data to create the color from. This may follow any of several forms.
	 * @example
	 * new Color(0xFFFFFF); // Hex value.
	 * new Color([1, 1, 1]); // RGB percentage value array.
	 * new Color("#FFFFFF"); // Hex value string with pound.
	 * new Color("FFFFFF"); // Hex value string.
	 * new Color("#FFF"); // Web-safe hex value string with pound.
	 * new Color("FFF"); // Web-safe hex value string.
	 */
	constructor(data = "FFF") {
		if (typeof data == "number") {
			data = [
				((data >> 16)	& 0xFF) / 0xFF,
				((data >> 8)	& 0xFF) / 0xFF,
				(data			& 0xFF) / 0xFF
			];
		} else if (typeof data == "string") {
			if (!data.startsWith("#")) { data = `#${data}`; }
			if (data.length == 4) { data = `#${data[1]}${data[1]}${data[2]}${data[2]}${data[3]}${data[3]}`; }

			data = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data);
			data.shift(); // Remove full string from first index.
			data = data.map((hex) => parseInt(hex, 16) / 0xFF);
		}

		while (data.length < 4) { data.push(0xFF); } // Fill alpha and/or missing colors.

		super(...data); // Will error if data is supplied in an invalid format.
	}

	/**
	 * The red value of the color.
	 * @type {number}
	 */
	get r() {
		return this[0] ?? 0;
	}

	/**
	 * The red value of the color.
	 * @type {number}
	 */
	set r(value) {
		/** @ignore */ this[0] = value;
	}

	/**
	 * The green value of the color.
	 * @type {number}
	 */
	get g() {
		return this[1] ?? 0;
	}

	/**
	 * The green value of the color.
	 * @type {number}
	 */
	set g(value) {
		/** @ignore */ this[1] = value;
	}

	/**
	 * The blue value of the color.
	 * @type {number}
	 */
	get b() {
		return this[2] ?? 0;
	}

	/**
	 * The blue value of the color.
	 * @type {number}
	 */
	set b(value) {
		/** @ignore */ this[2] = value;
	}

	/**
	 * The alpha value of the color.
	 * @type {number}
	 */
	get a() {
		return this[3] ?? 0;
	}

	/**
	 * The alpha value of the color.
	 * @type {number}
	 */
	set a(value) {
		/** @ignore */ this[3] = value;
	}
}