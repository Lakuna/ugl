import { Program } from "./Program.js";
import { UniformType, AttributeType } from "./WebGLConstant.js";

/** A variable in a WebGL shader program. */
export abstract class Variable {
  /**
   * Creates a variable.
   * @param program - The shader program that this variable belongs to.
   */
  constructor(program: Program) {
    this.program = program;
    this.gl = program.gl;
  }

  /** The shader program that this variable belongs to. */
  readonly program: Program;

  /** The rendering context of this variable. */
  readonly gl: WebGL2RenderingContext;

  /** The active information of this variable. */
  abstract readonly activeInfo: WebGLActiveInfo;

  /** The name of this variable. */
  get name(): string {
    return this.activeInfo.name;
  }

  /** The type of this variable. */
  get type(): UniformType | AttributeType {
    return this.activeInfo.type;
  }

  /** The size of this variable in memory in bytes. */
  get size(): number {
    return this.activeInfo.size;
  }
}
