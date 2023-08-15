/** Binding points for buffers. */
const enum BufferTarget {
    /** A buffer containing vertex attributes. */
    ARRAY_BUFFER = 0x8892,

    /** A buffer containing element indices. */
    ELEMENT_ARRAY_BUFFER = 0x8893,

    /** A buffer for copying from one buffer to another. */
    COPY_READ_BUFFER = 0x8F36,

    /** A buffer for copying from one buffer to another. */
    COPY_WRITE_BUFFER = 0x8F37,

    /** A buffer for transform feedback operations. */
    TRANSFORM_FEEDBACK_BUFFER = 0x8C8E,

    /** A buffer used for storing uniform blocks. */
    UNIFORM_BUFFER = 0x8A11,

    /** A buffer used for pixel transfer operations. */
    PIXEL_PACK_BUFFER = 0x88EB,

    /** A buffer used for pixel transfer operations. */
    PIXEL_UNPACK_BUFFER = 0x88EC
}

export default BufferTarget;
