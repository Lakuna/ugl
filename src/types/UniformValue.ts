import type Texture from "../core/textures/Texture.js";

/**
 * A value that can be passed to a uniform.
 * @public
 */
export type UniformValue =
	| number
	| Iterable<number>
	| Texture
	| Iterable<Texture>;
