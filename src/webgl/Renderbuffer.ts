import { Vector, WebGLConstant } from "../index";

/** Formats for a renderbuffer. */
export enum RenderbufferMode {
	RGBA4 = WebGLConstant.RGBA4,
	RGB565 = WebGLConstant.RGB565,
	RGB5_A1 = WebGLConstant.RGB5_A1,
	DEPTH_COMPONENT16 = WebGLConstant.DEPTH_COMPONENT16,
	STENCIL_INDEX8 = WebGLConstant.STENCIL_INDEX8,
	DEPTH_STENCIL = WebGLConstant.DEPTH_STENCIL,
	R8 = WebGLConstant.R8,
	R8UI = WebGLConstant.R8UI,
	R8I = WebGLConstant.R8I,
	R16UI = WebGLConstant.R16UI,
	R16I = WebGLConstant.R16I,
	R32UI = WebGLConstant.R32UI,
	R32I = WebGLConstant.R32I,
	RG8 = WebGLConstant.RG8,
	RG8UI = WebGLConstant.RG8UI,
	RG8I = WebGLConstant.RG8I,
	RG16UI = WebGLConstant.RG16UI,
	RG16I = WebGLConstant.RG16I,
	RG32UI = WebGLConstant.RG32UI,
	RG32I = WebGLConstant.RG32I,
	RGB8 = WebGLConstant.RGB8,
	RGBA8 = WebGLConstant.RGBA8,
	SRGB8_ALPHA8 = WebGLConstant.SRGB8_ALPHA8,
	RGB10_A2 = WebGLConstant.RGB10_A2,
	RGBA8UI = WebGLConstant.RGBA8UI,
	RGBA8I = WebGLConstant.RGBA8I,
	RGB10_A2UI = WebGLConstant.RGB10_A2UI,
	RGBA16UI = WebGLConstant.RGBA16UI,
	RGBA16I = WebGLConstant.RGBA16I,
	RGBA32I = WebGLConstant.RGBA32I,
	RGBA32UI = WebGLConstant.RGBA32UI,
	DEPTH_COMPONENT24 = WebGLConstant.DEPTH_COMPONENT24,
	DEPTH_COMPONENT32F = WebGLConstant.DEPTH_COMPONENT32F,
	DEPTH24_STENCIL8 = WebGLConstant.DEPTH24_STENCIL8,
	DEPTH32F_STENCIL8 = WebGLConstant.DEPTH32F_STENCIL8,
	RGBA32F_EXT = WebGLConstant.RGBA32F_EXT,
	RGB32F_EXT = WebGLConstant.RGB32F_EXT,
	SRGB8_ALPHA8_EXT = WebGLConstant.SRGB8_ALPHA8_EXT,
	R16F = WebGLConstant.R16F,
	RG16F = WebGLConstant.RG16F,
	RGBA16F = WebGLConstant.RGBA16F,
	R32F = WebGLConstant.R32F,
	RG32F = WebGLConstant.RG32F,
	RGBA32F = WebGLConstant.RGBA32F,
	R11F_G11F_B10F = WebGLConstant.R11F_G11F_B10F
}

/** A buffer that can contain an image or be the source or target of a rendering operation. */
export class Renderbuffer {
	/**
	 * Creates a renderbuffer.
	 * @param gl - The rendering context of the renderbuffer.
	 * @param format - The format of the renderbuffer.
	 * @param size - The width and height of the renderbuffer.
	 */
	constructor(gl: WebGL2RenderingContext, format: RenderbufferMode, size: Vector) {
		this.gl = gl;
		this.format = format;
		this.size = size;

		this.renderbuffer = gl.createRenderbuffer();
		this.bind();
		gl.renderbufferStorage(WebGLConstant.RENDERBUFFER, format, size.x, size.y);
	}

	/** The rendering context of this renderbuffer. */
	readonly gl: WebGL2RenderingContext;

	/** The WebGL renderbuffer that this renderbuffer represents. */
	readonly renderbuffer: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	readonly format: RenderbufferMode;

	/** The width and height of this renderbuffer. */
	readonly size: Vector;

	/** Binds this renderbuffer. */
	bind(): void {
		this.gl.bindRenderbuffer(WebGLConstant.RENDERBUFFER, this.renderbuffer);
	}
}