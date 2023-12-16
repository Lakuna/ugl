/**
 * A modified version of a `WebGL2RenderingContext` with experimental features.
 * @internal
 */
export type ExperimentalRawContext = WebGL2RenderingContext & {
	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 * @internal
	 */
	unpackColorSpace: PredefinedColorSpace;
};
