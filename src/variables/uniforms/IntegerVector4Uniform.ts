import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/**
 * An integer or boolean 4D vector global variable in a WebGL shader program.
 */
export default class IntegerVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		// TODO: Optional caching.
		this.context.internal.uniform4iv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
