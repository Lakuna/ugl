import { Variable } from "./Variable.js";
import { Program } from "./Program.js";
import { UniformType } from "./WebGLConstant.js";
import { Texture } from "./Texture.js";

/** A global variable in a WebGL shader program. */
export class Uniform extends Variable {
  /**
   * Creates a uniform. This should only be called by the `Program` constructor.
   * @param program The shader program that this uniform belongs to.
   * @param index The index of this uniform.
   * @param textureUnit The texture unit to use if this uniform is a sampler.
   */
  public constructor(program: Program, index: number, textureUnit: number) {
    super(program);

    this.valuePrivate = 0;

    const activeInfo: WebGLActiveInfo | null = this.gl.getActiveUniform(program.program, index);
    if (!activeInfo) { throw new Error("Unable to get uniform active information."); }
    this.activeInfo = activeInfo;

    const location: WebGLUniformLocation | null = this.gl.getUniformLocation(program.program, this.activeInfo.name);
    if (!location) { throw new Error("Unable to get uniform location."); }
    this.location = location;

    switch (this.activeInfo.type as UniformType) {
      case UniformType.SAMPLER_2D:
      case UniformType.SAMPLER_3D:
      case UniformType.SAMPLER_CUBE:
      case UniformType.SAMPLER_2D_SHADOW:
      case UniformType.SAMPLER_2D_ARRAY:
      case UniformType.SAMPLER_2D_ARRAY_SHADOW:
      case UniformType.SAMPLER_CUBE_SHADOW:
      case UniformType.INT_SAMPLER_2D:
      case UniformType.INT_SAMPLER_3D:
      case UniformType.INT_SAMPLER_CUBE:
      case UniformType.INT_SAMPLER_2D_ARRAY:
        this.textureUnit = textureUnit;
    }

    switch (this.activeInfo.type as UniformType) {
      case UniformType.FLOAT:
        this.setter = (value: number): void => this.gl.uniform1f(location, value);
        this.arraySetter = (value: Array<number>): void => this.gl.uniform1fv(location, value);
        break;
      case UniformType.FLOAT_VEC2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform2fv(location, value);
        break;
      case UniformType.FLOAT_VEC3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform3fv(location, value);
        break;
      case UniformType.FLOAT_VEC4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform4fv(location, value);
        break;
      case UniformType.SAMPLER_2D:
      case UniformType.SAMPLER_3D:
      case UniformType.SAMPLER_CUBE:
      case UniformType.SAMPLER_2D_SHADOW:
      case UniformType.SAMPLER_2D_ARRAY:
      case UniformType.SAMPLER_2D_ARRAY_SHADOW:
      case UniformType.SAMPLER_CUBE_SHADOW:
      case UniformType.INT_SAMPLER_2D:
      case UniformType.INT_SAMPLER_3D:
      case UniformType.INT_SAMPLER_CUBE:
      case UniformType.INT_SAMPLER_2D_ARRAY:
        this.setter = (value: Texture): void => {
          this.gl.uniform1i(location, this.textureUnit as number);
          value.update(this.textureUnit as number);
        };
        this.arraySetter = (value: Array<Texture>): void => {
          const textureUnits: Int32Array = new Int32Array(value.length);
          for (let i = 0; i < value.length; i++) { textureUnits[i] = (this.textureUnit as number) + i; }

          this.gl.uniform1iv(location, textureUnits);

          for (const [i, texture] of value.entries()) {
            texture.update(textureUnits[i] as number);
          }
        };
        break;
      case UniformType.BOOL:
      case UniformType.INT:
        this.setter = (value: number): void => this.gl.uniform1i(location, value);
        this.arraySetter = (value: Array<number>): void => this.gl.uniform1iv(location, value);
        break;
      case UniformType.BOOL_VEC2:
      case UniformType.INT_VEC2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform2iv(location, value);
        break;
      case UniformType.BOOL_VEC3:
      case UniformType.INT_VEC3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform3iv(location, value);
        break;
      case UniformType.BOOL_VEC4:
      case UniformType.INT_VEC4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform4iv(location, value);
        break;
      case UniformType.UNSIGNED_INT:
        this.setter = (value: number): void => this.gl.uniform1ui(location, value);
        this.arraySetter = (value: Array<number>): void => this.gl.uniform1uiv(location, value);
        break;
      case UniformType.UNSIGNED_INT_VEC2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform2uiv(location, value);
        break;
      case UniformType.UNSIGNED_INT_VEC3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform3uiv(location, value);
        break;
      case UniformType.UNSIGNED_INT_VEC4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniform4uiv(location, value);
        break;
      case UniformType.FLOAT_MAT2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix2fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix3fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix4fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT2x3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix2x3fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT2x4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix2x4fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT3x2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix3x2fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT3x4:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix3x4fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT4x2:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix4x2fv(location, false, value);
        break;
      case UniformType.FLOAT_MAT4x3:
        this.arraySetter = (value: Array<number>): void => this.gl.uniformMatrix4x3fv(location, false, value);
        break;
      default:
        throw new Error("Unable to make uniform setter.");
    }
  }

  /** The active information of this uniform. */
  public readonly activeInfo: WebGLActiveInfo;

  /** The location of this uniform. */
  public readonly location: WebGLUniformLocation;

  /** The texture unit of this uniform. */
  public readonly textureUnit?: number;

  /** The setter method for this uniform. */
  protected readonly setter?: ((value: number) => void) | ((value: Texture) => void);

  /** The setter method for this uniform if the value is an array. */
  protected readonly arraySetter: ((value: Array<number>) => void) | ((value: Array<Texture>) => void);

  /** The value of this uniform. */
  private valuePrivate: number | Array<number> | Texture | Array<Texture>;

  /** The value of this uniform. */
  public get value(): number | Array<number> | Texture | Array<Texture> {
    return this.valuePrivate ?? 0;
  }

  public set value(value: number | Array<number> | Texture | Array<Texture>) {
    if (Array.isArray(value)) {
      (this.arraySetter as (value: Array<number>) => void)(value as Array<number>);
    } else {
      if (!this.setter) { throw new Error("Cannot set this uniform to a single value."); }
      (this.setter as (value: number) => void)(value as number);
    }

    this.valuePrivate = value;
  }
}
