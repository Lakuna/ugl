/**
 * Binding points for mipmaps.
 * @see [`compressedTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D)
 * @see [`compressedTexSubImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D)
 * @see [`copyTexImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D)
 * @see [`copyTexSubImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexSubImage2D)
 * @see [`texImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)
 * @see [`texSubImage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D)
 * @see [`compressedTexSubImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/compressedTexSubImage3D)
 * @see [`copyTexSubImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/copyTexSubImage3D)
 * @see [`texImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D)
 * @see [`texSubImage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texSubImage3D)
 */
enum MipmapTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0de1,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806f,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8c1a,

	/** The positive X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,

	/** The negative X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,

	/** The positive Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,

	/** The negative Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,

	/** The positive Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,

	/** The negative Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a
}

export default MipmapTarget;
