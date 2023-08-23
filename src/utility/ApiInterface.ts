import type { ExperimentalRawContext } from "#ExperimentalRawContext";

/**
 * An object with direct access to the WebGL2 API.
 * @internal
 */
export default abstract class ApiInterface {
	/**
	 * Initializes the API interface.
	 * @param api The API interface object.
	 * @internal
	 */
	protected constructor(api: WebGL2RenderingContext) {
		this.api = api as ExperimentalRawContext;
	}

	/**
	 * The API interface.
	 * @internal
	 */
	protected api: ExperimentalRawContext;
}
