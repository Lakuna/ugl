/** Types of data that can be stored in a texture. */
export type TextureData =
	ArrayBuffer
	| ArrayBufferView
	| BufferSource
	| ImageData
	| HTMLImageElement
	| HTMLCanvasElement
	| HTMLVideoElement
	| ImageBitmap;