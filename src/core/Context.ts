import {
	ACTIVE_TEXTURE,
	BLEND,
	BLEND_COLOR,
	BLEND_DST_ALPHA,
	BLEND_DST_RGB,
	BLEND_EQUATION_ALPHA,
	BLEND_EQUATION_RGB,
	BLEND_SRC_ALPHA,
	BLEND_SRC_RGB,
	COLOR_BUFFER_BIT,
	COLOR_CLEAR_VALUE,
	COLOR_WRITEMASK,
	CULL_FACE,
	CULL_FACE_MODE,
	DEPTH_BUFFER_BIT,
	DEPTH_CLEAR_VALUE,
	DEPTH_FUNC,
	DEPTH_TEST,
	FRONT_FACE,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS,
	RASTERIZER_DISCARD,
	SCISSOR_BOX,
	SCISSOR_TEST,
	STENCIL_BACK_FUNC,
	STENCIL_BACK_REF,
	STENCIL_BACK_VALUE_MASK,
	STENCIL_BUFFER_BIT,
	STENCIL_CLEAR_VALUE,
	STENCIL_FUNC,
	STENCIL_REF,
	STENCIL_TEST,
	STENCIL_VALUE_MASK,
	TEXTURE0,
	UNPACK_ALIGNMENT,
	VIEWPORT
} from "#constants";
import ApiInterface from "#ApiInterface";
import BadValueError from "#BadValueError";
import BlendEquation from "#BlendEquation";
import type BlendEquationSet from "#BlendEquationSet";
import type BlendFunction from "#BlendFunction";
import type BlendFunctionFullSet from "#BlendFunctionFullSet";
import type BlendFunctionSet from "#BlendFunctionSet";
import type { Canvas } from "#Canvas";
import type Color from "#Color";
import type ColorMask from "#ColorMask";
import ErrorCode from "#ErrorCode";
import type Extension from "#Extension";
import type { ExtensionObject } from "#ExtensionObject";
import PolygonDirection from "#PolygonDirection";
import type Rectangle from "#Rectangle";
import type Stencil from "#Stencil";
import type TestFunction from "#TestFunction";
import UnsupportedOperationError from "#UnsupportedOperationError";
import WebglError from "#WebglError";
import type WindingOrientation from "#WindingOrientation";

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
		this.enabledExtensions = new Map();
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

	/**
	 * Already-enabled WebGL extensions.
	 * @see [`getExtension`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension)
	 * @internal
	 */
	private enabledExtensions: Map<Extension, ExtensionObject | null>;

	/**
	 * Enables the specified extension.
	 * @param extension - The extension.
	 * @returns The extension's implementation object.
	 * @see [`getExtension`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension)
	 */
	public enableExtension(extension: Extension): ExtensionObject | null {
		let out: ExtensionObject | null | undefined =
			this.enabledExtensions.get(extension);
		if (typeof out !== "undefined") {
			return out;
		}

		out = this.gl.getExtension(extension) as ExtensionObject | null;
		this.enabledExtensions.set(extension, out);
		return out;
	}

	/**
	 * A list of supported extensions.
	 * @see [`getSupportedExtensions`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions)
	 */
	public get supportedExtensions(): Extension[] {
		return this.gl.getSupportedExtensions() as Extension[];
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 * @internal
	 */
	private scissorBoxCache: Rectangle | undefined;

	/**
	 * Whether the scissor test is enabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 * @internal
	 */
	private doScissorTestCache: boolean | undefined;

	/**
	 * The scissor box, which limits drawing to a specified rectangle, or
	 * `false` if the scissor test is disabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public get scissorBox(): Rectangle | false {
		if (!(this.doScissorTestCache ??= this.gl.isEnabled(SCISSOR_TEST))) {
			return false;
		}

		return (this.scissorBoxCache ??= this.gl.getParameter(
			SCISSOR_BOX
		) as Rectangle);
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle, or
	 * `false` if the scissor test is disabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public set scissorBox(value: Rectangle | boolean) {
		if (typeof value === "boolean") {
			if (this.doScissorTestCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(SCISSOR_TEST);
			} else {
				this.gl.disable(SCISSOR_TEST);
			}
			this.doScissorTestCache = value;

			return;
		}

		if (!this.doScissorTestCache) {
			this.gl.enable(SCISSOR_TEST);
			this.doScissorTestCache = true;
		}

		if (this.scissorBoxCache === value) {
			return;
		}

		this.gl.scissor(value[0], value[1], value[2], value[3]);
		this.scissorBoxCache = value;
	}

	/**
	 * The viewport box, which specifies the affine transformation of
	 * coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 * @internal
	 */
	private viewportCache: Rectangle | undefined;

	/**
	 * The viewport box, which specifies the affine transformation of
	 * coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public get viewport(): Rectangle {
		return (this.viewportCache ??= this.gl.getParameter(VIEWPORT) as Rectangle);
	}

	/**
	 * The viewport box, which specifies the affine transformation of
	 * coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public set viewport(value: Rectangle) {
		this.gl.viewport(value[0], value[1], value[2], value[3]);
		this.viewportCache = value;
	}

	/**
	 * The front stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private frontStencilCache: Stencil | undefined;

	/**
	 * The back stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private backStencilCache: Stencil | undefined;

	/**
	 * Whether stencil testing is enabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private doStencilTestCache: boolean | undefined;

	/**
	 * The front stencil test function, reference, and mask, or `false` if stencil testing is disabled.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public get frontStencil(): Stencil | false {
		if (!(this.doStencilTestCache ??= this.gl.isEnabled(STENCIL_TEST))) {
			return false;
		}

		return (this.frontStencilCache ??= [
			this.gl.getParameter(STENCIL_FUNC),
			this.gl.getParameter(STENCIL_REF),
			this.gl.getParameter(STENCIL_VALUE_MASK)
		]);
	}

	/**
	 * The front stencil test function, reference, and mask, or `false` if stencil testing is disabled.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public set frontStencil(value: Stencil | boolean) {
		if (typeof value === "boolean") {
			if (this.doStencilTestCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(STENCIL_TEST);
			} else {
				this.gl.disable(STENCIL_TEST);
			}
			this.doStencilTestCache = value;

			return;
		}

		if (!this.doStencilTestCache) {
			this.gl.enable(STENCIL_TEST);
			this.doStencilTestCache = true;
		}

		if (
			typeof this.frontStencilCache !== "undefined" &&
			this.frontStencilCache[0] === value[0] &&
			this.frontStencilCache[1] === value[1] &&
			this.frontStencilCache[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFuncSeparate(
			PolygonDirection.FRONT,
			value[0],
			value[1],
			value[2]
		);
	}

	/**
	 * The back stencil test function, reference, and mask, or `false` if stencil testing is disabled.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public get backStencil(): Stencil | false {
		if (!(this.doStencilTestCache ??= this.gl.isEnabled(STENCIL_TEST))) {
			return false;
		}

		return (this.backStencilCache ??= [
			this.gl.getParameter(STENCIL_BACK_FUNC),
			this.gl.getParameter(STENCIL_BACK_REF),
			this.gl.getParameter(STENCIL_BACK_VALUE_MASK)
		]);
	}

	/**
	 * The back stencil test function, reference, and mask, or `false` if stencil testing is disabled.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public set backStencil(value: Stencil | boolean) {
		if (typeof value === "boolean") {
			if (this.doStencilTestCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(STENCIL_TEST);
			} else {
				this.gl.disable(STENCIL_TEST);
			}
			this.doStencilTestCache = value;

			return;
		}

		if (!this.doStencilTestCache) {
			this.gl.enable(STENCIL_TEST);
			this.doStencilTestCache = true;
		}

		if (
			typeof this.backStencilCache !== "undefined" &&
			this.backStencilCache[0] === value[0] &&
			this.backStencilCache[1] === value[1] &&
			this.backStencilCache[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFuncSeparate(
			PolygonDirection.BACK,
			value[0],
			value[1],
			value[2]
		);
	}

	/**
	 * The front and back stencil test functions, references, and masks, or `false` if stencil testing is disabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public get stencil(): Stencil | false {
		return this.frontStencil;
	}

	/**
	 * The front and back stencil test functions, references, and masks, or `false` if stencil testing is disabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public set stencil(value: Stencil | boolean) {
		if (typeof value === "boolean") {
			if (this.doStencilTestCache === value) {
				return;
			}

			if (value) {
				this.gl.enable(STENCIL_TEST);
			} else {
				this.gl.disable(STENCIL_TEST);
			}
			this.doStencilTestCache = value;

			return;
		}

		if (!this.doStencilTestCache) {
			this.gl.enable(STENCIL_TEST);
			this.doStencilTestCache = true;
		}

		if (
			typeof this.frontStencilCache !== "undefined" &&
			this.frontStencilCache[0] === value[0] &&
			this.frontStencilCache[1] === value[1] &&
			this.frontStencilCache[2] === value[2] &&
			typeof this.backStencilCache !== "undefined" &&
			this.backStencilCache[0] === value[0] &&
			this.backStencilCache[1] === value[1] &&
			this.backStencilCache[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFunc(value[0], value[1], value[2]);
		this.frontStencilCache = value;
		this.backStencilCache = value;
	}

	/**
	 * Whether primitives are discarded immediately before the rasterization stage.
	 * @internal
	 */
	private doRasterizerDiscardCache: boolean | undefined;

	/**
	 * Whether primitives are discarded immediately before the rasterization stage.
	 */
	public get doRasterizerDiscard(): boolean {
		return (this.doRasterizerDiscardCache ??=
			this.gl.isEnabled(RASTERIZER_DISCARD));
	}

	/**
	 * Whether primitives are discarded immediately before the rasterization stage.
	 */
	public set doRasterizerDiscard(value: boolean) {
		if (this.doRasterizerDiscardCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(RASTERIZER_DISCARD);
		} else {
			this.gl.disable(RASTERIZER_DISCARD);
		}
		this.doRasterizerDiscardCache = value;
	}

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 * @internal
	 */
	private frontFaceCache: WindingOrientation | undefined;

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public get frontFace(): WindingOrientation {
		return (this.frontFaceCache ??= this.gl.getParameter(
			FRONT_FACE
		) as WindingOrientation);
	}

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public set frontFace(value: WindingOrientation) {
		if (this.frontFaceCache === value) {
			return;
		}

		this.gl.frontFace(value);
		this.frontFaceCache = value;
	}

	/**
	 * Clears the specified buffers to the specified values.
	 * @param color - The value to clear the color buffer to or a boolean to use
	 * the previous clear color.
	 * @param depth - The value to clear the depth buffer to or a boolean to use
	 * the previous clear depth.
	 * @param stencil - The value to clear the stencil buffer to or a boolean to use
	 * the previous clear stencil.
	 * @see [`clear`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public clear(
		color: Color | boolean = false,
		depth: number | boolean = false,
		stencil: number | boolean = false
	): void {
		let colorBit: number = color ? COLOR_BUFFER_BIT : 0;
		if (typeof color !== "boolean") {
			this.clearColor = color;
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit: number = depth ? COLOR_BUFFER_BIT : 0;
		if (typeof depth !== "boolean") {
			this.clearDepth = depth;
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit: number = stencil ? STENCIL_BUFFER_BIT : 0;
		if (typeof stencil !== "boolean") {
			this.clearStencil = stencil;
			stencilBit = STENCIL_BUFFER_BIT;
		}

		this.gl.clear(colorBit | depthBit | stencilBit);
	}

	/**
	 * Resizes this rendering context's canvas' drawing buffer to match its
	 * physical size.
	 * @returns Whether the drawing buffer was resized.
	 */
	public fitDrawingBuffer(): boolean {
		if (this.canvas instanceof OffscreenCanvas) {
			return false;
		}

		// Get physical size.
		const displayWidth: number = this.canvas.clientWidth;
		const displayHeight: number = this.canvas.clientHeight;

		if (
			this.canvas.width !== displayWidth ||
			this.canvas.height !== displayHeight
		) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;
			return true;
		}

		return false;
	}

	/**
	 * Resizes this rendering context's viewport to match the size of its
	 * current drawing buffer.
	 */
	public fitViewport(): void {
		this.viewport = [0, 0, this.canvas.width, this.canvas.height];
	}

	/**
	 * Resizes this rendering context's canvas' drawing buffer to match its
	 * physical size, resizes the viewport and scissor box to match the given
	 * size, and enables the scissor test if necessary.
	 * @param rectangle - The rectangle that represents the viewport and
	 * scissor box, or `undefined` to match the viewport to the drawing buffer
	 * and disable the scissor test.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resize(rectangle?: Rectangle): boolean {
		if (this.canvas instanceof OffscreenCanvas) {
			throw new UnsupportedOperationError();
		}

		const out: boolean = this.fitDrawingBuffer();

		if (typeof rectangle === "undefined") {
			this.fitViewport();
			this.scissorBox = false;
		} else {
			this.viewport = rectangle;
			this.scissorBox = rectangle;
		}

		return out;
	}
}
