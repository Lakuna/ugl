import {
	BACK,
	COLOR_ATTACHMENT0,
	COLOR_BUFFER_BIT,
	DEPTH_ATTACHMENT,
	DEPTH_BUFFER_BIT,
	DEPTH_STENCIL_ATTACHMENT,
	DRAW_BUFFER0,
	IMPLEMENTATION_COLOR_READ_FORMAT,
	IMPLEMENTATION_COLOR_READ_TYPE,
	NONE,
	READ_BUFFER,
	RENDERBUFFER,
	STENCIL_ATTACHMENT,
	STENCIL_BUFFER_BIT
} from "../constants/constants.js";
import BadValueError from "../utility/BadValueError.js";
import BufferTarget from "../constants/BufferTarget.js";
import type Color from "../types/Color.js";
import type Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import type CubeFace from "../constants/CubeFace.js";
import FramebufferAttachment from "../constants/FramebufferAttachment.js";
import type FramebufferStatus from "../constants/FramebufferStatus.js";
import FramebufferTarget from "../constants/FramebufferTarget.js";
import MipmapTarget from "../constants/MipmapTarget.js";
import Primitive from "../constants/Primitive.js";
import type Rectangle from "../types/Rectangle.js";
import Renderbuffer from "./Renderbuffer.js";
import Texture from "./textures/Texture.js";
import type Texture2d from "./textures/Texture2d.js";
import type TextureCubemap from "./textures/TextureCubemap.js";
import TextureDataFormat from "../constants/TextureDataFormat.js";
import TextureDataType from "../constants/TextureDataType.js";
import type { UniformMap } from "../types/UniformMap.js";
import type VertexArray from "./VertexArray.js";
import VertexBuffer from "./buffers/VertexBuffer.js";
import getChannelsForTextureFormat from "../utility/internal/getChannelsForTextureFormat.js";
import getExtensionsForFramebufferAttachmentFormat from "../utility/internal/getExtensionsForFramebufferAttachmentFormat.js";
import getMipmapTargetForCubeFace from "../utility/internal/getMipmapTargetForCubeFace.js";
import getParameterForFramebufferTarget from "../utility/internal/getParameterForFramebufferTarget.js";
import getSizeOfDataType from "../utility/internal/getSizeOfDataType.js";
import getTypedArrayConstructorForDataType from "../utility/internal/getTypedArrayConstructorForTextureDataType.js";

/**
 * A portion of contiguous memory that contains a collection of buffers that store color, alpha, depth, and stencil information that is used to render an image.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer | WebGLFramebuffer}
 * @public
 */
export default class Framebuffer extends ContextDependent {
	/**
	 * The currently-bound framebufferbuffer cache.
	 * @internal
	 */
	private static bindingsCache = new Map<
		WebGL2RenderingContext,
		Map<FramebufferTarget, WebGLFramebuffer | null>
	>();

	/**
	 * Get the framebuffer bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(gl: WebGL2RenderingContext) {
		// Get the context bindings cache.
		let contextBindingsCache = Framebuffer.bindingsCache.get(gl);
		if (!contextBindingsCache) {
			contextBindingsCache = new Map();
			Framebuffer.bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the currently-bound framebuffer for a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point. Note that `FRAMEBUFFER` will return the same value as `DRAW_FRAMEBUFFER`.
	 * @returns The framebuffer.
	 * @internal
	 */
	public static getBound(
		context: Context,
		target: FramebufferTarget
	): WebGLFramebuffer | null {
		// Get the context bindings cache.
		const contextBindingsCache = Framebuffer.getContextBindingsCache(
			context.gl
		);

		// Get the bound framebuffer.
		let boundFramebuffer = contextBindingsCache.get(target);
		if (typeof boundFramebuffer === "undefined") {
			boundFramebuffer = context.doPrefillCache
				? null
				: (context.gl.getParameter(
						getParameterForFramebufferTarget(target)
					) as WebGLFramebuffer | null);
			contextBindingsCache.set(target, boundFramebuffer);
		}

		return boundFramebuffer;
	}

