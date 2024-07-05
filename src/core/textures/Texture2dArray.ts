import { BACK, COLOR_ATTACHMENT0, NONE } from "#constants";
import type Buffer from "#Buffer";
import BufferTarget from "#BufferTarget";
import type Context from "#Context";
import Framebuffer from "#Framebuffer";
import FramebufferTarget from "#FramebufferTarget";
import type MipmapTarget from "#MipmapTarget";
import type Prism from "#Prism";
import type Rectangle from "#Rectangle";
import Texture from "#Texture";
import type TextureDataType from "#TextureDataType";
import type TextureFormat from "#TextureFormat";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import TextureTarget from "#TextureTarget";
import isTextureFormatCompressed from "#isTextureFormatCompressed";

/** A two-dimensional array texture. */
export default class Texture2dArray extends Texture {
	/**
	 * Create a two-dimensional array texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Create a two-dimensional array texture with a fixed size. This has better performance than a variable-sized texture.
	 * @param context - The rendering context of the texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param width - The width of the texture.
	 * @param height - The height of the texture.
	 * @param depth - The depth of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureSizedInternalFormat,
		width: number,
		height: number,
		depth: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureSizedInternalFormat,
		width?: number,
		height?: number,
		depth?: number
	) {
		if (
			typeof levels === "undefined" ||
			typeof format === "undefined" ||
			typeof width === "undefined" ||
			typeof height === "undefined" ||
			typeof depth === "undefined"
		) {
			super(context, TextureTarget.TEXTURE_2D_ARRAY);
			return;
		}

		// Immutable-format.
		super(context, TextureTarget.TEXTURE_2D_ARRAY, levels, format, [
			width,
			height,
			depth
		]);
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
		dims: [number, number, number]
	) {
		this.gl.texStorage3D(
			this.target,
			levels,
			format,
			dims[0],
			dims[1],
			dims[2]
		);
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
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds?: Prism,
		framebuffer?: Framebuffer,
		area?: Rectangle,
		readBuffer?: boolean | number
	) {
		const mipDims = this.getSizeOfMip(level);

		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		const z = bounds?.[4] ?? 0;
		const width = bounds?.[2] ?? mipDims[0] ?? 1;
		const height = bounds?.[3] ?? mipDims[1] ?? 1;
		const depth = bounds?.[5] ?? mipDims[2] ?? 1;

		const frameX = area?.[0] ?? 0;
		const frameY = area?.[1] ?? 0;
		const frameWidth = area?.[2] ?? width;
		const frameHeight = area?.[3] ?? height;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameWidth * frameHeight > width * height * depth) {
			throw new RangeError("Bounds are too small.");
		}

		// Bind the framebuffer.
		if (typeof framebuffer === "undefined") {
			Framebuffer.unbindGl(this.context, FramebufferTarget.READ_FRAMEBUFFER);
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

		// Since a 2D framebuffer is being copied to a 3D texture, only a portion of the texture can be updated (resizing the texture is not possible).
		this.gl.copyTexSubImage3D(
			target,
			level,
			x,
			y,
			z,
			frameX,
			frameY,
			frameWidth,
			frameHeight
		);
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
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism,
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
				this.gl.compressedTexSubImage3D(
					target,
					level,
					bounds[0],
					bounds[1],
					bounds[4],
					bounds[2],
					bounds[3],
					bounds[5],
					format,
					size,
					offset
				);
				return;
			}

			// Uncompressed format.
			this.gl.texSubImage3D(
				target,
				level,
				bounds[0],
				bounds[1],
				bounds[4],
				bounds[2],
				bounds[3],
				bounds[5],
				format,
				type,
				offset
			);
			return;
		}

		// Mutable-format.
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage3D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
				bounds[5],
				0,
				size,
				offset
			);
		} else {
			// Uncompressed format.
			this.gl.texImage3D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
				bounds[5],
				0,
				format,
				type,
				offset
			);
		}

		// Update dimensions.
		// ESLint improperly assumes that `bounds` can be destructured.
		// eslint-disable-next-line prefer-destructuring
		this.dims[0] = bounds[2];
		// eslint-disable-next-line prefer-destructuring
		this.dims[1] = bounds[3];
		// eslint-disable-next-line prefer-destructuring
		this.dims[2] = bounds[5];
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
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	) {
		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		const z = bounds?.[4] ?? 0;
		const width =
			bounds?.[2] ??
			(data instanceof VideoFrame ? data.codedWidth : data.width);
		const height =
			bounds?.[3] ??
			(data instanceof VideoFrame ? data.codedHeight : data.height);
		const depth = bounds?.[5] ?? 1;

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions if they exist.
		if (this.isImmutableFormat || level > 0) {
			this.gl.texSubImage3D(
				target,
				level,
				x,
				y,
				z,
				width,
				height,
				depth,
				format,
				type,
				data
			);
			return;
		}

		// Mutable-format.
		this.gl.texImage3D(
			target,
			level,
			this.format,
			width,
			height,
			depth,
			0,
			format,
			type,
			data
		);

		// Update dimensions.
		this.dims[0] = width;
		this.dims[1] = height;
		this.dims[2] = depth;
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
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism,
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
				this.gl.compressedTexSubImage3D(
					target,
					level,
					bounds[0],
					bounds[1],
					bounds[4],
					bounds[2],
					bounds[3],
					bounds[5],
					format,
					array,
					offset,
					length
				);
				return;
			}

			// Uncompressed format.
			this.gl.texSubImage3D(
				target,
				level,
				bounds[0],
				bounds[1],
				bounds[4],
				bounds[2],
				bounds[3],
				bounds[5],
				format,
				type,
				array
			);
			return;
		}

		// Mutable-format.
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage3D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
				bounds[5],
				0,
				array,
				offset,
				length
			);
		} else if (typeof offset === "undefined") {
			// Uncompressed format without offset.
			this.gl.texImage3D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
				bounds[5],
				0,
				format,
				type,
				array
			);
		} else {
			// Uncompressed format with offset.
			this.gl.texImage3D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
				bounds[5],
				0,
				format,
				type,
				array,
				offset
			);
		}

		// Update dimensions.
		// ESLint improperly assumes that `bounds` can be destructured.
		// eslint-disable-next-line prefer-destructuring
		this.dims[0] = bounds[2];
		// eslint-disable-next-line prefer-destructuring
		this.dims[1] = bounds[3];
		// eslint-disable-next-line prefer-destructuring
		this.dims[2] = bounds[5];
	}
}
