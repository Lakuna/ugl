/**
 * Internal formats for the color components in a texture.
 * @see [OpenGL ES 3 reference](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage3D.xhtml)
 */
const enum TextureInternalFormat {
    /** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. Color renderable and texture filterable. */
    RGB = 0x1907,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. Color renderable and texture filterable. */
    RGBA = 0x1908,

    /** `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
    LUMINANCE_ALPHA = 0x190A,

    /** `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
    LUMINANCE = 0x1909,

    /** `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. Color renderable and texture filterable. */
    ALPHA = 0x1906,

    /** `format` must be `RED`. `type` must be `UNSIGNED_BYTE`. Takes an 8-bit number for the red channel, normalized to `[0,1]`. Color renderable and texture filterable. */
    R8 = 0x8229,

    /** `format` must be `RED`. `type` must be `BYTE`. Takes a signed 8-bit number for the red channel, normalized to `[-1,1]`. Texture filterable. */
    R8_SNORM = 0x8F94,

    /** `format` must be `RED`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes a 16-bit floating-point number for the red channel. Texture filterable. */
    R16F = 0x822D,

    /** `format` must be `RED`. `type` must be `FLOAT`. Takes a 32-bit floating-point number for the red channel. */
    R32F = 0x822E,

    /** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes an 8-bit unsigned integer for the red channel. Color renderable. */
    R8UI = 0x8232,

    /** `format` must be `RED_INTEGER`. `type` must be `BYTE`. Takes an 8-bit integer for the red channel. Color renderable. */
    R8I = 0x8231,

    /** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes a 16-bit unsigned integer for the red channel. Color renderable. */
    R16UI = 0x8234,

    /** `format` must be `RED_INTEGER`. `type` must be `SHORT`. Takes a 16-bit integer for the red channel. Color renderable. */
    R16I = 0x8233,

    /** `format` must be `RED_INTEGER`. `type` must be `UNSIGNED_INT`. Takes a 32-bit unsigned integer for the red channel. Color renderable. */
    R32UI = 0x8236,

    /** `format` must be `RED_INTEGER`. `type` must be `INT`. Takes a 32-bit integer for the red channel. Color renderable. */
    R32I = 0x8235,

    /** `format` must be `RG`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red and green channels, normalized to `[0,1]`. Color renderable and texture filterable. */
    RG8 = 0x822B,

    /** `format` must be `RG`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red and green channels, normalized to `[-1,1]`. Texture filterable. */
    RG8_SNORM = 0x8F95,

    /** `format` must be `RG`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red and green channels. Texture filterable. */
    RG16F = 0x822F,

    /** `format` must be `RG`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red and green channels. */
    RG32F = 0x8230,

    /** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red and green channels. Color renderable. */
    RG8UI = 0x8238,

    /** `format` must be `RG_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red and green channels. Color renderable. */
    RG8I = 0x8237,

    /** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red and green channels. Color renderable. */
    RG16UI = 0x823A,

    /** `format` must be `RG_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red and green channels. Color renderable. */
    RG16I = 0x8239,

    /** `format` must be `RG_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red and green channels. Color renderable. */
    RG32UI = 0x823C,

    /** `format` must be `RG_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red and green channels. Color renderable. */
    RG32I = 0x823B,

    /** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGB8 = 0x8051,

    /** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, and blue channels, normalized to `[0,1]`. Texture filterable. */
    SRGB8 = 0x8C41,

    /** `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. Takes 5-bit numbers for the red and blue channels and a 6-bit number for the green channel, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGB565 = 0x8D62,

    /** `format` must be `RGB`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red, green, and blue channels, normalized to `[-1,1]`. Texture filterable. */
    RGB8_SNORM = 0x8F96,

    /** `format` must be `RGB`. `type` must be `UNSIGNED_INT_10F_11F_11F_REV`, `HALF_FLOAT`, or `FLOAT`. Takes 11-bit floating-point numbers for the red and green channels, and a 10-bit floating-point number for the blue channel. Texture filterable. */
    R11F_G11F_B10F = 0x8C3A,

    /** `format` must be `RGB`. `type` must be `UNSIGNED_INT_5_9_9_9_REV`, `HALF_FLOAT`, or `FLOAT`. Takes 9-bit numbers for the red, green, and blue channels, normalized to `[0,1]`, with 5 shared bits. Texture filterable. */
    RGB9_E5 = 0x8C3D,

    /** `format` must be `RGB`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red, green, and blue channels. Texture filterable. */
    RGB16F = 0x881B,

    /** `format` must be `RGB`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red, green, and blue channels. */
    RGB32F = 0x8815,

    /** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red, green, and blue channels. */
    RGB8UI = 0x8D7D,

    /** `format` must be `RGB_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red, green, and blue channels. */
    RGB8I = 0x8D8F,

    /** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red, green, and blue channels. */
    RGB16UI = 0x8D77,

    /** `format` must be `RGB_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red, green, and blue channels. */
    RGB16I = 0x8D89,

    /** `format` must be `RGB_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red, green, and blue channels. */
    RGB32UI = 0x8D71,

    /** `format` must be `RGB_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red, green, and blue channels. */
    RGB32I = 0x8D83,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGBA8 = 0x8058,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
    SRGB8_ALPHA8 = 0x8C43,

    /** `format` must be `RGBA`. `type` must be `BYTE`. Takes signed 8-bit numbers for the red, green, blue, and alpha channels, normalized to `[-1,1]`. Texture filterable. */
    RGBA8_SNORM = 0x8F97,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_5_5_5_1`, or `UNSIGNED_INT_2_10_10_10_REV`. Takes 5-bit numbers for the red, green, and blue channels and a 1-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGB5_A1 = 0x8057,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_4_4_4_4`. Takes 4-bit numbers for the red, green, blue, and alpha channels, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGBA4 = 0x8056,

    /** `format` must be `RGBA`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. Takes 10-bit numbers for the red, green, and blue channels and a 2-bit number for the alpha channel, normalized to `[0,1]`. Color renderable and texture filterable. */
    RGB10_A2 = 0x8059,

    /** `format` must be `RGBA`. `type` must be `HALF_FLOAT` or `FLOAT`. Takes 16-bit floating-point numbers for the red, green, blue, and alpha channels. Texture filterable. */
    RGBA16F = 0x881A,

    /** `format` must be `RGBA`. `type` must be `FLOAT`. Takes 32-bit floating-point numbers for the red, green, blue, and alpha channels. */
    RGBA32F = 0x8814,

    /** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_BYTE`. Takes 8-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA8UI = 0x8D7C,

    /** `format` must be `RGBA_INTEGER`. `type` must be `BYTE`. Takes 8-bit integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA8I = 0x8D8E,

    /** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT_2_10_10_10_REV`. Takes unsigned 10-bit integers for the red, green, and blue channels and a 2-bit unsigned integer for the alpha channel. Color renderable. */
    RGB10_A2UI = 0x906F,

    /** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_SHORT`. Takes 16-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA16UI = 0x8D76,

    /** `format` must be `RGBA_INTEGER`. `type` must be `SHORT`. Takes 16-bit integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA16I = 0x8D88,

    /** `format` must be `RGBA_INTEGER`. `type` must be `INT`. Takes 32-bit integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA32I = 0x8D82,

    /** `format` must be `RGBA_INTEGER`. `type` must be `UNSIGNED_INT`. Takes 32-bit unsigned integers for the red, green, blue, and alpha channels. Color renderable. */
    RGBA32UI = 0x8D70,

    /** `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_SHORT` or `UNSIGNED_INT`. Takes a 32-bit unsigned integer for the depth channel. */
    DEPTH_COMPONENT16 = 0x81A5,

    /** `format` must be `DEPTH_COMPONENT`. `type` must be `UNSIGNED_INT`. Takes a 24-bit unsigned integer for the depth channel. */
    DEPTH_COMPONENT24 = 0x81A6,

    /** `format` must be `DEPTH_COMPONENT`. `type` must be `FLOAT`. Takes a 32-bit floating-point value for the depth channel. */
    DEPTH_COMPONENT32F = 0x8CAC,

    /** `format` must be `DEPTH_STENCIL`. `type` must be `UNSIGNED_INT_24_8`. Takes a 24-bit unsigned integer for the depth channel and an 8-bit unsigned integer for the stencil channel. */
    DEPTH24_STENCIL8 = 0x88F0,

    /** `format` must be `DEPTH_STENCIL`. `type` must be `FLOAT_32_UNSIGNED_INT_24_8_REV`. Takes a 32-bit floating-point value for the depth channel and an 8-bit unsigned integer for the stencil channel. */
    DEPTH32F_STENCIL8 = 0x8CAD
}

export default TextureInternalFormat;
