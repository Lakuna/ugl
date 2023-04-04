import type Context from "./Context.js";
import Renderbuffer, { RENDERBUFFER } from "./Renderbuffer.js";
import type { default as Texture, Mip } from "./textures/Texture.js";

/** Binding points for framebuffers. */
export const enum FramebufferTarget {
	/** A collection buffer data storage of color, alpha, depth, and stencil buffers used to render an image. */
	FRAMEBUFFER = 0x8D40,

	/** Used as a destination for drawing, rendering, clearing, and writing operations. */
	DRAW_FRAMEBUFFER = 0x8CA9,

	/** Used as a source for reading operations. */
	READ_FRAMEBUFFER = 0x8CA8
}

/** Attachment points for framebuffer attachments. */
export const enum FramebufferAttachmentPoint {
	/** The first color buffer. */
	COLOR_ATTACHMENT0 = 0x8CE0,

	/** The second color buffer. */
	COLOR_ATTACHMENT1 = 0x8CE1,

	/** The third color buffer. */
	COLOR_ATTACHMENT2 = 0x8CE2,

	/** The fourth color buffer. */
	COLOR_ATTACHMENT3 = 0x8CE3,

	/** The fifth color buffer. */
	COLOR_ATTACHMENT4 = 0x8CE4,

	/** The sixth color buffer. */
	COLOR_ATTACHMENT5 = 0x8CE5,

	/** The seventh color buffer. */
	COLOR_ATTACHMENT6 = 0x8CE6,

	/** The eighth color buffer. */
	COLOR_ATTACHMENT7 = 0x8CE7,

	/** The ninth color buffer. */
	COLOR_ATTACHMENT8 = 0x8CE8,

	/** The tenth color buffer. */
	COLOR_ATTACHMENT9 = 0x8CE9,

	/** The eleventh color buffer. */
	COLOR_ATTACHMENT10 = 0x8CEA,

	/** The twelfth color buffer. */
	COLOR_ATTACHMENT11 = 0x8CEB,

	/** The thirteenth color buffer. */
	COLOR_ATTACHMENT12 = 0x8CEC,

	/** The fourteenth color buffer. */
	COLOR_ATTACHMENT13 = 0x8CED,

	/** The fifteenth color buffer. */
	COLOR_ATTACHMENT14 = 0x8CEE,

	/** The sixteenth color buffer. */
	COLOR_ATTACHMENT15 = 0x8CEF,

	/** The depth buffer. */
	DEPTH_ATTACHMENT = 0x8D00,

	/** The stencil buffer. */
	STENCIL_ATTACHMENT = 0x8D20,

	/** The depth and stencil buffer. */
	DEPTH_STENCIL_ATTACHMENT = 0x821A
}

/** An attachment for a framebuffer. */
export type FramebufferAttachment = Texture<Mip> | Renderbuffer;

/**
 * A data structure that organizes the memory resources that are needed to render an image.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/framebuffers)
 */
export default class Framebuffer {
	/**
	 * Unbinds all framebuffers from the given rendering context.
	 * @param gl The rendering context.
	 */
	public static unbind(gl: Context): void {
		gl.gl.bindFramebuffer(FramebufferTarget.FRAMEBUFFER, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param gl The rendering context of the framebuffer.
	 */
	public constructor(gl: Context, target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER) {
		this.gl = gl;
		this.target = target;
		this.attachmentsPrivate = new Map();

		const framebuffer: WebGLFramebuffer | null = gl.gl.createFramebuffer();
		if (!framebuffer) { throw new Error("Failed to create a framebuffer."); }
		this.framebuffer = framebuffer;
	}

	/** The rendering context of this framebuffer. */
	public readonly gl: Context;

	/** The WebGL API interface of this framebuffer. */
	public readonly framebuffer: WebGLFramebuffer;

	/** The target binding point of this framebuffer. */
	public target: FramebufferTarget;

	/** Binds this framebuffer to its target. */
	public bind(): void {
		this.gl.gl.bindFramebuffer(this.target, this.framebuffer);
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
	public attach(attachment: Texture<Mip>, attachmentPoint: FramebufferAttachmentPoint): void;

	/**
	 * Attaches a single layer of a texture to this framebuffer.
	 * @param attachment The texture to attach.
	 * @param attachmentPoint The attachment point of the texture.
	 * @param layer The layer of the texture to attach.
	 */
	public attach(attachment: Texture<Mip>, attachmentPoint: FramebufferAttachmentPoint, layer: number): void;

	/**
	 * Attaches a renderbuffer to this framebuffer.
	 * @param attachment The renderbuffer to attach.
	 * @param attachmentPoint The attachment point of the renderbuffer.
	 */
	public attach(attachment: Renderbuffer, attachmentPoint: FramebufferAttachmentPoint): void;

	public attach(attachment: FramebufferAttachment, attachmentPoint: FramebufferAttachmentPoint, layer?: number): void {
		this.bind();

		if (attachment instanceof Renderbuffer) {
			this.gl.gl.framebufferRenderbuffer(this.target, attachmentPoint, RENDERBUFFER, attachment.renderbuffer);
		} else if (typeof layer == "number") {
			this.gl.gl.framebufferTextureLayer(this.target, attachmentPoint, attachment.texture, 0, layer);
		} else {
			this.gl.gl.framebufferTexture2D(this.target, attachmentPoint, attachment.target, attachment.texture, 0);
		}

		this.attachmentsPrivate.set(attachmentPoint, attachment);

		Framebuffer.unbind(this.gl);
	}
}
