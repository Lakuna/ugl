import Attribute from "#Attribute";
import type AttributeValue from "#AttributeValue";
import type Program from "#Program";

/**
 * A floating-point input variable in a WebGL vertex shader.
 * @internal
 */
export default class FloatAttribute extends Attribute {
	/**
	 * Create a floating-point attribute.
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
	 * @see [`vertexAttribPointer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer)
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		this.gl.vertexAttribPointer(
			this.location,
			value.size ?? 3,
			value.buffer.type,
			value.normalized ?? false,
			value.stride ?? 0,
			value.offset ?? 0
		);
	}
}