	/**
	 * Bind a framebuffer to a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer | bindFramebuffer}
	 * @internal
	 */
	public static bindGl(
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
		const contextBindingsCache = Framebuffer.getContextBindingsCache(
			context.gl
		);
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
			default: // Don't update anything else for `READ_FRAMEBUFFER`.
		}
	}

	/**
	 * Unbind the given framebuffer from the given binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param framebuffer - The framebuffer, or `undefined` for any framebuffer.
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		target: FramebufferTarget,
		framebuffer?: WebGLFramebuffer
	): void {
		// Do nothing if the framebuffer is already unbound.
		if (framebuffer && Framebuffer.getBound(context, target) !== framebuffer) {
			return;
		}

		// Unbind the framebuffer.
		Framebuffer.bindGl(context, target, null);
	}

	/**
	 * Create a framebuffer.
	 * @param context - The rendering context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer | createFramebuffer}
	 */
	public constructor(context: Context);

	/**
	 * Create a framebuffer.
	 * @param context - The rendering context.
	 * @param isDefault - Whether or not this object should represent the default framebuffer for the given rendering context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer | createFramebuffer}
	 * @internal
	 */
	// Hide the second argument from users, since default framebuffer objects should only be created alongside contexts.
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	public constructor(context: Context, isDefault?: boolean);

	public constructor(context: Context, isDefault = false) {
		super(context);

		this.internal = isDefault ? null : this.gl.createFramebuffer();
		this.targetCache = FramebufferTarget.FRAMEBUFFER;
		this.attachmentsCache = new Map();
	}

	/**
	 * The API interface of this framebuffer. `null` for the default framebuffer.
	 * @internal
	 */
	public readonly internal: WebGLFramebuffer | null;

	/**
	 * The binding point of this framebuffer.
	 * @internal
	 */
	private targetCache;

	/**
	 * The binding point of this framebuffer.
	 * @internal
	 */
	public get target(): FramebufferTarget {
		return this.targetCache;
	}

	/** @internal */
	public set target(value) {
		if (this.target === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The status of this framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus | checkFramebufferStatus}
	 */
	public get status(): FramebufferStatus {
		this.bind();
		return this.gl.checkFramebufferStatus(this.target);
	}

	/**
	 * Delete this framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteFramebuffer | deleteFramebuffer}
	 */
	public delete(): void {
		this.gl.deleteFramebuffer(this.internal);
	}

	/**
	 * Bind this framebuffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @internal
	 */
	public bind(target?: FramebufferTarget): void {
		if (target) {
			this.target = target;
		}

		Framebuffer.bindGl(this.context, this.target, this.internal);
	}

	/**
	 * Unbind this framebuffer from its binding point. For the default framebuffer, this has the same effect as binding this framebuffer.
	 * @internal
	 */
	public unbind(): void {
		Framebuffer.unbindGl(this.context, this.target, this.internal ?? void 0);
	}

	/**
	 * The attachments on this framebuffer.
	 * @internal
	 */
	private readonly attachmentsCache: Map<
		FramebufferAttachment | number,
		Texture | Renderbuffer
	>;

	/**
	 * The attachments on this framebuffer.
	 * @internal
	 */
	public get attachments(): ReadonlyMap<
		FramebufferAttachment | number,
		Texture | Renderbuffer
	> {
		return this.attachmentsCache;
	}

	/** The width of this framebuffer. */
	public get width(): number {
		if (!this.internal) {
			return this.context.viewport[2];
		}

		const [firstAttachment] = this.attachmentsCache.values();
		return firstAttachment ? firstAttachment.width : 0;
	}

	/** The height of this framebuffer. */
	public get height(): number {
		if (!this.internal) {
			return this.context.viewport[3];
		}

		const [firstAttachment] = this.attachmentsCache.values();
		return firstAttachment ? firstAttachment.height : 0;
	}

	/**
	 * Attach a 2D texture to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment, the depth stencil attachment, or the index of a color attachment.
	 * @param texture - The texture to attach.
	 * @param _ - An unused value.
	 * @param level - The level of the texture to attach. Defaults to the top level.
	 * @param layer - The layer of the texture to attach, or `undefined` for the entire texture.
	 * @throws {@link BadValueError} if the size of the texture does not match the size of any existing attachment to the framebuffer.
	 * @throws `Error` if this object represents the default framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D | framebufferTexture2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer | framebufferTextureLayer}
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: Texture2d,
		_?: unknown,
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
	 * @throws {@link BadValueError} if the size of the texture does not match the size of any existing attachment to the framebuffer.
	 * @throws `Error` if this object represents the default framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D | framebufferTexture2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/framebufferTextureLayer | framebufferTextureLayer}
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		texture: TextureCubemap,
		face: CubeFace,
		level?: number,
		layer?: number
	): void;

	/**
	 * Attach a renderbuffer to this framebuffer.
	 * @param attachment - Specify the depth attachment, the stencil attachment, the depth stencil attachment, or the index of a color attachment.
	 * @param renderbuffer - The renderbuffer to attach.
	 * @throws {@link BadValueError} if the size of the renderbuffer does not match the size of any existing attachment to the framebuffer.
	 * @throws `Error` if this object represents the default framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer | framebufferRenderbuffer}
	 */
	public attach(
		attachment: FramebufferAttachment | number,
		renderbuffer: Renderbuffer
	): void;

	public attach(
		attachment: FramebufferAttachment | number,
		data: Texture | Renderbuffer,
		face: CubeFace | undefined = void 0,
		level = 0,
		layer: number | undefined = void 0
	) {
		// No attaching to the default framebuffer!
		if (!this.internal) {
			throw new Error("Can't add an attachment to the default framebuffer.");
		}

		// Ensure that attachments are the same size.
		if (
			this.attachmentsCache.size > 0 &&
			(data.width !== this.width || data.height !== this.height)
		) {
			throw new BadValueError(
				"Framebuffer attachments must all be the same size."
			);
		}

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

		// Enable the extensions that are required for the attachment.
		if (data instanceof Texture) {
			for (const extension of getExtensionsForFramebufferAttachmentFormat(
				data.format
			)) {
				this.context.enableExtension(extension);
			}
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
			const mipmapTarget = face
				? getMipmapTargetForCubeFace(face)
				: MipmapTarget.TEXTURE_2D;

			// Attach an entire texture.
			this.gl.framebufferTexture2D(
				this.target,
				attachmentValue,
				mipmapTarget,
				data.internal,
				0 // `level` must be zero.
			);
		}

		// Save a reference to the attachment.
		this.attachmentsCache.set(attachment, data);

		// If the read buffer gets a new attachment, clear the implementation color read format and type caches.
		if (
			attachment === this.readBuffer ||
			(attachment === 0 && this.readBuffer === true)
		) {
			delete this.implementationColorReadFormatCache;
			delete this.implementationColorReadTypeCache;
		}
	}

	/**
	 * The current read buffer.
	 * @internal
	 */
	private readBufferCache?: number | boolean;

	/**
	 * The current read buffer. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/readBuffer | readBuffer}
	 */
	public get readBuffer(): number | boolean {
		if (typeof this.readBufferCache !== "undefined") {
			return this.readBufferCache;
		}

		if (this.context.doPrefillCache) {
			return (this.readBufferCache = this.internal === null ? true : 0);
		}

		this.bind(FramebufferTarget.READ_FRAMEBUFFER);
		const raw = this.gl.getParameter(READ_BUFFER) as number;
		this.readBufferCache =
			raw === BACK ? true : raw === NONE ? false : raw - COLOR_ATTACHMENT0;

		return this.readBufferCache;
	}

	public set readBuffer(value) {
		if (this.readBuffer === value) {
			return;
		}

		this.bind(FramebufferTarget.READ_FRAMEBUFFER);

		this.gl.readBuffer(
			value === true ? BACK : value === false ? NONE : COLOR_ATTACHMENT0 + value
		);
		this.readBufferCache = value;

		delete this.implementationColorReadFormatCache;
		delete this.implementationColorReadTypeCache;
	}

	/** The attachment that is currently bound to the current read buffer. */
	public get readAttachment(): Texture | Renderbuffer | undefined {
		if (this.readBuffer === false) {
			return void 0;
		}

		return this.attachments.get(this.readBuffer === true ? 0 : this.readBuffer);
	}

	/**
	 * The texture data format to use for reading pixel data from this framebuffer.
	 * @internal
	 */
	private implementationColorReadFormatCache?: TextureDataFormat;

	/**
	 * The texture data format to use for reading pixel data from this framebuffer.
	 * @internal
	 */
	public get implementationColorReadFormat(): TextureDataFormat {
		if (this.implementationColorReadFormatCache) {
			return this.implementationColorReadFormatCache;
		}

		// TODO: Support cache prefilling.

		this.bind();
		return (this.implementationColorReadFormatCache = this.gl.getParameter(
			IMPLEMENTATION_COLOR_READ_FORMAT
		) as TextureDataFormat);
	}

	/**
	 * The texture data type to use for reading pixel data from this framebuffer.
	 * @internal
	 */
	private implementationColorReadTypeCache?: TextureDataType;

	/**
	 * The texture data type to use for reading pixel data from this framebuffer.
	 * @internal
	 */
	public get implementationColorReadType(): TextureDataType {
		if (this.implementationColorReadTypeCache) {
			return this.implementationColorReadTypeCache;
		}

		// TODO: Support cache prefilling.

		this.bind();
		return (this.implementationColorReadTypeCache = this.gl.getParameter(
			IMPLEMENTATION_COLOR_READ_TYPE
		) as TextureDataType);
	}

	/**
	 * The current draw buffers.
	 * @internal
	 */
	private drawBuffersCache?: (number | boolean)[];

	/**
	 * The current draw buffers. `false` represents no buffer, `true` represents the back buffer, and an integer represents the corresponding color buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawBuffers | drawBuffers}
	 * @throws {@link BadValueError} if too many draw buffers are specified for the current environment.
	 */
	public get drawBuffers(): (number | boolean)[] {
		if (typeof this.drawBuffersCache !== "undefined") {
			return this.drawBuffersCache;
		}

		const out = [];
		if (this.context.doPrefillCache) {
			out.push(this.internal === null ? true : 0);
			for (let i = 1; i < this.context.maxDrawBuffers; i++) {
				out.push(false);
			}

			return (this.drawBuffersCache = out);
		}

		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);
		for (let i = 0; i < this.context.maxDrawBuffers; i++) {
			const drawBuffer = this.gl.getParameter(DRAW_BUFFER0 + i) as number;
			out.push(
				drawBuffer === BACK
					? true
					: drawBuffer === NONE
						? false
						: drawBuffer - COLOR_ATTACHMENT0
			);
		}

		return (this.drawBuffersCache = out);
	}

	public set drawBuffers(value) {
		// Throw an error if too many buffers are specified.
		if (value.length > this.context.maxDrawBuffers) {
			throw new BadValueError(
				`Invalid draw buffers (${value.toString()} must have no more than ${this.context.maxDrawBuffers.toString()} elements).`
			);
		}

		// Reorder the input value so that WebGL doesn't warn.
		const realValue = [] as (number | boolean)[];
		for (const i of value) {
			if (typeof i === "number") {
				realValue[i] = i;
			}
		}

		for (let i = 0; i < this.context.maxDrawBuffers; i++) {
			realValue[i] ??= false;
		}

		// Compare the reordered input to the cached value.
		if (this.drawBuffers.length === realValue.length) {
			let matches = true;
			for (let i = 0; i < realValue.length; i++) {
				if (this.drawBuffers[i] !== realValue[i]) {
					matches = false;
					break;
				}
			}

			if (matches) {
				return;
			}
		}

		const out = [];
		for (const buffer of realValue) {
			out.push(
				typeof buffer === "number"
					? COLOR_ATTACHMENT0 + buffer
					: buffer
						? BACK
						: NONE
			);
		}

		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);

		this.gl.drawBuffers(out);
		this.drawBuffersCache = realValue;
	}

	/**
	 * Draw the vertex data contained within a vertex array object.
	 * @param vao - The vertex array object that contains the data to be drawn.
	 * @param uniforms - A collection of uniform values to set prior to rasterization.
	 * @param primitive - The type of primitive to rasterize.
	 * @param offset - The number of elements to skip when rasterizing arrays, or the number of indices to skip when rasterizing elements.
	 * @param countOverride - The number of indices or elements to be rendered. Automatically renders all supplied data if `undefined`.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays | drawArrays}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements | drawElements}
	 * @throws {@link BadValueError} if a uniform is passed `undefined` as a value or if an unknown uniform is specified.
	 */
	public draw(
		vao: VertexArray,
		uniforms?: UniformMap,
		primitive: Primitive = Primitive.TRIANGLES,
		offset = 0,
		countOverride?: number
	): void {
		// Bind the correct framebuffer.
		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);

		// Bind the correct shader program.
		vao.program.bind();

		// Set uniforms.
		if (uniforms) {
			for (const [key, value] of Object.entries(uniforms)) {
				if (!Object.hasOwn(uniforms, key)) {
					continue;
				}

				const uniform = vao.program.uniforms.get(key);
				if (!uniform) {
					throw new BadValueError(`No uniform named \`${key}\`.`);
				}

				uniform.value = value;
			}
		}

		// Bind this VAO.
		vao.bind();

		// Rasterize.
		if (!vao.ebo) {
			// No EBO; must determine the proper number of elements to rasterize.
			const [firstAttribute] = vao.attributes.values();

			// No attributes; just return since nothing would be rasterized anyway.
			if (!firstAttribute) {
				return;
			}

			// Determine the shape of the data.
			const elementCount =
				firstAttribute.vbo.size / getSizeOfDataType(firstAttribute.vbo.type);
			const elementsPerIndex = firstAttribute.size ?? 3;

			// Rasterize arrays.
			this.gl.drawArrays(
				primitive,
				offset,
				countOverride ?? elementCount / elementsPerIndex
			);
			return;
		}

		// EBO exists. Rasterize elements.
		const indexSize = getSizeOfDataType(vao.ebo.type);
		const indexCount = vao.ebo.size / indexSize;
		const byteOffset = offset * indexSize;
		this.gl.drawElements(
			primitive,
			countOverride ?? indexCount,
			vao.ebo.type,
			byteOffset
		);
	}

	/**
	 * Clear the specified buffers to the specified values.
	 * @param color - The value to clear the color buffer to or a boolean to use the previous clear color.
	 * @param depth - The value to clear the depth buffer to or a boolean to use the previous clear depth.
	 * @param stencil - The value to clear the stencil buffer to or a boolean to use the previous clear stencil.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear | clear}
	 */
	public clear(
		color: Color | boolean = true,
		depth: number | boolean = true,
		stencil: number | boolean = true
	): void {
		let colorBit = color ? COLOR_BUFFER_BIT : 0;
		if (typeof color !== "boolean") {
			this.context.clearColor = color;
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = depth ? DEPTH_BUFFER_BIT : 0;
		if (typeof depth !== "boolean") {
			this.context.clearDepth = depth;
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = stencil ? STENCIL_BUFFER_BIT : 0;
		if (typeof stencil !== "boolean") {
			this.context.clearStencil = stencil;
			stencilBit = STENCIL_BUFFER_BIT;
		}

		this.bind(FramebufferTarget.DRAW_FRAMEBUFFER);
		this.gl.clear(colorBit | depthBit | stencilBit);
	}

	/**
	 * Read pixels from this framebuffer.
	 * @param rectangle - The rectangle of pixels to read. Defaults to the entire read buffer.
	 * @param rgba - Whether to output RGBA data (as opposed to using the format of the read buffer). Defaults to `false`.
	 * @param packAlignment - The alignment to use when packing the data, or `undefined` to let this be automatically determined.
	 * @param out - The buffer or typed array to store the pixel data in.
	 * @param offset - The offset at which to start storing pixel data in the buffer or typed array.
	 * @returns A typed array of pixel data.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels | readPixels}
	 */
	public readPixels(
		rectangle?: Rectangle,
		rgba?: boolean,
		packAlignment?: 1 | 2 | 4 | 8,
		out?: undefined,
		offset?: number
	): ArrayBufferView;

	/**
	 * Read pixels from this framebuffer.
	 * @param rectangle - The rectangle of pixels to read. Defaults to the entire read buffer.
	 * @param rgba - Whether to output RGBA data (as opposed to using the format of the read buffer). Defaults to `false`.
	 * @param packAlignment - The alignment to use when packing the data, or `undefined` to let this be automatically determined.
	 * @param out - The buffer or typed array to store the pixel data in.
	 * @param offset - The offset at which to start storing pixel data in the buffer or typed array.
	 * @returns The buffer or typed array to store the pixel data in.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels | readPixels}
	 * @throws `Error` if the given buffer or typed array is too small to store the selected data.
	 */
	public readPixels<T extends ArrayBufferView | VertexBuffer>(
		rectangle: Rectangle | undefined,
		rgba: boolean | undefined,
		packAlignment: 1 | 2 | 4 | 8 | undefined,
		out: T,
		offset?: number
	): T;

	public readPixels<T extends VertexBuffer | ArrayBufferView>(
		rectangle?: Rectangle,
		rgba?: boolean,
		packAlignment?: 1 | 2 | 4 | 8,
		out?: T,
		offset = 0
	): T | ArrayBufferView {
		// Bind the correct framebuffer.
		this.bind(FramebufferTarget.READ_FRAMEBUFFER);

		// Default to the entire color buffer if no dimensions were given.
		const realRect = rectangle ?? [0, 0, this.width, this.height];

		// Determine the proper output format and data type.
		const format = rgba
			? TextureDataFormat.RGBA
			: this.implementationColorReadFormat;
		const type = rgba
			? TextureDataType.UNSIGNED_BYTE
			: this.implementationColorReadType;
		const channels = getChannelsForTextureFormat(format);

		// Ensure that the buffer or typed array is large enough to store the data.
		const srcSize = realRect[2] * realRect[3] * channels;
		const typeSize = getSizeOfDataType(type);
		if (out) {
			const srcSizeBytes = srcSize * typeSize;
			const dstSize = out instanceof VertexBuffer ? out.size : out.byteLength;
			if (dstSize < offset + srcSizeBytes) {
				throw new Error(
					`Buffer too small to store read pixels (${dstSize.toString()}B < ${offset.toString()}B offset + ${srcSizeBytes.toString()}B)`
				);
			}
		}

		// Set the pack alignment.
		if (packAlignment) {
			this.context.packAlignment = packAlignment;
		} else if (realRect[3] > 1) {
			// Pack alignment doesn't matter if there is only one row of data.
			for (const alignment of [8, 4, 2, 1] as const) {
				if ((realRect[2] * channels) % alignment === 0) {
					this.context.packAlignment = alignment;
					break;
				}
			}
		}

		// Output to a pixel pack buffer.
		if (out instanceof VertexBuffer) {
			out.bind(BufferTarget.PIXEL_PACK_BUFFER);
			this.gl.readPixels(
				realRect[0],
				realRect[1],
				realRect[2],
				realRect[3],
				format,
				type,
				offset
			);
			out.clearDataCache();
			return out;
		}

		// Make a typed array if one wasn't provided.
		const realOut =
			out ??
			new (getTypedArrayConstructorForDataType(type))(
				offset / typeSize + srcSize
			);

		// Output to a typed array.
		this.gl.readPixels(
			realRect[0],
			realRect[1],
			realRect[2],
			realRect[3],
			format,
			type,
			realOut as ArrayBufferView,
			offset
		);
		return realOut;
	}
}
