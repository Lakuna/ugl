import type Texture from "#Texture";

/** A value that can be passed to a uniform. */
export type UniformValue =
	| number
	| Iterable<number>
	| Texture
	| Iterable<Texture>;
