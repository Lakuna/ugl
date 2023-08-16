import ScalarUniform from "#ScalarUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** An unsigned integer global variable in a WebGL shader program. */
export default class UnsignedIntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform1uiv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.context.internal.uniform1ui(this.location, value);
	}
}
