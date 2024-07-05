import {
	BACK,
	COLOR_ATTACHMENT0,
	DEPTH_ATTACHMENT,
	DEPTH_STENCIL_ATTACHMENT,
	DRAW_BUFFER0,
	NONE,
	READ_BUFFER,
	RENDERBUFFER,
	STENCIL_ATTACHMENT
} from "#constants";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import CubemapFace from "#CubemapFace";
import FramebufferAttachment from "#FramebufferAttachment";
import FramebufferTarget from "#FramebufferTarget";
import MipmapTarget from "#MipmapTarget";
import Renderbuffer from "#Renderbuffer";
import type Texture from "#Texture";
import type Texture2d from "#Texture2d";
import type TextureCubemap from "#TextureCubemap";
import UnsupportedOperationError from "#UnsupportedOperationError";
import getMipmapTargetForCubemapFace from "#getMipmapTargetForCubemapFace";
import getParameterForFramebufferTarget from "#getParameterForFramebufferTarget";

/**
 * A portion of contiguous memory that contains a collection of buffers that store color, alpha, depth, and stencil information that is used to render an image.
 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
 */
export default class Framebuffer extends ContextDependent {
	/**
	 * The currently-bound framebufferbuffer cache.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<FramebufferTarget, WebGLFramebuffer | null>
	>;

	/**
	 * Get the framebuffer bindings cache.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Framebuffer.bindingsCache ??= new Map());
	}

	/**
	 * Get the framebuffer bindings cache for a rendering context.
	 * @param context - The rendering context.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(context: Context) {
		// Get the full bindings cache.
		const bindingsCache = Framebuffer.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache = bindingsCache.get(context.gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = new Map();
			bindingsCache.set(context.gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the currently-bound framebuffer for a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point. Note that `FRAMEBUFFER` will return the same value as `DRAW_FRAMEBUFFER`.
	 * @returns The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static getBound(context: Context, target: FramebufferTarget) {
		// Get the context bindings cache.
		const contextBindingsCache = Framebuffer.getContextBindingsCache(context);

		// Get the bound framebuffer.
		let boundFramebuffer = contextBindingsCache.get(target);
		if (typeof boundFramebuffer === "undefined") {
			boundFramebuffer = context.gl.getParameter(
				getParameterForFramebufferTarget(target)
			) as WebGLFramebuffer | null;
			contextBindingsCache.set(target, boundFramebuffer);
		}
		return boundFramebuffer;
	}

	/**
	 * Bind a framebuffer to a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static bindGl(
		context: Context,
		target: FramebufferTarget,
		framebuffer: WebGLFramebuffer | null
	) {
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
	 * Unbind the given framebuffer from the given binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer, or `undefined` for any framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		target: FramebufferTarget,
		framebuffer?: WebGLFramebuffer
	) {
		// Do nothing if the framebuffer is already unbound.
		if (
			typeof framebuffer !== "undefined" &&
			Framebuffer.getBound(context, target) !== framebuffer
		) {
			return;
		}

		// Unbind the framebuffer.
		Framebuffer.bindGl(context, target, null);
	}

	/**
	 * Create a framebuffer.
	 * @param context - The rendering context.
	 * @see [`createFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context) {
		super(context);

		const framebuffer = this.gl.createFramebuffer();
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
	public readonly internal;

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private targetCache;

	/**
	 * Get the binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public get target() {
		return this.targetCache;
	}

	/**
	 * Set the binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public set target(value) {
		if (this.targetCache === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * Get the status of this framebuffer.
	 * @see [`checkFramebufferStatus`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus)
	 */
	public get status() {
		this.bind();
		return this.gl.checkFramebufferStatus(this.target);
	}

	/**
	 * Delete this framebuffer.
	 * @see [`deleteFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteFramebuffer)
	 */
	public delete() {
		this.gl.deleteFramebuffer(this.internal);
	}

