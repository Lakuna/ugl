import type Context from "#Context";

/**
 * A modified version of `Context` with access to the private `api` property.
 * @internal
 */
export type DangerousExposedContext = Context & {
	api: WebGL2RenderingContext;
};
