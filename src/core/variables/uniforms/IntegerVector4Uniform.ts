import Vector4Uniform from "./Vector4Uniform.js";

/**
 * An integer 4D vector global variable in a shader program.
 * @internal
 */
export default class IntegerVector4Uniform extends Vector4Uniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>) {
		this.gl.uniform4iv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
