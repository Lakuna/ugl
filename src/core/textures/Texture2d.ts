import Texture from "#Texture";
import TextureTarget from "#TextureTarget";
import type Context from "#Context";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import type MipmapTarget from "#MipmapTarget";
import type { MipData } from "#MipData";
import type TextureFormat from "#TextureFormat";
import type TextureDataType from "#TextureDataType";
import type Box from "#Box";
import Framebuffer from "#Framebuffer";
import type { DangerousExposedFramebuffer } from "#DangerousExposedFramebuffer";
import FramebufferTarget from "#FramebufferTarget";
import isTextureFormatCompressed from "#isTextureFormatCompressed";
import Buffer from "#Buffer";
import type { DangerousExposedBuffer } from "#DangerousExposedBuffer";
import BufferTarget from "#BufferTarget";

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

	/**
	 * Sets the data in a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param data The data to fill the mip with.
	 * @param format The format of the given data. Must be compatible with the
	 * format of the texture.
	 * @param type The type of the given data. Must be compatible with the
	 * format of the given data.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @internal
	 */
	protected override setMipInternal(
		target: MipmapTarget,
		level: number,
		data: MipData,
		format: TextureFormat,
		type: TextureDataType,
		bounds?: Box
	): void {
		const x: number = bounds?.x ?? 0;
		const y: number = bounds?.y ?? 0;
		const width: number = bounds?.width ?? 0;
		const height: number = bounds?.height ?? 0;

		// Immutable-format or bounds exist and fall within the current dimensions.
		if (
			this.isImmutableFormat ||
			(typeof bounds !== "undefined" &&
				x + width <= (this.dims[0] ?? 0) &&
				y + height <= (this.dims[1] ?? 0))
		) {
			// Copy from framebuffer.
			const dataIsFramebuffer = data instanceof Framebuffer;
			if (dataIsFramebuffer || (data && "framebuffer" in data)) {
				let framebuffer: DangerousExposedFramebuffer | undefined;
				let xOffset = 0;
				let yOffset = 0;
				if (dataIsFramebuffer) {
					framebuffer = data as DangerousExposedFramebuffer;
				} else {
					framebuffer = data.framebuffer as DangerousExposedFramebuffer;
					xOffset = data.x;
					yOffset = data.y;
				}

				framebuffer.target = FramebufferTarget.READ_FRAMEBUFFER;
				framebuffer.bind();
				this.gl.copyTexSubImage2D(
					target,
					level,
					xOffset,
					yOffset,
					x,
					y,
					width,
					height
				);
				return;
			}

			// Compressed-format.
			const dataIsBuffer = data instanceof Buffer;
			if (isTextureFormatCompressed(format)) {
				if (dataIsBuffer || (data && "buffer" in data && "offset" in data)) {
					let buffer: DangerousExposedBuffer | undefined;
					let offset = 0;
					let size = 0;
					if (dataIsBuffer) {
						buffer = data as DangerousExposedBuffer;
						size = buffer.size; // If not specified, copy the entire buffer.
					} else {
						buffer = data.buffer as DangerousExposedBuffer;
						offset = data.offset;
						size = data.size;
					}

					buffer.target = BufferTarget.PIXEL_UNPACK_BUFFER;
					buffer.bind();

					this.gl.compressedTexSubImage2D(
						target,
						level,
						x,
						y,
						width,
						height,
						format,
						size,
						offset
					);
				}

				// TODO: Parameters for `srcOffset` and `srcLengthOverride`. Consider expanding `OffsetBuffer` to include `TypedArray` (etc.) sources or just add more parameters.
				this.gl.compressedTexSubImage2D(
					target,
					level,
					x,
					y,
					width,
					height,
					format,
					data as ArrayBufferView
				);
			}

			// Uncompressed-format.
			// TODO
			return;
		}

		// Mutable-format.
		// TODO

		throw new Error(
			`${typeof target} ${typeof level} ${typeof format} ${typeof type} ${typeof bounds}}`
		);
	}
}
