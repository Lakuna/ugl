import { UnsupportedError } from "../utility/UnsupportedError.js";
import { WebGLConstant, TextureUnit, BlendEquation, BlendFunction } from "./WebGLConstant.js";
import { WebGLObject } from "./WebGLObject.js";
import { Rectangle } from "../utility/Rectangle.js";
import { Color } from "../utility/Color.js";

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

  /** The scissor box, which limits the drawing to a specified rectangle. The origin is the lower left corner. */
  get scissor(): Rectangle {
    return new Rectangle(...(this.#gl.getParameter(WebGLConstant.SCISSOR_BOX) as [number, number, number, number]));
  }
  set scissor(value: Rectangle) {
    this.#gl.scissor(value.x, value.y, value.width, value.height);
  }

  /** The viewport, which specifies the affine transformation of `x` and `y` from normalized device coordinates to window coordinates. The origin is the lower left corner. */
  get viewport(): Rectangle {
    return new Rectangle(...(this.#gl.getParameter(WebGLConstant.VIEWPORT) as [number, number, number, number]));
  }
  set viewport(value: Rectangle) {
    this.#gl.viewport(value.x, value.y, value.width, value.height);
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
  get blendColor(): Color {
    return new Color(this.#gl.getParameter(WebGLConstant.BLEND_COLOR));
  }
  set blendColor(value: Color) {
    this.#gl.blendColor(value.r, value.g, value.b, value.a);
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

  /** Defines which function is used for blending pixel arithmetic. Uses the form `[source, destination]`. */
  set blendFunction(value: [BlendFunction, BlendFunction]) {
    this.#gl.blendFunc(...value);
  }

  /** The source RGB blend function. */
  get blendFunctionSourceRgb(): BlendFunction {
    return this.#gl.getParameter(WebGLConstant.BLEND_SRC_RGB);
  }
  set blendFunctionSourceRgb(value: BlendFunction) {
    this.#gl.blendFuncSeparate(value, this.blendFunctionDestinationRgb, this.blendFunctionSourceAlpha, this.blendFunctionDestinationAlpha);
  }

  /** The destination RGB blend function. */
  get blendFunctionDestinationRgb(): BlendFunction {
    return this.#gl.getParameter(WebGLConstant.BLEND_DST_RGB);
  }
  set blendFunctionDestinationRgb(value: BlendFunction) {
    this.#gl.blendFuncSeparate(this.blendFunctionSourceRgb, value, this.blendFunctionSourceAlpha, this.blendFunctionDestinationAlpha);
  }

  /** The source alpha blend function. */
  get blendFunctionSourceAlpha(): BlendFunction {
    return this.#gl.getParameter(WebGLConstant.BLEND_SRC_ALPHA);
  }
  set blendFunctionSourceAlpha(value: BlendFunction) {
    this.#gl.blendFuncSeparate(this.blendFunctionSourceRgb, this.blendFunctionDestinationRgb, value, this.blendFunctionDestinationAlpha);
  }

  /** The destination alpha blend function. */
  get blendFunctionDestinationAlpha(): BlendFunction {
    return this.#gl.getParameter(WebGLConstant.BLEND_SRC_ALPHA);
  }
  set blendFunctionDestinationAlpha(value: BlendFunction) {
    this.#gl.blendFuncSeparate(this.blendFunctionSourceRgb, this.blendFunctionDestinationRgb, this.blendFunctionSourceAlpha, value);
  }

  /** The color values used when clearing color buffers. Values are clamped between 0 and 1. Uses the form `[red, green, blue, alpha]`. */
  get clearColor(): Color {
    return new Color(this.#gl.getParameter(WebGLConstant.COLOR_CLEAR_VALUE));
  }
  set clearColor(value: Color) {
    this.#gl.clearColor(value.r, value.g, value.b, value.a);
  }
}
