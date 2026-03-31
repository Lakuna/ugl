import type Context from "../Context.js";

import ApiInterface from "./ApiInterface.js";

/**
 * An object with direct access to the WebGL2 API that requires an existing rendering context to instantiate.
 * @public
 */
export default abstract class ContextDependent extends ApiInterface {
	/** The rendering context. */
	public readonly context: Context;

	/**
	 * Initializes the context-dependent API interface.
	 * @param context - The rendering context.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	protected constructor(context: Context) {
		super(context.gl);
		this.context = context;
	}
}
