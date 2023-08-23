import type { MipSource } from "#MipSource";
import TextureInternalFormat from "#TextureInternalFormat";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";
import TextureBaseFormat from "#TextureBaseFormat";
import UnsupportedOperationError from "#UnsupportedOperationError";
import TextureDataType from "#TextureDataType";
import { UNPACK_ALIGNMENT } from "#constants";

/** A version of a texture used for rendering at different sizes. */
export default abstract class Mip {
	/**
	 * Creates a mip.
	 * @param source The pixel source of the mip.
	 * @param internalFormat The format of the color components in the mip.
	 * @param dims The dimensions of the mip.
	 */
	public constructor(
		source?: MipSource,
		internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
		dims: Array<number | undefined> = []
	) {
		this.sourcePrivate = source;
		this.internalFormatPrivate = internalFormat;
		this.dimsPrivate = dims;

		this.needsUpdate = true;
	}

	/** The texture of this mip. */
	private texturePrivate?: Texture<Mip>;

	/** The texture of this mip. */
	public get texture(): Texture<Mip> | undefined {
		return this.texturePrivate;
	}

	/** The target of this mip. */
	private targetPrivate?: MipmapTarget;

	/** The target of this mip. */
	public get target(): MipmapTarget | undefined {
		return this.targetPrivate;
	}

	/** The level of detail of this mip. */
	private lodPrivate?: number;

	/** The level of detail of this mip. */
	public get lod(): number | undefined {
		return this.lodPrivate;
	}

	/** The source data of this mip. */
	private sourcePrivate: MipSource;

	/** The source data of this mip. */
	public get source(): MipSource {
		return this.sourcePrivate;
	}

	/** The source data of this mip. */
	public set source(value: MipSource) {
		this.sourcePrivate = value;
		this.needsUpdate = true;
	}

	/** The unpack alignment of this mip. */
	public unpackAlignment?: 1 | 2 | 4 | 8;

	/** The format of the color components in this mip. */
	private internalFormatPrivate: TextureInternalFormat;

	/** The format of the color components in this mip. */
	public get internalFormat(): TextureInternalFormat {
		return this.internalFormatPrivate;
	}

	/** The format of the color components in this mip. */
	public set internalFormat(value: TextureInternalFormat) {
		this.internalFormatPrivate = value;
		this.needsUpdate = true;
	}

	/** The dimensions of this mip. */
	private dimsPrivate: ReadonlyArray<number | undefined>;

	/** The dimensions of this mip. */
	public get dims(): ReadonlyArray<number | undefined> {
		return this.dimsPrivate;
	}

