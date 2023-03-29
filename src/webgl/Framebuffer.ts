import { FramebufferTarget, FramebufferAttachmentPoint, RENDERBUFFER } from "./Constant.js";
import type Texture from "./textures/Texture.js";
import Renderbuffer from "./Renderbuffer.js";
import type { TextureFaceLevel } from "./textures/Texture.js";

/** An attachment for a framebuffer. */
export type FramebufferAttachment = Texture<TextureFaceLevel> | Renderbuffer;

/** A data structure that organizes the memory resources that are needed to render an image. */
export default class Framebuffer {
	/**
	 * Unbinds all framebuffers from the given rendering context.
	 * @param gl The rendering context.
	 */
	public static unbind(gl: WebGL2RenderingContext): void {
		gl.bindFramebuffer(FramebufferTarget.FRAMEBUFFER, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param gl The rendering context of the framebuffer.
	 */
	public constructor(gl: WebGL2RenderingContext, target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER) {
		this.gl = gl;
		this.target = target;
		this.attachmentsPrivate = new Map();

		const framebuffer: WebGLFramebuffer | null = gl.createFramebuffer();
		if (!framebuffer) { throw new Error("Failed to create a framebuffer."); }
		this.framebuffer = framebuffer;
	}

	/** The rendering context of this framebuffer. */
	public readonly gl: WebGL2RenderingContext;

	/** The WebGL API interface of this framebuffer. */
	public readonly framebuffer: WebGLFramebuffer;

	/** The target binding point of this framebuffer. */
	public target: FramebufferTarget;

	/** Binds this framebuffer to its target. */
	public bind(): void {
		this.gl.bindFramebuffer(this.target, this.framebuffer);
	}

	/** A map of attachments on this framebuffer. */
	private attachmentsPrivate: Map<FramebufferAttachmentPoint, FramebufferAttachment>;

	/** A map of attachments on this framebuffer. */
	public get attachments(): ReadonlyMap<FramebufferAttachmentPoint, FramebufferAttachment> {
		return this.attachmentsPrivate;
	}

	/**
	 * Attaches a texture to this framebuffer.
	 * @param attachment The texture to attach.
	 * @param attachmentPoint The attachment point of the texture.
	 */
	public attach(attachment: Texture<TextureFaceLevel>, attachmentPoint: FramebufferAttachmentPoint): void;

	/**
	 * Attaches a single layer of a texture to this framebuffer.
	 * @param attachment The texture to attach.
	 * @param attachmentPoint The attachment point of the texture.
	 * @param layer The layer of the texture to attach.
	 */
	public attach(attachment: Texture<TextureFaceLevel>, attachmentPoint: FramebufferAttachmentPoint, layer: number): void;

	/**
	 * Attaches a renderbuffer to this framebuffer.
	 * @param attachment The renderbuffer to attach.
	 * @param attachmentPoint The attachment point of the renderbuffer.
	 */
	public attach(attachment: Renderbuffer, attachmentPoint: FramebufferAttachmentPoint): void;

	public attach(attachment: FramebufferAttachment, attachmentPoint: FramebufferAttachmentPoint, layer?: number): void {
		this.bind();

		if (attachment instanceof Renderbuffer) {
			this.gl.framebufferRenderbuffer(this.target, attachmentPoint, RENDERBUFFER, attachment.renderbuffer);
		} else if (typeof layer == "number") {
			this.gl.framebufferTextureLayer(this.target, attachmentPoint, attachment.texture, 0, layer);
		} else {
			this.gl.framebufferTexture2D(this.target, attachmentPoint, attachment.target, attachment.texture, 0);
		}

		this.attachmentsPrivate.set(attachmentPoint, attachment);

		Framebuffer.unbind(this.gl);
	}
}
