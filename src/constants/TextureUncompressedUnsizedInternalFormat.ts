/** Unsized internal formats for the color components in a texture. */
enum TextureUncompressedUnsizedInternalFormat {
	/** Color renderable and texture filterable. `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or `UNSIGNED_SHORT_5_6_5`. */
	RGB = 0x1907,

	/** Color renderable and texture filterable. `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`, `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. */
	RGBA = 0x1908,

	/** Color renderable and texture filterable. `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`. */
	LUMINANCE_ALPHA = 0x190a,

	/** Color renderable and texture filterable. `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. */
	LUMINANCE = 0x1909,

	/** Color renderable and texture filterable. `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. */
	ALPHA = 0x1906,

	/**
	 * Unsized sRGB format that leaves the precision up to the driver.
	 * @see [`EXT_sRGB`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 */
	SRGB = 0x8c40,

	/**
	 * Unsized sRGB format with an unsized alpha component.
	 * @see [`EXT_sRGB`](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 */
	SRGB_ALPHA = 0x8c42
}

export default TextureUncompressedUnsizedInternalFormat;
