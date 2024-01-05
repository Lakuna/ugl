/**
 * Comparison modes for textures.
 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
 */
enum TextureCompareMode {
	/** No compare mode. */
	NONE = 0,

	/** Compare the reference to the texture. */
	COMPARE_REF_TO_TEXTURE = 0x884e
}
export default TextureCompareMode;
