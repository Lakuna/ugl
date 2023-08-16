import Mip from "#Mip";
import type { MipSource } from "#MipSource";
import TextureInternalFormat from "#TextureInternalFormat";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";
import UnsupportedOperationError from "#UnsupportedOperationError";
import { UNPACK_ALIGNMENT } from "#constants";

/** A mip of a 3D texture. */
export default class Texture3dMip extends Mip {
	/**
	 * Creates a mip of a 3D texture.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param width The width of the mip.
	 * @param height The height of the mip.
	 */
	public constructor(
		source: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		width?: number,
		height?: number,
		depth?: number
	) {
		super(source, internalFormat, [width, height, depth]);
	}

	/** The width of this mip. */
	public get width(): number | undefined {
		return this.dims[0];
	}

	/** The width of this mip. */
	public set width(value: number | undefined) {
		this.dims = [value, this.dims[1], this.dims[2]];
	}

	/** The height of this mip. */
	public get height(): number | undefined {
		return this.dims[1];
	}

	/** The height of this mip. */
	public set height(value: number | undefined) {
		this.dims = [this.dims[0], value, this.dims[2]];
	}

	/** The depth of this mip. */
	public get depth(): number | undefined {
		return this.dims[2];
	}

	/** The depth of this mip. */
	public set depth(value: number | undefined) {
		this.dims = [this.dims[0], this.dims[1], value];
	}

	/**
	 * Updates this texture face level.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected override updateInternal(
		texture: Texture<Texture3dMip>,
		target: MipmapTarget,
		lod: number
	): void {
		if (
			typeof this.width == "undefined" ||
			typeof this.height == "undefined" ||
			typeof this.depth == "undefined"
		) {
			throw new UnsupportedOperationError(
				"The dimensions of the texture are not defined."
			);
		}

		if (!this.unpackAlignment && this.height > 1) {
			// Unpack alignment doesn't apply to the last row.
			for (const alignment of [8, 4, 2, 1]) {
				if (this.width % alignment == 0) {
					texture.context.internal.pixelStorei(UNPACK_ALIGNMENT, alignment);
					break;
				}
			}
		}

		texture.context.internal.texImage3D(
			target,
			lod,
			this.internalFormat,
			this.width,
			this.height,
			this.depth,
			0,
			this.format,
			this.type,
			this.source as ArrayBufferView
		);
	}
}
