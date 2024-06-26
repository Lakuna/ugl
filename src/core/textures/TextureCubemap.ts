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

/** A cube mapped texture. */
export default class TextureCubemap extends Texture {
	/**
	 * Creates a cube mapped texture from the data in the images at the given URLs.
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
	): TextureCubemap {
		// Create a new cube mapped texture.
		const out: TextureCubemap = new TextureCubemap(context);

		// Fill each face with one magenta texel until the image loads.
		const magenta: Uint8Array = new Uint8Array([0xff, 0x00, 0xff, 0xff]);
		out.setMip(
			MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X,
			0,
			magenta,
			[0, 0, 1, 1]
		);
		out.setMip(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, magenta);
		out.setMip(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, magenta);
		out.setMip(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, magenta);
		out.setMip(MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, magenta);
		out.setMip(MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, magenta);

		// Load the images.
		const loadedImages: Map<MipmapTarget, HTMLImageElement> = new Map<
			MipmapTarget,
			HTMLImageElement
		>();
		for (const [target, url] of [
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X, px],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, nx],
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, py],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, ny],
			[MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, pz],
			[MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, nz]
		] as [MipmapTarget, string][]) {
			const image: HTMLImageElement = new Image();
			image.addEventListener("load", () => {
				loadedImages.set(target, image);

				// Switch out the sources only after all of the images are loaded so that face sizes remain consistent.
				if (loadedImages.size >= 6) {
					for (const [otherTarget, otherImage] of loadedImages) {
						out.setMip(otherTarget, 0, otherImage);
					}
				}
			});
			image.crossOrigin = ""; // CORS
			image.src = url;
		}

		return out;
	}

	/**
	 * Creates a cube mapped texture.
	 * @param context - The rendering context of the texture.
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context);

	/**
	 * Creates a cube mapped texture with a fixed size. This has better
	 * performance than a variable-sized texture.
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
		dims: [number]
	): void {
		this.gl.texStorage2D(this.target, levels, format, dims[0], dims[0]);
	}

	protected override setMipFromFramebuffer(
		target:
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_X
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Y
			| MipmapTarget.TEXTURE_CUBE_MAP_POSITIVE_Z,
		level: number,
		bounds: Rectangle | undefined,
		framebuffer: Framebuffer | undefined,
		area: Rectangle | undefined,
		readBuffer: number | boolean | undefined
	): void {
		const mipDims: number[] = this.getSizeOfMip(level);

		const x: number = bounds?.[0] ?? 0;
		const y: number = bounds?.[1] ?? 0;
		const dim: number = bounds?.[2] ?? mipDims[0] ?? 1;

		const frameX: number = area?.[0] ?? 0;
		const frameY: number = area?.[1] ?? 0;
		const frameDim: number = area?.[2] ?? dim;

		// Ensure that the area being copied is no larger than the area being written to.
		if (frameDim > dim) {
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

	protected override setMipFromBuffer(
		target: MipmapTarget,
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

	protected override setMipFromData(
		target: MipmapTarget,
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
		const dim: number = Math.max(width, height);
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

		// Update dimensions.
		this.dims[0] = dim;
	}

	protected override setMipFromArray(
		target: MipmapTarget,
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
