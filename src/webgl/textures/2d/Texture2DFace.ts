import { UNPACK_ALIGNMENT, type TextureFaceTarget, type TextureFormat } from "../../WebGLConstant.js";
import { TextureFaceLevel, type TextureSource } from "../base/TextureFace.js";

/** A level of a face of a 2D texture. */
export class Texture2DFaceLevel extends TextureFaceLevel {
	/**
	 * Creates a level of a texture face.
	 * @param internalFormat The format of the color components in the texture.
	 * @param source The pixel source of the texture.
	 * @param width The width of the texture face level.
	 * @param height The height of the texture face level.
	 */
	public constructor(
		internalFormat: TextureFormat,
		source: TextureSource,
		width?: number,
		height?: number
	) {
		super(internalFormat, source, [width, height]);
	}

	/** The width of this texture face level. */
	public get width(): number {
		return this.dims[0] as number;
	}

	public set width(value: number) {
		this.dims = [value, this.dims[1] as number];
	}

	/** The height of this texture face level. */
	public get height(): number | undefined {
		return this.dims[1];
	}

	public set height(value: number | undefined) {
		this.dims = [this.dims[0], value];
	}

	/**
	 * Updates this texture face level.
	 * @param gl The rendering context of this texture face level.
	 * @param texture The WebGL texture.
	 * @param lod The level of detail of this texture face level.
	 */
	protected override updateInternal(gl: WebGL2RenderingContext, target: TextureFaceTarget, lod: number): void {
		if (this.width && this.height) {
			if (this.height > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			gl.texImage2D(target, lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			gl.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}
	}
}
