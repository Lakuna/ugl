import Attribute from "./Attribute.js";
import type AttributeValue from "../../../types/AttributeValue.js";

/**
 * A floating-point input variable in a WebGL vertex shader.
 * @internal
 */
export default class FloatAttribute extends Attribute {
	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer | vertexAttribPointer}
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		if (
			value.size === this.value?.size &&
			value.vbo === this.value?.vbo &&
			value.normalized === this.value.normalized &&
			value.stride === this.value.stride &&
			value.offset === this.value.offset
		) {
			return;
		}

		this.gl.vertexAttribPointer(
			this.location,
			value.size ?? 3,
			value.vbo.type,
			value.normalized ?? false,
			value.stride ?? 0,
			value.offset ?? 0
		);

		this.valueCache = value;
	}
}
