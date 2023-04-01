import type Context from "./Context.js";

/** Formats for a renderbuffer. */
export enum RenderbufferFormat {
	RGBA4 = 0x8056,
	RGB565 = 0x8D62,
	RGB5_A1 = 0x8057,
	DEPTH_COMPONENT16 = 0x81A5,
	STENCIL_INDEX8 = 0x8D48,
	DEPTH_STENCIL = 0x84F9,
	R8 = 0x8229,
	R8UI = 0x8232,
	R8I = 0x8231,
	R16UI = 0x8234,
	R16I = 0x8233,
	R32UI = 0x8236,
	R32I = 0x8235,
	RG8 = 0x822B,
	RG8UI = 0x8238,
	RG8I = 0x8237,
	RG16UI = 0x823A,
	RG16I = 0x8239,
	RG32I = 0x823B,
	RGB8 = 0x8051,
	RGBA8 = 0x8058,
	SRGB8_ALPHA8 = 0x8C43,
	RGB10_A2 = 0x8059,
	RGBA8UI = 0x8D7C,
	RGBA8I = 0x8D8E,
	RGB10_A2UI = 0x906F,
	RGBA16UI = 0x8D76,
	RGBA16I = 0x8D88,
	RGBA32I = 0x8D82,
	RGBA32UI = 0x8D70,
	DEPTH_COMPONENT24 = 0x81A6,
	DEPTH_COMPONENT32F = 0x8CAC,
	DEPTH24_STENCIL8 = 0x88F0,
	DEPTH32F_STENCIL8 = 0x8CAD,
	RGBA32F_EXT = 0x8814,
	RGB32F_EXT = 0x8815,
	SRGB8_ALPHA8_EXT = 0x8C43,
	R16F = 0x822D,
	RG16F = 0x822F,
	RGBA16F = 0x881A,
	R32F = 0x822E,
	RG32F = 0x8230,
	RGBA32F = 0x8814,
	R11F_G11F_B10F = 0x8C3A
}

/** A renderbuffer. */
export const RENDERBUFFER = 0x8D41;

/** A buffer that can contain an image or be the source or target of a rendering operation. */
export default class Renderbuffer {
	/**
	 * Creates a renderbuffer.
	 * @param gl The rendering context of the renderbuffer.
	 * @param format The format of the renderbuffer.
	 * @param width The width of the renderbuffer.
	 * @param height The height of the renderbuffer.
	 */
	public constructor(gl: Context, format: RenderbufferFormat, width: number, height: number) {
		this.gl = gl;
		this.format = format;
		this.width = width;
		this.height = height;

		const renderbuffer: WebGLRenderbuffer | null = gl.gl.createRenderbuffer();
		if (!renderbuffer) { throw new Error("Failed to create a renderbuffer."); }
		this.renderbuffer = renderbuffer;

		this.bind();
		gl.gl.renderbufferStorage(RENDERBUFFER, format, width, height);
	}

	/** The rendering context of this renderbuffer. */
	public readonly gl: Context;

	/** The WebGL API interface of this renderbuffer. */
	public readonly renderbuffer: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	public readonly format: RenderbufferFormat;

	/** The width of this renderbuffer. */
	public readonly width: number;

	/** The height of this renderbuffer. */
	public readonly height: number;

	/** Binds this renderbuffer. */
	public bind(): void {
		this.gl.gl.bindRenderbuffer(RENDERBUFFER, this.renderbuffer);
	}
}
