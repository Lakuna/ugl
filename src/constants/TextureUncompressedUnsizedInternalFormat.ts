/** Unsized internal formats for the color components in a texture. */
enum TextureUncompressedUnsizedInternalFormat {
	/**
	 * `format` must be `RGB`. `type` must be `UNSIGNED_BYTE` or
	 * `UNSIGNED_SHORT_5_6_5`. Color renderable and texture filterable.
	 */
	RGB = 0x1907,

	/**
	 * `format` must be `RGBA`. `type` must be `UNSIGNED_BYTE`,
	 * `UNSIGNED_SHORT_4_4_4_4`, or `UNSIGNED_SHORT_5_5_5_1`. Color renderable
	 * and texture filterable.
	 */
	RGBA = 0x1908,

	/**
	 * `format` must be `LUMINANCE_ALPHA`. `type` must be `UNSIGNED_BYTE`.
	 * Color renderable and texture filterable.
	 */
	LUMINANCE_ALPHA = 0x190a,

	/**
	 * `format` must be `LUMINANCE`. `type` must be `UNSIGNED_BYTE`. Color
	 * renderable and texture filterable.
	 */
	LUMINANCE = 0x1909,

	/**
	 * `format` must be `ALPHA`. `type` must be `UNSIGNED_BYTE`. Color
	 * renderable and texture filterable.
	 */
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
