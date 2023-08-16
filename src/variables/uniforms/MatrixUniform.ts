import MultipleValuedUniform from "#MultipleValuedUniform";
import type Program from "#Program";

/** A matrix global variable in a WebGL shader program. */
export default abstract class MatrixUniform extends MultipleValuedUniform {
	/**
	 * Creates a matrix uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 */
	public constructor(program: Program, index: number) {
		super(program, index);
		this.transpose = false;
	}

	/** Whether to transpose the value of this uniform when passing it to WebGL. */
	public transpose: boolean;
}
