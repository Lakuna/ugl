/** Binding points for textures. */
const enum TextureTarget {
    /** A two-dimensional texture. */
    TEXTURE_2D = 0x0DE1,

    /** A cube-mapped texture. */
    TEXTURE_CUBE_MAP = 0x8513,

    /** A three-dimensional texture. */
    TEXTURE_3D = 0x806F,

    /** A two-dimensional array texture. */
    TEXTURE_2D_ARRAY = 0x8C1A
}

export default TextureTarget;
