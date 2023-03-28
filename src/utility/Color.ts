/**
 * The piecewise equation used internally for calculating relative luminance.
 * @param c The value passed to the piecewise function (red, green, or blue).
 * @returns The modified value.
 */
function luminancePiecewise(c: number) {
	return c > 0.04045
		? ((c + 0.055) / 1.055) ** 2.4
		: c / 12.92
}

/** A color. */
export default class Color extends Float32Array {
	/**
	 * Creates a color from a hexadecimal value.
	 * @param hex The color as a hexadecimal number.
	 */
	public constructor(hex: number);

	/**
	 * Creates a color from RGBA values.
	 * @param r The amount of red in the color, from `0` to `1`.
	 * @param g The amount of green in the color, from `0` to `1`.
	 * @param b The amount of blue in the color, from `0` to `1`.
	 * @param a The opacity of the color, from `0` to `1`.
	 */
	public constructor(r: number, g: number, b: number, a?: number);

	public constructor(r = 0xFFFFFF, g?: number, b?: number, a?: number) {
		super(typeof g == "number" && typeof b == "number"
			? [r, g, b, typeof a == "number" ? a : 1]
			: [
				((r >> 16) & 0xFF) / 0xFF,
				((r >> 8) & 0xFF) / 0xFF,
				(r & 0xFF) / 0xFF,
				0xFF / 0xFF
			]
		);
	}

	/** The red value of this color. */
	public get r(): number {
		return this[0] as number;
	}

	public set r(value: number) {
		this[0] = value;
	}

	/** The green value of this color. */
	public get g(): number {
		return this[1] as number;
	}

	public set g(value: number) {
		this[1] = value;
	}

	/** The blue value of this color. */
	public get b(): number {
		return this[2] as number;
	}

	public set b(value: number) {
		this[2] = value;
	}

	/** The alpha value of this color. */
	public get a(): number {
		return this[3] as number;
	}

	public set a(value: number) {
		this[3] = value;
	}

	/**
	 * The luminance of this color.
	 * @see [Relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance)
	 */
	public get luminance(): number {
		return 0.2126 * luminancePiecewise(this.r)
			+ 0.7152 * luminancePiecewise(this.g)
			+ 0.0722 * luminancePiecewise(this.b);
	}

	/**
	 * Calculates the contrast ratio between this color and another.
	 * @param c The other color.
	 * @returns The contrast ratio between the colors.
	 * @see [Contrast ratio](https://www.w3.org/WAI/GL/wiki/Contrast_ratio)
	 */
	public contrast(c: Color): number {
		const l1: number = this.luminance;
		const l2: number = c.luminance;

		return l1 > l2
			? (l1 + 0.05) / (l2 + 0.05)
			: (l2 + 0.05) / (l1 + 0.05);
	}
}
