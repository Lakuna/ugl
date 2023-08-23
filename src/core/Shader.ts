import ContextDependent from "#ContextDependent";
import type Context from "#Context";

/** A WebGL2 shader. */
export default class Shader extends ContextDependent {
	/**
	 * Creates a shader.
	 * @param context The rendering context.
	 * @param source The source code.
	 */
	public constructor(context: Context, source: string) {
		super(context);
		this.source = source;
	}

	/** The source code of this shader. */
	public readonly source: string;
}
