import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 3D vector global variable in a WebGL shader program. */
export default class FloatVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		// TODO: Optional caching.
		this.context.internal.uniform3fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
