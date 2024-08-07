import MultipleValuedUniform from "./MultipleValuedUniform.js";

/**
 * An unsigned integer 4D vector global variable in a shader program.
 * @internal
 */
export default class UnsignedIntegerVector4Uniform extends MultipleValuedUniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>) {
		this.gl.uniform4uiv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
