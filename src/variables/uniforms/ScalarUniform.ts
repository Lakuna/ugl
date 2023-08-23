import SingleValuedUniform from "#SingleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A scalar global variable in a WebGL shader program. */
export default abstract class ScalarUniform extends SingleValuedUniform {
	/** The value of this uniform. */
	public override get value(): number | MeasuredIterable<number> {
		// TODO: Optional caching.
		return this.valuePrivate as number | MeasuredIterable<number>;
	}

	/** The value of this uniform. */
	public override set value(value: number | MeasuredIterable<number>) {
		// TODO: Optional caching.
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}
