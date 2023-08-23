import Uniform from "#Uniform";
import type MeasuredIterable from "#MeasuredIterable";

/**
 * A global variable that can only hold multiple values in a WebGL shader
 * program.
 */
export default abstract class MultipleValuedUniform extends Uniform {
	/** The value of this uniform. */
	public override get value(): MeasuredIterable<number> {
		return this.valuePrivate as MeasuredIterable<number>;
	}

	/** The value of this uniform. */
	public override set value(value: MeasuredIterable<number>) {
		this.arraySetter(value);
		this.valuePrivate = value;
	}
}
