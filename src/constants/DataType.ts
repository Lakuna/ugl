/**
 * Types of data that can be stored as components in a buffer.
 * @public
 */
enum DataType {
	/** An 8-bit signed integer with values in the range `[-0x80,0x80)`. */
	BYTE = 0x1400,

	/** A 16-bit signed integer with values in the range `[-0x8000,0x8000)`. */
	SHORT = 0x1402,

	/** An 8-bit unsigned integer with values in the range `[0x0,0x100)`. */
	UNSIGNED_BYTE = 0x1401,

	/** A 16-bit unsigned integer with values in the range `[0x0,0x10000)`. */
	UNSIGNED_SHORT = 0x1403,

	/** A 32-bit signed floating-point number. */
	FLOAT = 0x1406,

	/** A 16-bit signed floating-point number. */
	HALF_FLOAT = 0x140b,

	/** A 32-bit signed integer. */
	INT = 0x1404,

	/** A 32-bit unsigned integer. */
	UNSIGNED_INT = 0x1405,

	/** A 32-bit signed integer with values in the range `[-0x200,0x200)`. */
	INT_2_10_10_10_REV = 0x8d9f,

	/** A 32-bit unsigned integer with values in the range `[0x0,0x400)`. */
	UNSIGNED_INT_2_10_10_10_REV = 0x8368
}

export default DataType;
