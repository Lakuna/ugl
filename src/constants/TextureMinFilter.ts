/** Minification filters for textures. */
const enum TextureMinFilter {
    /** Chooses one pixel from the largest mip. */
    NEAREST = 0x2600,

    /** Chooses four pixels from the largest mip and blends them. */
    LINEAR = 0x2601,

    /** Chooses the best mip, then picks one pixel from that mip. */
    NEAREST_MIPMAP_NEAREST = 0x2700,

    /** Chooses the best mip, then blends four pixels from that mip. */
    LINEAR_MIPMAP_NEAREST = 0x2701,

    /** Chooses the best two mips, then chooses one pixel from each and blends them. */
    NEAREST_MIPMAP_LINEAR = 0x2702,

    /** Chooses the best two mips, then chooses four pixels from each and blends them. */
    LINEAR_MIPMAP_LINEAR = 0x2703
}

export default TextureMinFilter;
