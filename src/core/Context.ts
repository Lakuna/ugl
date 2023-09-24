import {
	ACTIVE_TEXTURE,
	TEXTURE0,
	BLEND_COLOR,
	BLEND_EQUATION_RGB,
	BLEND_EQUATION_ALPHA,
	BLEND_SRC_RGB,
	BLEND_SRC_ALPHA,
	BLEND_DST_RGB,
	BLEND_DST_ALPHA,
	COLOR_CLEAR_VALUE,
	DEPTH_CLEAR_VALUE,
	STENCIL_CLEAR_VALUE,
	COLOR_BUFFER_BIT,
	DEPTH_BUFFER_BIT,
	STENCIL_BUFFER_BIT
} from "#constants";
import ApiInterface from "#ApiInterface";
import type { Canvas } from "#Canvas";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type { ExperimentalRawContext } from "#ExperimentalRawContext";
import type Color from "#Color";
import BlendEquation from "#BlendEquation";
import type BlendEquationSet from "#BlendEquationSet";
import type BlendFunctionSet from "#BlendFunctionSet";
import type BlendFunctionFullSet from "#BlendFunctionFullSet";
import type BlendFunction from "#BlendFunction";
import ErrorCode from "#ErrorCode";
import WebglError from "#WebglError";

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
	 * @see [`getContext`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
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

		this.canvas = this.gl.canvas;
	}

	/**
	 * The canvas of this rendering context.
	 * @see [`canvas`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/canvas)
	 */
	public readonly canvas: Canvas;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 * @internal
	 */
	private drawingBufferColorSpaceCache?: PredefinedColorSpace;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public get drawingBufferColorSpace(): PredefinedColorSpace {
		if (typeof this.drawingBufferColorSpaceCache == "undefined") {
			this.drawingBufferColorSpaceCache = this.gl.drawingBufferColorSpace;
		}
		return this.drawingBufferColorSpaceCache;
	}

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public set drawingBufferColorSpace(value: PredefinedColorSpace) {
		if (this.drawingBufferColorSpaceCache == value) {
			return;
		}
		this.gl.drawingBufferColorSpace = value;
		this.drawingBufferColorSpaceCache = value;
	}

	/**
	 * The actual height of the drawing buffer of this rendering context.
	 * @see [`drawingBufferHeight`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferHeight)
	 */
	public get drawingBufferHeight(): number {
		return this.gl.drawingBufferHeight;
	}

	/**
	 * The actual width of the drawing buffer of this rendering context.
	 * @see [`drawingBufferWidth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferWidth)
	 */
	public get drawingBufferWidth(): number {
		return this.gl.drawingBufferWidth;
	}

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 * @internal
	 */
	private unpackColorSpaceCache?: PredefinedColorSpace;

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	public get unpackColorSpace(): PredefinedColorSpace {
		if (typeof this.unpackColorSpaceCache == "undefined") {
			this.unpackColorSpaceCache = (
				this.gl as ExperimentalRawContext
			).unpackColorSpace;
		}
		return this.unpackColorSpaceCache;
	}

	/**
	 * The color space to convert to when importing textures.
	 * @see [`unpackColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace)
	 * @experimental
	 */
	public set unpackColorSpace(value: PredefinedColorSpace) {
		if (this.unpackColorSpaceCache == value) {
			return;
		}
		(this.gl as ExperimentalRawContext).unpackColorSpace = value;
		this.unpackColorSpaceCache = value;
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	private activeTextureCache?: number;

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 */
	public get activeTexture(): number {
		if (typeof this.activeTextureCache == "undefined") {
			this.activeTextureCache = this.gl.getParameter(ACTIVE_TEXTURE) - TEXTURE0;
		}
		return this.activeTextureCache;
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @throws {@link WebglError}
	 */
	public set activeTexture(value: number) {
		// TODO: Ensure that this is between `0` and `MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1`.
		if (this.activeTextureCache == value) {
			return;
		}
		this.gl.activeTexture(value + TEXTURE0);
		this.throwIfError();
		this.activeTextureCache = value;
	}

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 * @internal
	 */
	private blendColorCache?: Color;

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public get blendColor(): Color {
		if (typeof this.blendColorCache == "undefined") {
			this.blendColorCache = this.gl.getParameter(BLEND_COLOR) as Color;
		}
		return this.blendColorCache;
	}

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public set blendColor(value: Color) {
		if (
			typeof this.blendColorCache != "undefined" &&
			this.blendColorCache[0] == value[0] &&
			this.blendColorCache[1] == value[1] &&
			this.blendColorCache[2] == value[2] &&
			this.blendColorCache[3] == value[3]
		) {
			return;
		}
		this.gl.blendColor(value[0], value[1], value[2], value[3]);
		this.blendColorCache = value;
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 * @internal
	 */
	private blendEquationCache?: BlendEquationSet;

	/**
	 * Initializes the blend equation cache.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 * @internal
	 */
	private setBlendEquationCache(): void {
		if (typeof this.blendEquationCache == "undefined") {
			this.blendEquationCache = new Uint8Array([
				this.gl.getParameter(BLEND_EQUATION_RGB),
				this.gl.getParameter(BLEND_EQUATION_ALPHA)
			]) as unknown as BlendEquationSet;
		}
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public get blendEquation(): BlendEquationSet {
		this.setBlendEquationCache();
		return this.blendEquationCache!;
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public set blendEquation(value: BlendEquation | BlendEquationSet) {
		const rgb: BlendEquation = (value as BlendEquationSet)?.[0] ?? value;
		const alpha: BlendEquation = (value as BlendEquationSet)?.[1] ?? value;
		if (
			typeof this.blendEquationCache != "undefined" &&
			this.blendEquationCache[0] == rgb &&
			this.blendEquationCache[1] == alpha
		) {
			return;
		}
		if (rgb == alpha) {
			this.gl.blendEquation(rgb);
		} else {
			this.gl.blendEquationSeparate(rgb, alpha);
		}
		this.blendEquationCache = new Uint8Array([
			rgb,
			alpha
		]) as unknown as BlendEquationSet;
	}

	/**
	 * The RGB blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationRgb(): BlendEquation {
		this.setBlendEquationCache();
		return this.blendEquationCache![0];
	}

	/**
	 * The alpha blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationAlpha(): BlendEquation {
		this.setBlendEquationCache();
		return this.blendEquationCache![1];
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private blendFunctionCache?: BlendFunctionFullSet;

	/**
	 * Initializes the blend function cache.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private setBlendFunctionCache(): void {
		if (typeof this.blendFunctionCache == "undefined") {
			this.blendFunctionCache = new Uint8Array([
				this.gl.getParameter(BLEND_SRC_RGB),
				this.gl.getParameter(BLEND_DST_RGB),
				this.gl.getParameter(BLEND_SRC_ALPHA),
				this.gl.getParameter(BLEND_DST_ALPHA)
			]) as unknown as BlendFunctionFullSet;
		}
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public get blendFunction(): BlendFunctionFullSet {
		this.setBlendFunctionCache();
		return this.blendFunctionCache!;
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @throws {@link WebglError}
	 */
	public set blendFunction(value: BlendFunctionSet | BlendFunctionFullSet) {
		const sourceRgb: BlendFunction = value[0];
		const destinationRgb: BlendFunction = value[1];
		const sourceAlpha: BlendFunction = 2 in value ? value[2] : value[0];
		const destinationAlpha: BlendFunction = 3 in value ? value[3] : value[1];
		if (
			typeof this.blendFunctionCache != "undefined" &&
			this.blendFunctionCache[0] == sourceRgb &&
			this.blendFunctionCache[1] == destinationRgb &&
			this.blendFunctionCache[2] == sourceAlpha &&
			this.blendFunctionCache[3] == destinationAlpha
		) {
			return;
		}
		if (sourceRgb == sourceAlpha && destinationRgb == destinationAlpha) {
			this.gl.blendFunc(sourceRgb, destinationRgb);
		} else {
			this.gl.blendFuncSeparate(
				sourceRgb,
				destinationRgb,
				sourceAlpha,
				destinationAlpha
			);
		}
		this.throwIfError();
		this.blendFunctionCache = new Uint8Array([
			sourceRgb,
			destinationRgb,
			sourceAlpha,
			destinationAlpha
		]) as unknown as BlendFunctionFullSet;
	}

	/**
	 * The source RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceRgb(): BlendFunction {
		this.setBlendFunctionCache();
		return this.blendFunctionCache![0];
	}

	/**
	 * The destination RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationRgb(): BlendFunction {
		this.setBlendFunctionCache();
		return this.blendFunctionCache![1];
	}

	/**
	 * The source alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceAlpha(): BlendFunction {
		this.setBlendFunctionCache();
		return this.blendFunctionCache![2];
	}

	/**
	 * The destination alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationAlpha(): BlendFunction {
		this.setBlendFunctionCache();
		return this.blendFunctionCache![3];
	}

	/**
	 * The most recent WebGL error that has occurred in this context.
	 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
	 */
	public get error(): ErrorCode {
		return this.gl.getError();
	}

	/**
	 * Throws a JavaScript error if a WebGL error has occurred.
	 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
	 * @throws {@link WebglError}
	 */
	public throwIfError(): void {
		const code: ErrorCode = this.error;
		if (code != ErrorCode.NO_ERROR) {
			throw new WebglError(code);
		}
	}

	/**
	 * Clears buffers to their specified preset values.
	 * @param color Whether to clear the color buffer.
	 * @param depth Whether to clear the depth buffer.
	 * @param stencil Whether to clear the stencil buffer.
	 */
	public clear(color?: boolean, depth?: boolean, stencil?: boolean): void;

	/**
	 * Clears buffers to the specified values.
	 * @param color The value to clear the color buffer to.
	 * @param depth The value to clear the depth buffer to.
	 * @param stencil The value to clear the stencil buffer to.
	 */
	public clear(color: Color, depth: number, stencil: number): void;

	public clear(
		color: boolean | Color = true,
		depth: boolean | number = true,
		stencil: boolean | number = true
	): void {
		if (typeof color == "boolean") {
			this.gl.clear(
				(color ? COLOR_BUFFER_BIT : 0) |
					(depth ? DEPTH_BUFFER_BIT : 0) |
					(stencil ? STENCIL_BUFFER_BIT : 0)
			);
			return;
		}

		this.clearColor = color;
		this.clearDepth = depth as number;
		this.clearStencil = stencil as number;
		this.gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT | STENCIL_BUFFER_BIT);
	}

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 * @internal
	 */
	private clearColorCache?: Color;

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public get clearColor(): Color {
		if (typeof this.clearColorCache == "undefined") {
			this.clearColorCache = this.gl.getParameter(COLOR_CLEAR_VALUE);
		}
		return this.clearColorCache!;
	}

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public set clearColor(value: Color) {
		this.gl.clearColor(value[0], value[1], value[2], value[3]);
		this.clearColorCache = value;
	}

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 * @internal
	 */
	private clearDepthCache?: number;

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public get clearDepth(): number {
		if (typeof this.clearDepthCache == "undefined") {
			this.clearDepthCache = this.gl.getParameter(DEPTH_CLEAR_VALUE);
		}
		return this.clearDepthCache!;
	}

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public set clearDepth(value: number) {
		this.gl.clearDepth(value);
		this.clearDepthCache = value;
	}

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 * @internal
	 */
	private clearStencilCache?: number;

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public get clearStencil(): number {
		if (typeof this.clearStencilCache == "undefined") {
			this.clearStencilCache = this.gl.getParameter(STENCIL_CLEAR_VALUE);
		}
		return this.clearStencilCache!;
	}

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public set clearStencil(value: number) {
		this.gl.clearStencil(value);
		this.clearStencilCache = value;
	}
}
