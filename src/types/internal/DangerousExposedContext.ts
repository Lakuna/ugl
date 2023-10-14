import type Context from "#Context";

/**
 * A modified version of `Context` with access to certain protected properties,
 * methods, and accessors. This is required because there is no equivalent to
 * the `package` access modifier in TypeScript.
 * @internal
 */
export type DangerousExposedContext = Context & {
	/**
	 * The API interface.
	 * @see [`WebGL2RenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
	 * @internal
	 */
	gl: WebGL2RenderingContext;

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	get activeTexture(): number;

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @throws {@link WebglError}
	 * @internal
	 */
	set activeTexture(value: number);
};
