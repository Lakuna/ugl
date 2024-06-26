import { BACK, COLOR_ATTACHMENT0, NONE } from "#constants";
import type Buffer from "#Buffer";
import BufferTarget from "#BufferTarget";
import type Context from "#Context";
import Framebuffer from "#Framebuffer";
import FramebufferTarget from "#FramebufferTarget";
import MipmapTarget from "#MipmapTarget";
import type Rectangle from "#Rectangle";
import Texture from "#Texture";
import type TextureDataType from "#TextureDataType";
import type TextureFormat from "#TextureFormat";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import TextureTarget from "#TextureTarget";
import isTextureFormatCompressed from "#isTextureFormatCompressed";

/** A two-dimensional texture. */
export default class Texture2d extends Texture {
	/**
	 * Creates a two-dimensional texture from the data in the image at the given URL.
	 * @param context - The rendering context of the texture.
	 * @param url - The URL of the image.
	 * @returns The texture.
	 */
	public static fromImageUrl(context: Context, url: string): Texture2d {
		// Create a new 2D texture.
		const out: Texture2d = new Texture2d(context);

		// Fill it with one magenta texel until the image loads.
		out.setMip(
			MipmapTarget.TEXTURE_2D,
			0,
			new Uint8Array([0xff, 0x00, 0xff, 0xff])
		);

		// Load the image.
		const image: HTMLImageElement = new Image();
		image.addEventListener("load", () => {
			out.setMip(MipmapTarget.TEXTURE_2D, 0, image);
		});
		image.crossOrigin = ""; // CORS
		image.src = url;

		return out;
	}

	/**
	 * Creates a two-dimensional texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Creates a two-dimensional texture with a fixed size. This has better
	 * performance than a variable-sized texture.
	 * @param context - The rendering context of the texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param width - The width of the texture.
	 * @param height - The height of the texture.
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
		dims: [number, number]
	): void {
		this.gl.texStorage2D(this.target, levels, format, dims[0], dims[1]);
	}

	protected override setMipFromFramebuffer(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle | undefined,
		framebuffer: Framebuffer | undefined,
		area: Rectangle | undefined,
		readBuffer: number | boolean | undefined
	): void {
		const mipDims: number[] = this.getSizeOfMip(level);

		const x: number = bounds?.[0] ?? 0;
		const y: number = bounds?.[1] ?? 0;
		const width: number = bounds?.[2] ?? mipDims[0] ?? 1;
		const height: number = bounds?.[3] ?? mipDims[1] ?? 1;

		const frameX: number = area?.[0] ?? 0;
		const frameY: number = area?.[1] ?? 0;
		const frameWidth: number = area?.[2] ?? width;
		const frameHeight: number = area?.[3] ?? height;

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
		this.dims[0] = frameWidth;
		this.dims[1] = frameHeight;
	}

	protected override setMipFromBuffer(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle,
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
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
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
				bounds[2],
				bounds[3],
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
	}

	protected override setMipFromData(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	): void {
		const x: number = bounds?.[0] ?? 0;
		const y: number = bounds?.[1] ?? 0;
		const width: number =
			bounds?.[2] ??
			(data instanceof VideoFrame ? data.codedWidth : data.width);
		const height: number =
			bounds?.[3] ??
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
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle,
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
		if (isCompressed) {
			// Compressed format.
			this.gl.compressedTexImage2D(
				target,
				level,
				this.format,
				bounds[2],
				bounds[3],
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
				bounds[2],
				bounds[3],
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
				bounds[2],
				bounds[3],
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
	}
}
