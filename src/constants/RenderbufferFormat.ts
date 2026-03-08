/**
 * Formats for a renderbuffer.
 * @public
 */
enum RenderbufferFormat {
	/** 8 bits each for red, green, and blue. */
	RGB8 = 0x8051,

	/** 4 bits each for red, green, blue, and alpha. */
	RGBA4 = 0x8056,

	/** 5 bits each for red, green, and blue, and 1 bit for alpha. */
	RGB5_A1 = 0x8057,

	/** 8 bits each for red, green, blue, and alpha. */
	RGBA8 = 0x8058,

	/** 10 bits each for red, green, and blue, and 2 bits for alpha. */
	RGB10_A2 = 0x8059,

	/** 16 depth bits. */
	DEPTH_COMPONENT16 = 0x81a5,

	/** 24 bits for depth. */
	DEPTH_COMPONENT24 = 0x81a6,

	/** 8 red bits. */
	R8 = 0x8229,

	/** 8 bits each for red and green. */
	RG8 = 0x822b,

	/** A 16-bit floating-point number for red. */
	R16F = 0x822d,

	/** A 32-bit floating-point number for red. */
	R32F = 0x822e,

	/** A 16-bit floating-point number each for red and green. */
	RG16F = 0x822f,

	/** A 32-bit floating-point number each for red and green. */
	RG32F = 0x8230,

	/** An 8-bit integer for red. */
	R8I = 0x8231,

	/** An 8-bit unsigned integer for red. */
	R8UI = 0x8232,

	/** A 16-bit integer for red. */
	R16I = 0x8233,

	/** A 16-bit unsigned integer for red. */
	R16UI = 0x8234,

	/** A 32-bit integer for red. */
	R32I = 0x8235,

	/** A 32-bit unsigned integer for red. */
	R32UI = 0x8236,

	/** An 8-bit integer each for red and green. */
	RG8I = 0x8237,

	/** An 8-bit unsigned integer each for red and green. */
	RG8UI = 0x8238,

	/** A 16-bit integer each for red and green. */
	RG16I = 0x8239,

	/** A 16-bit unsigned integer each for red and green. */
	RG16UI = 0x823a,

	/** A 32-bit integer each for red and green. */
	RG32I = 0x823b,

	/** A 32-bit unsigned integer each for red and green. */
	RG32UI = 0x823c,

	/** A depth stencil. */
	DEPTH_STENCIL = 0x84f9,

	/** A 32-bit floating-point number each for red, green, blue, and alpha. */
	RGBA32F = 0x8814,

	/**
	 * A 32-bit floating-point number each for red, green, and blue.
	 * @deprecated Use the constant from {@link Extension.EXT_COLOR_BUFFER_FLOAT} instead.
	 */
	RGB32F_EXT = 0x8815,

	/** A 16-bit floating-point number each for red, green, blue, and alpha. */
	RGBA16F = 0x881a,

	/** 24 bits for depth and 8 bits for stencil. */
	DEPTH24_STENCIL8 = 0x88f0,

	/** An 11-bit floating-point number each for red and green, and a 10-bit floating-point number for blue. */
	R11F_G11F_B10F = 0x8c3a,

	/** 8 bits each for red, green, blue, and alpha. */
	SRGB8_ALPHA8 = 0x8c43,

	/** A 32-bit floating-point number for depth. */
	DEPTH_COMPONENT32F = 0x8cac,

	/** A 32-bit floating-point number for depth and 8 bits for stencil. */
	DEPTH32F_STENCIL8 = 0x8cad,

	/** 8 stencil bits. */
	STENCIL_INDEX8 = 0x8d48,

	/** 5 red bits, 6 green bits, and 5 blue bits. */
	RGB565 = 0x8d62,

	/** A 32-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA32UI = 0x8d70,

	/** A 16-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA16UI = 0x8d76,

	/** An 8-bit unsigned integer each for red, green, blue, and alpha. */
	RGBA8UI = 0x8d7c,

	/** A 32-bit integer each for red, green, blue, and alpha. */
	RGBA32I = 0x8d82,

	/** A 16-bit integer each for red, green, blue, and alpha. */
	RGBA16I = 0x8d88,

	/** An 8-bit integer each for red, green, blue, and alpha. */
	RGBA8I = 0x8d8e,

	/** A 10-bit unsigned integer each for red, green, and blue, and a 2-bit unsigned integer for alpha. */
	RGB10_A2UI = 0x906f
}

export default RenderbufferFormat;
