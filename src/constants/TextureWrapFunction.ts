/**
 * Wrapping functions for textures.
 * @see [`texParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 */
enum TextureWrapFunction {
	/** The texture repeats after it ends. */
	REPEAT = 0x2901,

	/** The last pixel of the texture repeats after it ends. */
	CLAMP_TO_EDGE = 0x812f,

	/** The texture repeats after it ends, mirroring on each repetition. */
	MIRRORED_REPEAT = 0x8370
}

export default TextureWrapFunction;
