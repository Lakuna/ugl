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
	DITHER,
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
	 * Create a wrapper for a WebGL2 rendering context.
	 * @param gl - The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Create a WebGL2 rendering context.
	 * @param canvas - The canvas of the rendering context.
	 * @throws {@link UnsupportedOperationError}
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
			const gl = source.getContext("webgl2", options);
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
	public readonly canvas;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 * @internal
	 */
	private drawingBufferColorSpaceCache?: PredefinedColorSpace;

	/**
	 * Get the color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public get drawingBufferColorSpace() {
		return (this.drawingBufferColorSpaceCache ??=
			this.gl.drawingBufferColorSpace);
	}

	/**
	 * Set the color space of the drawing buffer of this rendering context.
	 * @see [`drawingBufferColorSpace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace)
	 */
	public set drawingBufferColorSpace(value) {
		if (this.drawingBufferColorSpaceCache === value) {
			return;
		}

		this.gl.drawingBufferColorSpace = value;
		this.drawingBufferColorSpaceCache = value;
	}

	/**
	 * Get the actual height of the drawing buffer of this rendering context.
	 * @see [`drawingBufferHeight`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferHeight)
	 */
	public get drawingBufferHeight() {
		return this.gl.drawingBufferHeight;
	}

	/**
	 * Get the actual width of the drawing buffer of this rendering context.
	 * @see [`drawingBufferWidth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferWidth)
	 */
	public get drawingBufferWidth() {
		return this.gl.drawingBufferWidth;
	}

	/**
	 * The active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	private activeTextureCache?: number;

	/**
	 * Get the active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @internal
	 */
	public get activeTexture() {
		return (this.activeTextureCache ??=
			this.gl.getParameter(ACTIVE_TEXTURE) - TEXTURE0);
	}

	/**
	 * Set the active texture unit.
	 * @see [`activeTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture)
	 * @throws {@link BadValueError}
	 * @internal
	 */
	public set activeTexture(value) {
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
	private blendColorCache?: Color;

	/**
	 * The blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public get blendColor() {
		return (this.blendColorCache ??= this.gl.getParameter(BLEND_COLOR));
	}

	/**
	 * Set the blend color.
	 * @see [`blendColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor)
	 */
	public set blendColor(value) {
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
	private blendEquationCache?: BlendEquationSet;

	/**
	 * Create the blend equation cache.
	 * @returns The blend equation cache.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 * @internal
	 */
	private makeBlendEquationCache() {
		return new Uint8Array([
			this.gl.getParameter(BLEND_EQUATION_RGB),
			this.gl.getParameter(BLEND_EQUATION_ALPHA)
		]) as unknown as BlendEquationSet;
	}

	/**
	 * Get the RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public get blendEquation(): BlendEquationSet {
		return (this.blendEquationCache ??= this.makeBlendEquationCache());
	}

	/**
	 * Set the RGB and alpha blend equations.
	 * @see [`blendEquation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation)
	 */
	public set blendEquation(value: BlendEquation | BlendEquationSet) {
		// One value.
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

		// Set of values.
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
	 * Get the RGB blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationRgb() {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[0];
	}

	/**
	 * Get the alpha blend equation.
	 * @see [`blendEquationSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate)
	 */
	public get blendEquationAlpha() {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[1];
	}

	/**
	 * Whether or not blending is enabled.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private doBlendCache?: boolean;

	/** Get whether or not blending is enabled. */
	public get doBlend() {
		return (this.doBlendCache ??= this.gl.isEnabled(BLEND));
	}

	/** Set whether or not blending is enabled. */
	public set doBlend(value) {
		if (this.doBlendCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(BLEND);
		} else {
			this.gl.disable(BLEND);
		}
		this.doBlendCache = value;
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private blendFunctionCache?: BlendFunctionFullSet;

	/**
	 * Create the blend function cache.
	 * @returns The blend function cache.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @internal
	 */
	private makeBlendFunctionCache() {
		return new Uint8Array([
			this.gl.getParameter(BLEND_SRC_RGB),
			this.gl.getParameter(BLEND_DST_RGB),
			this.gl.getParameter(BLEND_SRC_ALPHA),
			this.gl.getParameter(BLEND_DST_ALPHA)
		]) as unknown as BlendFunctionFullSet;
	}

	/**
	 * Get the source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public get blendFunction(): BlendFunctionFullSet {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache());
	}

	/**
	 * Set the source and destination RGB and alpha blend functions.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 * @throws {@link WebglError}
	 */
	public set blendFunction(value: BlendFunctionSet | BlendFunctionFullSet) {
		// Full set.
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

		// Half set.
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
	 * Get the source RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceRgb() {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[0];
	}

	/**
	 * Get the destination RGB blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationRgb() {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[1];
	}

	/**
	 * Get the source alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionSourceAlpha() {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[2];
	}

	/**
	 * Get the destination alpha blend function.
	 * @see [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate)
	 */
	public get blendFunctionDestinationAlpha() {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[3];
	}

	/**
	 * Get the code of the most recent WebGL error that has occurred in this context.
	 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
	 */
	public get error(): ErrorCode {
		return this.gl.getError();
	}

	/**
	 * Throw a JavaScript error if a WebGL error has occurred.
	 * @see [`getError`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError)
	 * @throws {@link WebglError}
	 */
	public throwIfError() {
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
	private clearColorCache?: Color;

	/**
	 * Get the value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public get clearColor() {
		return (this.clearColorCache ??= this.gl.getParameter(COLOR_CLEAR_VALUE));
	}

	/**
	 * Set the value to store in the color buffer when clearing it.
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 */
	public set clearColor(value) {
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
	private clearDepthCache?: number;

	/**
	 * Get the value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public get clearDepth() {
		return (this.clearDepthCache ??= this.gl.getParameter(DEPTH_CLEAR_VALUE));
	}

	/**
	 * Set the value to store in the depth buffer when clearing it.
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 */
	public set clearDepth(value) {
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
	private clearStencilCache?: number;

	/**
	 * Get the value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public get clearStencil() {
		return (this.clearStencilCache ??=
			this.gl.getParameter(STENCIL_CLEAR_VALUE));
	}

	/**
	 * Set the value to store in the stencil buffer when clearing it.
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public set clearStencil(value) {
		if (this.clearStencilCache === value) {
			return;
		}

		this.gl.clearStencil(value);
		this.clearStencilCache = value;
	}

	/**
	 * The mask that specifies which components to enable or disable when rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 * @internal
	 */
	private colorMaskCache?: ColorMask;

	/**
	 * Get the mask that specifies which components to enable or disable when rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 */
	public get colorMask() {
		return (this.colorMaskCache ??= this.gl.getParameter(COLOR_WRITEMASK));
	}

	/**
	 * Set the mask that specifies which components to enable or disable when rendering to a framebuffer.
	 * @see [`colorMask`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask)
	 */
	public set colorMask(value) {
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
	private maxCombinedTextureImageUnitsCache?: number;

	/**
	 * Get the maximum number of texture units that can be used.
	 * @see [`getParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
	 */
	public get maxCombinedTextureImageUnits() {
		return (this.maxCombinedTextureImageUnitsCache ??= this.gl.getParameter(
			MAX_COMBINED_TEXTURE_IMAGE_UNITS
		));
	}

	/**
	 * Whether or not polygon culling is enabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 * @internal
	 */
	private doCullFaceCache?: boolean;

	/**
	 * Get whether or not polygon culling is enabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public get doCullFace() {
		return (this.doCullFaceCache ??= this.gl.isEnabled(CULL_FACE));
	}

	/**
	 * Set whether or not polygon culling is enabled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public set doCullFace(value) {
		if (this.doCullFaceCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(CULL_FACE);
		} else {
			this.gl.disable(CULL_FACE);
		}
		this.doCullFaceCache = value;
	}

	/**
	 * The direction that polygons should face if they are to be culled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 * @internal
	 */
	private cullFaceCache?: PolygonDirection;

	/**
	 * Get the direction that polygons should face if they are to be culled.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public get cullFace() {
		return (this.cullFaceCache ??= this.gl.getParameter(CULL_FACE_MODE));
	}

	/**
	 * Set the direction that polygons should face if they are to be culled, or `true` to enable polygon culling with the previous value, or `false` to disable polygon culling.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public set cullFace(value) {
		if (this.cullFaceCache === value) {
			return;
		}

		this.gl.cullFace(value);
		this.cullFaceCache = value;
	}

	/**
	 * Whether or not dithering is enabled.
	 * @internal
	 */
	private doDitherCache?: boolean;

	/** Get whether or not dithering is enabled. */
	public get doDither() {
		return (this.doDitherCache ??= this.gl.isEnabled(DITHER));
	}

	/** Set whether or not dithering is enabled. */
	public set doDither(value) {
		if (this.doDitherCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(DITHER);
		} else {
			this.gl.disable(DITHER);
		}
		this.doDitherCache = value;
	}

	/**
	 * Whether or not depth testing is enabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 * @internal
	 */
	private doDepthTestCache?: boolean;

	/**
	 * Get whether or not depth testing is enabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public get doDepthTest() {
		return (this.doDepthTestCache ??= this.gl.isEnabled(DEPTH_TEST));
	}

	/**
	 * Set whether or not depth testing is enabled.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public set doDepthTest(value) {
		if (this.doDepthTestCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(DEPTH_TEST);
		} else {
			this.gl.disable(DEPTH_TEST);
		}
		this.doDepthTestCache = value;
	}

	/**
	 * The depth comparison function to use.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 * @internal
	 */
	private depthFunctionCache?: TestFunction;

	/**
	 * Get the depth comparison function to use.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public get depthFunction() {
		return (this.depthFunctionCache ??= this.gl.getParameter(DEPTH_FUNC));
	}

	/**
	 * Set the depth comparison function to use.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public set depthFunction(value) {
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
	private unpackAlignmentCache?: 1 | 2 | 4 | 8;

	/**
	 * Get the alignment to use when unpacking pixel data from memory.
	 * @see [`pixelStorei`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
	 */
	public get unpackAlignment() {
		return (this.unpackAlignmentCache ??=
			this.gl.getParameter(UNPACK_ALIGNMENT));
	}

	/**
	 * Set the alignment to use when unpacking pixel data from memory.
	 * @see [`pixelStorei`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
	 */
	public set unpackAlignment(value) {
		if (this.unpackAlignmentCache === value) {
			return;
		}

		this.gl.pixelStorei(UNPACK_ALIGNMENT, value);
		this.unpackAlignmentCache = value;
	}

	/**
	 * A map of already-enabled WebGL extensions.
	 * @see [`getExtension`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension)
	 * @internal
	 */
	private enabledExtensions: Map<Extension, ExtensionObject | null>;

	/**
	 * Enable the specified extension.
	 * @param extension - The extension.
	 * @returns The extension's implementation object.
	 * @see [`getExtension`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension)
	 */
	public enableExtension(extension: Extension) {
		let out = this.enabledExtensions.get(extension);
		if (typeof out !== "undefined") {
			return out;
		}

		out = this.gl.getExtension(extension) as ExtensionObject | null;
		this.enabledExtensions.set(extension, out);
		return out;
	}

	/**
	 * Get a list of supported extensions.
	 * @see [`getSupportedExtensions`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions)
	 */
	public get supportedExtensions() {
		return this.gl.getSupportedExtensions() as Extension[];
	}

	/**
	 * Whether or not the scissor test is enabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 * @internal
	 */
	private doScissorTestCache?: boolean;

	/**
	 * Get whether or not the scissor test is enabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public get doScissorTest() {
		return (this.doScissorTestCache ??= this.gl.isEnabled(SCISSOR_TEST));
	}

	/**
	 * Set whether or not the scissor test is enabled.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public set doScissorTest(value) {
		if (this.doScissorTestCache === value) {
			return;
		}

		if (value) {
			this.gl.enable(SCISSOR_TEST);
		} else {
			this.gl.disable(SCISSOR_TEST);
		}
		this.doScissorTestCache = value;
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 * @internal
	 */
	private scissorBoxCache?: Rectangle;

	/**
	 * Get the scissor box, which limits drawing to a specified rectangle.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public get scissorBox() {
		return (this.scissorBoxCache ??= this.gl.getParameter(SCISSOR_BOX));
	}

	/**
	 * Set the scissor box, which limits drawing to a specified rectangle.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public set scissorBox(value) {
		if (
			typeof this.scissorBoxCache !== "undefined" &&
			this.scissorBoxCache[0] === value[0] &&
			this.scissorBoxCache[1] === value[1] &&
			this.scissorBoxCache[2] === value[2] &&
			this.scissorBoxCache[3] === value[3]
		) {
			return;
		}

		this.gl.scissor(value[0], value[1], value[2], value[3]);
		this.scissorBoxCache = value;
	}

	/**
	 * The viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 * @internal
	 */
	private viewportCache?: Rectangle;

	/**
	 * Get the viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public get viewport() {
		return (this.viewportCache ??= this.gl.getParameter(VIEWPORT));
	}

	/**
	 * Set the viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public set viewport(value) {
		if (
			typeof this.viewportCache !== "undefined" &&
			this.viewportCache[0] === value[0] &&
			this.viewportCache[1] === value[1] &&
			this.viewportCache[2] === value[2] &&
			this.viewportCache[3] === value[3]
		) {
			return;
		}

		this.gl.viewport(value[0], value[1], value[2], value[3]);
		this.viewportCache = value;
	}

	/**
	 * Whether stencil testing is enabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private doStencilTestCache?: boolean;

	/**
	 * Get whether stencil testing is enabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public get doStencilTest() {
		return (this.doStencilTestCache ??= this.gl.isEnabled(STENCIL_TEST));
	}

	/**
	 * Set whether stencil testing is enabled.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public set doStencilTest(value) {
		if (value === this.doStencilTestCache) {
			return;
		}

		if (value) {
			this.gl.enable(STENCIL_TEST);
		} else {
			this.gl.disable(STENCIL_TEST);
		}
		this.doStencilTestCache = value;
	}

	/**
	 * The front stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private frontStencilCache?: Stencil;

	/**
	 * Get the front stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public get frontStencil() {
		return (this.frontStencilCache ??= [
			this.gl.getParameter(STENCIL_FUNC),
			this.gl.getParameter(STENCIL_REF),
			this.gl.getParameter(STENCIL_VALUE_MASK)
		]);
	}

	/**
	 * Set the front stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public set frontStencil(value) {
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
	 * The back stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 * @internal
	 */
	private backStencilCache?: Stencil;

	/**
	 * Get the back stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public get backStencil() {
		return (this.backStencilCache ??= [
			this.gl.getParameter(STENCIL_BACK_FUNC),
			this.gl.getParameter(STENCIL_BACK_REF),
			this.gl.getParameter(STENCIL_BACK_VALUE_MASK)
		]);
	}

	/**
	 * Set the back stencil test function, reference, and mask.
	 * @see [`stencilFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate)
	 */
	public set backStencil(value) {
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
	 * Get the front and back stencil test functions, references, and masks.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public get stencil() {
		return this.frontStencil;
	}

	/**
	 * Set the front and back stencil test functions, references, and masks.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public set stencil(value) {
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
	private doRasterizerDiscardCache?: boolean;

	/** Whether primitives are discarded immediately before the rasterization stage. */
	public get doRasterizerDiscard() {
		return (this.doRasterizerDiscardCache ??=
			this.gl.isEnabled(RASTERIZER_DISCARD));
	}

	/** Whether primitives are discarded immediately before the rasterization stage. */
	public set doRasterizerDiscard(value) {
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
	private frontFaceCache?: WindingOrientation;

	/**
	 * Get the winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public get frontFace() {
		return (this.frontFaceCache ??= this.gl.getParameter(FRONT_FACE));
	}

	/**
	 * Set the winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public set frontFace(value) {
		if (this.frontFaceCache === value) {
			return;
		}

		this.gl.frontFace(value);
		this.frontFaceCache = value;
	}

	/**
	 * Clear the specified buffers to the specified values.
	 * @param color - The value to clear the color buffer to or a boolean to use the previous clear color.
	 * @param depth - The value to clear the depth buffer to or a boolean to use the previous clear depth.
	 * @param stencil - The value to clear the stencil buffer to or a boolean to use the previous clear stencil.
	 * @see [`clear`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear)
	 * @see [`clearColor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor)
	 * @see [`clearDepth`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth)
	 * @see [`clearStencil`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil)
	 */
	public clear(
		color: Color | boolean = false,
		depth: number | boolean = false,
		stencil: number | boolean = false
	) {
		let colorBit = color ? COLOR_BUFFER_BIT : 0;
		if (typeof color !== "boolean") {
			this.clearColor = color;
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = depth ? COLOR_BUFFER_BIT : 0;
		if (typeof depth !== "boolean") {
			this.clearDepth = depth;
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = stencil ? STENCIL_BUFFER_BIT : 0;
		if (typeof stencil !== "boolean") {
			this.clearStencil = stencil;
			stencilBit = STENCIL_BUFFER_BIT;
		}

		this.gl.clear(colorBit | depthBit | stencilBit);
	}

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size.
	 * @returns Whether or not the drawing buffer was resized.
	 */
	public fitDrawingBuffer() {
		if (this.canvas instanceof OffscreenCanvas) {
			return false;
		}

		// Get physical size.
		const displayWidth = this.canvas.clientWidth;
		const displayHeight = this.canvas.clientHeight;

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

	/** Resize this rendering context's viewport to match the size of its current drawing buffer. */
	public fitViewport() {
		this.viewport = [0, 0, this.canvas.width, this.canvas.height];
	}

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size, resizes the viewport and scissor box to match the given size, and enables the scissor test if necessary.
	 * @param rectangle - The rectangle that represents the viewport and scissor box, or `undefined` to match the viewport to the drawing buffer and disable the scissor test.
	 * @returns Whether or not the drawing buffer was resized.
	 * @throws {@link UnsupportedOperationError}
	 */
	public resize(rectangle?: Rectangle) {
		if (this.canvas instanceof OffscreenCanvas) {
			throw new UnsupportedOperationError();
		}

		const out = this.fitDrawingBuffer();

		if (typeof rectangle === "undefined") {
			this.fitViewport();
			this.doScissorTest = false;
		} else {
			this.viewport = rectangle;
			this.scissorBox = rectangle;
		}

		return out;
	}
}
