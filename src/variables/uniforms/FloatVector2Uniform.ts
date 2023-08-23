import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 2D vector global variable in a WebGL shader program. */
export default class FloatVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		// TODO: Optional caching.
		this.context.internal.uniform2fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
