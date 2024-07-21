/**
 * Usage patterns of a buffer's data store for optimization purposes.
 * @public
 */
enum BufferUsage {
	/** The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_DRAW = 0x88e4,

	/** The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_DRAW = 0x88e8,

	/** The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_DRAW = 0x88e0,

	/** The contents are intended to be specified once by reading data from WebGL, and queried many times by the application. */
	STATIC_READ = 0x88e5,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application. */
	DYNAMIC_READ = 0x88e9,

	/** The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application. */
	STREAM_READ = 0x88e1,

	/** The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_COPY = 0x88e6,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_COPY = 0x88ea,

	/** The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_COPY = 0x88e2
}

export default BufferUsage;
