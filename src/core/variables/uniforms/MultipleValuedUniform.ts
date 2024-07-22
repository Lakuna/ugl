import Uniform from "./Uniform.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";

/**
 * A global variable that can only hold multiple values in a WebGL shader program.
 * @internal
 */
export default abstract class MultipleValuedUniform extends Uniform {
	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @internal
	 */
	public override setter() {
		// TODO: Add `@throws` documentation.

		throw new UnsupportedOperationError(
			`${this.name} cannot be set to a non-iterable value.`
		);
	}
}
