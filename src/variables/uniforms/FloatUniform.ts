import ScalarUniform from "#ScalarUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float global variable in a WebGL shader program. */
export default class FloatUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		// TODO: Optional caching.
		this.context.internal.uniform1fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		// TODO: Optional caching.
		this.context.internal.uniform1f(this.location, value);
	}
}
