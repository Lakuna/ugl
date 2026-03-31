import type VariableType from "../../constants/VariableType.js";
import type Program from "../Program.js";

import ContextDependent from "../internal/ContextDependent.js";

/**
 * A variable in a WebGL shader program.
 * @public
 */
export default abstract class Variable extends ContextDependent {
	/**
	 * The value that is stored in this variable.
	 * @internal
	 */
	public abstract value: unknown;

	/** The name of this variable. */
	public get name(): string {
		return this.activeInfo.name;
	}

	/** The size of this variable in memory in bytes. */
	public get size(): number {
		return this.activeInfo.size;
	}

	/** The type of this variable. */
	public get type(): VariableType {
		return this.activeInfo.type;
	}

	/**
	 * The active information of this variable.
	 * @internal
	 */
	protected readonly activeInfo: WebGLActiveInfo;

	/**
	 * The shader program that this variable belongs to.
	 * @internal
	 */
	protected readonly program: Program;

	/**
	 * Create a variable.
	 * @param program - The shader program that this variable belongs to.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	protected constructor(program: Program, activeInfo: WebGLActiveInfo) {
		super(program.context);
		this.program = program;
		this.activeInfo = activeInfo;
	}
}
