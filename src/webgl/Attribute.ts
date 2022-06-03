import { Variable } from "./Variable.js";
import { Program } from "./Program.js";
import { AttributeType } from "./WebGLConstant.js";
import { AttributeState } from "./AttributeState.js";

/** An input variable in a WebGL vertex shader. */
export class Attribute extends Variable {
  /**
   * Creates an attribute. This should only be called by the `Program` constructor.
   * @param program - The shader program that this attribute belongs to.
   * @param index - The index of this attribute.
   */
  public constructor(program: Program, index: number) {
    super(program);

    this.enabledPrivate = false;
    this.enabled = true;

    const activeInfo: WebGLActiveInfo | null = this.gl.getActiveAttrib(program.program, index);
    if (!activeInfo) { throw new Error("Unable to get attribute active information."); }
    this.activeInfo = activeInfo;

    this.location = this.gl.getAttribLocation(program.program, this.activeInfo.name);

    switch (this.activeInfo.type as AttributeType) {
      case AttributeType.FLOAT:
      case AttributeType.FLOAT_VEC2:
      case AttributeType.FLOAT_VEC3:
      case AttributeType.FLOAT_VEC4:
        this.setter = (value: AttributeState): void => {
          value.buffer.bind();
          this.enabled = true;
          this.gl.vertexAttribPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset);
        };
        break;
      case AttributeType.INT:
			case AttributeType.INT_VEC2:
			case AttributeType.INT_VEC3:
			case AttributeType.INT_VEC4:
			case AttributeType.UNSIGNED_INT:
			case AttributeType.UNSIGNED_INT_VEC2:
			case AttributeType.UNSIGNED_INT_VEC3:
			case AttributeType.UNSIGNED_INT_VEC4:
			case AttributeType.BOOL:
			case AttributeType.BOOL_VEC2:
			case AttributeType.BOOL_VEC3:
			case AttributeType.BOOL_VEC4:
        this.setter = (value: AttributeState): void => {
          value.buffer.bind();
          this.enabled = true;
          this.gl.vertexAttribIPointer(this.location, value.size, value.type, value.stride, value.offset);
        };
        break;
      case AttributeType.FLOAT_MAT2:
        // Matrix attributes are treated as multiple vectors rather than one matrix.
        this.setter = (value: AttributeState): void => {
          const dim = 2;
          const stride = (dim * dim) * value.size;
          for (let i = 0; i < dim; i++) {
            const location: number = this.location + i;
            this.gl.enableVertexAttribArray(location);
            this.gl.vertexAttribPointer(location, value.size / dim, value.type, value.normalized, stride, value.offset + (stride / dim) * i);
          }
        }
        break;
      case AttributeType.FLOAT_MAT3:
        // Matrix attributes are treated as multiple vectors rather than one matrix.
        this.setter = (value: AttributeState): void => {
          const dim = 3;
          const stride = (dim * dim) * value.size;
          for (let i = 0; i < dim; i++) {
            const location: number = this.location + i;
            this.gl.enableVertexAttribArray(location);
            this.gl.vertexAttribPointer(location, value.size / dim, value.type, value.normalized, stride, value.offset + (stride / dim) * i);
          }
        }
        break;
      case AttributeType.FLOAT_MAT4:
        // Matrix attributes are treated as multiple vectors rather than one matrix.
        this.setter = (value: AttributeState): void => {
          const dim = 4;
          const stride = (dim * dim) * value.size;
          for (let i = 0; i < dim; i++) {
            const location: number = this.location + i;
            this.gl.enableVertexAttribArray(location);
            this.gl.vertexAttribPointer(location, value.size / dim, value.type, value.normalized, stride, value.offset + (stride / dim) * i);
          }
        }
        break;
      default:
        throw new Error("Unable to make attribute setter.");
    }
  }

  /** The active information of this attribute. */
  public readonly activeInfo: WebGLActiveInfo;

  /** The location of this attribute. */
  public readonly location: number;

  /** The setter method for this attribute. */
  protected readonly setter: (value: AttributeState) => void;

  /** Does nothing; attributes cannot be set to array values. */
  protected readonly arraySetter?: () => void;

  /** Enables getting data from a buffer for this attribute. */
  public enable(): void {
    this.gl.enableVertexAttribArray(this.location);
  }

  /** Whether this attribute can get data from a buffer. */
  private enabledPrivate: boolean;

  /** Whether this attribute can get data from a buffer. */
  public get enabled(): boolean {
    return this.enabledPrivate;
  }

  public set enabled(value: boolean) {
    if (value) {
      this.gl.enableVertexAttribArray(this.location);
    } else {
      this.gl.disableVertexAttribArray(this.location);
    }

    this.enabledPrivate = value;
  }

  /** The value of this attribute. */
  private valuePrivate?: AttributeState;

  /** The value of this attribute. */
  public get value(): AttributeState | undefined {
    return this.valuePrivate;
  }

  public set value(value: AttributeState | undefined) {
    if (!value) { return; }
    this.setter(value);
    this.valuePrivate = value;
  }
}
