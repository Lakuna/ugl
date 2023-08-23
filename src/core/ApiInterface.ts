/**
 * A modified version of a `WebGL2RenderingContext` with experimental features.
 * @internal
 */
type ModifiedRenderingContext = WebGL2RenderingContext & {
	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	unpackColorSpace: PredefinedColorSpace;
};

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
		this.api = api as ModifiedRenderingContext;
	}

	/**
	 * The API interface.
	 * @internal
	 */
	protected api: ModifiedRenderingContext;
}
