/**
 * Data types for texel data.
 * @public
 */
const enum TextureDataType {
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
