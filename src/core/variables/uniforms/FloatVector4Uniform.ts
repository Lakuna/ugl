import MultipleValuedUniform from "./MultipleValuedUniform.js";

/**
 * A floating-point 4D vector global variable in a shader program.
 * @internal
 */
export default class FloatVector4Uniform extends MultipleValuedUniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>) {
		this.gl.uniform4fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
