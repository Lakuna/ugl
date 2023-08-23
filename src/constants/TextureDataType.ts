/** Data types for texel data. */
enum TextureDataType {
	/**
	 * Indicates that data must come from a `Uint8Array` or a
	 * `Uint8ClampedArray`.
	 */
	UNSIGNED_BYTE = 0x1401,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_5_6_5 = 0x8363,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_4_4_4_4 = 0x8033,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT_5_5_5_1 = 0x8034,

	/** Indicates that data must come from a `Uint16Array`. */
	UNSIGNED_SHORT = 0x1403,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT = 0x1405,

	/** Indicates that data must come from a `Float32Array`. */
	FLOAT = 0x1406,

	/** Indicates that data must come from a `Uint16Array`. */
	HALF_FLOAT_OES = 0x8d61,

	/** Indicates that data must come from an `Int8Array`. */
	BYTE = 0x1400,

	/** Indicates that data must come from an `Int16Array`. */
	SHORT = 0x1402,

	/** Indicates that data must come from an `Int32Array`. */
	INT = 0x1404,

	/** Indicates that data must come from a `Uint16Array`. */
	HALF_FLOAT = 0x140b,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_2_10_10_10_REV = 0x8368,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_10F_11F_11F_REV = 0x8c3b,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_5_9_9_9_REV = 0x8c3e,

	/** Indicates that data must come from a `Uint32Array`. */
	UNSIGNED_INT_24_8 = 0x84fa,

	/** Indicates that data must be null. */
	FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8dad
}

export default TextureDataType;
