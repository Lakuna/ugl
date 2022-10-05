/** A color. */
export default class Color extends Array<number> {
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
		super(...(typeof g == "number"
			? [r, g, b as number, a as number]
			: [
				((r >> 16) & 0xFF) / 0xFF,
				((r >> 8) & 0xFF) / 0xFF,
				(r & 0xFF) / 0xFF,
				0xFF / 0xFF
			]
		));
	}

	/** The luminance of this color. */
	public get luminance(): number {
		const rgb: Array<number> = [];
		for (let i = 0; i < 3; i++) {
			rgb.push(this[i] as number > 0.03928
				? (((this[i] as number) + 0.055) / 1.055) ** 2.4
				: (this[i] as number) / 12.92
			);
		}

		return 0.2126 * (rgb[0] as number) + 0.7152 * (rgb[1] as number) + 0.0722 * (rgb[2] as number);
	}

	/**
	 * Calculates the contrast ratio between two colors.
	 * @param c The other color.
	 * @returns The contrast ratio between the two colors.
	 */
	public contrast(c: Color): number {
		const l1: number = this.luminance;
		const l2: number = c.luminance;

		return l1 > l2
			? (l1 + 0.05) / (l2 + 0.05)
			: (l2 + 0.05) / (l1 + 0.05);
	}
}
