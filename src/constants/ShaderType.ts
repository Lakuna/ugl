/**
 * Types of shaders.
 * @public
 */
enum ShaderType {
	/** A fragment shader, which runs once for each fragment and computes the color of the fragment. */
	FRAGMENT_SHADER = 0x8b30,

	/** A vertex shader, which runs once for each vertex and computes the position of the vertex. */
	VERTEX_SHADER = 0x8b31
}

export default ShaderType;
