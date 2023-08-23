import type Context from "#Context";
import FramebufferTarget from "#FramebufferTarget";
import {
	NONE,
	BACK,
	COLOR_ATTACHMENT0,
	FRAMEBUFFER_BINDING,
	READ_FRAMEBUFFER_BINDING,
	DRAW_FRAMEBUFFER_BINDING,
	DEPTH_ATTACHMENT,
	STENCIL_ATTACHMENT,
	DEPTH_STENCIL_ATTACHMENT,
	RENDERBUFFER
} from "#constants";
import type { FramebufferAttachment } from "#FramebufferAttachment";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Mip from "#Mip";
import type FramebufferStatus from "#FramebufferStatus";
import type Mipmap from "#Mipmap";
import Renderbuffer from "#Renderbuffer";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";

/**
 * A data structure that organizes the memory resources that are needed to
 * render an image.
 * @see [Framebuffers](https://www.lakuna.pw/a/webgl/framebuffers)
 */
export default class Framebuffer {
	/**
	 * Unbinds a framebuffer from the given rendering context.
	 * @param context The rendering context.
	 * @param target The target binding point.
	 */
	public static unbind(context: Context, target: FramebufferTarget): void {
		// TODO: Optional caching.
		Framebuffer.bind(context, target, null);
	}

