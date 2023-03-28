import type { TypedArray } from "../../../index.js";
import { TextureFormat, type TextureFaceTarget, TextureDataType } from "../../WebGLConstant.js";

export type TextureSource =
	TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** A face of a texture. */
export default abstract class TextureFace {
	/**
	 * Creates a texture face.
	 * @param levels A map of the levels of the texture face to their level of detail.
	 */
	public constructor(levels: Map<number, TextureFaceLevel>) {
		this.levels = levels;
	}

	/** The source data of each level of this texture face. */
	public levels: Map<number, TextureFaceLevel>;

	/** Whether this texture face is texture complete. */
	public get isTextureComplete(): boolean {
		const baseLevel: TextureFaceLevel | undefined = this.levels.get(0);
		if (!baseLevel) {
			return false;
		}

		const dims: Array<number> = [...baseLevel.dims];

		let lod = 1;
		while (dims.some((dim: number) => dim > 1)) {
			const level: TextureFaceLevel | undefined = this.levels.get(lod);
			if (!level) {
				return false;
			}

			for (let i = 0; i < dims.length; i++) {
				if (Math.floor((dims[i] as number) / 2) == (level.dims[i] as number)) {
					dims[i] = level.dims[i] as number;
				} else {
					return false;
				}
			}

			lod++;
		}

		return true;
	}

	/**
	 * Updates this texture face.
	 * @param texture The WebGL texture.
	 * @param target The target of this this texture face.
	 */
	public update(texture: WebGLTexture, target: TextureFaceTarget): void {
		for (const [lod, level] of this.levels) {
			level.update(texture, target, lod);
		}
	}

	/** Sets all of the levels of this face as outdated. */
	public setAllNeedsUpdate(): void {
		for (const level of this.levels.values()) {
			level.setNeedsUpdate();
		}
	}
}

/** A level of a face of a texture. */
export abstract class TextureFaceLevel {
	/**
	 * Creates a level of a texture face.
	 * @param dims The dimensions of the texture face level.
	 */
	public constructor(
		internalFormat: TextureFormat,
		dims: ReadonlyArray<number>,
		source: TextureSource
	) {
		this.internalFormatPrivate = internalFormat;
		this.dimsPrivate = dims;
		this.sourcePrivate = source;

		this.needsUpdate = true;
	}

	/** The format of the color components in this texture. */
	private internalFormatPrivate: TextureFormat;

	/** The format of the color components in this texture. */
	public get internalFormat(): TextureFormat {
		return this.internalFormatPrivate;
	}

	public set internalFormat(value: TextureFormat) {
		this.internalFormatPrivate = value;
		this.needsUpdate = true;
	}

	/** The dimensions of this texture face level. */
	private dimsPrivate: ReadonlyArray<number>;

	/** The dimensions of this texture face level. */
	public get dims(): ReadonlyArray<number> {
		return this.dimsPrivate;
	}

	public set dims(value: ReadonlyArray<number>) {
		this.dimsPrivate = value;
		this.needsUpdate = true;
	}

	/** The source data of this texture face level. */
	private sourcePrivate: TextureSource;

	/** The source data of this texture face level. */
	public get source(): TextureSource {
		return this.sourcePrivate;
	}

	public set source(value: TextureSource) {
		this.sourcePrivate = value;
		this.needsUpdate = true;
	}

	/** The format of the texel data in this texture face level. */
	private formatPrivate: TextureFormat | undefined;

