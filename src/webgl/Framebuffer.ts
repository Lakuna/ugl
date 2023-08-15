import { type default as Texture, Mip, type Mipmap, MipmapTarget } from "#textures/Texture";
import type Context from "#webgl/Context";
import Renderbuffer, { RENDERBUFFER } from "#webgl/Renderbuffer";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";

/** The currently-bound framebuffer. */
export const FRAMEBUFFER_BINDING = 0x8CA6;

/** The currently-bound draw framebuffer. */
export const DRAW_FRAMEBUFFER_BINDING = 0x8CA6;

/** The currently-bound read framebuffer. */
export const READ_FRAMEBUFFER_BINDING = 0x8CAA;

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
	 * Unbinds a framebuffer from the given rendering context.
	 * @param context The rendering context.
	 * @param target The target binding point.
	 */
	public static unbind(context: Context, target: FramebufferTarget): void {
		Framebuffer.bind(context, target, null);
	}

	/**
	 * Sets the drawing buffer array.
	 * @param context The rendering context.
	 * @param none Whether to not render to any attachment.
	 * @param back Whether to render to the back buffer.
	 * @param colorAttachments A list of color attachments to render to.
	 */
	public static setDrawBuffers(context: Context, none: boolean, back: boolean, colorAttachments: Array<number>): void {
		const drawBuffers: Array<number> = [];
		if (none) { drawBuffers.push(NONE); }
		if (back) { drawBuffers.push(BACK); }
		for (const colorAttachment of colorAttachments) { drawBuffers.push(COLOR_ATTACHMENT0 + colorAttachment); }
		context.internal.drawBuffers(drawBuffers);
	}

	/**
	 * Sets the read buffer to none.
	 * @param context The rendering context.
	 */
	public static setReadBuffer(context: Context): void;

	/**
	 * Sets the read buffer to the back buffer.
	 * @param context The rendering context.
	 * @param back Whether to read from the back buffer.
	 */
	public static setReadBuffer(context: Context, back: boolean): void;

	/**
	 * Sets the read buffer to a color buffer.
	 * @param context The rendering context.
	 * @param colorBuffer The color attachment to read from.
	 */
	public static setReadBuffer(context: Context, colorBuffer: number): void;

	public static setReadBuffer(context: Context, readBuffer?: boolean | number): void {
		context.internal.readBuffer(typeof readBuffer == "number"
			? COLOR_ATTACHMENT0 + readBuffer
			: readBuffer
				? BACK
				: NONE);
	}

	/**
	 * Gets the internal representation of the currently-bound framebuffer.
	 * @param context The context that the framebuffer is bound to.
	 * @param target The target that the framebuffer is bound to.
	 * @returns The currently-bound framebuffer.
	 */
	private static getBoundFramebuffer(context: Context, target: FramebufferTarget): WebGLFramebuffer | null {
		switch (target) {
			case FramebufferTarget.FRAMEBUFFER:
				return context.internal.getParameter(FRAMEBUFFER_BINDING);
			case FramebufferTarget.READ_FRAMEBUFFER:
				return context.internal.getParameter(READ_FRAMEBUFFER_BINDING);
			case FramebufferTarget.DRAW_FRAMEBUFFER:
				return context.internal.getParameter(DRAW_FRAMEBUFFER_BINDING);
		}
	}

	/**
	 * Binds a framebuffer to a binding point.
	 * @param context The rendering context of the framebuffer.
	 * @param target The target binding point.
	 * @param framebuffer The framebuffer.
	 */
	private static bind(context: Context, target: FramebufferTarget, framebuffer: WebGLFramebuffer | null): void {
		context.internal.bindFramebuffer(target, framebuffer);
	}

	/**
	 * Creates a framebuffer.
	 * @param context The rendering context of the framebuffer.
	 */
	public constructor(
		context: Context,
		colorAttachments: Array<FramebufferAttachment> = [],
		depthAttachment?: FramebufferAttachment,
		stencilAttachment?: FramebufferAttachment,
		depthStencilAttachment?: FramebufferAttachment,
		target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER
	) {
		this.context = context;
		this.target = target;

		const framebuffer: WebGLFramebuffer | null = context.internal.createFramebuffer();
		if (!framebuffer) { throw new UnsupportedOperationError(); }
		this.internal = framebuffer;

		this.colorAttachments = [];
		for (let i = 0; i < colorAttachments.length; i++) {
			this.setColorAttachment(i, colorAttachments[i] as FramebufferAttachment);
		}
		if (depthAttachment) { this.depthAttachment = depthAttachment; }
		if (stencilAttachment) { this.stencilAttachment = stencilAttachment; }
		if (depthStencilAttachment) { this.depthStencilAttachment = depthStencilAttachment; }
	}

	/** The rendering context of this framebuffer. */
	public readonly context: Context;

	/** The WebGL API interface of this framebuffer. */
	public readonly internal: WebGLFramebuffer;

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
		if (!value) { throw new UnsupportedOperationError(); }
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
		if (!value) { throw new UnsupportedOperationError(); }
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
		if (!value) { throw new UnsupportedOperationError(); }
		this.attach(value as Mip, DEPTH_STENCIL_ATTACHMENT);
		this.depthStencilAttachmentPrivate = value;
	}

	/** The status of this framebuffer. */
	public get status(): FramebufferStatus {
		return this.with((framebuffer: this): FramebufferStatus => {
			return framebuffer.context.internal.checkFramebufferStatus(framebuffer.target);
		});
	}

	/** Binds this framebuffer to its target. */
	public bind(): void {
		Framebuffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this framebuffer bound, then re-binds the previously-bound framebuffer.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (framebuffer: this) => T): T {
		const previousBinding: WebGLFramebuffer | null = Framebuffer.getBoundFramebuffer(this.context, this.target);
		this.bind();
		const out: T = f(this);
		Framebuffer.bind(this.context, this.target, previousBinding);
		return out;
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
		return this.with((framebuffer: this): void => {
			if (attachment instanceof Renderbuffer) {
				framebuffer.context.internal.framebufferRenderbuffer(framebuffer.target, attachmentPoint, RENDERBUFFER, attachment.internal);
			} else if (attachment instanceof Mip) {
				framebuffer.context.internal.framebufferTextureLayer(framebuffer.target, attachmentPoint, (attachment.texture as Texture<Mip>).internal, attachment.lod as number, layer);
			} else {
				framebuffer.context.internal.framebufferTexture2D(framebuffer.target, attachmentPoint, attachment.target as MipmapTarget, (attachment.texture as Texture<Mip>).internal, 0);
			}
		});
	}

	/** Deletes this framebuffer. */
	public delete(): void {
		this.context.internal.deleteFramebuffer(this.internal);
	}
}
