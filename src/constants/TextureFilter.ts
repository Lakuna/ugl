/**
 * Minification and magnification filters for textures.
 * @public
 */
const enum TextureFilter {
	/** Choose one pixel from the largest mip. */
	NEAREST = 0x2600,

	/** Choose four pixels from the largest mip and blends them. */
	LINEAR = 0x2601,

	/** Choose the best mip, then picks one pixel from that mip. */
	NEAREST_MIPMAP_NEAREST = 0x2700,

	/** Choose the best mip, then blends four pixels from that mip. */
	LINEAR_MIPMAP_NEAREST = 0x2701,

	/** Choose the best two mips, then chooses one pixel from each and blends them. */
	NEAREST_MIPMAP_LINEAR = 0x2702,

	/** Choose the best two mips, then chooses four pixels from each and blends them. */
	LINEAR_MIPMAP_LINEAR = 0x2703
}

export default TextureFilter;
