import ScalarUniform from "./ScalarUniform.js";

/**
 * An integer global variable in a shader program.
 * @internal
 */
export default class IntegerUniform extends ScalarUniform {
	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>) {
		this.gl.uniform1iv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override setterInternal(value: number) {
		this.gl.uniform1i(this.location, value);
	}
}
