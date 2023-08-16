import ScalarUniform from "#ScalarUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** An integer or boolean global variable in a WebGL shader program. */
export default class IntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform1iv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.context.internal.uniform1i(this.location, value);
	}
}
