import type Context from "#Context";

/**
 * A modified version of `Context` with access to the protected `gl` property.
 * This is required because there is no equivalent to the `package` access
 * modifier in TypeScript.
 * @internal
 */
export type DangerousExposedContext = Context & {
	/**
	 * The API interface.
	 * @internal
	 */
	gl: WebGL2RenderingContext;
};
