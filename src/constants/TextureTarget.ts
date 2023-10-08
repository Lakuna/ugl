/**
 * Binding points for textures.
 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D)
 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
 */
enum TextureTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0de1,

	/** A cube-mapped texture. */
	TEXTURE_CUBE_MAP = 0x8513,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806f,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8c1a
}

export default TextureTarget;
