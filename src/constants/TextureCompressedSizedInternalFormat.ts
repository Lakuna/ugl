/**
 * Compressed sized formats for the color components in a texture.
 * @public
 */
enum TextureCompressedSizedInternalFormat {
	/** One-channel unsigned format compression. */
	COMPRESSED_R11_EAC = 0x9270,

	/** One-channel signed format compression. */
	COMPRESSED_SIGNED_R11_EAC = 0x9271,

	/** Two-channel unsigned format compression. */
	COMPRESSED_RG11_EAC = 0x9272,

	/** Two-channel signed format compression. */
	COMPRESSED_SIGNED_RG11_EAC = 0x9273,

	/** Compressed RGB8 data with no alpha channel. */
	COMPRESSED_RGB8_ETC2 = 0x9274,

	/** Compressed RGB8 data. */
	COMPRESSED_RGBA8_ETC2_EAC = 0x9275,

	/** Compressed sRGB8 data with no alpha channel. */
	COMPRESSED_SRGB8_ETC2 = 0x9276,

	/** Compressed sRGB8 data with no alpha channel. */
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277,

	/** Compressed RGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent). */
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278,

	/** Compressed sRGB8 data with the ability to punch through the alpha channel (make it completely opaque or transparent). */
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279
}

export default TextureCompressedSizedInternalFormat;
