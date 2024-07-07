import type Texture from "../../textures/Texture.js";
import Uniform from "./Uniform.js";

/** A sampler global variable in a WebGL shader program. */
export default class SamplerUniform extends Uniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
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

		// Pass the texture units to the shader program.
		this.gl.uniform1iv(
			this.location,
			textureUnits,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @internal
	 */
	public override setter(value: Texture) {
		this.gl.uniform1i(this.location, value.bind());
	}
}
