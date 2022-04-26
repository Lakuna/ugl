import { ShaderType } from "./WebGLConstant.js";
import { COMPILE_STATUS, DELETE_STATUS } from "./WebGLConstant.js";

/** A function which runs on the GPU. */
export class Shader {
  /**
   * Creates a shader from source code.
   * @param type - The type of the shader.
   * @param source - The source code of the shader.
   */
  constructor(gl: WebGL2RenderingContext, type: ShaderType, source: string) {
    this.gl = gl;
    this.type = type;
    this.source = source;

    const shader: WebGLShader | null = gl.createShader(type);
    if (!shader) { throw new Error("Unable to create a shader."); }
    this.shader = shader;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!this.compileStatus) {
      console.error(this.infoLog);
      this.delete();
      throw new Error("Shader failed to compile.");
    }
  }

  /** The rendering context of this shader. */
  readonly gl: WebGL2RenderingContext;

  /** The type of this shader. */
  readonly type: ShaderType;

  /** The source code of this shader. */
  readonly source: string;

  /** The WebGL API interface of this shader. */
  readonly shader: WebGLShader;

  /** Whether this shader is flagged for deletion. */
  get deleteStatus(): boolean {
    return this.gl.getShaderParameter(this.shader, DELETE_STATUS);
  }

  /** Whether the last shader compilation was successful. */
  get compileStatus(): boolean {
    return this.gl.getShaderParameter(this.shader, COMPILE_STATUS);
  }

  /** The information log for this shader. */
  get infoLog(): string {
    return this.gl.getShaderInfoLog(this.shader) ?? "";
  }

  /** Deletes this shader. */
  delete(): void {
    this.gl.deleteShader(this.shader);
  }
}
