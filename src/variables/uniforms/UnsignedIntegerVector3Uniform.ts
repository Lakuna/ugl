import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** An unsigned integer 3D vector global variable in a WebGL shader program. */
export default class UnsignedIntegerVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform3uiv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
