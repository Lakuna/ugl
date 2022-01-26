import { ColorData } from "./ColorData.js";

/** A color. */
export class Color extends Array<number> {
	/**
	 * Creates a color.
	 * @param data - The data used to create the color. This can be of any of the following forms: `0xFFFFFF`, `[1, 1, 1]`, `[1, 1, 1, 1]`, `"#FFFFFF"`, `"FFFFFF"`, `"#FFF"`, `"FFF"`.
	 */
	constructor(data: ColorData = 0xFFFFFF) {
		if (typeof data == "number") {
			data = [
				((data >> 16) & 0xFF) / 0xFF,
				((data >> 8) & 0xFF) / 0xFF,
				(data & 0xFF) / 0xFF
			];
		} else if (typeof data == "string") {
			if (data.length < 6) {
				if (data.startsWith("#")) {
					data = data.substring(1);
				}
				data = `${data[0]}${data[0]}${data[1]}${data[1]}${data[2]}${data[2]}`;
			}

			const regex: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data);
			if (regex) {
				regex.shift()
				data = regex.map((hex: string): number => parseInt(hex, 0x10) / 0xFF);
			} else {
				data = [];
			}
		}

		while (data.length < 4) {
			data.push(0xFF / 0xFF);
		}

		while (data.length > 4) {
			data.pop();
		}

		super(...data);
	}

	/** The red value of this color. */
	get r(): number {
		return this[0] ?? 0;
	}

	set r(value: number) {
		this[0] = value;
	}

	/** The green value of this color. */
	get g(): number {
		return this[1] ?? 0;
	}

	set g(value: number) {
		this[1] = value;
	}

	/** The blue value of this color. */
	get b(): number {
		return this[2] ?? 0;
	}

	set b(value: number) {
		this[2] = value;
	}

	/** The alpha value of this color. */
	get a(): number {
		return this[3] ?? 0;
	}

	set a(value: number) {
		this[3] = value;
	}
}