/**
 * Test functions.
 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
 */
enum TestFunction {
	/** Never passes. */
	NEVER = 0x0200,

	/** Passes if the incoming value is less than the buffer value. */
	LESS = 0x0201,

	/** Passes if the incoming value is equal to the buffer value. */
	EQUAL = 0x0202,

	/**
	 * Passes if the incoming value is less than or equal to the buffer value.
	 */
	LEQUAL = 0x0203,

	/** Passes if the incoming value is greater than the buffer value. */
	GREATER = 0x0204,

	/** Passes if the incoming value is not equal to the buffer value. */
	NOTEQUAL = 0x0205,

	/**
	 * Passes if the incoming value is greater than or equal to the buffer
	 * value.
	 */
	GEQUAL = 0x0206,

	/** Always passes. */
	ALWAYS = 0x0207
}

export default TestFunction;
