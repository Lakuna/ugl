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
	 * Creates a two-dimensional array texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Creates a two-dimensional array texture with a fixed size. This has better
	 * performance than a variable-sized texture.
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
	 * Makes this into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D).
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 * @internal
	 */
	protected makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: [number, number, number]
	): void {
		this.gl.texStorage3D(
			this.target,
			levels,
			format,
			dims[0],
			dims[1],
			dims[2]
		);
	}

	protected override setMipFromFramebuffer(
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism | undefined,
		framebuffer: Framebuffer | undefined,
		area: Rectangle | undefined
	): void {
		const mipDims: number[] = this.getSizeOfMip(level);

		const x: number = bounds?.[0] ?? 0;
		const y: number = bounds?.[1] ?? 0;
		const z: number = bounds?.[4] ?? 0;
		const width: number = bounds?.[2] ?? mipDims[0] ?? 1;
		const height: number = bounds?.[3] ?? mipDims[1] ?? 1;
		const depth: number = bounds?.[5] ?? mipDims[2] ?? 1;

		const frameX: number = area?.[0] ?? 0;
		const frameY: number = area?.[1] ?? 0;
		const frameWidth: number = area?.[2] ?? width;
		const frameHeight: number = area?.[3] ?? height;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameWidth * frameHeight > width * height * depth) {
			throw new RangeError("Bounds are too small.");
		}

		// Bind the framebuffer.
		if (typeof framebuffer === "undefined") {
			Framebuffer.unbind(this.context, FramebufferTarget.READ_FRAMEBUFFER);
		} else {
			framebuffer.bind(FramebufferTarget.READ_FRAMEBUFFER);
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

	protected override setMipFromBuffer(
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism,
		format: TextureFormat,
		type: TextureDataType,
		buffer: Buffer,
		size: number,
		offset: number
	): void {
		const isCompressed: boolean = isTextureFormatCompressed(format);

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

	protected override setMipFromData(
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	): void {
		const x: number = bounds?.[0] ?? 0;
		const y: number = bounds?.[1] ?? 0;
		const z: number = bounds?.[4] ?? 0;
		const width: number =
			bounds?.[2] ??
			(data instanceof VideoFrame ? data.codedWidth : data.width);
		const height: number =
			bounds?.[3] ??
			(data instanceof VideoFrame ? data.codedHeight : data.height);
		const depth: number = bounds?.[5] ?? 1;

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

	protected override setMipFromArray(
		target: MipmapTarget.TEXTURE_2D_ARRAY,
		level: number,
		bounds: Prism,
		format: TextureFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	): void {
		const isCompressed: boolean = isTextureFormatCompressed(format);

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
