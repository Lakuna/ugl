/** Types of shaders. */
enum ShaderType {
	/**
	 * A fragment shader, which calculates a color for each pixel of a
	 * primitive.
	 */
	FRAGMENT_SHADER = 0x8b30,

	/**
	 * A vertex shader, which calculates a position for each vertex of a
	 * primitive.
	 */
	VERTEX_SHADER = 0x8b31
}

export default ShaderType;
