// Based on work by trincot.

/** Data which can be used to create a bigdecimal. */
export type BigDecimalData = string | number | BigInt | BigDecimal;

/** A high-precision floating-point number. */
export class BigDecimal {
	#divideRound(dividend: bigint, divisor: bigint): BigDecimal {
		this.expandedValue = dividend / divisor + (this.rounded ? dividend * 2n / divisor % 2n : 0n);
		return this;
	}

	readonly #shift: bigint;

	/**
	 * Creates a bigdecimal.
	 * @param value - The number to store in the bigdecimal.
	 * @param decimalPlaces - The number of decimal places to store in the bigdecimal.
	 * @param rounded - Whether to round the number. Truncates otherwise.
	 */
	constructor(value: BigDecimalData, decimalPlaces = 100, rounded = true) {
		this.decimalPlaces = decimalPlaces;
		this.rounded = rounded;
		this.#shift = BigInt("1" + "0".repeat(Number(decimalPlaces)));
		this.expandedValue = 0n;
		this.value = value;
	}

	/** Number of decimal places for this bigdecimal. */
	readonly decimalPlaces: number;

	/** Whether to round this number. Truncates otherwise. */
	readonly rounded: boolean;

	/** The unshifted value stored in this bigdecimal. */
	protected expandedValue: bigint;

	/** The value of the bigdecimal. */
	get value(): string {
		const s: string = String(this.expandedValue).padStart(this.decimalPlaces + 1, "0");
		return s.slice(0, -this.decimalPlaces) + "." + s.slice(-this.decimalPlaces).replace(/\.?0+$/, "");
	}

	set value(value: BigDecimalData) {
		const [integer, decimal]: string[] = String(value).split(".").concat("");
		this.expandedValue = BigInt(integer + (decimal?.padEnd(this.decimalPlaces, "0").slice(0, this.decimalPlaces) ?? ""))
			+ BigInt(this.rounded && (decimal?.[this.decimalPlaces] ?? "") >= "5");
	}

	/** Converts the bigdecimal to a string. */
	toString(): string {
		return this.value;
	}

	/**
	 * Adds to this bigdecimal.
	 * @param value - The amount to add.
	 * @returns This bigdecimal.
	 */
	add(value: BigDecimalData): BigDecimal {
		this.expandedValue += new BigDecimal(value, this.decimalPlaces, this.rounded).expandedValue;
		return this;
	}

	/**
	 * Subtracts from this bigdecimal.
	 * @param value - The amount to subtract.
	 * @returns This bigdecimal.
	 */
	subtract(value: BigDecimalData): BigDecimal {
		this.expandedValue -= new BigDecimal(value, this.decimalPlaces, this.rounded).expandedValue;
		return this;
	}

	/**
	 * Multiplies this bigdecimal.
	 * @param value - The amount to multiply by.
	 * @returns This bigdecimal.
	 */
	multiply(value: BigDecimalData): BigDecimal {
		return this.#divideRound(this.expandedValue * new BigDecimal(value, this.decimalPlaces, this.rounded).expandedValue, this.#shift);
	}

	/**
	 * Divides this bigdecimal.
	 * @param value - The amount to divide by.
	 * @returns This bigdecimal.
	 */
	divide(value: BigDecimalData): BigDecimal {
		return this.#divideRound(this.expandedValue * this.#shift, new BigDecimal(value).expandedValue);
	}
}