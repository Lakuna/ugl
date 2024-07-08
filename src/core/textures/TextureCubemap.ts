import { BACK, COLOR_ATTACHMENT0, NONE } from "../../constants/constants.js";
import type Buffer from "../buffers/Buffer.js";
import BufferTarget from "../../constants/BufferTarget.js";
import type Context from "../Context.js";
import CubemapFace from "../../constants/CubemapFace.js";
import Framebuffer from "../Framebuffer.js";
import FramebufferTarget from "../../constants/FramebufferTarget.js";
import type MipmapTarget from "../../constants/MipmapTarget.js";
import type Rectangle from "../../types/Rectangle.js";
import Texture from "./Texture.js";
import type TextureDataType from "../../constants/TextureDataType.js";
import type TextureFormat from "../../constants/TextureFormat.js";
import type { TextureSizedInternalFormat } from "../../types/TextureSizedInternalFormat.js";
import TextureTarget from "../../constants/TextureTarget.js";
import isTextureFormatCompressed from "../../utility/internal/isTextureFormatCompressed.js";

/** A cube mapped texture. */
export default class TextureCubemap extends Texture {
	/**
	 * Create a cube mapped texture from the data in the images at the given URLs.
	 * @param context - The rendering context of the texture.
	 * @param px - The URL of the image for the face on the X-axis in the positive direction.
	 * @param nx - The URL of the image for the face on the X-axis in the negative direction.
	 * @param py - The URL of the image for the face on the Y-axis in the positive direction.
	 * @param ny - The URL of the image for the face on the Y-axis in the negative direction.
	 * @param pz - The URL of the image for the face on the Z-axis in the positive direction.
	 * @param nz - The URL of the image for the face on the Z-axis in the negative direction.
	 * @returns The texture.
	 */
	public static fromImageUrls(
		context: Context,
		px: string,
		nx: string,
		py: string,
		ny: string,
		pz: string,
		nz: string
	) {
		// Create a new cube mapped texture.
		const out = new TextureCubemap(context);

		// Fill each face with one magenta texel until the image loads.
		const magenta = new Uint8Array([0xff, 0x00, 0xff, 0xff]);
		out.setMip(CubemapFace.PositiveX, 0, magenta, [0, 0, 1, 1]);
		out.setMip(CubemapFace.NegativeX, 0, magenta);
		out.setMip(CubemapFace.PositiveY, 0, magenta);
		out.setMip(CubemapFace.NegativeY, 0, magenta);
		out.setMip(CubemapFace.PositiveZ, 0, magenta);
		out.setMip(CubemapFace.NegativeZ, 0, magenta);

		// Load the images.
		const loadedImages = new Map<CubemapFace, HTMLImageElement>();
		for (const [face, url] of [
			[CubemapFace.PositiveX, px],
			[CubemapFace.NegativeX, nx],
			[CubemapFace.PositiveY, py],
			[CubemapFace.NegativeY, ny],
			[CubemapFace.PositiveZ, pz],
			[CubemapFace.NegativeZ, nz]
		] as [CubemapFace, string][]) {
			const image = new Image();
			image.addEventListener("load", () => {
				loadedImages.set(face, image);

				// Switch out the sources only after all of the images are loaded so that face sizes remain consistent.
				if (loadedImages.size >= 6) {
					for (const [otherFace, otherImage] of loadedImages) {
						out.setMip(otherFace, 0, otherImage);
					}
				}
			});
			image.crossOrigin = ""; // CORS
			image.src = url;
		}

		return out;
	}

