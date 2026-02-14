/**
 * An object with direct access to the WebGL2 API.
 * @public
 */
export default abstract class ApiInterface {
	/**
	 * The API interface.
	 * @internal
	 */
	public readonly gl: WebGL2RenderingContext;

	/**
	 * Initializes the API interface.
	 * @param gl - The API interface object.
	 * @internal
	 */
	protected constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
	}
}
