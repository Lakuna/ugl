import Attribute from "#Attribute";
import type AttributeValue from "#AttributeValue";
import type Program from "#Program";
import getSizeOfDataType from "#getSizeOfDataType";

/**
 * A matrix input variable in a vertex shader.
 * @internal
 */
export default class MatrixAttribute extends Attribute {
	/**
	 * Create a matrix attribute.
	 * @param program - The shader program that the attribute belongs to.
	 * @param index - The index of the attribute.
	 * @internal
	 */
	public constructor(program: Program, index: number, dim: 1 | 2 | 3 | 4) {
		super(program, index);
		this.dim = dim;
	}

	/**
	 * The side length of values passed to this attribute.
	 * @internal
	 */
	private readonly dim;

	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see [`vertexAttribPointer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer)
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		const normalized = value.normalized ?? false;
		const stride = value.stride ?? 0;
		const offset = value.offset ?? 0;
		const actualStride = stride || getSizeOfDataType(value.buffer.type);
		for (let i = 0; i < this.dim; i++) {
			this.gl.vertexAttribPointer(
				this.location + i,
				this.dim,
				value.buffer.type,
				normalized,
				stride,
				offset + actualStride * this.dim * i
			);
		}
	}
}
