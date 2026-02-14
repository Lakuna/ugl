import ApiInterface from "./ApiInterface.js";
import type Context from "../Context.js";

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
	protected constructor(context: Context) {
		super(context.gl);
		this.context = context;
	}
}
