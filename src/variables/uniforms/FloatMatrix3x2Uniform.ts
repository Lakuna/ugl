import MatrixUniform from "#MatrixUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 3x2 matrix global variable in a WebGL shader program. */
export default class FloatMatrix3x2Uniform extends MatrixUniform {
    /** The setter method for this uniform if the value is an array. */
    public arraySetter(value: MeasuredIterable<number>): void {
        this.context.internal.uniformMatrix3x2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
    }
}
