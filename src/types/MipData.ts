import type Framebuffer from "#Framebuffer";
import type { TypedArray } from "#TypedArray";

export type MipData =
	| TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap
	| Framebuffer
	| undefined
	| null;
