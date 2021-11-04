import { Renderbuffer, RenderbufferMode, Texture, TextureDataType, TextureFilter, TextureFormat, TextureWrapMode, Vector, WebGLConstant } from "../index"

/** Update modes for data in a framebuffer. */
export enum FramebufferMode {
	Renderbuffer = "Renderbuffer",
	Texture = "Texture",
	TextureLayer = "Layer"
}

/** Render targets for framebuffers. */
export enum FramebufferTarget {
	FRAMEBUFFER = WebGLConstant.FRAMEBUFFER,
	DRAW_FRAMEBUFFER = WebGLConstant.DRAW_FRAMEBUFFER,
	READ_FRAMEBUFFER = WebGLConstant.READ_FRAMEBUFFER
}

/** Attachment points for framebuffers. */
export enum FramebufferAttachmentPoint {
	COLOR_ATTACHMENT0 = WebGLConstant.COLOR_ATTACHMENT0,
	DEPTH_ATTACHMENT = WebGLConstant.DEPTH_ATTACHMENT,
	DEPTH_STENCIL_ATTACHMENT = WebGLConstant.DEPTH_STENCIL_ATTACHMENT,
	STENCIL_ATTACHMENT = WebGLConstant.STENCIL_ATTACHMENT
}

/** Parameters for creating a framebuffer. */
export type FramebufferParameters = {
	/** The rendering context of the framebuffer. */
	gl: WebGL2RenderingContext;

	/** The bind point of the framebuffer. */
	target?: FramebufferTarget;

	/** The width and height of the framebuffer. */
	size?: Vector;

	/** The number of color textures to add to the framebuffer. */
	colorTextureCount?: number;

	/** Whether to add a depth buffer to the framebuffer. */
	depth?: boolean;

	/** Whether to add a stencil buffer to the framebuffer. */
	stencil?: boolean;

	/** Whether to add a depth texture to the framebuffer. This overrides any depth and stencil buffers. */
	depthTexture?: boolean;

	/** The wrappig behavior of textures attached to the framebuffer on the S axis. */
	wrapS?: TextureWrapMode;

	/** The wrappig behavior of textures attached to the framebuffer on the T axis. */
	wrapT?: TextureWrapMode;

	/** The minimum mip filter of textures attached to the framebuffer. */
	minFilter?: TextureFilter;

	/** The maximum mip filter of textures attached to the framebuffer. */
	magFilter?: TextureFilter;

	/** The data type of the values in textures attached to the framebuffer. */
	type?: TextureDataType;

	/** The format of the data supplied to textures attached to the framebuffer. */
	format?: TextureFormat;

	/** The format of the data in textures attached to the framebuffer. */
	internalFormat?: TextureFormat;

	/** The unpack alignment of the textures attached to the framebuffer. */
	unpackAlignment?: number;

	/** Whether to multiply the alpha channel into the other channels. */
	premultiplyAlpha?: boolean;
}

/** Data that can be stored in a framebuffer. */
export type FramebufferData = Texture | Renderbuffer;

/** A data structure that organizes the memory resources that are needed to render an image. */
export class Framebuffer {
	/**
	 * Unbinds all framebuffers to draw to the canvas.
	 * @param gl - The rendering context to operate on.
	 */
	static unbind(gl: WebGL2RenderingContext) {
		gl.bindFramebuffer(WebGLConstant.FRAMEBUFFER, null);
	}

	#size: Vector;
	#data: FramebufferData[];