	/**
	 * Create a cube mapped texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Create a cube mapped texture with a fixed size. This has better performance than a variable-sized texture.
	 * @param context - The rendering context of the texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dim - The width and height of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureSizedInternalFormat,
		dim: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureSizedInternalFormat,
		dim?: number
	) {
		if (
			typeof levels === "undefined" ||
			typeof format === "undefined" ||
			typeof dim === "undefined"
		) {
			super(context, TextureTarget.TEXTURE_CUBE_MAP);
			return;
		}

		// Immutable-format.
		super(context, TextureTarget.TEXTURE_CUBE_MAP, levels, format, [dim]);
	}

	/**
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D)
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 * @internal
	 */
	protected override makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: [number]
	): void {
		this.gl.texStorage2D(this.target, levels, format, dims[0], dims[0]);
	}

	/**
	 * Copy the data in a framebuffer into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param framebuffer - The framebuffer to copy into the mip, or `undefined` for the default framebuffer.
	 * @param area - The area of the framebuffer to copy into the mip.
	 * @param readBuffer - The color buffer to read from, or `true` for the back buffer, or `false` for no buffer, or `undefined` for the previous buffer.
	 * @internal
	 */
	protected override setMipFromFramebuffer(
		target:
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z,
		level: number,
		bounds?: Rectangle,
		framebuffer?: Framebuffer,
		area?: Rectangle,
		readBuffer?: number | boolean
	) {
		const mipDims = this.getSizeOfMip(level);

		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		const dim = bounds?.[2] ?? mipDims[0] ?? 1;

		const frameX = area?.[0] ?? 0;
		const frameY = area?.[1] ?? 0;
		const frameDim = area?.[2] ?? dim;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameDim > dim) {
			throw new RangeError("Bounds are too small.");
		}

		// Bind the framebuffer.
		if (typeof framebuffer === "undefined") {
			Framebuffer.unbindGl(this.gl, FramebufferTarget.READ_FRAMEBUFFER);
		} else {
			framebuffer.bind(FramebufferTarget.READ_FRAMEBUFFER);
		}

		// Set the read buffer.
		if (typeof readBuffer === "number") {
			this.gl.readBuffer(COLOR_ATTACHMENT0 + readBuffer);
		} else if (readBuffer) {
			this.gl.readBuffer(BACK);
		} else if (readBuffer === false) {
			this.gl.readBuffer(NONE);
		}

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions if they exist.
		if (this.isImmutableFormat || level > 0) {
			this.gl.copyTexSubImage2D(
				target,
				level,
				x,
				y,
				frameX,
				frameY,
				frameDim,
				frameDim
			);
			return;
		}

		// Mutable-format and top mip.
		this.gl.copyTexImage2D(
			target,
			level,
			this.format,
			frameX,
			frameY,
			frameDim,
			frameDim,
			0
		);

		// Update dimensions.
		this.dims[0] = frameDim;
	}

	/**
	 * Copy the data in a buffer into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated.
	 * @param format - The format of the data in the buffer.
	 * @param type - The type of the data in the buffer.
	 * @param buffer - The buffer to copy into the mip.
	 * @param size - The number of bytes of data to copy from the buffer.
	 * @param offset - The offset in bytes from the start of the buffer to start copying at.
	 * @internal
	 */
	protected override setMipFromBuffer(
		target: MipmapTarget,
		level: number,
		bounds: Rectangle,
		format: TextureFormat,
		type: TextureDataType,
		buffer: Buffer,
		size: number,
		offset: number
	) {
		const isCompressed = isTextureFormatCompressed(format);

		// Bind the buffer.
		buffer.bind(BufferTarget.PIXEL_UNPACK_BUFFER);

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions and exist.
		if (this.isImmutableFormat || level > 0) {
			// Compressed format.
			if (isCompressed) {
				this.gl.compressedTexSubImage2D(
					target,
					level,
					bounds[0],
					bounds[1],
					bounds[2],
					bounds[3],
					format,
					size,
					offset
				);
				return;
			}

			// Uncompressed format.
			this.gl.texSubImage2D(
				target,
				level,
				bounds[0],
				bounds[1],
				bounds[2],
				bounds[3],
				format,
				type,
				offset
			);
			return;
		}

		// Mutable-format.
		const dim: number = Math.max(bounds[2], bounds[3]);
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				size,
				offset
			);
		} else {
			// Uncompressed format.
			this.gl.texImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				format,
				type,
				offset
			);
		}

		// Update dimensions.
		this.dims[0] = dim;
	}

	/**
	 * Copy data into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param format - The format of the data.
	 * @param type - The type of the data.
	 * @param data - The data to copy into the mip.
	 * @internal
	 */
	protected override setMipFromData(
		target: MipmapTarget,
		level: number,
		bounds: Rectangle | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	) {
		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		// https://caniuse.com/mdn-api_videoframe
		// const width = bounds?.[2] ?? (data instanceof VideoFrame ? data.codedWidth : data.width);
		// const height = bounds?.[3] ?? (data instanceof VideoFrame ? data.codedHeight : data.height);
		const width = bounds?.[2] ?? (data as HTMLImageElement).width;
		const height = bounds?.[3] ?? (data as HTMLImageElement).height;

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions and exist.
		if (this.isImmutableFormat || level > 0) {
			this.gl.texSubImage2D(
				target,
				level,
				x,
				y,
				width,
				height,
				format,
				type,
				data
			);
			return;
		}

		// Mutable-format.
		const dim: number = Math.max(width, height);
		if (typeof bounds === "undefined") {
			// Undefined bounds. Resize to match data.
			this.gl.texImage2D(target, level, this.format, format, type, data);
		} else {
			// Defined bounds. Resize to match bounds.
			this.gl.texImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				format,
				type,
				data
			);
		}

		// Update dimensions.
		this.dims[0] = dim;
	}

	/**
	 * Copy the data in an array into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param format - The format of the data in the array.
	 * @param type - The type of the data in the array.
	 * @param array - The array to copy into the mip.
	 * @param offset - The offset from the start of the array to start copying at, or `undefined` for the start of the array.
	 * @param length - The number of elements to copy from the array, or `undefined` for the entire array.
	 * @internal
	 */
	protected override setMipFromArray(
		target: MipmapTarget,
		level: number,
		bounds: Rectangle,
		format: TextureFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	) {
		const isCompressed = isTextureFormatCompressed(format);

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions and exist.
		if (this.isImmutableFormat || level > 0) {
			// Compressed format.
			if (isCompressed) {
				this.gl.compressedTexSubImage2D(
					target,
					level,
					bounds[0],
					bounds[1],
					bounds[2],
					bounds[3],
					format,
					array,
					offset,
					length
				);
				return;
			}

			// Uncompressed format.
			this.gl.texSubImage2D(
				target,
				level,
				bounds[0],
				bounds[1],
				bounds[2],
				bounds[3],
				format,
				type,
				array
			);
			return;
		}

		// Mutable-format.
		const dim: number = Math.max(bounds[2], bounds[3]);
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				array,
				offset,
				length
			);
		} else if (typeof offset === "undefined") {
			// Uncompressed format without offset.
			this.gl.texImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				format,
				type,
				array
			);
		} else {
			// Uncompressed format with offset.
			this.gl.texImage2D(
				target,
				level,
				this.format,
				dim,
				dim,
				0,
				format,
				type,
				array,
				offset
			);
		}

		// Update dimensions.
		this.dims[0] = dim;
	}
}
