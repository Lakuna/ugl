import Attribute from "#Attribute";
import type AttributeValue from "#AttributeValue";
import type Program from "#Program";

/**
 * An integer, unsigned integer, or boolean input variable in a vertex shader.
 * @internal
 */
export default class IntegerAttribute extends Attribute {
	/**
	 * Create an integer, unsigned integer, or boolean attribute.
	 * @param program - The shader program that the attribute belongs to.
	 * @param index - The index of the attribute.
	 * @internal
	 */
	public constructor(program: Program, index: number) {
		super(program, index);
	}

	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see [`vertexAttribIPointer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribIPointer)
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		this.gl.vertexAttribIPointer(
			this.location,
			value.size ?? 3,
			value.buffer.type,
			value.stride ?? 0,
			value.offset ?? 0
		);
	}
}
