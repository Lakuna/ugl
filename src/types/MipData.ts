import type { TypedArray } from "#TypedArray";

export type MipData =
	| TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap
	| undefined
	| null;
