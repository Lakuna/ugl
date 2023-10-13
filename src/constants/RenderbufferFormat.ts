/**
 * Formats for a renderbuffer.
 * @see [`renderbufferStorage`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage)
 */
enum RenderbufferFormat {
	/** 4 bits each for red, green, blue, and alpha. */
	RGBA4 = 0x8056,

	/** 5 red bits, 6 green bits, and 5 blue bits. */
	RGB565 = 0x8d62,

	/** 5 bits each for red, green, and blue, and 1 bit for alpha. */
	RGB5_A1 = 0x8057,

	/** 16 depth bits. */
	DEPTH_COMPONENT16 = 0x81a5,

	/** 8 stencil bits. */
	STENCIL_INDEX8 = 0x8d48,

	/** A depth stencil. */
	DEPTH_STENCIL = 0x84f9,

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
	RG8 = 0x822b,

	/** An 8-bit unsigned integer each for red and green. */
	RG8UI = 0x8238,

	/** An 8-bit integer each for red and green. */
	RG8I = 0x8237,

	/** A 16-bit unsigned integer each for red and green. */
	RG16UI = 0x823a,

	/** A 16-bit integer each for red and green. */
	RG16I = 0x8239,

	/** A 32-bit unsigned integer each for red and green. */
	RG32UI = 0x823c,

	/** A 32-bit integer each for red and green. */
	RG32I = 0x823b,

	/** 8 bits each for red, green, and blue. */
	RGB8 = 0x8051,

	/** 8 bits each for red, green, blue, and alpha. */
	RGBA8 = 0x8058,

	/** 8 bits each for red, green, blue, and alpha. */
	SRGB8_ALPHA8 = 0x8c43,

	/** 10 bits each for red, green, and blue, and 2 bits for alpha. */
	RGB10_A2 = 0x8059,

	/** An 8-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA8UI = 0x8d7c,

	/** An 8-bit integer each for red, green, blue, and alpha. */
	RGBA8I = 0x8d8e,

	/**
	 * A 10-bit unsigned integer each for red, green, and blue, and a 2-bit
	 * unsigned integer for alpha.
	 */
	RGB10_A2UI = 0x906f,

	/** A 16-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA16UI = 0x8d76,

	/** A 16-bit integer each for red, green, blue, and alpha. */
	RGBA16I = 0x8d88,

	/** A 32-bit integer each for red, green, blue, and alpha. */
	RGBA32I = 0x8d82,

	/** A 32-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA32UI = 0x8d70,

	/** 24 bits for depth. */
	DEPTH_COMPONENT24 = 0x81a6,

	/** A 32-bit floating-point number for depth. */
	DEPTH_COMPONENT32F = 0x8cac,

	/** 24 bits for depth and 8 bits for stencil. */
	DEPTH24_STENCIL8 = 0x88f0,

	/** A 32-bit floating-point number for depth and 8 bits for stencil. */
	DEPTH32F_STENCIL8 = 0x8cad,

	/** A 32-bit floating-point number each for red, green, and blue. */
	RGB32F_EXT = 0x8815,

	/** A 16-bit floating-point number for red. */
	R16F = 0x822d,

	/** A 16-bit floating-point number each for red and green. */
	RG16F = 0x822f,

	/** A 16-bit floating-point number each for red, green, blue, and alpha. */
	RGBA16F = 0x881a,

	/** A 32-bit floating-point number for red. */
	R32F = 0x822e,

	/** A 32-bit floating-point number each for red and green. */
	RG32F = 0x8230,

	/** A 32-bit floating-point number each for red, green, blue, and alpha. */
	RGBA32F = 0x8814,

	/**
	 * An 11-bit floating-point number each for red and green, and a 10-bit
	 * floating-point number for blue.
	 */
	R11F_G11F_B10F = 0x8c3a
}

export default RenderbufferFormat;
