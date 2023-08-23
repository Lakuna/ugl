import MatrixUniform from "#MatrixUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 2x2 matrix global variable in a WebGL shader program. */
export default class FloatMatrix2x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		// TODO: Optional caching.
		this.context.internal.uniformMatrix2fv(
			this.location,
			this.transpose,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
