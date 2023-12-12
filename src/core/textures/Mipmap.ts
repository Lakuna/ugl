import type Mip from "#Mip";

/** A list of mips that make up a texture. */
export default abstract class Mipmap<
	Miptype extends Mip
> extends Array<Miptype> {
	// TODO
}
