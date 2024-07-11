import type AttributeType from "../../constants/AttributeType.js";
import ContextDependent from "../internal/ContextDependent.js";
import type Program from "../Program.js";
import type UniformType from "../../constants/UniformType.js";

/**
 * A variable in a WebGL shader program.
 * @public
 */
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
	 * @internal
	 */
	protected abstract readonly activeInfo: WebGLActiveInfo;

	/** The name of this variable. */
	public get name(): string {
		return this.activeInfo.name;
	}

	/** The type of this variable. */
	public get type(): UniformType | AttributeType {
		return this.activeInfo.type;
	}

	/** The size of this variable in memory in bytes. */
	public get size(): number {
		return this.activeInfo.size;
	}
}
