/**
 * An object with direct access to the WebGL2 API.
 * @public
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
	 * @internal
	 */
	public readonly gl;
}
