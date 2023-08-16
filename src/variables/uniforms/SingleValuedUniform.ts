import Uniform from "#Uniform";
import type { UniformValue } from "#UniformValue";
import type MeasuredIterable from "#MeasuredIterable";

/** A global variable that can hold one value in a WebGL shader program. */
export default abstract class SingleValuedUniform extends Uniform {
	/** The setter method for this uniform. */
	public abstract setter(value: UniformValue): void;

	/** The value of this uniform. */
	public override set value(
		value: UniformValue | MeasuredIterable<UniformValue>
	) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}
