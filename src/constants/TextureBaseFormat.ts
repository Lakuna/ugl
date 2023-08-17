/** Formats for the color components in a texture. */
enum TextureBaseFormat {
	/** Each element is a red/green/blue triple. Fixed-point normalized components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using `1` for alpha. */
	RGB = 0x1907,

	/** Each element contains all four components. */
	RGBA = 0x1908,

	/** Each element is a luminance/alpha double. Components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using the luminance value for red, green, and blue. */
	LUMINANCE_ALPHA = 0x190a,

	/** Each element is a single luminance component. Components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using the luminance value for red, green, and blue and `1` for alpha. */
	LUMINANCE = 0x1909,

	/** Each element is a single alpha component. Components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using `0` for red, green, and blue. */
	ALPHA = 0x1906,

	/** Each element is a single red component. Fixed-point normalized components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using `0` for green and blue and `1` for alpha. */
	RED = 0x1903,

	/** Each element is a single red component. Components are assembled into an RGBA element by using `0` for green and blue and `1` for alpha. */
	RED_INTEGER = 0x8d94,

	/** Each element is a red/green double. Fixed-point normalized components are converted to floating-point, clamped to `[0,1]`, and assembled into an RGBA element by using `0` for blue and `1` for alpha. */
	RG = 0x8227,

	/** Each element is a red/green double. Components are assembled into an RGBA element by using `0` for blue and `1` for alpha. */
	RG_INTEGER = 0x8228,

	/** Each element contains all four components. */
	RGB_INTEGER = 0x8d98,

	/** Indicates that a texture uses the red, green, blue, and alpha channels and stores integers. */
	RGBA_INTEGER = 0x8d99,

	/** Each element contains a single depth value. Components are converted to floating-point and clamped to `[0,1]`. */
	DEPTH_COMPONENT = 0x1902,

	/** Each element is a pair of depth and stencil values. The depth component is interpreted as with `DEPTH_COMPONENT`. The stencil component is interpreted based on the internal format. */
	DEPTH_STENCIL = 0x84f9
}

export default TextureBaseFormat;
