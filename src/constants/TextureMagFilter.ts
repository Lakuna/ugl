/**
 * Magnification filters for textures.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
enum TextureMagFilter {
	/** Chooses one pixel from the largest mip. */
	NEAREST = 0x2600,

	/** Chooses four pixels from the largest mip and blends them. */
	LINEAR = 0x2601
}

export default TextureMagFilter;
