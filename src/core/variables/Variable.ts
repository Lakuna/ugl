import type AttributeType from "#AttributeType";
import ContextDependent from "#ContextDependent";
import type Program from "#Program";
import type UniformType from "#UniformType";

/** A variable in a WebGL shader program. */
export default abstract class Variable extends ContextDependent {
	/**
	 * Create a variable.
	 * @param program - The shader program that this variable belongs to.
	 * @internal
	 */
	protected constructor(program: Program) {
		super(program.context);
		this.program = program;
	}

	/**
	 * The shader program that this variable belongs to.
	 * @internal
	 */
	protected readonly program;

	/**
	 * The value that is stored in this variable.
	 * @internal
	 */
	public abstract value: unknown;

	/**
	 * The active information of this variable.
	 * @see [`getActiveUniform`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform)
	 * @see [`getActiveAttrib`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib)
	 * @see [`getTransformFeedbackVarying`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getTransformFeedbackVarying)
	 * @internal
	 */
	protected abstract readonly activeInfo: WebGLActiveInfo;

	/** Get the name of this variable. */
	public get name() {
		return this.activeInfo.name;
	}

	/** Get the type of this variable. */
	public get type(): UniformType | AttributeType {
		return this.activeInfo.type;
	}

	/** Get the size of this variable in memory in bytes. */
	public get size() {
		return this.activeInfo.size;
	}
}
