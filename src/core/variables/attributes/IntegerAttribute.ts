import Attribute from "./Attribute.js";
import type AttributeValue from "../../../types/AttributeValue.js";

/**
 * An integer, unsigned integer, or boolean input variable in a vertex shader.
 * @internal
 */
export default class IntegerAttribute extends Attribute {
	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribIPointer | vertexAttribIPointer}
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		this.gl.vertexAttribIPointer(
			this.location,
			value.size ?? 3,
			value.vbo.type,
			value.stride ?? 0,
			value.offset ?? 0
		);
	}
}
