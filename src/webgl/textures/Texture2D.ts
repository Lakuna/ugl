import { TextureFilter, TextureWrapFunction, type TextureTarget, TextureFaceTarget, TextureFormat, UNPACK_ALIGNMENT } from "../WebGLConstant.js";
import Texture, { TextureFace, TextureFaceLevel, type TextureSource } from "./Texture.js";

/** A 2D texture. */
export default class Texture2D extends Texture<Texture2DFaceLevel> {
	/**
	 * Creates a 2D texture.
	 * @param gl The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param face The face of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture across the T-axis.
	 */
	public constructor(
		gl: WebGL2RenderingContext,
		target: TextureTarget,
		face: TextureFace<Texture2DFaceLevel>,
		magFilter: TextureFilter = TextureFilter.NEAREST,
		minFilter: TextureFilter = TextureFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		super(
			gl,
			target,
			new Map([
				[TextureFaceTarget.TEXTURE_2D, face]
			]),
			magFilter,
			minFilter,
			wrapSFunction,
			wrapTFunction
		);
	}

	/** The face of this texture. */
	public get face(): TextureFace<Texture2DFaceLevel> {
		return this.faces.get(TextureFaceTarget.TEXTURE_2D) as TextureFace<Texture2DFaceLevel>;
	}

	public set face(value: TextureFace<Texture2DFaceLevel>) {
		this.faces.set(TextureFaceTarget.TEXTURE_2D, value);
	}
}

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
