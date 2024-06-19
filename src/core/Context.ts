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
	STENCIL_BUFFER_BIT,
	COLOR_WRITEMASK,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS,
	UNPACK_ALIGNMENT,
	CULL_FACE,
	CULL_FACE_MODE,
	DEPTH_TEST,
	DEPTH_FUNC,
	BLEND
} from "#constants";
import ApiInterface from "#ApiInterface";
import type { Canvas } from "#Canvas";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type Color from "#Color";
import BlendEquation from "#BlendEquation";
import type BlendEquationSet from "#BlendEquationSet";
import type BlendFunctionSet from "#BlendFunctionSet";
import type BlendFunctionFullSet from "#BlendFunctionFullSet";
import type BlendFunction from "#BlendFunction";
import ErrorCode from "#ErrorCode";
import WebglError from "#WebglError";
import type ColorMask from "#ColorMask";
import BadValueError from "#BadValueError";
import type PolygonDirection from "#PolygonDirection";
import type TestFunction from "#TestFunction";

/**
 * A WebGL2 rendering context.
 * @see [`WebGL2RenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
 */
export default class Context extends ApiInterface {
	/**
	 * Creates a wrapper for a WebGL2 rendering context.
	 * @param gl - The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Creates a WebGL2 rendering context.
	 * @param canvas - The canvas of the rendering context.
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
			const gl: RenderingContext | null = source.getContext("webgl2", options);
			if (gl === null) {
				throw new UnsupportedOperationError(
					"The environment does not support WebGL2."
				);
			}
			// This is necessary because TypeDoc incorrectly identifies `gl` as a `RenderingContext`.
			if (!(gl instanceof WebGL2RenderingContext)) {
				throw new UnsupportedOperationError();
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
	private drawingBufferColorSpaceCache: PredefinedColorSpace | undefined;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public get drawingBufferColorSpace(): PredefinedColorSpace {
		return (this.drawingBufferColorSpaceCache ??=
			this.gl.drawingBufferColorSpace);
	}

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public set drawingBufferColorSpace(value: PredefinedColorSpace) {
		if (this.drawingBufferColorSpaceCache === value) {
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
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	private activeTextureCache: number | undefined;

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	public get activeTexture(): number {
		return (this.activeTextureCache ??=
			this.gl.getParameter(ACTIVE_TEXTURE) - TEXTURE0);
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	public set activeTexture(value: number) {
		if (this.activeTextureCache === value) {
			return;
		}

		if (value < 0 || value >= this.maxCombinedTextureImageUnits) {
			throw new BadValueError();
		}

		this.gl.activeTexture(value + TEXTURE0);
		this.activeTextureCache = value;
	}

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 * @internal
	 */
	private blendColorCache: Color | undefined;

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public get blendColor(): Color {
		return (this.blendColorCache ??= this.gl.getParameter(
			BLEND_COLOR
		) as Color);
	}

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public set blendColor(value: Color) {
		if (
			typeof this.blendColorCache !== "undefined" &&
			this.blendColorCache[0] === value[0] &&
			this.blendColorCache[1] === value[1] &&
			this.blendColorCache[2] === value[2] &&
			this.blendColorCache[3] === value[3]
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
	private blendEquationCache: BlendEquationSet | undefined;

	/**
	 * Creates the blend equation cache.
	 * @returns The blend equation cache.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 * @internal
	 */
	private makeBlendEquationCache(): BlendEquationSet {
		return new Uint8Array([
			this.gl.getParameter(BLEND_EQUATION_RGB),
			this.gl.getParameter(BLEND_EQUATION_ALPHA)
		]) as unknown as BlendEquationSet;
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public get blendEquation(): BlendEquationSet {
		return (this.blendEquationCache ??= this.makeBlendEquationCache());
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public set blendEquation(value: BlendEquation | BlendEquationSet) {
		if (typeof value === "number") {
			if (
				typeof this.blendEquationCache !== "undefined" &&
				this.blendEquationCache[0] === value &&
				this.blendEquationCache[1] === value
			) {
				return;
			}

			this.gl.blendEquation(value);

			this.blendEquationCache = new Uint8Array([
				value,
				value
			]) as unknown as BlendEquationSet;

			return;
		}

		if (
			typeof this.blendEquationCache !== "undefined" &&
			this.blendEquationCache[0] === value[0] &&
			this.blendEquationCache[1] === value[1]
		) {
			return;
		}

		this.gl.blendEquationSeparate(value[0], value[1]);

		this.blendEquationCache = new Uint8Array([
			value[0],
			value[1]
		]) as unknown as BlendEquationSet;
	}

	/**
	 * The RGB blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationRgb(): BlendEquation {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[0];
	}

	/**
	 * The alpha blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationAlpha(): BlendEquation {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[1];
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private blendFunctionCache: BlendFunctionFullSet | undefined;

	/**
	 * Whether blending is enabled.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private doBlendCache: boolean | undefined;

	/**
	 * Creates the blend function cache.
	 * @returns The blend function cache.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private makeBlendFunctionCache(): BlendFunctionFullSet {
		return new Uint8Array([
			this.gl.getParameter(BLEND_SRC_RGB),
			this.gl.getParameter(BLEND_DST_RGB),
			this.gl.getParameter(BLEND_SRC_ALPHA),
			this.gl.getParameter(BLEND_DST_ALPHA)
		]) as unknown as BlendFunctionFullSet;
	}

	/**
	 * The source and destination RGB and alpha blend functions, or `false` if blending is disabled.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public get blendFunction(): BlendFunctionFullSet | false {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache());
	}

	/**
	 * The source and destination RGB and alpha blend functions, or `false` if blending is disabled.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @throws {@link WebglError}
	 */
	public set blendFunction(
		value: BlendFunctionSet | BlendFunctionFullSet | boolean
	) {
		if (typeof value === "boolean") {
			if (this.doBlendCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(BLEND);
			} else {
				this.gl.disable(BLEND);
			}
			this.doBlendCache = value;

			return;
		}

		if (2 in value) {
			if (
				typeof this.blendFunctionCache !== "undefined" &&
				this.blendFunctionCache[0] === value[0] &&
				this.blendFunctionCache[1] === value[1] &&
				this.blendFunctionCache[2] === value[2] &&
				this.blendFunctionCache[3] === value[3]
			) {
				return;
			}

			this.gl.blendFuncSeparate(value[0], value[1], value[2], value[3]);

			this.blendFunctionCache = new Uint8Array([
				value[0],
				value[1],
				value[2],
				value[3]
			]) as unknown as BlendFunctionFullSet;

			return;
		}

		if (
			typeof this.blendFunctionCache !== "undefined" &&
			this.blendFunctionCache[0] === value[0] &&
			this.blendFunctionCache[1] === value[1] &&
			this.blendFunctionCache[2] === value[0] &&
			this.blendFunctionCache[3] === value[1]
		) {
			return;
		}

		this.gl.blendFunc(value[0], value[1]);

		this.blendFunctionCache = new Uint8Array([
			value[0],
			value[1],
			value[0],
			value[1]
		]) as unknown as BlendFunctionFullSet;
	}

	/**
	 * The source RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceRgb(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[0];
	}

	/**
	 * The destination RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationRgb(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[1];
	}

	/**
	 * The source alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceAlpha(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[2];
	}

	/**
	 * The destination alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationAlpha(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[3];
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
		if (code !== ErrorCode.NO_ERROR) {
			throw new WebglError(code);
		}
	}

	/**
	 * Clears buffers to their specified preset values.
	 * @param color - Whether to clear the color buffer.
	 * @param depth - Whether to clear the depth buffer.
	 * @param stencil - Whether to clear the stencil buffer.
	 */
	public clear(color?: boolean, depth?: boolean, stencil?: boolean): void;

	/**
	 * Clears buffers to the specified values.
	 * @param color - The value to clear the color buffer to.
	 * @param depth - The value to clear the depth buffer to.
	 * @param stencil - The value to clear the stencil buffer to.
	 */
	public clear(color: Color, depth: number, stencil: number): void;

	public clear(
		color: boolean | Color = true,
		depth: boolean | number = true,
		stencil: boolean | number = true
	): void {
		if (typeof color === "boolean") {
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
	private clearColorCache: Color | undefined;

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public get clearColor(): Color {
		return (this.clearColorCache ??= this.gl.getParameter(
			COLOR_CLEAR_VALUE
		) as Color);
	}

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public set clearColor(value: Color) {
		if (
			typeof this.clearColorCache !== "undefined" &&
			this.clearColorCache[0] === value[0] &&
			this.clearColorCache[1] === value[1] &&
			this.clearColorCache[2] === value[2] &&
			this.clearColorCache[3] === value[3]
		) {
			return;
		}

		this.gl.clearColor(value[0], value[1], value[2], value[3]);
		this.clearColorCache = value;
	}

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 * @internal
	 */
	private clearDepthCache: number | undefined;

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public get clearDepth(): number {
		return (this.clearDepthCache ??= this.gl.getParameter(
			DEPTH_CLEAR_VALUE
		) as number);
	}

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public set clearDepth(value: number) {
		if (this.clearDepthCache === value) {
			return;
		}

		this.gl.clearDepth(value);
		this.clearDepthCache = value;
	}

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 * @internal
	 */
	private clearStencilCache: number | undefined;

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public get clearStencil(): number {
		return (this.clearStencilCache ??= this.gl.getParameter(
			STENCIL_CLEAR_VALUE
		) as number);
	}

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public set clearStencil(value: number) {
		if (this.clearStencilCache === value) {
			return;
		}

		this.gl.clearStencil(value);
		this.clearStencilCache = value;
	}

	/**
	 * The mask that specifies which components to enable or disable when
	 * rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 * @internal
	 */
	private colorMaskCache: ColorMask | undefined;

	/**
	 * The mask that specifies which components to enable or disable when
	 * rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 */
	public get colorMask(): ColorMask {
		return (this.colorMaskCache ??= this.gl.getParameter(
			COLOR_WRITEMASK
		) as ColorMask);
	}

	/**
	 * The mask that specifies which components to enable or disable when
	 * rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 */
	public set colorMask(value: ColorMask) {
		if (
			typeof this.colorMaskCache !== "undefined" &&
			this.colorMaskCache[0] === value[0] &&
			this.colorMaskCache[1] === value[1] &&
			this.colorMaskCache[2] === value[2] &&
			this.colorMaskCache[3] === value[3]
		) {
			return;
		}

		this.gl.colorMask(value[0], value[1], value[2], value[3]);
		this.colorMaskCache = value;
	}

	/**
	 * The maximum number of texture units that can be used.
	 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
	 * @internal
	 */
	private maxCombinedTextureImageUnitsCache: number | undefined;

	public get maxCombinedTextureImageUnits(): number {
		return (this.maxCombinedTextureImageUnitsCache ??= this.gl.getParameter(
			MAX_COMBINED_TEXTURE_IMAGE_UNITS
		) as number);
	}

	/**
	 * The direction that polygons should face if they are to be culled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 * @internal
	 */
	private cullFaceCache: PolygonDirection | undefined;

	/**
	 * Whether polygon culling is enabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 * @internal
	 */
	private doCullFaceCache: boolean | undefined;

	/**
	 * The direction that polygons should face if they are to be culled, or
	 * `false` if polygon culling is disabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public get cullFace(): PolygonDirection | false {
		if (!(this.doCullFaceCache ??= this.gl.isEnabled(CULL_FACE))) {
			return false;
		}

		return (this.cullFaceCache ??= this.gl.getParameter(
			CULL_FACE_MODE
		) as PolygonDirection);
	}

	/**
	 * The direction that polygons should face if they are to be culled, or
	 * `false` if polygon culling is disabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public set cullFace(value: PolygonDirection | boolean) {
		if (typeof value === "boolean") {
			if (this.doCullFaceCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(CULL_FACE);
			} else {
				this.gl.disable(CULL_FACE);
			}
			this.doCullFaceCache = value;

			return;
		}

		if (!this.doCullFaceCache) {
			this.gl.enable(CULL_FACE);
			this.doCullFaceCache = true;
		}

		if (this.cullFaceCache === value) {
			return;
		}

		this.gl.cullFace(value);
		this.cullFaceCache = value;
	}

	/**
	 * The depth comparison function to use.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 * @internal
	 */
	private depthFunctionCache: TestFunction | undefined;

	/**
	 * Whether depth testing is enabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 * @internal
	 */
	private doDepthTestCache: boolean | undefined;

	/**
	 * The depth comparison function to use, or `false` if depth testing is disabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public get depthFunction(): TestFunction | false {
		if (!(this.doDepthTestCache ??= this.gl.isEnabled(DEPTH_TEST))) {
			return false;
		}

		return (this.depthFunctionCache ??= this.gl.getParameter(
			DEPTH_FUNC
		) as TestFunction);
	}

	/**
	 * The depth comparison function to use, or `false` if depth testing is disabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public set depthFunction(value: TestFunction | boolean) {
		if (typeof value === "boolean") {
			if (this.doDepthTestCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(DEPTH_TEST);
			} else {
				this.gl.disable(DEPTH_TEST);
			}
			this.doDepthTestCache = value;

			return;
		}

		if (!this.doDepthTestCache) {
			this.gl.enable(DEPTH_TEST);
			this.doDepthTestCache = true;
		}

		if (this.depthFunctionCache === value) {
			return;
		}

		this.gl.depthFunc(value);
		this.depthFunctionCache = value;
	}

	/**
	 * The alignment to use when unpacking pixel data from memory.
	 * @see [`pixelStorei`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
	 * @internal
	 */
	private unpackAlignmentCache: 1 | 2 | 4 | 8 | undefined;

	/**
	 * The alignment to use when unpacking pixel data from memory.
	 * @see [`pixelStorei`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
	 */
	public get unpackAlignment(): 1 | 2 | 4 | 8 {
		return (this.unpackAlignmentCache ??= this.gl.getParameter(
			UNPACK_ALIGNMENT
		) as 1 | 2 | 4 | 8);
	}

	/**
	 * The alignment to use when unpacking pixel data from memory.
	 * @see [`pixelStorei`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
	 */
	public set unpackAlignment(value: 1 | 2 | 4 | 8) {
		if (this.unpackAlignmentCache === value) {
			return;
		}

		this.gl.pixelStorei(UNPACK_ALIGNMENT, value);
		this.unpackAlignmentCache = value;
	}
}
