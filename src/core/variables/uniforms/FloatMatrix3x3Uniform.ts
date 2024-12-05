import MatrixUniform9 from "./MatrixUniform9.js";

/**
 * A floating-point 3x3 matrix global variable in a shader program.
 * @internal
 */
export default class FloatMatrix3x3Uniform extends MatrixUniform9 {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniformMatrix | uniformMatrix[234]x[234]fv}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>): void {
		this.gl.uniformMatrix3fv(
			this.location,
			this.transpose ?? false,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
