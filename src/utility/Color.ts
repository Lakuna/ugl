/** A color. */
export class Color extends Float32Array {
	/**
	 * Creates a color from a hexadecimal value.
	 * @param hex - The color as a hexadecimal number.
	 */
	constructor(hex: number);

	/**
	 * Creates a color from RGBA values.
	 * @param r - The amount of red in the color, from `0` to `1`.
	 * @param g - The amount of green in the color, from `0` to `1`.
	 * @param b - The amount of blue in the color, from `0` to `1`.
	 * @param a - The opacity of the color, from `0` to `1`.
	 */
	constructor(r: number, g: number, b: number, a?: number);

	constructor(r = 0xFFFFFF, g?: number, b?: number, a?: number) {
		super(g ? [r, g, b as number, a as number] : [
			((r >> 16) & 0xFF) / 0xFF,
			((r >> 8) & 0xFF) / 0xFF,
			(r & 0xFF) / 0xFF,
			0xFF / 0xFF
		]);
	}

	/** The red value of this color. */
	get r(): number {
		return this[0] as number;
	}
	set r(value: number) {
		this[0] = value;
	}

	/** The green value of this color. */
	get g(): number {
		return this[1] as number;
	}
	set g(value: number) {
		this[1] = value;
	}

	/** The blue value of this color. */
	get b(): number {
		return this[2] as number;
	}
	set b(value: number) {
		this[2] = value;
	}

	/** The alpha value of this color. */
	get a(): number {
		return this[3] as number;
	}
	set a(value: number) {
		this[3] = value;
	}
}
