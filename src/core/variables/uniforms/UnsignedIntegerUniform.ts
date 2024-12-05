import ScalarUniform from "./ScalarUniform.js";

/**
 * An unsigned integer global variable in a shader program.
 * @internal
 */
export default class UnsignedIntegerUniform extends ScalarUniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>): void {
		this.gl.uniform1uiv(
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
	public override setterInternal(value: number): void {
		this.gl.uniform1ui(this.location, value);
	}
}
