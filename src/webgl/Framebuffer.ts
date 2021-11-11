import { FramebufferMode, WebGLConstant, FramebufferAttachmentPoint,
	FramebufferTarget, RenderbufferMode, TextureDataType, TextureFilter,
	TextureFormat, TextureWrapMode, FramebufferData, FramebufferParameters,
	Renderbuffer, Texture, Vector } from "../index.js";

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
		this.#data = [];
		this.#size = new Vector();
		this.size = size;
		this.depth = depth;
		this.target = target;

		const framebuffer: WebGLFramebuffer | null = gl.createFramebuffer();
		if (framebuffer) {
			this.framebuffer = framebuffer;
		} else {
			throw new Error("Failed to create a WebGL framebuffer.");
		}
		this.textures = [];

		this.bind();

		const drawBuffers: number[] = [];
		for (let i = 0; i < colorTextureCount; i++) {
			const texture: Texture = new Texture({
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
			});
			this.textures.push(texture);
			this.add(texture);
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