import type { AttributeType } from "#attributes/Attribute";
import type { UniformType } from "#variables/Uniform";
import type Context from "#webgl/Context";
import type Program from "#webgl/Program";

/** A variable in a WebGL shader program. */
export default abstract class Variable {
	/**
	 * Creates a variable.
	 * @param program The shader program that this variable belongs to.
	 */
	public constructor(program: Program) {
		this.program = program;
		this.context = program.context;
	}

	/** The shader program that this variable belongs to. */
	public readonly program: Program;

	/** The rendering context of this variable. */
	public readonly context: Context;

	/** The active information of this variable. */
	public abstract readonly activeInfo: WebGLActiveInfo;

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