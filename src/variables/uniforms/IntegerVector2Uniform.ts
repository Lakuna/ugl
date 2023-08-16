import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** An integer or boolean 2D vector global variable in a WebGL shader program. */
export default class IntegerVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform2iv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
