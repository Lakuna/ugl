import type { TypedArray } from "#TypedArray";

/** Pixel data sources for mips. */
export type MipSource =
    TypedArray
    | ImageData
    | HTMLImageElement
    | HTMLCanvasElement
    | HTMLVideoElement
    | ImageBitmap
    | undefined
    | null;
