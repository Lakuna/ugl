/** Types of data that can be stored as components in a buffer. */
const enum BufferDataType {
	/** An 8-bit signed integer. */
	BYTE = 0x1400,

	/** A 16-bit signed integer. */
	SHORT = 0x1402,

	/** An 8-bit unsigned integer. */
	UNSIGNED_BYTE = 0x1401,

	/** A 16-bit unsigned integer. */
	UNSIGNED_SHORT = 0x1403,

	/** A 32-bit signed floating-point number. */
	FLOAT = 0x1406,

	/** A 16-bit signed floating-point number. */
	HALF_FLOAT = 0x140b
}

export default BufferDataType;
