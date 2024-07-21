/**
 * Types of attributes.
 * @public
 */
enum VariableType {
	// Attribute or Uniform Types

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
	FLOAT_MAT4 = 0x8b5c,

	// Uniform-Only Types

	/** A sampler of a 2D texture. */
	SAMPLER_2D = 0x8b5e,

	/** A sampler of a 3D texture. */
	SAMPLER_3D = 0x8b5f,

	/** A sampler of a cube texture. */
	SAMPLER_CUBE = 0x8b60,

	/** A sampler of a 2D shadow texture. */
	SAMPLER_2D_SHADOW = 0x8b62,

	/** A sampler of a 2D array texture. */
	SAMPLER_2D_ARRAY = 0x8dc1,

	/** A sampler of a 2D array shadow texture. */
	SAMPLER_2D_ARRAY_SHADOW = 0x8dc4,

	/** A sampler of a cube shadow texture. */
	SAMPLER_CUBE_SHADOW = 0x8dc5,

	/** An integer sampler of a 2D texture. */
	INT_SAMPLER_2D = 0x8dca,

	/** An integer sampler of a 3D texture. */
	INT_SAMPLER_3D = 0x8dcb,

	/** An integer sampler of a cube texture. */
	INT_SAMPLER_CUBE = 0x8dcc,

	/** An integer sampler of a 2D array texture. */
	INT_SAMPLER_2D_ARRAY = 0x8dcf,

	/** A matrix of 32-bit signed floating-point values with two rows and three columns. */
	FLOAT_MAT2x3 = 0x8b65,

	/** A matrix of 32-bit signed floating-point values with two rows and four columns. */
	FLOAT_MAT2x4 = 0x8b66,

	/** A matrix of 32-bit signed floating-point values with three rows and two columns. */
	FLOAT_MAT3x2 = 0x8b67,

	/** A matrix of 32-bit signed floating-point values with three rows and four columns. */
	FLOAT_MAT3x4 = 0x8b68,

	/** A matrix of 32-bit signed floating-point values with four rows and two columns. */
	FLOAT_MAT4x2 = 0x8b69,

	/** A matrix of 32-bit signed floating-point values with four rows and three columns. */
	FLOAT_MAT4x3 = 0x8b6a
}

export default VariableType;
