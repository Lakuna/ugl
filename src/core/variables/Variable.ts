import ContextDependent from "../internal/ContextDependent.js";
import type Program from "../Program.js";
import type VariableType from "../../constants/VariableType.js";

/**
 * A variable in a WebGL shader program.
 * @public
 */
export default abstract class Variable extends ContextDependent {
	/**
	 * The shader program that this variable belongs to.
	 * @internal
	 */
	protected readonly program: Program;

	/**
	 * The active information of this variable.
	 * @internal
	 */
	protected readonly activeInfo: WebGLActiveInfo;

	/**
	 * The value that is stored in this variable.
	 * @internal
	 */
	public abstract value: unknown;

	/**
	 * Create a variable.
	 * @param program - The shader program that this variable belongs to.
	 * @internal
	 */
	protected constructor(program: Program, activeInfo: WebGLActiveInfo) {
		super(program.context);
		this.program = program;
		this.activeInfo = activeInfo;
	}

	/** The name of this variable. */
	public get name(): string {
		return this.activeInfo.name;
	}

	/** The type of this variable. */
	public get type(): VariableType {
		return this.activeInfo.type;
	}

	/** The size of this variable in memory in bytes. */
	public get size(): number {
		return this.activeInfo.size;
	}
}
