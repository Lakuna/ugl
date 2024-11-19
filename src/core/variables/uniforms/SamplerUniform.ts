import IntegerUniform from "./IntegerUniform.js";
import type Texture from "../../textures/Texture.js";

/** A sampler global variable in a WebGL shader program. */
export default class SamplerUniform extends IntegerUniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number> | Iterable<Texture>) {
		const textureUnits = [];
		for (const texture of value) {
			// If a texture unit was passed, just fall back to integer behavior.
			if (typeof texture === "number") {
				super.iterableSetter(value as Iterable<number>);
				return;
			}

			// Ensure that the texture is texture complete.
			if (!texture.isTextureComplete) {
				texture.generateMipmap();
			}

			textureUnits.push(texture.bind(void 0, true));
		}

		// Can only accept one value.
		const [textureUnit] = [...textureUnits];
		if (
			textureUnit === this.scalarValueCache ||
			typeof textureUnit === "undefined"
		) {
			return;
		}

		// Pass the texture units to the shader program.
		this.iterableSetterInternal(textureUnits);
		this.scalarValueCache = textureUnit;
	}

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override setter(value: number | Texture) {
		// If a texture unit was passed, just fall back to integer behavior.
		if (typeof value === "number") {
			super.setter(value);
			return;
		}

		// Ensure that the texture is texture complete.
		if (!value.isTextureComplete) {
			value.generateMipmap();
		}

		const textureUnit = value.bind(void 0, true);
		if (textureUnit === this.scalarValueCache) {
			return;
		}

		// Pass the texture unit to the shader program.
		this.setterInternal(textureUnit);
		this.scalarValueCache = textureUnit;
	}
}
