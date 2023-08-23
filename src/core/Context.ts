import { ACTIVE_TEXTURE, TEXTURE0 } from "#constants";
import ApiInterface from "#ApiInterface";
import type { Canvas } from "#Canvas";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * A WebGL2 rendering context.
 * @see [`WebGL2RenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
 */
export default class Context extends ApiInterface {
	/**
	 * Creates a wrapper for a WebGL2 rendering context.
	 * @param gl The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Creates a WebGL2 rendering context.
	 * @param canvas The canvas of the rendering context.
	 * @throws {@link UnsupportedOperationError} if the environment does not
	 * support WebGL2.
	 */
	public constructor(canvas: Canvas, options?: WebGLContextAttributes);

	public constructor(
		source: WebGL2RenderingContext | Canvas,
		options?: WebGLContextAttributes
	) {
		if (source instanceof WebGL2RenderingContext) {
			super(source);
		} else {
			const gl: WebGL2RenderingContext | null = source.getContext(
				"webgl2",
				options
			) as WebGL2RenderingContext | null;
			if (gl == null) {
				throw new UnsupportedOperationError(
					"The environment does not support WebGL2."
				);
			}
			super(gl);
		}

		this.canvas = this.api.canvas;
	}

	/** The canvas of this rendering context. */
	public readonly canvas: Canvas;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	private drawingBufferColorSpaceCache?: PredefinedColorSpace;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public get drawingBufferColorSpace(): PredefinedColorSpace {
		if (typeof this.drawingBufferColorSpaceCache == "undefined") {
			this.drawingBufferColorSpaceCache = this.api.drawingBufferColorSpace;
		}
		return this.drawingBufferColorSpaceCache;
	}

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public set drawingBufferColorSpace(value: PredefinedColorSpace) {
		this.api.drawingBufferColorSpace = value;
		this.drawingBufferColorSpaceCache = value;
	}

	/**
	 * The actual height of the drawing buffer of this rendering context.
	 * @see [`drawingBufferHeight`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferHeight)
	 */
	public get drawingBufferHeight(): number {
		return this.api.drawingBufferHeight;
	}

	/**
	 * The actual width of the drawing buffer of this rendering context.
	 * @see [`drawingBufferWidth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferWidth)
	 */
	public get drawingBufferWidth(): number {
		return this.api.drawingBufferWidth;
	}

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	private unpackColorSpaceCache?: PredefinedColorSpace;

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	public get unpackColorSpace(): PredefinedColorSpace {
		if (typeof this.unpackColorSpaceCache == "undefined") {
			this.unpackColorSpaceCache = this.api.unpackColorSpace;
		}
		return this.unpackColorSpaceCache;
	}

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	public set unpackColorSpace(value: PredefinedColorSpace) {
		this.api.unpackColorSpace = value;
		this.unpackColorSpaceCache = value;
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 */
	private activeTextureCache?: number;

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 */
	public get activeTexture(): number {
		if (typeof this.activeTextureCache == "undefined") {
			this.activeTextureCache =
				this.api.getParameter(ACTIVE_TEXTURE) - TEXTURE0;
		}
		return this.activeTextureCache;
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 */
	public set activeTexture(value: number) {
		this.api.activeTexture(value + TEXTURE0);
		this.activeTextureCache = value;
	}
}
