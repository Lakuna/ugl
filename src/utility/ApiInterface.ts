import type { ExperimentalRawContext } from "#ExperimentalRawContext";

/**
 * An object with direct access to the WebGL2 API.
 * @internal
 */
export default abstract class ApiInterface {
	/**
	 * Initializes the API interface.
	 * @param gl The API interface object.
	 * @internal
	 */
	protected constructor(gl: WebGL2RenderingContext) {
		this.gl = gl as ExperimentalRawContext;
	}

	/**
	 * The API interface.
	 * @internal
	 */
	protected gl: ExperimentalRawContext;
}
