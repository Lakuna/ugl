import { TextureFilter, TextureWrapFunction, type TextureTarget, TextureFaceTarget } from "../../WebGLConstant.js";
import Texture from "../base/Texture.js";
import type TextureFace from "../base/TextureFace.js";
import type { Texture2DFaceLevel } from "./Texture2DFace.js";

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
			new Map([[TextureFaceTarget.TEXTURE_2D, face]]),
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
