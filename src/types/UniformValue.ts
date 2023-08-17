import type Texture from "#Texture";
import type Mip from "#Mip";

/** A value that can be stored in a uniform. */
export type UniformValue = number | Iterable<number> | Texture<Mip>;
