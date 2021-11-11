import { TextureData, TextureMode, TextureDataType, TextureFilter,
	TextureFormat, TextureTarget, TextureWrapMode, Vector } from "../index.js";

/** Parameters for creating a texture. */
export type TextureParameters = {
	/** The rendering context of the texture. */
	gl: WebGL2RenderingContext;

	/** The data contained within the texture. */
	data?: TextureData;

	/** The bind target of the texture. */
	target?: TextureTarget;

	/** Whether to generate a mipmap for the texture. */
	generateMipmap?: boolean;

	/** Whether to flip the Y axis of the texture. */
	flipY?: boolean;

	/** Whether to multiply the alpha channel into the other color channels in the texture. */
	premultiplyAlpha?: boolean;

	/** The unpack alignment of the texture. */
	unpackAlignment?: number;

	/** The minimum mip filter of the texture. */
	minFilter?: TextureFilter;

	/** The maximum mip filter of the texture. */
	magFilter?: TextureFilter;

	/** The wrapping behavior of the texture on the S axis. */
	wrapS?: TextureWrapMode;

	/** The wrapping behavior of the texture on the T axis. */
	wrapT?: TextureWrapMode;

	/** The width, height, and depth of the texture. */
	size?: Vector;

	/** The coordinate offset of the texture if it is a sub-image. */
	offset?: Vector;

	/** The starting coordinates (bottom-left) of the texture if it is a copy of a sub-image. */
	copyStart?: Vector;

	/** The format of the data supplied to the texture. */
	format?: TextureFormat;

	/** The format of the data in the texture. */
	internalFormat?: TextureFormat;

	/** The data type of the values in the texture. */
	type?: TextureDataType;

	/** The mip level of the texture. */
	level?: number;

	/** The length of the source of the texture when reading from the pixel unpack buffer. */
	sourceLength?: number;

	/** The offset of the source of the texture when reading from the pixel unpack buffer. */
	sourceOffset?: number;

	/** The length override of the source of the texture when reading from the pixel unpack buffer. */
	sourceLengthOverride?: number;

	/** The update mode of the texture. */
	updateMode?: TextureMode;
}