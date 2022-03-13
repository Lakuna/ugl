import { RenderbufferFormat } from "./WebGLConstant.js";

const RENDERBUFFER = 0x8D41;

/** A buffer that can contain an image or be the source or target of a rendering operation. */
export class Renderbuffer {
  /**
   * Creates a renderbuffer.
   * @param gl - The rendering context of the renderbuffer.
   * @param format - The format of the renderbuffer.
   * @param width - The width of the renderbuffer.
   * @param height - The height of the renderbuffer.
   */
  constructor(gl: WebGL2RenderingContext, format: RenderbufferFormat, width: number, height: number) {
    this.gl = gl;
    this.format = format;
    this.width = width;
    this.height = height;

    const renderbuffer: WebGLRenderbuffer | null = gl.createRenderbuffer();
    if (!renderbuffer) { throw new Error("Failed to create a renderbuffer."); }
    this.renderbuffer = renderbuffer;

    this.bind();
    gl.renderbufferStorage(RENDERBUFFER, format, width, height);
  }

  /** The rendering context of this renderbuffer. */
  readonly gl: WebGL2RenderingContext;

  /** The WebGL API interface of this renderbuffer. */
  readonly renderbuffer: WebGLRenderbuffer;

  /** The format of this renderbuffer. */
  readonly format: RenderbufferFormat;

  /** The width of this renderbuffer. */
  readonly width: number;

  /** The height of this renderbuffer. */
  readonly height: number;

  /** Binds this renderbuffer. */
  bind(): void {
    this.gl.bindRenderbuffer(RENDERBUFFER, this.renderbuffer);
  }
}
