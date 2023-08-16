/** Possible variable types for attributes. */
const enum AttributeType {
	/** A 32-bit signed floating-point value. */
	FLOAT = 0x1406,

	/** A two-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC2 = 0x8b50,

	/** A three-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC3 = 0x8b51,

	/** A four-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC4 = 0x8b52,

	/** A boolean value. */
	BOOL = 0x8b56,

	/** A 32-bit signed integer value. */
	INT = 0x1404,

	/** A two-dimensional vector of boolean values. */
	BOOL_VEC2 = 0x8b57,

	/** A two-dimensional vector of 32-bit signed integer values. */
	INT_VEC2 = 0x8b53,

	/** A three-dimensional vector of boolean values. */
	BOOL_VEC3 = 0x8b58,

	/** A three-dimensional vector of 32-bit signed integer values. */
	INT_VEC3 = 0x8b54,

	/** A four-dimensional vector of boolean values. */
	BOOL_VEC4 = 0x8b59,

	/** A four-dimensional vector of 32-bit signed integer values. */
	INT_VEC4 = 0x8b55,

	/** A 32-bit signed uninteger value. */
	UNSIGNED_INT = 0x1405,

	/** A two-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC2 = 0x8dc6,

	/** A three-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC3 = 0x8dc7,

	/** A four-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC4 = 0x8dc8,

	/** A matrix of 32-bit signed floating-point values with two rows and two columns. */
	FLOAT_MAT2 = 0x8b5a,

	/** A matrix of 32-bit signed floating-point values with three rows and three columns. */
	FLOAT_MAT3 = 0x8b5b,

	/** A matrix of 32-bit signed floating-point values with four rows and four columns. */
	FLOAT_MAT4 = 0x8b5c
}

export default AttributeType;
