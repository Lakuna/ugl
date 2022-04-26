import { FramebufferTarget, FramebufferAttachment } from "./WebGLConstant.js";
import { Texture } from "./Texture.js";
import { Renderbuffer } from "./Renderbuffer.js";
import { RENDERBUFFER } from "./WebGLConstant.js";

/** A data structure that organizes the memory resources that are needed to render an image. */
export class Framebuffer {
  /**
   * Unbinds all framebuffers from the given rendering context.
   * @param gl - The rendering context.
   */
  static unbind(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(FramebufferTarget.FRAMEBUFFER, null);
  }

  /**
   * Creates a framebuffer.
   * @param gl - The rendering context of the framebuffer.
   */
  constructor(gl: WebGL2RenderingContext, width: number, height: number, target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER) {
    this.gl = gl;
    this.target = target;
    this.#attachments = new Map();
    this.width = width;
    this.height = height;

    const framebuffer: WebGLFramebuffer | null = gl.createFramebuffer();
    if (!framebuffer) { throw new Error("Failed to create a framebuffer."); }
    this.framebuffer = framebuffer;
  }

  /** The rendering context of this framebuffer. */
  readonly gl: WebGL2RenderingContext;

  /** The WebGL API interface of this framebuffer. */
  readonly framebuffer: WebGLFramebuffer;

  /** The target binding point of this framebuffer. */
  target: FramebufferTarget

  /** The width of this framebuffer. */
  width: number;

  /** The height of this framebuffer. */
  height: number;

  /** Binds this framebuffer to its target. */
  bind(): void {
    this.gl.bindFramebuffer(this.target, this.framebuffer);
  }

  /** A map of attachments on this framebuffer. */
  #attachments: Map<FramebufferAttachment, Texture | Renderbuffer>

  /** A map of attachments on this framebuffer. */
  get attachments(): ReadonlyMap<FramebufferAttachment, Texture | Renderbuffer> {
    return this.#attachments;
  }

  /**
   * Attaches a texture to this framebuffer.
   * @param texture - The texture to attach.
   * @param attachmentPoint - The attachment point of the texture.
   */
  attach(texture: Texture, attachmentPoint: FramebufferAttachment, level?: number): void;

  attach(attachment: Texture | Renderbuffer, attachmentPoint: FramebufferAttachment, layer?: number): void {
    this.bind();

    if (attachment instanceof Renderbuffer) {
      this.gl.framebufferRenderbuffer(this.target, attachmentPoint, RENDERBUFFER, attachment.renderbuffer);
    } else if (typeof layer == "number") {
      this.gl.framebufferTextureLayer(this.target, attachmentPoint, attachment.texture, 0, layer);
    } else {
      this.gl.framebufferTexture2D(this.target, attachmentPoint, attachment.target, attachment.texture, 0);
    }

    this.#attachments.set(attachmentPoint, attachment);

    Framebuffer.unbind(this.gl);
  }
}
