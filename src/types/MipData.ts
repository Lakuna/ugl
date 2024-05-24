import type Buffer from "#Buffer";
import type Framebuffer from "#Framebuffer";
import type OffsetBuffer from "#OffsetBuffer";
import type OffsetFramebuffer from "#OffsetFramebuffer";
import type { TypedArray } from "#TypedArray";

export type MipData =
	| ArrayBufferView
	| ArrayBuffer
	| DataView
	| TypedArray
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap
	| Buffer
	| OffsetBuffer
	| Framebuffer
	| OffsetFramebuffer
	| undefined
	| null;