	/** Creates a framebuffer. */
	constructor({
		gl,
		target = FramebufferTarget.FRAMEBUFFER,
		size = new Vector(gl.canvas.width, gl.canvas.height),
		colorTextureCount = 1,
		depth = false,
		stencil = false,
		depthTexture = false,
		wrapS = TextureWrapMode.CLAMP_TO_EDGE,
		wrapT = TextureWrapMode.CLAMP_TO_EDGE,
		minFilter = TextureFilter.LINEAR,
		magFilter = minFilter,
		type = TextureDataType.UNSIGNED_BYTE,
		format = TextureFormat.RGBA,
		internalFormat = format,
		unpackAlignment = 4,
		premultiplyAlpha = false
	}: FramebufferParameters) {
		this.gl = gl;
		this.size = size;
		this.depth = depth;
		this.target = target;

		this.framebuffer = gl.createFramebuffer();
		this.textures = [];

		this.bind();

		const drawBuffers: number[] = [];
		for (let i = 0; i < colorTextureCount; i++) {
			this.textures.push(new Texture({
				gl,
				generateMipmap: false,
				flipY: false,
				premultiplyAlpha,
				unpackAlignment,
				minFilter,
				magFilter,
				wrapS,
				wrapT,
				size,
				format,
				internalFormat,
				type
			}));
			this.add(this.textures[i]);
			drawBuffers.push(WebGLConstant.COLOR_ATTACHMENT0 + i);
		}

		if (drawBuffers.length > 1) {
			gl.drawBuffers(drawBuffers);
		}

		if (depthTexture) {
			this.depthTexture = new Texture({
				gl,
				minFilter: TextureFilter.NEAREST,
				magFilter: TextureFilter.NEAREST,
				size,
				format: TextureFormat.DEPTH_COMPONENT,
				internalFormat: TextureFormat.DEPTH_COMPONENT16,
				type: TextureDataType.UNSIGNED_INT
			});

			this.add(this.depthTexture, FramebufferAttachmentPoint.DEPTH_ATTACHMENT);
		} else {
			if (depth && !stencil) {
				this.depthBuffer = new Renderbuffer(gl, RenderbufferMode.DEPTH_COMPONENT16, size);
				this.add(this.depthBuffer, FramebufferAttachmentPoint.DEPTH_ATTACHMENT, FramebufferMode.Renderbuffer);
			} else if (stencil && !depth) {
				this.stencilBuffer = new Renderbuffer(gl, RenderbufferMode.STENCIL_INDEX8, size);
				this.add(this.stencilBuffer, FramebufferAttachmentPoint.STENCIL_ATTACHMENT, FramebufferMode.Renderbuffer);
			} else if (depth && stencil) {
				this.depthStencilBuffer = new Renderbuffer(gl, RenderbufferMode.DEPTH_STENCIL, size);
				this.add(this.depthStencilBuffer, FramebufferAttachmentPoint.DEPTH_STENCIL_ATTACHMENT, FramebufferMode.Renderbuffer);
			}
		}

		this.unbind();
	}

	/** The rendering context of this framebuffer. */
	readonly gl: WebGL2RenderingContext;

	/** Whether this framebuffer has a depth buffer. */
	readonly depth: boolean;

	/** The WebGL framebuffer that this framebuffer represents. */
	readonly framebuffer: WebGLFramebuffer;

	/** The bind point of this framebuffer. */
	target: FramebufferTarget;

	/** A list of textures attached to this framebuffer. */
	readonly textures: Texture[];

	/** The depth texture attached to this framebuffer. */
	readonly depthTexture?: Texture;

	/** The depth buffer attached to this framebuffer. */
	readonly depthBuffer?: Renderbuffer;

	/** The stencil buffer attached to this framebuffer. */
	readonly stencilBuffer?: Renderbuffer;

	/** The depth stencil buffer attached to this framebuffer. */
	readonly depthStencilBuffer?: Renderbuffer;

	/** A list of data attached to this framebuffer. */
	get data(): ReadonlyArray<FramebufferData> {
		return this.#data;
	}

	/** The width and height of this framebuffer. */
	get size(): Vector {
		return this.#size ?? new Vector(
			this.textures?.[0]?.size?.x ?? (this.textures?.[0]?.data as HTMLImageElement)?.width ?? 0,
			this.textures?.[0]?.size?.y ?? (this.textures?.[0]?.data as HTMLImageElement)?.height ?? 0);
	}

	set size(value: Vector) {
		this.#size = value?.copy;
	}

	/** Binds this framebuffer to its target. */
	bind(): void {
		this.gl.bindFramebuffer(this.target, this.framebuffer);
	}

	/** Unbinds this framebuffer from its target. */
	unbind(): void {
		Framebuffer.unbind(this.gl);
	}

	/**
	 * Adds an attachment to this framebuffer.
	 * @param data - The data.
	 * @param attachmentPoint - The attachment point of the data.
	 * @param updateMode - The update mode of the data.
	 * @param level - The mipmap level of the texture image to attach to the framebuffer.
	 * @param layer - The layer of the texture image to attach to the framebuffer.
	 */
	add(data: FramebufferData, attachmentPoint: FramebufferAttachmentPoint = FramebufferAttachmentPoint.COLOR_ATTACHMENT0,
		updateMode: FramebufferMode = FramebufferMode.Texture, level = 0, layer = 0): void {
		data.bind();
		this.bind();

		switch (updateMode) {
			case FramebufferMode.Renderbuffer:
				this.gl.framebufferRenderbuffer(this.target, attachmentPoint, WebGLConstant.RENDERBUFFER, (data as Renderbuffer).renderbuffer);
				break;
			case FramebufferMode.Texture:
				this.gl.framebufferTexture2D(this.target, attachmentPoint, (data as Texture).target, (data as Texture).texture, 0);
				break;
			case FramebufferMode.TextureLayer:
				this.gl.framebufferTextureLayer(this.target, attachmentPoint, (data as Texture).texture, level, layer);
				break;
			default:
				throw new Error("Invalid update mode.");
		}

		this.#data.push(data);

		this.unbind();
	}
}