import MultipleValuedUniform from "#MultipleValuedUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** An integer or boolean 3D vector global variable in a WebGL shader program. */
export default class IntegerVector3Uniform extends MultipleValuedUniform {
    /** The setter method for this uniform if the value is an array. */
    public arraySetter(value: MeasuredIterable<number>): void {
        this.context.internal.uniform3iv(this.location, value, this.sourceOffset, this.sourceLength);
    }
}
