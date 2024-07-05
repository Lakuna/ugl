/**
 * An object with direct access to the WebGL2 API.
 * @internal
 */
export default abstract class ApiInterface {
	/**
	 * Initializes the API interface.
	 * @param gl - The API interface object.
	 * @internal
	 */
	protected constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
	}

	/**
	 * The API interface.
	 * @see [`WebGL2RenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
	 * @internal
	 */
	public readonly gl;
}
