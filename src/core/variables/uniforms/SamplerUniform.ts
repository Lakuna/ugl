import type Texture from "../../textures/Texture.js";
import Uniform from "./Uniform.js";

/** A sampler global variable in a WebGL shader program. */
export default class SamplerUniform extends Uniform {
	/**
	 * The texture unit that is stored in this sampler uniform.
	 * @internal
	 */
	private textureUnitCache?: number | number[];

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<Texture>) {
		// Assign the textures to texture units.
		const textureUnits = [];
		for (const texture of value) {
			textureUnits.push(texture.bind());

			// Ensure that the texture is texture complete.
			if (!texture.isTextureComplete) {
				texture.generateMipmap();
			}
		}

		if (
			typeof this.textureUnitCache !== "undefined" &&
			typeof this.textureUnitCache !== "number" &&
			Symbol.iterator in this.textureUnitCache
		) {
			let matches = true;
			for (let i = 0; i < textureUnits.length; i++) {
				if (textureUnits[i] !== this.textureUnitCache[i]) {
					matches = false;
					break;
				}
			}

			if (matches) {
				return;
			}
		}

		// Pass the texture units to the shader program.
		this.gl.uniform1iv(
			this.location,
			textureUnits,
			this.sourceOffset,
			this.sourceLength
		);
		this.textureUnitCache = textureUnits;
	}

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override setter(value: Texture) {
		// Ensure that the texture is texture complete.
		if (!value.isTextureComplete) {
			value.generateMipmap();
		}

		const textureUnit = value.bind();
		if (
			typeof this.textureUnitCache === "number" &&
			this.textureUnitCache === textureUnit
		) {
			return;
		}

		// Pass the texture unit to the shader program.
		this.gl.uniform1i(this.location, textureUnit);
		this.textureUnitCache = textureUnit;
	}
}
