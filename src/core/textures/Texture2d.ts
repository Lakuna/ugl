import Texture from "#Texture";
import TextureTarget from "#TextureTarget";
import type Context from "#Context";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import type Box from "#Box";
import type Buffer from "#Buffer";
import Framebuffer from "#Framebuffer";
import type MipmapTarget from "#MipmapTarget";
import type TextureFormat from "#TextureFormat";
import FramebufferTarget from "#FramebufferTarget";
import isTextureFormatCompressed from "#isTextureFormatCompressed";
import BufferTarget from "#BufferTarget";
import type TextureDataType from "#TextureDataType";

/** A two-dimensional texture. */
export default class Texture2d extends Texture {
	/**
	 * Creates a two-dimensional texture.
	 * @param context The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Creates a two-dimensional texture with a fixed size. This has better
	 * performance than a variable-sized texture.
	 * @param context The rendering context of the texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param width The width of the texture.
	 * @param height The height of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureSizedInternalFormat,
		width: number,
		height: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureSizedInternalFormat,
		width?: number,
		height?: number
	) {
		if (
			typeof levels === "undefined" ||
			typeof format === "undefined" ||
			typeof width === "undefined" ||
			typeof height === "undefined"
		) {
			super(context, TextureTarget.TEXTURE_2D);
			return;
		}

		// Immutable-format.
		super(context, TextureTarget.TEXTURE_2D, levels, format, [width, height]);
	}

	/**
	 * Makes this into an immutable-format texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param dims The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D).
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 * @internal
	 */
	protected makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: [number, number]
	): void {
		this.gl.texStorage2D(this.target, levels, format, dims[0], dims[1]);
	}

	protected override setMipFromFramebuffer(
		target: MipmapTarget,
		level: number,
		bounds: Box | undefined,
		framebuffer: Framebuffer | undefined,
		area: Box | undefined
	): void {
		const mipDims: number[] = this.getSizeOfMip(level);

		const x: number = bounds?.x ?? 0;
		const y: number = bounds?.y ?? 0;
		const width: number = bounds?.width ?? mipDims[0] ?? 0;
		const height: number = bounds?.height ?? mipDims[1] ?? 0;

		const frameX: number = area?.x ?? 0;
		const frameY: number = area?.y ?? 0;
		const frameWidth: number = area?.width ?? width;
		const frameHeight: number = area?.height ?? height;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameWidth * frameHeight > width * height) {
			throw new RangeError("Bounds are too small.");
		}

		// Bind the framebuffer.
		if (typeof framebuffer === "undefined") {
			Framebuffer.unbind(this.context, FramebufferTarget.READ_FRAMEBUFFER);
		} else {
			framebuffer.bind(FramebufferTarget.READ_FRAMEBUFFER);
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
				frameWidth,
				frameHeight
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
			frameWidth,
			frameHeight,
			0
		);

		// Update dimensions.
		this.dims[0] = frameWidth - frameX;
		this.dims[1] = frameHeight - frameY;
	}

	protected override setMipFromBuffer(
		target: MipmapTarget,
		level: number,
		bounds: Box,
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
				this.gl.compressedTexSubImage2D(
					target,
					level,
					bounds.x,
					bounds.y,
					bounds.width,
					bounds.height,
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
				bounds.x,
				bounds.y,
				bounds.width,
				bounds.height,
				format,
				type,
				offset
			);
			return;
		}

		// Mutable-format.
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				bounds.width,
				bounds.height,
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
				bounds.width,
				bounds.height,
				0,
				format,
				type,
				offset
			);
		}

		// Update dimensions.
		this.dims[0] = bounds.width;
		this.dims[1] = bounds.height;
	}

	protected override setMipFromData(
		target: MipmapTarget,
		level: number,
		bounds: Box | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	): void {
		const x: number = bounds?.x ?? 0;
		const y: number = bounds?.y ?? 0;
		const width: number =
			bounds?.width ??
			(data instanceof VideoFrame ? data.codedWidth : data.width);
		const height: number =
			bounds?.height ??
			(data instanceof VideoFrame ? data.codedHeight : data.height);

		// Immutable-format or not top mip. Bounds are guaranteed to fit within existing dimensions if they exist.
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
		this.gl.texImage2D(
			target,
			level,
			this.format,
			width,
			height,
			0,
			format,
			type,
			data
		);

		// Update dimensions.
		this.dims[0] = width;
		this.dims[1] = height;
	}

	protected override setMipFromArray(
		target: MipmapTarget,
		level: number,
		bounds: Box,
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
				this.gl.compressedTexSubImage2D(
					target,
					level,
					bounds.x,
					bounds.y,
					bounds.width,
					bounds.height,
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
				bounds.x,
				bounds.y,
				bounds.width,
				bounds.height,
				format,
				type,
				array
			);
			return;
		}

		// Mutable-format.
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				bounds.width,
				bounds.height,
				0,
				array,
				offset,
				length
			);
		} else {
			// Uncompressed format.
			if (typeof offset === "undefined") {
				this.gl.texImage2D(
					target,
					level,
					this.format,
					bounds.width,
					bounds.height,
					0,
					format,
					type,
					array
				);
			} else {
				this.gl.texImage2D(
					target,
					level,
					this.format,
					bounds.width,
					bounds.height,
					0,
					format,
					type,
					array,
					offset
				);
			}
		}

		// Update dimensions.
		this.dims[0] = bounds.width;
		this.dims[1] = bounds.height;
	}
}