	/** The format of the texel data in this texture face level. */
	public get format(): TextureFormat {
		if (this.formatPrivate) { return this.formatPrivate; }

		switch (this.internalFormat) {
			case TextureFormat.RGB:
			case TextureFormat.RGB8:
			case TextureFormat.SRGB8:
			case TextureFormat.RGB565:
			case TextureFormat.R11F_G11F_B10F:
			case TextureFormat.RGB9_E5:
			case TextureFormat.RGB16F:
			case TextureFormat.RGB32F:
				return TextureFormat.RGB;
			case TextureFormat.RGBA:
			case TextureFormat.RGBA8:
			case TextureFormat.SRGB8_ALPHA8:
			case TextureFormat.RGB5_A1:
			case TextureFormat.RGB10_A2:
			case TextureFormat.RGBA4:
			case TextureFormat.RGBA16F:
			case TextureFormat.RGBA32F:
				return TextureFormat.RGBA;
			case TextureFormat.LUMINANCE_ALPHA:
				return TextureFormat.LUMINANCE_ALPHA;
			case TextureFormat.LUMINANCE:
				return TextureFormat.LUMINANCE;
			case TextureFormat.ALPHA:
				return TextureFormat.ALPHA;
			case TextureFormat.R8:
			case TextureFormat.R16F:
			case TextureFormat.R32F:
				return TextureFormat.RED;
			case TextureFormat.R8UI:
				return TextureFormat.RED_INTEGER;
			case TextureFormat.RG8:
			case TextureFormat.RG16F:
			case TextureFormat.RG32F:
				return TextureFormat.RG;
			case TextureFormat.RG8UI:
				return TextureFormat.RG_INTEGER;
			case TextureFormat.RGB8UI:
				return TextureFormat.RGB_INTEGER;
			case TextureFormat.RGBA8UI:
				return TextureFormat.RGBA_INTEGER;
			default:
				return this.internalFormat;
		}
	}

	public set format(value: TextureFormat | undefined) {
		this.formatPrivate = value;
		this.needsUpdate = true;
	}

	/** The data type of the components in this texture face level. */
	private typePrivate: TextureDataType | undefined;

	/** The data type of the components in this texture face level. */
	public get type(): TextureDataType {
		if (this.typePrivate) { return this.typePrivate; }

		switch (this.internalFormat) {
			case TextureFormat.RGB:
			case TextureFormat.RGBA:
			case TextureFormat.LUMINANCE_ALPHA:
			case TextureFormat.LUMINANCE:
			case TextureFormat.ALPHA:
			case TextureFormat.R8:
			case TextureFormat.R8UI:
			case TextureFormat.RG8:
			case TextureFormat.RG8UI:
			case TextureFormat.RGB8:
			case TextureFormat.SRGB8:
			case TextureFormat.RGB565:
			case TextureFormat.RGB8UI:
			case TextureFormat.RGBA8:
			case TextureFormat.SRGB8_ALPHA8:
			case TextureFormat.RGB5_A1:
			case TextureFormat.RGBA4:
			case TextureFormat.RGBA8UI:
				return TextureDataType.UNSIGNED_BYTE;
			case TextureFormat.R16F:
			case TextureFormat.R32F:
			case TextureFormat.RG16F:
			case TextureFormat.RG32F:
			case TextureFormat.R11F_G11F_B10F:
			case TextureFormat.RGB9_E5:
			case TextureFormat.RGB16F:
			case TextureFormat.RGB32F:
			case TextureFormat.RGBA16F:
			case TextureFormat.RGBA32F:
				return TextureDataType.FLOAT;
			case TextureFormat.RGB10_A2:
				return TextureDataType.UNSIGNED_INT_2_10_10_10_REV;
			default:
				throw new Error("Unset data type without default for selected format.");
		}
	}

	public set type(value: TextureDataType | undefined) {
		this.typePrivate = value;
		this.needsUpdate = true;
	}

	/** Whether this texture face level requires an update. */
	private needsUpdate: boolean;

	/**
	 * Updates this texture face level.
	 * @param texture The WebGL texture.
	 * @param target The target of this texture face level.
	 * @param lod The level of detail of this texture face level.
	 */
	public update(texture: WebGLTexture, target: TextureFaceTarget, lod: number): void {
		if (!this.needsUpdate) {
			return;
		}

		this.updateInternal(texture, target, lod);

		this.needsUpdate = false;
	}

	/**
	 * Updates this texture face level.
	 * @param texture The WebGL texture.
	 * @param target The target of this texture face level.
	 * @param lod The level of detail of this texture face level.
	 */
	protected abstract updateInternal(texture: WebGLTexture, target: TextureFaceTarget, lod: number): void;

	/** Sets this texture face level as outdated. */
	public setNeedsUpdate(): void {
		this.needsUpdate = true;
	}
}
