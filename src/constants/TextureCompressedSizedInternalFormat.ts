/** Compressed sized formats for the color components in a texture. */
enum TextureCompressedSizedInternalFormat {
	/**
	 * One-channel unsigned format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_R11_EAC = 0x9270,

	/**
	 * One-channel signed format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SIGNED_R11_EAC = 0x9271,

	/**
	 * Two-channel unsigned format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RG11_EAC = 0x9272,

	/**
	 * Two-channel signed format compression.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SIGNED_RG11_EAC = 0x9273,

	/**
	 * Compressed RGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGB8_ETC2 = 0x9274,

	/**
	 * Compressed RGB8 data.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGBA8_ETC2_EAC = 0x9275,

	/**
	 * Compressed sRGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_ETC2 = 0x9276,

	/**
	 * Compressed sRGB8 data with no alpha channel.
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277,

	/**
	 * Compressed RGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent).
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278,

	/**
	 * Compressed sRGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent).
	 * @see [`WEBGL_compressed_texture_etc`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279
}

export default TextureCompressedSizedInternalFormat;
