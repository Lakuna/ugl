import type Context from "./Context.js";

/** Formats for a renderbuffer. */
export const enum RenderbufferFormat {
	/** 4 bits each for red, green, blue, and alpha. */
	RGBA4 = 0x8056,

	/** 5 red bits, 6 green bits, and 5 blue bits. */
	RGB565 = 0x8D62,

	/** 5 bits each for red, green, and blue, and 1 bit for alpha. */
	RGB5_A1 = 0x8057,

	/** 16 depth bits. */
	DEPTH_COMPONENT16 = 0x81A5,

	/** 8 stencil bits. */
	STENCIL_INDEX8 = 0x8D48,

	/** A depth stencil. */
	DEPTH_STENCIL = 0x84F9,

	/** 8 red bits. */
	R8 = 0x8229,

	/** An 8-bit unsigned integer for red. */
	R8UI = 0x8232,

	/** An 8-bit integer for red. */
	R8I = 0x8231,

	/** A 16-bit unsigned integer for red. */
	R16UI = 0x8234,

	/** A 16-bit integer for red. */
	R16I = 0x8233,

	/** A 32-bit unsigned integer for red. */
	R32UI = 0x8236,

	/** A 32-bit integer for red. */
	R32I = 0x8235,

	/** 8 bits each for red and green. */
	RG8 = 0x822B,

	/** An 8-bit unsigned integer each for red and green. */
	RG8UI = 0x8238,

	/** An 8-bit integer each for red and green. */
	RG8I = 0x8237,

	/** A 16-bit unsigned integer each for red and green. */
	RG16UI = 0x823A,

	/** A 16-bit integer each for red and green. */
	RG16I = 0x8239,

	/** A 32-bit unsigned integer each for red and green. */
	RG32UI = 0x823C,

	/** A 32-bit integer each for red and green. */
	RG32I = 0x823B,

	/** 8 bits each for red, green, and blue. */
	RGB8 = 0x8051,

	/** 8 bits each for red, green, blue, and alpha. */
	RGBA8 = 0x8058,

	/** 8 bits each for red, green, blue, and alpha. */
	SRGB8_ALPHA8 = 0x8C43,

	/** 10 bits each for red, green, and blue, and 2 bits for alpha. */
	RGB10_A2 = 0x8059,

	/** An 8-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA8UI = 0x8D7C,

	/** An 8-bit integer each for red, green, blue, and alpha. */
	RGBA8I = 0x8D8E,

	/** A 10-bit unsigned integer each for red, green, and blue, and a 2-bit unsigned integer for alpha. */
	RGB10_A2UI = 0x906F,

	/** A 16-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA16UI = 0x8D76,

	/** A 16-bit integer each for red, green, blue, and alpha. */
	RGBA16I = 0x8D88,

	/** A 32-bit integer each for red, green, blue, and alpha. */
	RGBA32I = 0x8D82,

	/** A 32-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA32UI = 0x8D70,

	/** 24 bits for depth. */
	DEPTH_COMPONENT24 = 0x81A6,

	/** A 32-bit floating-point number for depth. */
	DEPTH_COMPONENT32F = 0x8CAC,

	/** 24 bits for depth and 8 bits for stencil. */
	DEPTH24_STENCIL8 = 0x88F0,

	/** A 32-bit floating-point number for depth and 8 bits for stencil. */
	DEPTH32F_STENCIL8 = 0x8CAD,

	/** A 32-bit floating-point number each for red, green, blue, and alpha. */
	RGBA32F_EXT = 0x8814,

	/** A 32-bit floating-point number each for red, green, and blue. */
	RGB32F_EXT = 0x8815,

	/** 8 bits each for red, green, blue, and alpha. */
	SRGB8_ALPHA8_EXT = 0x8C43,

	/** A 16-bit floating-point number for red. */
	R16F = 0x822D,

	/** A 16-bit floating-point number each for red and green. */
	RG16F = 0x822F,

	/** A 16-bit floating-point number each for red, green, blue, and alpha. */
	RGBA16F = 0x881A,

	/** A 32-bit floating-point number for red. */
	R32F = 0x822E,

	/** A 32-bit floating-point number each for red and green. */
	RG32F = 0x8230,

	/** A 32-bit floating-point number each for red, green, blue, and alpha. */
	RGBA32F = 0x8814,

	/** An 11-bit floating-point number each for red and green, and a 10-bit floating-point number for blue. */
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
