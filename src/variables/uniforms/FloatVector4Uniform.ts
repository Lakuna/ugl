import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 4D vector global variable in a WebGL shader program. */
export default class FloatVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform4fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
