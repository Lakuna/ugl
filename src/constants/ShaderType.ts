/** Types of shaders. */
const enum ShaderType {
    /** A fragment shader, which calculates a color for each pixel of a primitive. */
    FRAGMENT_SHADER = 0x8B30,

    /** A vertex shader, which calculates a position for each vertex of a primitive. */
    VERTEX_SHADER = 0x8B31
}

export default ShaderType;