	/** The dimensions of this mip. */
	public set dims(value: ReadonlyArray<number | undefined>) {
		this.dimsPrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the texel data in this mip. */
	private formatPrivate: TextureBaseFormat | undefined;

	/** The format of the texel data in this mip. */
	public get format(): TextureBaseFormat {
		if (this.formatPrivate) {
			return this.formatPrivate;
		}

		switch (this.internalFormat) {
			case TextureInternalFormat.RGB:
			case TextureInternalFormat.RGB8:
			case TextureInternalFormat.SRGB8:
			case TextureInternalFormat.RGB565:
			case TextureInternalFormat.R11F_G11F_B10F:
			case TextureInternalFormat.RGB9_E5:
			case TextureInternalFormat.RGB16F:
			case TextureInternalFormat.RGB32F:
				return TextureBaseFormat.RGB;
			case TextureInternalFormat.RGBA:
			case TextureInternalFormat.RGBA8:
			case TextureInternalFormat.SRGB8_ALPHA8:
			case TextureInternalFormat.RGB5_A1:
			case TextureInternalFormat.RGB10_A2:
			case TextureInternalFormat.RGBA4:
			case TextureInternalFormat.RGBA16F:
			case TextureInternalFormat.RGBA32F:
				return TextureBaseFormat.RGBA;
			case TextureInternalFormat.LUMINANCE_ALPHA:
				return TextureBaseFormat.LUMINANCE_ALPHA;
			case TextureInternalFormat.LUMINANCE:
				return TextureBaseFormat.LUMINANCE;
			case TextureInternalFormat.ALPHA:
				return TextureBaseFormat.ALPHA;
			case TextureInternalFormat.R8:
			case TextureInternalFormat.R16F:
			case TextureInternalFormat.R32F:
				return TextureBaseFormat.RED;
			case TextureInternalFormat.R8UI:
				return TextureBaseFormat.RED_INTEGER;
			case TextureInternalFormat.RG8:
			case TextureInternalFormat.RG16F:
			case TextureInternalFormat.RG32F:
				return TextureBaseFormat.RG;
			case TextureInternalFormat.RG8UI:
				return TextureBaseFormat.RG_INTEGER;
			case TextureInternalFormat.RGB8UI:
				return TextureBaseFormat.RGB_INTEGER;
			case TextureInternalFormat.RGBA8UI:
				return TextureBaseFormat.RGBA_INTEGER;
			case TextureInternalFormat.DEPTH_COMPONENT16:
			case TextureInternalFormat.DEPTH_COMPONENT24:
			case TextureInternalFormat.DEPTH_COMPONENT32F:
				return TextureBaseFormat.DEPTH_COMPONENT;
			case TextureInternalFormat.DEPTH24_STENCIL8:
			case TextureInternalFormat.DEPTH32F_STENCIL8:
				return TextureBaseFormat.DEPTH_STENCIL;
			default:
				throw new UnsupportedOperationError(
					"No default format exists for the specified internal format."
				);
		}
	}

	/** The format of the texel data in this mip. */
	public set format(value: TextureBaseFormat | undefined) {
		this.formatPrivate = value;
		this.needsUpdate = true;
	}

	/** The data type of the components in this mip. */
	private typePrivate: TextureDataType | undefined;

	/** The data type of the components in this mip. */
	public get type(): TextureDataType {
		if (this.typePrivate) {
			return this.typePrivate;
		}

		switch (this.internalFormat) {
			case TextureInternalFormat.RGB:
			case TextureInternalFormat.RGBA:
			case TextureInternalFormat.LUMINANCE_ALPHA:
			case TextureInternalFormat.LUMINANCE:
			case TextureInternalFormat.ALPHA:
			case TextureInternalFormat.R8:
			case TextureInternalFormat.R8UI:
			case TextureInternalFormat.RG8:
			case TextureInternalFormat.RG8UI:
			case TextureInternalFormat.RGB8:
			case TextureInternalFormat.SRGB8:
			case TextureInternalFormat.RGB565:
			case TextureInternalFormat.RGB8UI:
			case TextureInternalFormat.RGBA8:
			case TextureInternalFormat.SRGB8_ALPHA8:
			case TextureInternalFormat.RGB5_A1:
			case TextureInternalFormat.RGBA4:
			case TextureInternalFormat.RGBA8UI:
				return TextureDataType.UNSIGNED_BYTE;
			case TextureInternalFormat.R16F:
			case TextureInternalFormat.R32F:
			case TextureInternalFormat.RG16F:
			case TextureInternalFormat.RG32F:
			case TextureInternalFormat.R11F_G11F_B10F:
			case TextureInternalFormat.RGB9_E5:
			case TextureInternalFormat.RGB16F:
			case TextureInternalFormat.RGB32F:
			case TextureInternalFormat.RGBA16F:
			case TextureInternalFormat.RGBA32F:
			case TextureInternalFormat.DEPTH_COMPONENT32F:
				return TextureDataType.FLOAT;
			case TextureInternalFormat.RGB10_A2:
				return TextureDataType.UNSIGNED_INT_2_10_10_10_REV;
			case TextureInternalFormat.DEPTH_COMPONENT16:
			case TextureInternalFormat.DEPTH_COMPONENT24:
				return TextureDataType.UNSIGNED_INT;
			case TextureInternalFormat.DEPTH24_STENCIL8:
				return TextureDataType.UNSIGNED_INT_24_8;
			case TextureInternalFormat.DEPTH32F_STENCIL8:
				return TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV;
			default:
				throw new UnsupportedOperationError(
					"No default type exists for the specified internal format."
				);
		}
	}

	/** The data type of the components in this mip. */
	public set type(value: TextureDataType | undefined) {
		this.typePrivate = value;
		this.needsUpdate = true;
	}

	/** Whether this mip requires an update. */
	private needsUpdate: boolean;

	/**
	 * Updates this mip.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 * @returns Whether an update was performed.
	 */
	public update(
		texture: Texture<Mip>,
		target: MipmapTarget,
		lod: number
	): boolean {
		if (!this.needsUpdate) {
			return false;
		}

		if (this.unpackAlignment) {
			texture.context.internal.pixelStorei(
				UNPACK_ALIGNMENT,
				this.unpackAlignment
			);
		}

		this.updateInternal(texture, target, lod);

		this.needsUpdate = false;

		this.texturePrivate = texture;
		this.targetPrivate = target;
		this.lodPrivate = lod;

		return true;
	}

	/**
	 * Updates this mip.
	 * @param texture The texture of this mip.
	 * @param target The target of this mip.
	 * @param lod The level of detail of this mip.
	 */
	protected abstract updateInternal(
		texture: Texture<Mip>,
		target: MipmapTarget,
		lod: number
	): void;

	/** Sets this mip as outdated. */
	public setNeedsUpdate(): void {
		this.needsUpdate = true;
	}
}
