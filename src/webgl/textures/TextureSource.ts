import type { TypedArray } from "../../index.js";

/** Pixel data sources for textures. */
export type TextureSourceData =
	TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;

/** The source data and parameters of a texture. */
export default class TextureSource {

}
