import Uniform from "#Uniform";

/**
 * An unsigned integer global variable in a shader program.
 * @internal
 */
export default class UnsignedIntegerUniform extends Uniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>) {
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
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @internal
	 */
	public override setter(value: number) {
		this.gl.uniform1ui(this.location, value);
	}
}
