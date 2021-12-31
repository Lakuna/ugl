import { UnsupportedError } from "../utility/UnsupportedError.js";
import { WebGLConstant, TextureUnit, BlendEquation } from "./WebGLConstant.js";
import { WebGLObject } from "./WebGLObject.js";

/** GPU configurations. */
export enum PowerPreference {
  /** Let the user agent decide which GPU configuration is most suitable. */
  Default = "default",

  /** Prioritizes rendering performance over power consumption. */
  HighPerformance = "high-performance",

  /** Prioritizes power saving over rendering performance. */
  LowPower = "low-power"
}

/** A WebGL2 rendering context. */
export class RenderingContext extends WebGLObject {
  #gl: WebGL2RenderingContext;

  /**
   * Creates a rendering context.
   * @param canvas - The canvas associated with the context.
   * @param contextAttributes - The attributes to use when creating the context.
   */
	constructor(canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes) {
    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", contextAttributes);
    if (!gl) { throw new UnsupportedError("WebGL2 is not supported by your browser."); }
    super(gl);
    this.#gl = gl;
    this.canvas = canvas;
  }

  /** The canvas associated with this context. */
  readonly canvas: HTMLCanvasElement;

  /** The width of the current drawing buffer. */
  get drawingBufferWidth(): number {
    return this.#gl.drawingBufferWidth;
  }
  set drawingBufferWidth(value: number) {
    this.canvas.width = value;
  }

  /** The height of the current drawing buffer. */
  get drawingBufferHeight(): number {
    return this.#gl.drawingBufferHeight
  }
  set drawingBufferHeight(value: number) {
    this.canvas.height = value;
  }

  /** The attributes used when creating this context. */
  get contextAttributes(): WebGLContextAttributes {
    return this.#gl.getContextAttributes() ?? {};
  }

  /** Whether this context is lost. */
  get isLost(): boolean {
    return this.#gl.isContextLost();
  }

  // TODO: makeXRCompatible()

  /** The scissor box, which limits the drawing to a specified rectangle. Uses the form `[x, y, width, height]`, with the origin being the lower left corner of the box. */
  get scissor(): [number, number, number, number] {
    return [...(this.#gl.getParameter(WebGLConstant.SCISSOR_BOX) as Int32Array)] as [number, number, number, number];
  }
  set scissor(value: [number, number, number, number]) {
    this.#gl.scissor(...value);
  }

  /** The viewport, which specifies the affine transformation of `x` and `y` from normalized device coordinates to window coordinates. Uses the form `[x, y, width, height]`, with the origin being the lower left corner of the box. */
  get viewport(): [number, number, number, number] {
    return [...(this.#gl.getParameter(WebGLConstant.VIEWPORT) as Int32Array)] as [number, number, number, number];
  }
  set viewport(value: [number, number, number, number]) {
    this.#gl.viewport(...value);
  }

  /** The maximum size of the viewport, of the form `[x, y]`.*/
  get maxViewport(): [number, number] {
    return [...(this.#gl.getParameter(WebGLConstant.MAX_VIEWPORT_DIMS) as Int32Array)] as [number, number];
  }

  /** The active texture unit. */
  get activeTexture(): TextureUnit {
    return this.#gl.getParameter(WebGLConstant.ACTIVE_TEXTURE);
  }
  set activeTexture(value: TextureUnit) {
    this.#gl.activeTexture(value);
  }

  /** The maximum number of texture units. */
  get maxTextureUnits(): number {
    return this.#gl.getParameter(WebGLConstant.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  }

  /** The source and desination blending factors. Uses the form `[red, green, blue, alpha]`. */
  get blendColor(): [number, number, number, number] {
    return [...(this.#gl.getParameter(WebGLConstant.BLEND_COLOR) as Float32Array)] as [number, number, number, number];
  }
  set blendColor(value: [number, number, number, number]) {
    this.#gl.blendColor(...value);
  }

  /** Determines how a new pixel is combined with a pixel already in a framebuffer. */
  set blendEquation(value: BlendEquation) {
    this.#gl.blendEquation(value);
  }

  /** The RGB blend equation. */
  get blendEquationRgb(): BlendEquation {
    return this.#gl.getParameter(WebGLConstant.BLEND_EQUATION_RGB);
  }
  set blendEquationRgb(value: BlendEquation) {
    this.#gl.blendEquationSeparate(value, this.blendEquationAlpha);
  }

  /** The alpha blend equation. */
  get blendEquationAlpha(): BlendEquation {
    return this.#gl.getParameter(WebGLConstant.BLEND_EQUATION_ALPHA);
  }
  set blendEquationAlpha(value: BlendEquation) {
    this.#gl.blendEquationSeparate(this.blendEquationRgb, value);
  }
}
