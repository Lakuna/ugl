import { Shader } from "./Shader.js";
import { ShaderType, TransformFeedbackBufferMode } from "./WebGLConstant.js";
import { Uniform } from "./Uniform.js";
import { Attribute } from "./Attribute.js";
import { TransformFeedbackVarying } from "./TransformFeedbackVarying.js";
import { DELETE_STATUS, LINK_STATUS, VALIDATE_STATUS, ACTIVE_ATTRIBUTES, ACTIVE_UNIFORMS, TRANSFORM_FEEDBACK_VARYINGS } from "./WebGLConstant.js";

/** A vertex shader and a fragment shader which are used together to rasterize primitives. */
export class Program {
  /**
   * Creates a shader program from source code.
   * @param gl - The rendering context of the shader program.
   * @param vertexShaderSource - The source code of the vertex shader.
   * @param fragmentShaderSource - The source code of the fragment shader.
   * @returns A shader program.
   */
  public static fromSource(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string): Program {
    return new Program(new Shader(gl, ShaderType.VERTEX_SHADER, vertexShaderSource), new Shader(gl, ShaderType.FRAGMENT_SHADER, fragmentShaderSource));
  }

  /**
   * Creates a shader program.
   * @param vertexShader - The vertex shader.
   * @param fragmentShader - The fragment shader.
   * @param transformFeedbackVaryingNames - The names of the varyings which should be tracked for transform feedback.
   * @param transformFeedbackBufferMode - The mode to use when capturing transform feedback varyings.
   */
  public constructor(vertexShader: Shader, fragmentShader: Shader, transformFeedbackVaryingNames: Array<string> = [], transformFeedbackBufferMode = TransformFeedbackBufferMode.SEPARATE_ATTRIBS) {
    if (vertexShader.gl != fragmentShader.gl) { throw new Error("Shaders have different rendering contexts."); }
    if (vertexShader.type != ShaderType.VERTEX_SHADER) { throw new Error("Invalid vertex shader."); }
    if (fragmentShader.type != ShaderType.FRAGMENT_SHADER) { throw new Error("Invalid fragment shader."); }

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.transformFeedbackBufferMode = transformFeedbackBufferMode;

    this.gl = vertexShader.gl;

    const program: WebGLProgram | null = this.gl.createProgram();
    if (!program) { throw new Error("Unable to create a shader program."); }
    this.program = program;

    this.gl.attachShader(program, vertexShader.shader);
    this.gl.attachShader(program, fragmentShader.shader);
    this.gl.transformFeedbackVaryings(program, transformFeedbackVaryingNames, transformFeedbackBufferMode);
    this.gl.linkProgram(program);

    if (!this.linkStatus) {
      console.error(this.infoLog);
      this.delete();
      throw new Error("Program failed to link.");
    }

    const uniforms: Map<string, Uniform> = new Map();
    let nextTextureUnit = 0;
    const numUniforms: number = this.gl.getProgramParameter(program, ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const uniform: Uniform = new Uniform(this, i, nextTextureUnit);
      uniforms.set(uniform.name, uniform);
      if (typeof uniform.textureUnit == "number") { nextTextureUnit++; }
    }
    this.uniforms = uniforms;

    const attributes: Map<string, Attribute> = new Map();
    const numAttributes: number = this.gl.getProgramParameter(program, ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttributes; i++) {
      const attribute: Attribute = new Attribute(this, i);
      attributes.set(attribute.name, attribute);
    }
    this.attributes = attributes;

    const transformFeedbackVaryings: Map<string, TransformFeedbackVarying> = new Map();
    const numTransformFeedbackVaryings: number = this.gl.getProgramParameter(program, TRANSFORM_FEEDBACK_VARYINGS);
    for (let i = 0; i < numTransformFeedbackVaryings; i++) {
      const transformFeedbackVarying: TransformFeedbackVarying = new TransformFeedbackVarying(this, i);
      transformFeedbackVaryings.set(transformFeedbackVarying.name, transformFeedbackVarying);
    }
    this.transformFeedbackVaryings = transformFeedbackVaryings;

    this.allowTransparent = true;
    this.allowDepth = true;
  }

  /** The vertex shader of this shader program. */
  public readonly vertexShader: Shader;

  /** The fragment shader of this shader program. */
  public readonly fragmentShader: Shader;

  /** The mode this program uses when capturing transform feedback varyings. */
  public readonly transformFeedbackBufferMode: TransformFeedbackBufferMode;

  /** The rendering context of this shader program. */
  public readonly gl: WebGL2RenderingContext;

  /** The WebGL API interface of this shader program. */
  public readonly program: WebGLProgram;

  /** A map of uniform names to uniforms. */
  public readonly uniforms: ReadonlyMap<string, Uniform>;

  /** A map of attribute names to attributes. */
  public readonly attributes: ReadonlyMap<string, Attribute>;

  /** A map of transform feedback varying names to varyings. */
  public readonly transformFeedbackVaryings: ReadonlyMap<string, TransformFeedbackVarying>;

  /** Whether this program is allowed to draw transparent objects. Used for optimization only. */
  public allowTransparent: boolean;

  /** Whether this program is allowed to draw with depth. Used for optimization only. */
  public allowDepth: boolean;

  /** Whether this program is flagged for deletion. */
  public get deleteStatus(): boolean {
    return this.gl.getProgramParameter(this.program, DELETE_STATUS);
  }

  /** Whether the last link operation was successful. */
  public get linkStatus(): boolean {
    return this.gl.getProgramParameter(this.program, LINK_STATUS);
  }

  /** Whether the last validation operation was successful. */
  public get validateStatus(): boolean {
    return this.gl.getProgramParameter(this.program, VALIDATE_STATUS);
  }

  /** The information log for this shader program. */
  public get infoLog(): string {
    return this.gl.getProgramInfoLog(this.program) ?? "";
  }

  /** Deletes this shader program. */
  public delete(): void {
    this.gl.deleteProgram(this.program);
  }

  /** Sets this as the active shader program. */
  public use(): void {
    this.gl.useProgram(this.program);
  }
}
