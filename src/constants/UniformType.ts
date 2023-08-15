/** Possible variable types for uniforms. */
const enum UniformType {
    /** A 32-bit signed floating-point value. */
    FLOAT = 0x1406,

    /** A two-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC2 = 0x8B50,

    /** A three-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC3 = 0x8B51,

    /** A four-dimensional vector of 32-bit signed floating-point values. */
    FLOAT_VEC4 = 0x8B52,

    /** A sampler of a 2D texture. */
    SAMPLER_2D = 0x8B5E,

    /** A sampler of a 3D texture. */
    SAMPLER_3D = 0x8B5F,

    /** A sampler of a cube texture. */
    SAMPLER_CUBE = 0x8B60,

    /** A sampler of a 2D shadow texture. */
    SAMPLER_2D_SHADOW = 0x8B62,

    /** A sampler of a 2D array texture. */
    SAMPLER_2D_ARRAY = 0x8DC1,

    /** A sampler of a 2D array shadow texture. */
    SAMPLER_2D_ARRAY_SHADOW = 0x8DC4,

    /** A sampler of a cube shadow texture. */
    SAMPLER_CUBE_SHADOW = 0x8DC5,

    /** An integer sampler of a 2D texture. */
    INT_SAMPLER_2D = 0x8DCA,

    /** An integer sampler of a 3D texture. */
    INT_SAMPLER_3D = 0x8DCB,

    /** An integer sampler of a cube texture. */
    INT_SAMPLER_CUBE = 0x8DCC,

    /** An integer sampler of a 2D array texture. */
    INT_SAMPLER_2D_ARRAY = 0x8DCF,

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
    FLOAT_MAT4 = 0x8B5C,

    /** A matrix of 32-bit signed floating-point values with two rows and three columns. */
    FLOAT_MAT2x3 = 0x8B65,

    /** A matrix of 32-bit signed floating-point values with two rows and four columns. */
    FLOAT_MAT2x4 = 0x8B66,

    /** A matrix of 32-bit signed floating-point values with three rows and two columns. */
    FLOAT_MAT3x2 = 0x8B67,

    /** A matrix of 32-bit signed floating-point values with three rows and four columns. */
    FLOAT_MAT3x4 = 0x8B68,

    /** A matrix of 32-bit signed floating-point values with four rows and two columns. */
    FLOAT_MAT4x2 = 0x8B69,

    /** A matrix of 32-bit signed floating-point values with four rows and three columns. */
    FLOAT_MAT4x3 = 0x8B6A
}

export default UniformType;
