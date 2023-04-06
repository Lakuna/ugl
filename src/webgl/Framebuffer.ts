import type Context from "./Context.js";
import Renderbuffer, { RENDERBUFFER } from "./Renderbuffer.js";
import { type default as Texture, Mip, type Mipmap, MipmapTarget } from "./textures/Texture.js";

/** Binding points for framebuffers. */
export const enum FramebufferTarget {
	/** A collection buffer data storage of color, alpha, depth, and stencil buffers used to render an image. */
	FRAMEBUFFER = 0x8D40,

	/** Used as a destination for drawing, rendering, clearing, and writing operations. */
	DRAW_FRAMEBUFFER = 0x8CA9,

	/** Used as a source for reading operations. */
	READ_FRAMEBUFFER = 0x8CA8
}

/** An attachment for a framebuffer. */
export type FramebufferAttachment = Mip | Mipmap<Mip> | Renderbuffer;

/** The first color attachment. */
export const COLOR_ATTACHMENT0 = 0x8CE0;

/** The depth attachment. */
export const DEPTH_ATTACHMENT = 0x8D00;

/** The stencil attachment. */
export const STENCIL_ATTACHMENT = 0x8D20;

/** The depth and stencil attachment. */
export const DEPTH_STENCIL_ATTACHMENT = 0x821A;

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
	public constructor(
		gl: Context,
		colorAttachments: Array<FramebufferAttachment> = [],
		depthAttachment?: FramebufferAttachment,
		stencilAttachment?: FramebufferAttachment,
		depthStencilAttachment?: FramebufferAttachment,
		target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER
	) {
		this.gl = gl;
		this.target = target;

		const framebuffer: WebGLFramebuffer | null = gl.gl.createFramebuffer();
		if (!framebuffer) { throw new Error("Failed to create a framebuffer."); }
		this.framebuffer = framebuffer;

		this.colorAttachments = [];
		for (let i = 0; i < colorAttachments.length; i++) {
			this.setColorAttachment(i, colorAttachments[i] as FramebufferAttachment);
		}
		if (depthAttachment) { this.depthAttachment = depthAttachment; }
		if (stencilAttachment) { this.stencilAttachment = stencilAttachment; }
		if (depthStencilAttachment) { this.depthStencilAttachment = depthStencilAttachment; }
	}

	/** The rendering context of this framebuffer. */
	public readonly gl: Context;

	/** The WebGL API interface of this framebuffer. */
	public readonly framebuffer: WebGLFramebuffer;

	/** The target binding point of this framebuffer. */
	public target: FramebufferTarget;

	/** A list of color attachments on this framebuffer. */
	private readonly colorAttachments: Array<FramebufferAttachment>;

	/**
	 * Gets a color attachment.
	 * @param i The index of the color attachment.
	 * @returns The color attachment.
	 */
	public getColorAttachment(i: number): FramebufferAttachment | undefined {
		return this.colorAttachments[i];
	}

	/**
	 * Sets a color attachment.
	 * @param i The index of the color attachment.
	 * @param attachment The attachment.
	 */
	public setColorAttachment(i: number, attachment: FramebufferAttachment): void {
		this.attach(attachment as Mip, COLOR_ATTACHMENT0 + i);
		this.colorAttachments[i] = attachment;
	}

	/** The depth attachment on this framebuffer. */
	private depthAttachmentPrivate?: FramebufferAttachment;

	/** The depth attachment on this framebuffer. */
	public get depthAttachment(): FramebufferAttachment | undefined {
		return this.depthAttachmentPrivate;
	}

	public set depthAttachment(value: FramebufferAttachment | undefined) {
		if (!value) { throw new Error("Cannot set an attachment to be undefined."); }
		this.attach(value as Mip, DEPTH_ATTACHMENT);
		this.depthAttachmentPrivate = value;
	}

	/** The stencil attachment on this framebuffer. */
	private stencilAttachmentPrivate?: FramebufferAttachment;

	/** The stencil attachment on this framebuffer. */
	public get stencilAttachment(): FramebufferAttachment | undefined {
		return this.stencilAttachmentPrivate;
	}

	public set stencilAttachment(value: FramebufferAttachment | undefined) {
		if (!value) { throw new Error("Cannot set an attachment to be undefined."); }
		this.attach(value as Mip, STENCIL_ATTACHMENT);
		this.stencilAttachmentPrivate = value;
	}

	/** The depth stencil attachment on this framebuffer. */
	private depthStencilAttachmentPrivate?: FramebufferAttachment;

	/** The depth stencil attachment on this framebuffer. */
	public get depthStencilAttachment(): FramebufferAttachment | undefined {
		return this.depthStencilAttachmentPrivate;
	}

	public set depthStencilAttachment(value: FramebufferAttachment | undefined) {
		if (!value) { throw new Error("Cannot set an attachment to be undefined."); }
		this.attach(value as Mip, DEPTH_STENCIL_ATTACHMENT);
		this.depthStencilAttachmentPrivate = value;
	}

	/** Binds this framebuffer to its target. */
	public bind(): void {
		this.gl.gl.bindFramebuffer(this.target, this.framebuffer);
	}

	/**
	 * Attaches a texture to this framebuffer.
	 * @param attachment The texture to attach.
	 * @param attachmentPoint The attachment point of the texture.
	 */
	private attach(attachment: Mipmap<Mip>, attachmentPoint: number): void;

	/**
	 * Attaches a single layer of a texture to this framebuffer.
	 * @param attachment The texture to attach.
	 * @param attachmentPoint The attachment point of the texture.
	 * @param layer The layer of the texture to attach.
	 */
	private attach(attachment: Mip, attachmentPoint: number, layer?: number): void;

	/**
	 * Attaches a renderbuffer to this framebuffer.
	 * @param attachment The renderbuffer to attach.
	 * @param attachmentPoint The attachment point of the renderbuffer.
	 */
	private attach(attachment: Renderbuffer, attachmentPoint: number): void;

	private attach(attachment: FramebufferAttachment, attachmentPoint: number, layer = 0): void {
		this.bind();

		if (attachment instanceof Renderbuffer) {
			this.gl.gl.framebufferRenderbuffer(this.target, attachmentPoint, RENDERBUFFER, attachment.renderbuffer);
		} else if (attachment instanceof Mip) {
			this.gl.gl.framebufferTextureLayer(this.target, attachmentPoint, (attachment.texture as Texture<Mip>).texture, attachment.lod as number, layer);
		} else {
			this.gl.gl.framebufferTexture2D(this.target, attachmentPoint, attachment.target as MipmapTarget, (attachment.texture as Texture<Mip>).texture, 0);
		}

		Framebuffer.unbind(this.gl);
	}
}
