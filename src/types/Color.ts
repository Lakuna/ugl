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

/** A color mask. */
export class ColorMask extends Array<boolean> {
	/**
	 * Creates a color mask.
	 * @param r - Whether to allow red values.
	 * @param g - Whether to allow green values.
	 * @param b - Whether to allow blue values.
	 * @param a - Whether to allow alpha values.
	 */
	constructor(r: boolean, g: boolean, b: boolean, a: boolean) {
		super(r, g, b, a);
	}

	/** Whether to allow red values. */
	get r(): boolean {
		return this[0] ?? false;
	}
	set r(value: boolean) {
		this[0] = value;
	}

	/** Whether to allow green values. */
	get g(): boolean {
		return this[1] ?? false;
	}
	set g(value: boolean) {
		this[1] = value;
	}

	/** Whether to allow blue values. */
	get b(): boolean {
		return this[2] ?? false;
	}
	set b(value: boolean) {
		this[2] = value;
	}

	/** Whether to allow alpha values. */
	get a(): boolean {
		return this[3] ?? false;
	}
	set a(value: boolean) {
		this[3] = value;
	}
}