	/**
	 * Sets the drawing buffer array.
	 * @param context The rendering context.
	 * @param none Whether to not render to any attachment.
	 * @param back Whether to render to the back buffer.
	 * @param colorAttachments A list of color attachments to render to.
	 */
	public static setDrawBuffers(
		context: Context,
		none: boolean,
		back: boolean,
		colorAttachments: Array<number>
	): void {
		const drawBuffers: Array<number> = [];
		if (none) {
			drawBuffers.push(NONE);
		}
		if (back) {
			drawBuffers.push(BACK);
		}
		for (const colorAttachment of colorAttachments) {
			drawBuffers.push(COLOR_ATTACHMENT0 + colorAttachment);
		}
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

	public static setReadBuffer(
		context: Context,
		readBuffer?: boolean | number
	): void {
		context.internal.readBuffer(
			typeof readBuffer == "number"
				? COLOR_ATTACHMENT0 + readBuffer
				: readBuffer
				? BACK
				: NONE
		);
	}

	/**
	 * Gets the internal representation of the currently-bound framebuffer.
	 * @param context The context that the framebuffer is bound to.
	 * @param target The target that the framebuffer is bound to.
	 * @returns The currently-bound framebuffer.
	 */
	private static getBoundFramebuffer(
		context: Context,
		target: FramebufferTarget
	): WebGLFramebuffer | null {
		// TODO: Optional caching.
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
	private static bind(
		context: Context,
		target: FramebufferTarget,
		framebuffer: WebGLFramebuffer | null
	): void {
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

		const framebuffer: WebGLFramebuffer | null =
			context.internal.createFramebuffer();
		if (!framebuffer) {
			throw new UnsupportedOperationError();
		}
		this.internal = framebuffer;

		this.colorAttachments = [];
		for (let i = 0; i < colorAttachments.length; i++) {
			this.setColorAttachment(i, colorAttachments[i] as FramebufferAttachment);
		}
		if (depthAttachment) {
			this.depthAttachment = depthAttachment;
		}
		if (stencilAttachment) {
			this.stencilAttachment = stencilAttachment;
		}
		if (depthStencilAttachment) {
			this.depthStencilAttachment = depthStencilAttachment;
		}
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
		// TODO: Optional caching.
		return this.colorAttachments[i];
	}

	/**
	 * Sets a color attachment.
	 * @param i The index of the color attachment.
	 * @param attachment The attachment.
	 */
	public setColorAttachment(
		i: number,
		attachment: FramebufferAttachment
	): void {
		// TODO: Optional caching.
		this.attach(attachment as Mip, COLOR_ATTACHMENT0 + i);
		this.colorAttachments[i] = attachment;
	}

	/** The depth attachment on this framebuffer. */
	private depthAttachmentPrivate?: FramebufferAttachment;

	/** The depth attachment on this framebuffer. */
	public get depthAttachment(): FramebufferAttachment | undefined {
		// TODO: Optional caching.
		return this.depthAttachmentPrivate;
	}

	/** The depth attachment on this framebuffer. */
	public set depthAttachment(value: FramebufferAttachment | undefined) {
		// TODO: Optional caching.
		if (!value) {
			throw new UnsupportedOperationError();
		}
		this.attach(value as Mip, DEPTH_ATTACHMENT);
		this.depthAttachmentPrivate = value;
	}

	/** The stencil attachment on this framebuffer. */
	private stencilAttachmentPrivate?: FramebufferAttachment;

	/** The stencil attachment on this framebuffer. */
	public get stencilAttachment(): FramebufferAttachment | undefined {
		// TODO: Optional caching.
		return this.stencilAttachmentPrivate;
	}

	/** The stencil attachment on this framebuffer. */
	public set stencilAttachment(value: FramebufferAttachment | undefined) {
		// TODO: Optional caching.
		if (!value) {
			throw new UnsupportedOperationError();
		}
		this.attach(value as Mip, STENCIL_ATTACHMENT);
		this.stencilAttachmentPrivate = value;
	}

	/** The depth stencil attachment on this framebuffer. */
	private depthStencilAttachmentPrivate?: FramebufferAttachment;

	/** The depth stencil attachment on this framebuffer. */
	public get depthStencilAttachment(): FramebufferAttachment | undefined {
		// TODO: Optional caching.
		return this.depthStencilAttachmentPrivate;
	}

	/** The depth stencil attachment on this framebuffer. */
	public set depthStencilAttachment(value: FramebufferAttachment | undefined) {
		// TODO: Optional caching.
		if (!value) {
			throw new UnsupportedOperationError();
		}
		this.attach(value as Mip, DEPTH_STENCIL_ATTACHMENT);
		this.depthStencilAttachmentPrivate = value;
	}

	/** The status of this framebuffer. */
	public get status(): FramebufferStatus {
		return this.with((framebuffer: this): FramebufferStatus => {
			return framebuffer.context.internal.checkFramebufferStatus(
				framebuffer.target
			);
		});
	}

	/** Binds this framebuffer to its target. */
	public bind(): void {
		// TODO: Optional caching.
		Framebuffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this framebuffer bound, then re-binds
	 * the previously-bound framebuffer.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (framebuffer: this) => T): T {
		// TODO: Optional caching.
		const previousBinding: WebGLFramebuffer | null =
			Framebuffer.getBoundFramebuffer(this.context, this.target);
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
	private attach(
		attachment: Mip,
		attachmentPoint: number,
		layer?: number
	): void;

	/**
	 * Attaches a renderbuffer to this framebuffer.
	 * @param attachment The renderbuffer to attach.
	 * @param attachmentPoint The attachment point of the renderbuffer.
	 */
	private attach(attachment: Renderbuffer, attachmentPoint: number): void;

	private attach(
		attachment: FramebufferAttachment,
		attachmentPoint: number,
		layer = 0
	): void {
		// TODO: Optional caching.
		return this.with((framebuffer: this): void => {
			if (attachment instanceof Renderbuffer) {
				framebuffer.context.internal.framebufferRenderbuffer(
					framebuffer.target,
					attachmentPoint,
					RENDERBUFFER,
					attachment.internal
				);
			} else if (attachment instanceof Mip) {
				framebuffer.context.internal.framebufferTextureLayer(
					framebuffer.target,
					attachmentPoint,
					(attachment.texture as Texture<Mip>).internal,
					attachment.lod as number,
					layer
				);
			} else {
				framebuffer.context.internal.framebufferTexture2D(
					framebuffer.target,
					attachmentPoint,
					attachment.target as MipmapTarget,
					(attachment.texture as Texture<Mip>).internal,
					0
				);
			}
		});
	}

	/** Deletes this framebuffer. */
	public delete(): void {
		this.context.internal.deleteFramebuffer(this.internal);
	}
}
