import MatrixUniform4 from "./MatrixUniform4.js";

/**
 * A floating-point 2x2 matrix global variable in a shader program.
 * @internal
 */
export default class FloatMatrix2x2Uniform extends MatrixUniform4 {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniformMatrix | uniformMatrix[234]x[234]fv}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>): void {
		this.gl.uniformMatrix2fv(
			this.location,
			this.transpose ?? false,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
