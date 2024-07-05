/**
 * Data types for texel data.
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
enum TextureDataType {
	/** Unsigned 8-bit integer data. */
	UNSIGNED_BYTE = 0x1401,

	/** Unsigned 16-bit integer data. */
	UNSIGNED_SHORT_5_6_5 = 0x8363,

	/** Unsigned 16-bit integer data. */
	UNSIGNED_SHORT_4_4_4_4 = 0x8033,

	/** Unsigned 16-bit integer data. */
	UNSIGNED_SHORT_5_5_5_1 = 0x8034,

	/** Unsigned 16-bit integer data. */
	UNSIGNED_SHORT = 0x1403,

	/** Unsigned 32-bit integer data. */
	UNSIGNED_INT = 0x1405,

	/** 32-bit floating-point data. */
	FLOAT = 0x1406,

	/** Unsigned 16-bit integer data. */
	HALF_FLOAT_OES = 0x8d61,

	/** Signed 8-bit integer data. */
	BYTE = 0x1400,

	/** Signed 16-bit integer data. */
	SHORT = 0x1402,

	/** Signed 32-bit integer data. */
	INT = 0x1404,

	/** Unsigned 16-bit integer data. */
	HALF_FLOAT = 0x140b,

	/** Unsigned 32-bit integer data. */
	UNSIGNED_INT_2_10_10_10_REV = 0x8368,

	/** Unsigned 32-bit integer data. */
	UNSIGNED_INT_10F_11F_11F_REV = 0x8c3b,

	/** Unsigned 32-bit integer data. */
	UNSIGNED_INT_5_9_9_9_REV = 0x8c3e,

	/** Unsigned 32-bit integer data. */
	UNSIGNED_INT_24_8 = 0x84fa,

	/**
	 * Null data.
	 * @deprecated Unusable in WebGL.
	 */
	FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8dad
}

export default TextureDataType;
