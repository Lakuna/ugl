/**
 * Types of primitives that can be rasterized.
 * @public
 */
enum Primitive {
	/** Draws a dot at each vertex. */
	POINTS = 0x0000,

	/** Draws a line between each vertex. */
	LINE_STRIP = 0x0003,

	/** Draws a line between each vertex, then draws a line between the first and last vertices. */
	LINE_LOOP = 0x0002,

	/** Draws lines between each pair of vertices. */
	LINES = 0x0001,

	/** Draws triangles from each vertex and the previous two, starting at the third vertex. */
	TRIANGLE_STRIP = 0x0005,

	/** Draws triangles from each vertex, the previous vertex, and the first vertex, starting at the third vertex. */
	TRIANGLE_FAN = 0x0006,

	/** Draws triangles between every three vertices. */
	TRIANGLES = 0x0004
}

export default Primitive;
