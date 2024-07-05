import MultipleValuedUniform from "#MultipleValuedUniform";

/**
 * An unsigned integer 3D vector global variable in a shader program.
 * @internal
 */
export default class UnsignedIntegerVector3Uniform extends MultipleValuedUniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>) {
		this.gl.uniform3uiv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
