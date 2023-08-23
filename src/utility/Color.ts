import type { ColorLike } from "#ColorLike";

/** A color. */
export default class Color extends Float32Array {
	/**
	 * The piecewise equation used internally for calculating relative
	 * luminance.
	 * @param c The value passed to the piecewise function (red, green, or
	 * blue).
	 * @returns The modified value.
	 */
	private static luminancePiecewise(c: number) {
		return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
	}

	/**
	 * Returns the luminance of a color.
	 * @param color The color.
	 * @returns The luminance.
	 * @see [Relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance)
	 */
	private static luminance(color: ColorLike): number {
		return (
			0.2126 * Color.luminancePiecewise(color[0]) +
			0.7152 * Color.luminancePiecewise(color[1]) +
			0.0722 * Color.luminancePiecewise(color[2])
		);
	}

	/**
	 * Calculates the contrast ratio between two colors.
	 * @param a The first color.
	 * @param b The second color.
	 * @returns The contrast ratio between the colors.
	 * @see [Contrast ratio](https://www.w3.org/WAI/GL/wiki/Contrast_ratio)
	 */
	private static contrast(a: ColorLike, b: ColorLike): number {
		const l1: number = Color.luminance(a);
		const l2: number = Color.luminance(b);

		return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
	}

	/**
	 * Creates a color from a hexadecimal value.
	 * @param hex The color as a hexadecimal number.
	 */
	public constructor(hex: number);

	/**
	 * Creates a color from RGBA values.
	 * @param r The red component of the color, from `0` to `1`.
	 * @param g The green component of the color, from `0` to `1`.
	 * @param b The blue component of the color, from `0` to `1`.
	 * @param a The alpha component (opacity) of the color, from `0` to `1`.
	 */
	public constructor(r: number, g: number, b: number, a?: number);

	public constructor(r = 0xffffff, g?: number, b?: number, a?: number) {
		super(
			typeof g == "number" && typeof b == "number"
				? [r, g, b, typeof a == "number" ? a : 1]
				: [
						((r >> 16) & 0xff) / 0xff,
						((r >> 8) & 0xff) / 0xff,
						(r & 0xff) / 0xff,
						0xff / 0xff
				  ]
		);
	}

	/** The red component of this color. */
	public get r(): number {
		return this[0] as number;
	}

	/** The red component of this color. */
	public set r(value: number) {
		this[0] = value;
	}

	/** The green component of this color. */
	public get g(): number {
		return this[1] as number;
	}

	/** The green component of this color. */
	public set g(value: number) {
		this[1] = value;
	}

	/** The blue component of this color. */
	public get b(): number {
		return this[2] as number;
	}

	/** The blue component of this color. */
	public set b(value: number) {
		this[2] = value;
	}

	/** The alpha component of this color. */
	public get a(): number {
		return this[3] as number;
	}

	/** The alpha component of this color. */
	public set a(value: number) {
		this[3] = value;
	}

	/**
	 * The luminance of this color.
	 * @see [Relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance)
	 */
	public get luminance(): number {
		return Color.luminance(this);
	}

	/**
	 * Calculates the contrast ratio between this color and another.
	 * @param color The other color.
	 * @returns The contrast ratio between the colors.
	 * @see [Contrast ratio](https://www.w3.org/WAI/GL/wiki/Contrast_ratio)
	 */
	public contrast(color: ColorLike): number {
		return Color.contrast(this, color);
	}
}