	/**
	 * Bind this framebuffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public bind(target?: FramebufferTarget) {
		if (typeof target !== "undefined") {
			this.target = target;
		}

		Framebuffer.bindGl(this.context, this.target, this.internal);
	}

	/**
	 * Unbind this framebuffer from its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	public unbind() {
		Framebuffer.unbindGl(this.context, this.target, this.internal);
	}

	/**
	 * Attach a 2D texture to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment, the depth stencil attachment, or the index of a color attachment.
	 * @param texture - The texture to attach.
	 * @param _ - An unused value.
	 * @param level - The level of the texture to attach. Defaults to the top level.
	 * @param layer - The layer of the texture to attach, or `undefined` for the entire texture.
	 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
	 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: Texture2d,
		_?: never,
		level?: number,
		layer?: number
	): void;

	/**
	 * Attach a face of a cubemapped texture to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment, the depth stencil attachment, or the index of a color attachment.
	 * @param texture - The texture to attach.
	 * @param face - The face of the cubemapped texture to attach.
	 * @param level - The level of the texture to attach. Defaults to the top level.
	 * @param layer - The layer of the texture to attach, or `undefined` for the entire texture.
	 * @see [`framebufferTexture2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D)
	 * @see [`framebufferTextureLayer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer)
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: TextureCubemap,
		face: CubemapFace,
		level?: number,
		layer?: number
	): void;

	/**
	 * Attach a renderbuffer to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment, the depth stencil attachment, or the index of a color attachment.
	 * @param renderbuffer - The renderbuffer to attach.
	 * @see [`framebufferRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer)
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		renderbuffer: Renderbuffer
	): void;

	public attach(
		attachment: FramebufferAttachment | number,
		data: Texture | Renderbuffer,
		face: CubemapFace | undefined = void 0,
		level = 0,
		layer: number | undefined = void 0
	) {
		// Determine the actual WebGL constant value of the attachment.
		let attachmentValue = attachment;
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

		// Attach the renderbuffer or texture.
		if (data instanceof Renderbuffer) {
			// Attach a renderbuffer.
			this.gl.framebufferRenderbuffer(
				this.target,
				attachmentValue,
				RENDERBUFFER,
				data.internal
			);
		} else if (typeof layer === "number") {
			// Attach a layer of a texture.
			this.gl.framebufferTextureLayer(
				this.target,
				attachmentValue,
				data.internal,
				level,
				layer
			);
		} else {
			// Get the mipmap binding point of the specified face. `undefined` means that a `Texture2d` is being used.
			const mipmapTarget =
				typeof face === "undefined"
					? MipmapTarget.TEXTURE_2D
					: getMipmapTargetForCubemapFace(face);

			// Attach an entire texture.
			this.gl.framebufferTexture2D(
				this.target,
				attachmentValue,
				mipmapTarget,
				data.internal,
				level
			);
		}
	}

	/**
	 * The current read buffer.
	 * @see [`readBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/readBuffer)
	 * @internal
	 */
	private readBufferCache?: number | boolean;

	/**
	 * Get the current read buffer. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see [`readBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/readBuffer)
	 */
	public get readBuffer() {
		if (typeof this.readBufferCache !== "undefined") {
			return this.readBufferCache;
		}

		this.bind(FramebufferTarget.READ_FRAMEBUFFER);

		this.readBufferCache =
			this.gl.getParameter(READ_BUFFER) - COLOR_ATTACHMENT0;
		return this.readBufferCache;
	}

	/**
	 * Set the current read buffer. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see [`readBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/readBuffer)
	 */
	public set readBuffer(value) {
		if (this.readBufferCache === value) {
			return;
		}

		this.bind(FramebufferTarget.READ_FRAMEBUFFER);

		this.gl.readBuffer(
			value === true ? BACK : value === false ? NONE : COLOR_ATTACHMENT0 + value
		);
		this.readBufferCache = value;
	}

	/**
	 * The current draw buffers.
	 * @see [`drawBuffers`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers)
	 * @internal
	 */
	private drawBuffersCache?: (number | boolean)[];

	/**
	 * Get the current draw buffers. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see [`drawBuffers`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers)
	 */
	public get drawBuffers() {
		if (typeof this.drawBuffersCache !== "undefined") {
			return this.drawBuffersCache;
		}

		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);

		const out = [];
		for (let i = 0; i < this.context.maxDrawBuffers; i++) {
			const drawBuffer = this.gl.getParameter(DRAW_BUFFER0 + i) as number;
			out.push(
				drawBuffer === BACK
					? true
					: drawBuffer === NONE
						? false
						: drawBuffer - DRAW_BUFFER0
			);
		}

		this.drawBuffersCache = out;
		return this.drawBuffersCache;
	}

	/**
	 * Set the current draw buffers. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see [`drawBuffers`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers)
	 */
	public set drawBuffers(value) {
		if (
			typeof this.drawBuffersCache !== "undefined" &&
			this.drawBuffersCache.length === value.length
		) {
			let mismatch = false;
			for (let i = 0; i < value.length; i++) {
				if (this.drawBuffersCache[i] === value[i]) {
					mismatch = true;
					break;
				}
			}

			if (!mismatch) {
				return;
			}
		}

		const out = [];
		for (const buffer of value) {
			out.push(
				buffer === true
					? BACK
					: buffer === false
						? NONE
						: COLOR_ATTACHMENT0 + buffer
			);
		}

		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);

		this.gl.drawBuffers(out);
		this.drawBuffersCache = value;
	}
}
