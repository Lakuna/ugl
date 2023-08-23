import Mip from "#Mip";
import type { MipSource } from "#MipSource";
import TextureInternalFormat from "#TextureInternalFormat";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";
import { UNPACK_ALIGNMENT } from "#constants";

/** A mip of a 2D texture. */
export default class Texture2dMip extends Mip {
	/**
	 * Creates a mip of a 2D texture.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param width The width of the mip.
	 * @param height The height of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		width?: number,
		height?: number
	) {
		super(source, internalFormat, [width, height]);
	}

	/** The width of this mip. */
	public get width(): number | undefined {
		// TODO: Optional caching.
		return this.dims[0];
	}

	/** The width of this mip. */
	public set width(value: number | undefined) {
		// TODO: Optional caching.
		this.dims = [value, this.dims[1]];
	}

	/** The height of this mip. */
	public get height(): number | undefined {
		// TODO: Optional caching.
		return this.dims[1];
	}

	/** The height of this mip. */
	public set height(value: number | undefined) {
		// TODO: Optional caching.
		this.dims = [this.dims[0], value];
	}

	/**
	 * Updates this texture face level.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected override updateInternal(
		texture: Texture<Texture2dMip>,
		target: MipmapTarget,
		lod: number
	): void {
		// TODO: Optional caching.
		if (this.width && this.height) {
			if (!this.unpackAlignment && this.height > 1) {
				// Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						texture.context.internal.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			texture.context.internal.texImage2D(
				target,
				lod,
				this.internalFormat,
				this.width,
				this.height,
				0,
				this.format,
				this.type,
				this.source as ArrayBufferView
			);
		} else {
			texture.context.internal.texImage2D(
				target,
				lod,
				this.internalFormat,
				this.format,
				this.type,
				this.source as ImageData
			);
		}
	}
}
