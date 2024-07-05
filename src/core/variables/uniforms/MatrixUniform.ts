import MultipleValuedUniform from "#MultipleValuedUniform";

/**
 * A matrix global variable in a WebGL shader program.
 * @internal
 */
export default abstract class MatrixUniform extends MultipleValuedUniform {
	/** Whether or not to transpose the value of this uniform when passing it to WebGL. Treated as `false` if not set. */
	public transpose?: boolean;
}
