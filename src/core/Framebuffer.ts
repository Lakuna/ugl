import {
	COLOR_ATTACHMENT0,
	DEPTH_ATTACHMENT,
	DEPTH_STENCIL_ATTACHMENT,
	RENDERBUFFER,
	STENCIL_ATTACHMENT
} from "#constants";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import FramebufferAttachment from "#FramebufferAttachment";
import FramebufferStatus from "#FramebufferStatus";
import FramebufferTarget from "#FramebufferTarget";
import MipmapTarget from "#MipmapTarget";
import Renderbuffer from "#Renderbuffer";
import type Texture from "#Texture";
import type Texture2d from "#Texture2d";
import type TextureCubemap from "#TextureCubemap";
import UnsupportedOperationError from "#UnsupportedOperationError";
import getParameterForFramebufferTarget from "#getParameterForFramebufferTarget";

/**
 * A portion of contiguous memory that can be thought of as a collection of
 * attachments (buffers with purposes).
 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
 */
export default class Framebuffer extends ContextDependent {
	/**
	 * The currently-bound framebufferbuffer cache.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private static bindingsCache:
		| Map<
				WebGL2RenderingContext,
				Map<FramebufferTarget, WebGLFramebuffer | null>
		  >
		| undefined;

	/**
	 * Gets the framebuffer bindings cache.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache(): Map<
		WebGL2RenderingContext,
		Map<FramebufferTarget, WebGLFramebuffer | null>
	> {
		return (Framebuffer.bindingsCache ??= new Map() as Map<
			WebGL2RenderingContext,
			Map<FramebufferTarget, WebGLFramebuffer | null>
		>);
	}

	/**
	 * Gets the framebuffer bindings cache for a rendering context.
	 * @param context - The rendering context.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		context: Context
	): Map<FramebufferTarget, WebGLFramebuffer | null> {
		// Get the full bindings cache.
		const bindingsCache: Map<
			WebGL2RenderingContext,
			Map<FramebufferTarget, WebGLFramebuffer | null>
		> = Framebuffer.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache:
			| Map<FramebufferTarget, WebGLFramebuffer | null>
			| undefined = bindingsCache.get(context.gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = new Map();
			bindingsCache.set(context.gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Gets the currently-bound framebuffer for a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point. Note that `FRAMEBUFFER` will return the
	 * same value as `DRAW_FRAMEBUFFER`.
	 * @returns The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static getBound(
		context: Context,
		target: FramebufferTarget
	): WebGLFramebuffer | null {
		// Get the context bindings cache.
		const contextBindingsCache: Map<
			FramebufferTarget,
			WebGLFramebuffer | null
		> = Framebuffer.getContextBindingsCache(context);

		// Get the bound framebuffer.
		let boundFramebuffer: WebGLFramebuffer | null | undefined =
			contextBindingsCache.get(target);
		if (typeof boundFramebuffer === "undefined") {
			boundFramebuffer = context.gl.getParameter(
				getParameterForFramebufferTarget(target)
			) as WebGLFramebuffer | null;
			contextBindingsCache.set(target, boundFramebuffer);
		}
		return boundFramebuffer;
	}

	/**
	 * Binds a framebuffer to a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static override bind(
		context: Context,
		target: FramebufferTarget,
		framebuffer: WebGLFramebuffer | null
	): void {
		// Do nothing if the binding is already correct.
		if (Framebuffer.getBound(context, target) === framebuffer) {
			return;
		}

		// Bind the framebuffer to the target.
		context.gl.bindFramebuffer(target, framebuffer);

		// Update the bindings cache.
		const contextBindingsCache = Framebuffer.getContextBindingsCache(context);
		contextBindingsCache.set(target, framebuffer);
		switch (target) {
			case FramebufferTarget.FRAMEBUFFER:
				// For `FRAMEBUFFER`, update all binding points.
				contextBindingsCache.set(
					FramebufferTarget.READ_FRAMEBUFFER,
					framebuffer
				);
				contextBindingsCache.set(
					FramebufferTarget.DRAW_FRAMEBUFFER,
					framebuffer
				);
				break;
			case FramebufferTarget.DRAW_FRAMEBUFFER:
				// For `DRAW_FRAMEBUFFER`, update `FRAMEBUFFER` too (`FRAMEBUFFER_BINDING` always returns `DRAW_FRAMEBUFFER_BINDING`).
				contextBindingsCache.set(FramebufferTarget.FRAMEBUFFER, framebuffer);
				break;
			default:
				throw new RangeError();
		}
	}

	/**
	 * Unbinds the given framebuffer from the given binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer, or `undefined` for any framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static unbind(
		context: Context,
		target: FramebufferTarget,
		framebuffer?: WebGLFramebuffer
	): void {
		// Do nothing if the framebuffer is already unbound.
		if (
			typeof framebuffer !== "undefined" &&
			Framebuffer.getBound(context, target) !== framebuffer
		) {
			return;
		}

		// Unbind the framebuffer.
		Framebuffer.bind(context, target, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param context - The rendering context.
	 * @see [`createFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context) {
		super(context);

		const framebuffer: WebGLFramebuffer | null = this.gl.createFramebuffer();
		if (framebuffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = framebuffer;
		this.targetCache = FramebufferTarget.FRAMEBUFFER;
	}

	/**
	 * The API interface of this framebuffer.
	 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
	 * @internal
	 */
	protected readonly internal: WebGLFramebuffer;

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private targetCache: FramebufferTarget;

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public get target(): FramebufferTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public set target(value: FramebufferTarget) {
		if (this.targetCache === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The status of this framebuffer.
	 * @see [`checkFramebufferStatus`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus)
	 */
	public get status(): FramebufferStatus {
		this.bind();
		return this.gl.checkFramebufferStatus(this.target);
	}

	/**
	 * Deletes this framebuffer.
	 * @see [`deleteFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteFramebuffer)
	 */
	public delete(): void {
		this.gl.deleteFramebuffer(this.internal);
	}

	/**
	 * Binds this framebuffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the
	 * previous binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public bind(target?: FramebufferTarget): void {
		if (typeof target !== "undefined") {
			this.target = target;
		}

		Framebuffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Unbinds this framebuffer from its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public unbind(): void {
		Framebuffer.unbind(this.context, this.target, this.internal);
	}

	/**
	 * Attaches a 2D texture to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment,
	 * the depth stencil attachment, or the index of a color attachment.
	 * @param texture - The texture to attach.
	 * @param _ - An unused value.
	 * @param level - The level of the texture to attach. Defaults to the top level.
	 * @param layer - The layer of the texture to attach, or `undefined` for
	 * the entire texture.
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: Texture2d,
		_?: never,
		level?: number,
		layer?: number
	): void;

	/**
	 * Attaches a face of a cubemapped texture to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment,
	 * the depth stencil attachment, or the index of a color attachment.
	 * @param texture - The texture to attach.
	 * @param face - The face of the cubemapped texture to attach.
	 * @param level - The level of the texture to attach. Defaults to the top level.
	 * @param layer - The layer of the texture to attach, or `undefined` for
	 * the entire texture.
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: TextureCubemap,
		face:
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z,
		level?: number,
		layer?: number
	): void;

	/**
	 * Attaches a renderbuffer to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment,
	 * the depth stencil attachment, or the index of a color attachment.
	 * @param renderbuffer - The renderbuffer to attach.
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		renderbuffer: Renderbuffer
	): void;

	public attach(
		attachment: FramebufferAttachment | number,
		data: Texture | Renderbuffer,
		face: MipmapTarget = MipmapTarget.TEXTURE_2D,
		level = 0,
		layer: number | undefined = void 0
	): void {
		// Determine the actual WebGL constant value of the attachment.
		let attachmentValue: number = attachment;
		switch (attachment as FramebufferAttachment) {
			case FramebufferAttachment.Depth:
				attachmentValue = DEPTH_ATTACHMENT;
				break;
			case FramebufferAttachment.DepthStencil:
				attachmentValue = DEPTH_STENCIL_ATTACHMENT;
				break;
			case FramebufferAttachment.Stencil:
				attachmentValue = STENCIL_ATTACHMENT;
				break;
			default:
				attachmentValue += COLOR_ATTACHMENT0;
		}

		// Bind this framebuffer.
		this.bind();

		// Attach a renderbuffer.
		if (data instanceof Renderbuffer) {
			this.gl.framebufferRenderbuffer(
				this.target,
				attachmentValue,
				RENDERBUFFER,
				(data as unknown as { internal: WebGLRenderbuffer }).internal
			);
			return;
		}

		// Attach a layer of a texture.
		if (typeof layer === "number") {
			this.gl.framebufferTextureLayer(
				this.target,
				attachmentValue,
				(data as unknown as { internal: WebGLTexture }).internal,
				level,
				layer
			);
			return;
		}

		// Attach an entire texture.
		this.gl.framebufferTexture2D(
			this.target,
			attachmentValue,
			face,
			(data as unknown as { internal: WebGLTexture }).internal,
			level
		);
	}
}
