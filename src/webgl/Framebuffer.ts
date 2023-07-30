import { type default as Texture, Mip, type Mipmap, MipmapTarget } from "#textures/Texture";
import type Context from "#webgl/Context";
import Renderbuffer, { RENDERBUFFER } from "#webgl/Renderbuffer";

/** Binding points for framebuffers. */
export const enum FramebufferTarget {
	/** A collection buffer data storage of color, alpha, depth, and stencil buffers used to render an image. */
	FRAMEBUFFER = 0x8D40,

	/** Used as a destination for drawing, rendering, clearing, and writing operations. */
	DRAW_FRAMEBUFFER = 0x8CA9,

	/** Used as a source for reading operations. */
	READ_FRAMEBUFFER = 0x8CA8
}

/** Statuses for framebuffers. */
export const enum FramebufferStatus {
	/** The framebuffer is ready to display. */
	FRAMEBUFFER_COMPLETE = 0x8CD5,

	/** The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete. */
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6,

	/** There is no attachment. */
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7,

	/** Height and width of the attachment are not the same. */
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9,

	/** The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer. */
	FRAMEBUFFER_UNSUPPORTED = 0x8CDD,

	/** The values of the samples are different among attached renderbuffers, or are non-zero if the attached images are a mix of renderbuffers and textures. */
	FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8D56,

	/** If the base view index is not the same for all framebuffer attachment points where the object type is set, the framebuffer is considered incomplete. */
	FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = 0x9633
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

/** Indicates that the back framebuffer (canvas) should be drawn to. */
export const BACK = 0x0405;

/** Indicates that no framebuffers should be drawn to. */
export const NONE = 0;

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
	 * Sets the drawing buffer array.
	 * @param gl The rendering context.
	 * @param none Whether to not render to any attachment.
	 * @param back Whether to render to the back buffer.
	 * @param colorAttachments A list of color attachments to render to.
	 */
	public static setDrawBuffers(gl: Context, none: boolean, back: boolean, colorAttachments: Array<number>): void {
		const drawBuffers: Array<number> = [];
		if (none) { drawBuffers.push(NONE); }
		if (back) { drawBuffers.push(BACK); }
		for (const colorAttachment of colorAttachments) { drawBuffers.push(COLOR_ATTACHMENT0 + colorAttachment); }
		gl.gl.drawBuffers(drawBuffers);
	}

	/**
	 * Sets the read buffer to none.
	 * @param gl The rendering context.
	 */
	public static setReadBuffer(gl: Context): void;

	/**
	 * Sets the read buffer to the back buffer.
	 * @param gl The rendering context.
	 * @param back Whether to read from the back buffer.
	 */
	public static setReadBuffer(gl: Context, back: boolean): void;

	/**
	 * Sets the read buffer to a color buffer.
	 * @param gl The rendering context.
	 * @param colorBuffer The color attachment to read from.
	 */
	public static setReadBuffer(gl: Context, colorBuffer: number): void;

	public static setReadBuffer(gl: Context, readBuffer?: boolean | number): void {
		if (typeof readBuffer == "number") {
			gl.gl.readBuffer(COLOR_ATTACHMENT0 + readBuffer);
		} else {
			if (readBuffer) {
				gl.gl.readBuffer(BACK);
			} else {
				gl.gl.readBuffer(NONE);
			}
		}
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

	/** The depth attachment on this framebuffer. */
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

	/** The stencil attachment on this framebuffer. */
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

	/** The depth stencil attachment on this framebuffer. */
	public set depthStencilAttachment(value: FramebufferAttachment | undefined) {
		if (!value) { throw new Error("Cannot set an attachment to be undefined."); }
		this.attach(value as Mip, DEPTH_STENCIL_ATTACHMENT);
		this.depthStencilAttachmentPrivate = value;
	}

	/** The status of this framebuffer. */
	public get status(): FramebufferStatus {
		this.bind();
		return this.gl.gl.checkFramebufferStatus(this.target);
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
