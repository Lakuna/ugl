import BadValueError from "../../utility/BadValueError.js";
import BufferTarget from "../../constants/BufferTarget.js";
import type Context from "../Context.js";
import Framebuffer from "../Framebuffer.js";
import FramebufferTarget from "../../constants/FramebufferTarget.js";
import type MipmapTarget from "../../constants/MipmapTarget.js";
import type Rectangle from "../../types/Rectangle.js";
import Texture from "./Texture.js";
import type TextureDataFormat from "../../constants/TextureDataFormat.js";
import type TextureDataType from "../../constants/TextureDataType.js";
import type TextureFormat from "../../constants/TextureFormat.js";
import TextureTarget from "../../constants/TextureTarget.js";
import type Vbo from "../buffers/Vbo.js";
import isTextureDataFormatCompressed from "../../utility/internal/isTextureDataFormatCompressed.js";

/**
 * A two-dimensional texture.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture | WebGLTexture}
 * @public
 */
export default class Texture2d extends Texture {
	/**
	 * Create a two-dimensional texture from the data in the image at the given URL.
	 * @param context - The rendering context of the texture.
	 * @param url - The URL of the image.
	 * @returns The texture.
	 */
	public static fromImageUrl(context: Context, url: string): Texture2d {
		// Create a new 2D texture.
		const out = new Texture2d(context);

		// Fill it with one magenta texel until the image loads.
		out.setMip(
			new Uint8Array([0xff, 0x00, 0xff, 0xff]),
			0,
			void 0,
			[0, 0, 1, 1]
		);

		// Load the image.
		const image = new Image();
		image.addEventListener("load", () => {
			out.setMip(image);
		});
		image.crossOrigin = ""; // CORS
		image.src = url;

		return out;
	}

	/**
	 * Create a two-dimensional texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError} if a texture cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture | createTexture}
	 */
	public constructor(context: Context);

	/**
	 * Create a two-dimensional texture with a fixed size. This has better performance than a variable-sized texture.
	 * @param context - The rendering context of the texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param width - The width of the texture.
	 * @param height - The height of the texture.
	 * @throws {@link UnsupportedOperationError} if a texture cannot be created.
	 * @throws {@link TextureFormatError} if the given format is unsized.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture | createTexture}
	 */
	public constructor(
		context: Context,
		levels: number,
		format: TextureFormat,
		width: number,
		height: number
	);

	public constructor(
		context: Context,
		levels?: number,
		format?: TextureFormat,
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
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D | texStorage2D}
	 * @internal
	 */
	protected override makeImmutableFormatInternal(
		levels: number,
		format: TextureFormat,
		dims: [number, number]
	) {
		this.gl.texStorage2D(this.target, levels, format, dims[0], dims[1]);
	}

	/**
	 * Copy the data in a framebuffer into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param framebuffer - The framebuffer to copy into the mip, or `null` for the default framebuffer.
	 * @param area - The area of the framebuffer to copy into the mip.
	 * @throws {@link BadValueError} if the area that is being updated is too small to contain the selected portion of the framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexSubImage2D | copyTexSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/copyTexImage2D | copyTexImage2D}
	 * @internal
	 */
	protected override setMipFromFramebuffer(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds?: Rectangle,
		framebuffer?: Framebuffer | null,
		area?: Rectangle
	) {
		const mipDims = this.getSizeOfMip(level);

		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		const width = bounds?.[2] ?? mipDims[0] ?? 1;
		const height = bounds?.[3] ?? mipDims[1] ?? 1;

		const frameX = area?.[0] ?? 0;
		const frameY = area?.[1] ?? 0;
		const frameWidth = area?.[2] ?? width;
		const frameHeight = area?.[3] ?? height;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameWidth * frameHeight > width * height) {
			throw new BadValueError("Bounds are too small.");
		}

		// Bind the framebuffer.
		if (typeof framebuffer === "undefined" || framebuffer === null) {
			Framebuffer.unbindGl(this.gl, FramebufferTarget.READ_FRAMEBUFFER);
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
		this.setWidth(frameWidth);
		this.setHeight(frameHeight);
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D | compressedTexSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D | texSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D | compressedTexImage[23]D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D | texImage2D}
	 * @internal
	 */
	protected override setMipFromBuffer(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle,
		format: TextureDataFormat,
		type: TextureDataType,
		buffer: Vbo,
		size: number,
		offset: number
	): void {
		const isCompressed = isTextureDataFormatCompressed(format);

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
		this.setWidth(bounds[2]);
		this.setHeight(bounds[3]);
	}

	/**
	 * Copy data into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param format - The format of the data.
	 * @param type - The type of the data.
	 * @param data - The data to copy into the mip.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D | texSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D | texImage2D}
	 * @internal
	 */
	protected override setMipFromData(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle | undefined,
		format: TextureDataFormat,
		type: TextureDataType,
		data?: TexImageSource
	): void {
		const x = bounds?.[0] ?? 0;
		const y = bounds?.[1] ?? 0;
		// https://caniuse.com/mdn-api_videoframe
		// `const width = bounds?.[2] ?? (data instanceof VideoFrame ? data.codedWidth : (data?.width ?? 1));`
		// `const height = bounds?.[3] ?? (data instanceof VideoFrame ? data.codedHeight : (data?.height ?? 1));`
		const width =
			bounds?.[2] ??
			(data as HTMLImageElement | undefined)?.width ??
			this.getSizeOfMip(level)[0] ??
			1;
		const height =
			bounds?.[3] ??
			(data as HTMLImageElement | undefined)?.height ??
			this.getSizeOfMip(level)[1] ??
			1;

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
				(data ?? null) as unknown as TexImageSource // Cheat the overloads to make the code less verbose.
			);
			return;
		}

		// Mutable-format.
		if (typeof bounds === "undefined" && typeof data !== "undefined") {
			// Undefined bounds. Resize to match data.
			this.gl.texImage2D(target, level, this.format, format, type, data);
		} else {
			// Defined bounds. Resize to match bounds.
			this.gl.texImage2D(
				target,
				level,
				this.format,
				width,
				height,
				0,
				format,
				type,
				(data ?? null) as unknown as TexImageSource // Cheat the overloads to make the code less verbose.
			);
		}

		// Update dimensions.
		this.setWidth(width);
		this.setHeight(height);
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexSubImage2D | compressedTexSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texSubImage2D | texSubImage2D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compressedTexImage2D | compressedTexImage[23]D}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D | texImage2D}
	 * @internal
	 */
	protected override setMipFromArray(
		target: MipmapTarget.TEXTURE_2D,
		level: number,
		bounds: Rectangle,
		format: TextureDataFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	): void {
		const isCompressed = isTextureDataFormatCompressed(format);

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
		this.setWidth(bounds[2]);
		this.setHeight(bounds[3]);
	}
}
