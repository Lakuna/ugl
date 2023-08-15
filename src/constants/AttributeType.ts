/** Possible variable types for attributes. */
const enum AttributeType {
    /** A 32-bit signed floating-point value. */
    FLOAT = 0x1406,

    /** A two-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC2 = 0x8B50,

    /** A three-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC3 = 0x8B51,

    /** A four-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC4 = 0x8B52,

    /** A boolean value. */
    BOOL = 0x8B56,

    /** A 32-bit signed integer value. */
    INT = 0x1404,

    /** A two-dimensional vector of boolean values. */
    BOOL_VEC2 = 0x8B57,

    /** A two-dimensional vector of 32-bit signed integer values. */
    INT_VEC2 = 0x8B53,

    /** A three-dimensional vector of boolean values. */
    BOOL_VEC3 = 0x8B58,

    /** A three-dimensional vector of 32-bit signed integer values. */
    INT_VEC3 = 0x8B54,

    /** A four-dimensional vector of boolean values. */
    BOOL_VEC4 = 0x8B59,

    /** A four-dimensional vector of 32-bit signed integer values. */
    INT_VEC4 = 0x8B55,

    /** A 32-bit signed uninteger value. */
    UNSIGNED_INT = 0x1405,

    /** A two-dimensional vector of 32-bit unsigned integer values. */
    UNSIGNED_INT_VEC2 = 0x8DC6,

    /** A three-dimensional vector of 32-bit unsigned integer values. */
    UNSIGNED_INT_VEC3 = 0x8DC7,

    /** A four-dimensional vector of 32-bit unsigned integer values. */
    UNSIGNED_INT_VEC4 = 0x8DC8,

    /** A matrix of 32-bit signed floating-point values with two rows and two columns. */
    FLOAT_MAT2 = 0x8B5A,

    /** A matrix of 32-bit signed floating-point values with three rows and three columns. */
    FLOAT_MAT3 = 0x8B5B,

    /** A matrix of 32-bit signed floating-point values with four rows and four columns. */
    FLOAT_MAT4 = 0x8B5C
}

export default AttributeType;
