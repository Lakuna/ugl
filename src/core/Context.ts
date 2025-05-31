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
	COLOR_CLEAR_VALUE,
	COLOR_WRITEMASK,
	CULL_FACE,
	CULL_FACE_MODE,
	DEPTH_CLEAR_VALUE,
	DEPTH_FUNC,
	DEPTH_RANGE,
	DEPTH_TEST,
	DEPTH_WRITEMASK,
	DITHER,
	FRONT_FACE,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS,
	MAX_DRAW_BUFFERS,
	MAX_TEXTURE_MAX_ANISOTROPY_EXT,
	MAX_VIEWPORT_DIMS,
	PACK_ALIGNMENT,
	POLYGON_OFFSET_FACTOR,
	POLYGON_OFFSET_FILL,
	POLYGON_OFFSET_UNITS,
	RASTERIZER_DISCARD,
	SAMPLE_ALPHA_TO_COVERAGE,
	SAMPLE_COVERAGE,
	SAMPLE_COVERAGE_INVERT,
	SAMPLE_COVERAGE_VALUE,
	SCISSOR_BOX,
	SCISSOR_TEST,
	STENCIL_BACK_FUNC,
	STENCIL_BACK_REF,
	STENCIL_BACK_VALUE_MASK,
	STENCIL_CLEAR_VALUE,
	STENCIL_FUNC,
	STENCIL_REF,
	STENCIL_TEST,
	STENCIL_VALUE_MASK,
	TEXTURE0,
	UNPACK_ALIGNMENT,
	VIEWPORT
} from "../constants/constants.js";
import ApiInterface from "./internal/ApiInterface.js";
import BadValueError from "../utility/BadValueError.js";
import BlendEquation from "../constants/BlendEquation.js";
import type BlendEquationSet from "../types/BlendEquationSet.js";
import BlendFunction from "../constants/BlendFunction.js";
import type BlendFunctionFullSet from "../types/BlendFunctionFullSet.js";
import type BlendFunctionSet from "../types/BlendFunctionSet.js";
import type Color from "../types/Color.js";
import type ColorMask from "../types/ColorMask.js";
import ErrorCode from "../constants/ErrorCode.js";
import Extension from "../constants/Extension.js";
import type { ExtensionObject } from "../types/ExtensionObject.js";
import Face from "../constants/Face.js";
import Framebuffer from "./Framebuffer.js";
import Orientation from "../constants/Orientation.js";
import type Pair from "../types/Pair.js";
import type Rectangle from "../types/Rectangle.js";
import type Stencil from "../types/Stencil.js";
import TestFunction from "../constants/TestFunction.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";
import WebglError from "../utility/WebglError.js";

/**
 * A WebGL2 rendering context.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext | WebGL2RenderingContext}
 * @public
 */
export default class Context extends ApiInterface {
	/**
	 * A map of canvases and rendering contexts to existing `Context`s.
	 * @internal
	 */
	private static existingContexts = new Map<
		HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext,
		Context
	>();

	/**
	 * Create a `Context` or get an existing `Context` if one already exists for the given rendering context. This is preferable to calling the `Context` constructor in cases where multiple `Context`s may be created for the same canvas (i.e. in a Next.js page).
	 * @param gl - The rendering context.
	 * @returns A rendering context.
	 * @public
	 */
	public static get(gl: WebGL2RenderingContext): Context;

	/**
	 * Create a `Context` or get an existing `Context` if one already exists for the given canvas. This is preferable to calling the `Context` constructor in cases where multiple `Context`s may be created for the same canvas (i.e. in a Next.js page).
	 * @param canvas - The canvas of the rendering context.
	 * @param options - The options to create the rendering context with if necessary.
	 * @param doPrefillCache - Whether or not cached values should be prefilled with their default values. It is recommended that this is set to `true` unless the rendering context may have been modified prior to the creation of this object.
	 * @returns A rendering context.
	 * @public
	 */
	public static get(
		canvas: HTMLCanvasElement | OffscreenCanvas,
		options?: WebGLContextAttributes,
		doPrefillCache?: boolean
	): Context;

	public static get(
		source: HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext,
		options?: WebGLContextAttributes,
		doPrefillCache?: boolean
	): Context {
		const { existingContexts } = Context;
		const existingContext = existingContexts.get(source);
		if (existingContext) {
			return existingContext;
		}

		const out = new Context(
			source as HTMLCanvasElement | OffscreenCanvas, // Use `as` to cheat and reduce code size. Second argument is ignored if `source` is a `WebGL2RenderingContext`.
			options,
			doPrefillCache
		);
		existingContexts.set(out.canvas, out);
		existingContexts.set(out.gl, out);
		return out;
	}

	/**
	 * Create a wrapper for a WebGL2 rendering context.
	 * @param gl - The rendering context.
	 * @throws {@link DuplicateContextError} if a `Context` already exists for `gl`.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Create a WebGL2 rendering context.
	 * @param canvas - The canvas of the rendering context.
	 * @param options - The options to create the rendering context with if necessary.
	 * @param doPrefillCache - Whether or not cached values should be prefilled with their default values. It is recommended that this is set to `true` unless the rendering context may have been modified prior to the creation of this object.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext | getContext}
	 * @throws {@link UnsupportedOperationError} if a WebGL2 context cannot be created.
	 * @throws {@link DuplicateContextError} if a `Context` already exists for `canvas`.
	 */
	public constructor(
		canvas: HTMLCanvasElement | OffscreenCanvas,
		options?: WebGLContextAttributes,
		doPrefillCache?: boolean
	);

	public constructor(
		source: WebGL2RenderingContext | HTMLCanvasElement | OffscreenCanvas,
		options?: WebGLContextAttributes,
		doPrefillCache = true
	) {
		if (Context.existingContexts.has(source)) {
			throw new Error(
				"A `Context` already exists for that canvas. Consider using `Context.get` instead."
			);
		}

		if (source instanceof WebGL2RenderingContext) {
			super(source);
		} else {
			const gl = source.getContext("webgl2", options);
			if (!gl) {
				throw new UnsupportedOperationError(
					"The environment does not support WebGL2."
				);
			}

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
			super(gl as WebGL2RenderingContext); // This assertion is only necessary because TypeDoc incorrectly identifies `gl` as a `RenderingContext`. Remove it once this is fixed.

			if (options) {
				this.attributesCache = options;
			}
		}

		this.canvas = this.gl.canvas;
		this.doPrefillCache = doPrefillCache;
		this.enabledExtensions = new Map();
		this.fbo = new Framebuffer(this, true);
	}

	/** The canvas of this rendering context. */
	public readonly canvas: HTMLCanvasElement | OffscreenCanvas;

	/**
	 * Whether or not cached values should be prefilled with their default values.
	 * @internal
	 */
	public readonly doPrefillCache: boolean;

	/** The default framebuffer object for this rendering context. */
	public readonly fbo: Framebuffer;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @internal
	 */
	private drawingBufferColorSpaceCache?: PredefinedColorSpace;

	/**
	 * The color space of the drawing buffer of this rendering context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace | drawingBufferColorSpace}
	 */
	public get drawingBufferColorSpace(): PredefinedColorSpace {
		return (this.drawingBufferColorSpaceCache ??=
			this.gl.drawingBufferColorSpace);
	}

	public set drawingBufferColorSpace(value: PredefinedColorSpace) {
		if (this.drawingBufferColorSpace === value) {
			return;
		}

		this.gl.drawingBufferColorSpace = value;
		this.drawingBufferColorSpaceCache = value;
	}

	/**
	 * The actual height of the drawing buffer of this rendering context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferHeight | drawingBufferHeight}
	 */
	public get drawingBufferHeight(): number {
		return this.gl.drawingBufferHeight;
	}

	/**
	 * The actual width of the drawing buffer of this rendering context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferWidth | drawingBufferWidth}
	 */
	public get drawingBufferWidth(): number {
		return this.gl.drawingBufferWidth;
	}

	/**
	 * The attributes of this rendering context, or `null` if this rendering context is lost.
	 * @internal
	 */
	private attributesCache?: WebGLContextAttributes | null;

	/**
	 * The attributes of this rendering context, or `null` if this rendering context is lost.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes | getContextAttributes}
	 */
	public get attributes(): WebGLContextAttributes | null {
		return (this.attributesCache ??= this.gl.getContextAttributes());
	}

	/**
	 * The active texture unit.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture | activeTexture}
	 * @internal
	 */
	private activeTextureCache?: number;

	/**
	 * The active texture unit.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture | activeTexture}
	 * @throws {@link BadValueError} if set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public get activeTexture(): number {
		return (this.activeTextureCache ??= this.doPrefillCache
			? 0
			: this.gl.getParameter(ACTIVE_TEXTURE) - TEXTURE0);
	}

	public set activeTexture(value: number) {
		if (this.activeTexture === value) {
			return;
		}

		if (value < 0 || value >= this.maxCombinedTextureImageUnits) {
			throw new BadValueError(
				`Invalid texture unit (${value.toString()} must be positive and below ${this.maxCombinedTextureImageUnits.toString()}).`
			);
		}

		this.gl.activeTexture(value + TEXTURE0);
		this.activeTextureCache = value;
	}

	/**
	 * Whether or not to compute the computation of a temporary coverage value determined by the alpha value.
	 * @internal
	 */
	private doSampleAlphaToCoverageCache?: boolean;

	/** Whether or not to compute the computation of a temporary coverage value determined by the alpha value. */
	public get doSampleAlphaToCoverage(): boolean {
		return (this.doSampleAlphaToCoverageCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(SAMPLE_ALPHA_TO_COVERAGE));
	}

	public set doSampleAlphaToCoverage(value: boolean) {
		if (this.doSampleAlphaToCoverage === value) {
			return;
		}

		if (value) {
			this.gl.enable(SAMPLE_ALPHA_TO_COVERAGE);
		} else {
			this.gl.disable(SAMPLE_ALPHA_TO_COVERAGE);
		}

		this.doSampleAlphaToCoverageCache = value;
	}

	/**
	 * Whether or not to AND the fragment's coverage with the temporary coverage value.
	 * @internal
	 */
	private doSampleCoverageCache?: boolean;

	/** Whether or not to AND the fragment's coverage with the temporary coverage value. */
	public get doSampleCoverage(): boolean {
		return (this.doSampleCoverageCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(SAMPLE_COVERAGE));
	}

	public set doSampleCoverage(value: boolean) {
		if (this.doSampleCoverage === value) {
			return;
		}

		if (value) {
			this.gl.enable(SAMPLE_COVERAGE);
		} else {
			this.gl.disable(SAMPLE_COVERAGE);
		}

		this.doSampleCoverageCache = value;
	}

	/**
	 * A single floating-point coverage value.
	 * @internal
	 */
	private sampleCoverageValueCache?: number;

	/**
	 * A single floating-point coverage value.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/sampleCoverage | sampleCoverage}
	 */
	public get sampleCoverageValue(): number {
		return (this.sampleCoverageValueCache ??= this.doPrefillCache
			? 1
			: this.gl.getParameter(SAMPLE_COVERAGE_VALUE));
	}

	public set sampleCoverageValue(value: number) {
		if (value === this.sampleCoverageValue) {
			return;
		}

		this.gl.sampleCoverage(value, this.sampleCoverageInvert);
		this.sampleCoverageValueCache = value;
	}

	/**
	 * Whether or not the coverage masks should be inverted.
	 * @internal
	 */
	private sampleCoverageInvertCache?: boolean;

	/**
	 * Whether or not the coverage masks should be inverted.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/sampleCoverage | sampleCoverage}
	 */
	public get sampleCoverageInvert(): boolean {
		return (this.sampleCoverageInvertCache ??= this.doPrefillCache
			? false
			: this.gl.getParameter(SAMPLE_COVERAGE_INVERT));
	}

	public set sampleCoverageInvert(value: boolean) {
		if (value === this.sampleCoverageInvert) {
			return;
		}

		this.gl.sampleCoverage(this.sampleCoverageValue, value);
		this.sampleCoverageInvertCache = value;
	}

	/**
	 * The blend color.
	 * @internal
	 */
	private blendColorCache?: Color;

	/**
	 * The blend color.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor | blendColor}
	 */
	public get blendColor(): Color {
		return (this.blendColorCache ??= this.doPrefillCache
			? new Float32Array([0, 0, 0, 0])
			: this.gl.getParameter(BLEND_COLOR));
	}

	public set blendColor(value: Color) {
		if (
			this.blendColor[0] === value[0] &&
			this.blendColor[1] === value[1] &&
			this.blendColor[2] === value[2] &&
			this.blendColor[3] === value[3]
		) {
			return;
		}

		this.gl.blendColor(value[0], value[1], value[2], value[3]);
		this.blendColorCache = value;
	}

	/**
	 * The RGB and alpha blend equations.
	 * @internal
	 */
	private blendEquationCache?: BlendEquationSet;

	/**
	 * Create the blend equation cache.
	 * @returns The blend equation cache.
	 * @internal
	 */
	private makeBlendEquationCache(): Uint8Array & BlendEquationSet {
		return this.doPrefillCache
			? (new Uint8Array([
					BlendEquation.FUNC_ADD,
					BlendEquation.FUNC_ADD
				]) as Uint8Array & BlendEquationSet)
			: (new Uint8Array([
					this.gl.getParameter(BLEND_EQUATION_RGB),
					this.gl.getParameter(BLEND_EQUATION_ALPHA)
				]) as Uint8Array & BlendEquationSet);
	}

	/**
	 * The RGB and alpha blend equations.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation | blendEquation}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate | blendEquationSeparate}
	 */
	public get blendEquation(): BlendEquationSet {
		return (this.blendEquationCache ??= this.makeBlendEquationCache());
	}

	public set blendEquation(value: BlendEquation | BlendEquationSet) {
		// One value.
		if (typeof value === "number") {
			if (this.blendEquation[0] === value && this.blendEquation[1] === value) {
				return;
			}

			this.gl.blendEquation(value);

			this.blendEquationCache = new Uint8Array([value, value]) as Uint8Array &
				BlendEquationSet;

			return;
		}

		// Set of values.
		if (
			this.blendEquation[0] === value[0] &&
			this.blendEquation[1] === value[1]
		) {
			return;
		}

		this.gl.blendEquationSeparate(value[0], value[1]);

		this.blendEquationCache = new Uint8Array([
			value[0],
			value[1]
		]) as Uint8Array & BlendEquationSet;
	}

	/** The RGB blend equation. */
	public get blendEquationRgb(): BlendEquation {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[0];
	}

	/** The alpha blend equation. */
	public get blendEquationAlpha(): BlendEquation {
		return (this.blendEquationCache ??= this.makeBlendEquationCache())[1];
	}

	/**
	 * Whether or not blending is enabled.
	 * @internal
	 */
	private doBlendCache?: boolean;

	/** Whether or not blending is enabled. */
	public get doBlend(): boolean {
		return (this.doBlendCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(BLEND));
	}

	public set doBlend(value: boolean) {
		if (this.doBlend === value) {
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
	 * @internal
	 */
	private blendFunctionCache?: BlendFunctionFullSet;

	/**
	 * Create the blend function cache.
	 * @returns The blend function cache.
	 * @internal
	 */
	private makeBlendFunctionCache(): Uint8Array & BlendFunctionFullSet {
		return this.doPrefillCache
			? (new Uint8Array([
					BlendFunction.ONE,
					BlendFunction.ZERO,
					BlendFunction.ONE,
					BlendFunction.ZERO
				]) as Uint8Array & BlendFunctionFullSet)
			: (new Uint8Array([
					this.gl.getParameter(BLEND_SRC_RGB),
					this.gl.getParameter(BLEND_DST_RGB),
					this.gl.getParameter(BLEND_SRC_ALPHA),
					this.gl.getParameter(BLEND_DST_ALPHA)
				]) as Uint8Array & BlendFunctionFullSet);
	}

	/**
	 * The source and destination RGB and alpha blend functions.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc | blendFunc}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate | blendFuncSeparate}
	 */
	public get blendFunction(): BlendFunctionFullSet {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache());
	}

	public set blendFunction(value: BlendFunctionSet | BlendFunctionFullSet) {
		// Full set.
		if (2 in value) {
			if (
				this.blendFunction[0] === value[0] &&
				this.blendFunction[1] === value[1] &&
				this.blendFunction[2] === value[2] &&
				this.blendFunction[3] === value[3]
			) {
				return;
			}

			this.gl.blendFuncSeparate(value[0], value[1], value[2], value[3]);

			this.blendFunctionCache = new Uint8Array([
				value[0],
				value[1],
				value[2],
				value[3]
			]) as Uint8Array & BlendFunctionFullSet;

			return;
		}

		// Half set.
		if (
			this.blendFunction[0] === value[0] &&
			this.blendFunction[1] === value[1] &&
			this.blendFunction[2] === value[0] &&
			this.blendFunction[3] === value[1]
		) {
			return;
		}

		this.gl.blendFunc(value[0], value[1]);

		this.blendFunctionCache = new Uint8Array([
			value[0],
			value[1],
			value[0],
			value[1]
		]) as Uint8Array & BlendFunctionFullSet;
	}

	/** The source RGB blend function. */
	public get blendFunctionSourceRgb(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[0];
	}

	/** The destination RGB blend function. */
	public get blendFunctionDestinationRgb(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[1];
	}

	/** The source alpha blend function. */
	public get blendFunctionSourceAlpha(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[2];
	}

	/** The destination alpha blend function. */
	public get blendFunctionDestinationAlpha(): BlendFunction {
		return (this.blendFunctionCache ??= this.makeBlendFunctionCache())[3];
	}

	/**
	 * The code of the most recent WebGL error that has occurred in this context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError | getError}
	 */
	public get error(): ErrorCode {
		return this.gl.getError();
	}

	/**
	 * Throw a JavaScript error if a WebGL error has occurred.
	 * @throws {@link WebglError} if a WebGL error has occurred.
	 */
	public throwIfError(): void {
		const code = this.error;
		if (code !== ErrorCode.NO_ERROR) {
			throw new WebglError(code);
		}
	}

	/**
	 * The value to store in the color buffer when clearing it.
	 * @internal
	 */
	private clearColorCache?: Color;

	/**
	 * The value to store in the color buffer when clearing it.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor | clearColor}
	 */
	public get clearColor(): Color {
		return (this.clearColorCache ??= this.doPrefillCache
			? new Float32Array([0, 0, 0, 0])
			: this.gl.getParameter(COLOR_CLEAR_VALUE));
	}

	public set clearColor(value: Color) {
		if (
			this.clearColor[0] === value[0] &&
			this.clearColor[1] === value[1] &&
			this.clearColor[2] === value[2] &&
			this.clearColor[3] === value[3]
		) {
			return;
		}

		this.gl.clearColor(value[0], value[1], value[2], value[3]);
		this.clearColorCache = value;
	}

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @internal
	 */
	private clearDepthCache?: number;

	/**
	 * The value to store in the depth buffer when clearing it.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth | clearDepth}
	 */
	public get clearDepth(): number {
		return (this.clearDepthCache ??= this.doPrefillCache
			? 1
			: this.gl.getParameter(DEPTH_CLEAR_VALUE));
	}

	public set clearDepth(value: number) {
		if (this.clearDepth === value) {
			return;
		}

		this.gl.clearDepth(value);
		this.clearDepthCache = value;
	}

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @internal
	 */
	private clearStencilCache?: number;

	/**
	 * The value to store in the stencil buffer when clearing it.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil | clearStencil}
	 */
	public get clearStencil(): number {
		return (this.clearStencilCache ??= this.doPrefillCache
			? 0
			: this.gl.getParameter(STENCIL_CLEAR_VALUE));
	}

	public set clearStencil(value: number) {
		if (this.clearStencil === value) {
			return;
		}

		this.gl.clearStencil(value);
		this.clearStencilCache = value;
	}

	/**
	 * The mask that specifies which components to enable or disable when rendering to a framebuffer.
	 * @internal
	 */
	private colorMaskCache?: ColorMask;

	/**
	 * The mask that specifies which components to enable or disable when rendering to a framebuffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask | colorMask}
	 */
	public get colorMask(): ColorMask {
		return (this.colorMaskCache ??= this.doPrefillCache
			? [true, true, true, true]
			: this.gl.getParameter(COLOR_WRITEMASK));
	}

	public set colorMask(value: ColorMask) {
		if (
			this.colorMask[0] === value[0] &&
			this.colorMask[1] === value[1] &&
			this.colorMask[2] === value[2] &&
			this.colorMask[3] === value[3]
		) {
			return;
		}

		this.gl.colorMask(value[0], value[1], value[2], value[3]);
		this.colorMaskCache = value;
	}

	/**
	 * The maximum number of texture units that can be used.
	 * @internal
	 */
	private maxCombinedTextureImageUnitsCache?: number;

	/** The maximum number of texture units that can be used. Effectively all systems support at least `8`. */
	public get maxCombinedTextureImageUnits(): number {
		// Cannot be prefilled (different for every system).
		return (this.maxCombinedTextureImageUnitsCache ??= this.gl.getParameter(
			MAX_COMBINED_TEXTURE_IMAGE_UNITS
		));
	}

	/**
	 * Whether or not polygon culling is enabled.
	 * @internal
	 */
	private doCullFaceCache?: boolean;

	/** Whether or not polygon culling is enabled. */
	public get doCullFace(): boolean {
		return (this.doCullFaceCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(CULL_FACE));
	}

	public set doCullFace(value: boolean) {
		if (this.doCullFace === value) {
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
	 * @internal
	 */
	private cullFaceCache?: Face;

	/**
	 * The direction that polygons should face if they are to be culled.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace | cullFace}
	 */
	public get cullFace(): Face {
		return (this.cullFaceCache ??= this.doPrefillCache
			? Face.BACK
			: this.gl.getParameter(CULL_FACE_MODE));
	}

	public set cullFace(value: Face) {
		if (this.cullFace === value) {
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

	/** Whether or not dithering is enabled. */
	public get doDither(): boolean {
		return (this.doDitherCache ??= this.doPrefillCache
			? true
			: this.gl.isEnabled(DITHER));
	}

	public set doDither(value: boolean) {
		if (this.doDither === value) {
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
	 * @internal
	 */
	private doDepthTestCache?: boolean;

	/** Whether or not depth testing is enabled. */
	public get doDepthTest(): boolean {
		return (this.doDepthTestCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(DEPTH_TEST));
	}

	public set doDepthTest(value: boolean) {
		if (this.doDepthTest === value) {
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
	 * Whether or not the depth buffer can be written to.
	 * @internal
	 */
	private depthMaskCache?: boolean;

	/** Whether or not the depth buffer can be written to. */
	public get depthMask(): boolean {
		return (this.depthMaskCache ??= this.doPrefillCache
			? true
			: this.gl.getParameter(DEPTH_WRITEMASK));
	}

	public set depthMask(value: boolean) {
		if (this.depthMask === value) {
			return;
		}

		this.gl.depthMask(value);
		this.depthMaskCache = value;
	}

	/**
	 * The depth comparison function to use.
	 * @internal
	 */
	private depthFunctionCache?: TestFunction;

	/**
	 * The depth comparison function to use.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc | depthFunc}
	 */
	public get depthFunction(): TestFunction {
		return (this.depthFunctionCache ??= this.doPrefillCache
			? TestFunction.LESS
			: this.gl.getParameter(DEPTH_FUNC));
	}

	public set depthFunction(value: TestFunction) {
		if (this.depthFunction === value) {
			return;
		}

		this.gl.depthFunc(value);
		this.depthFunctionCache = value;
	}

	/**
	 * The depth range mapping from normalized device coordinates to window or viewport coordinates.
	 * @internal
	 */
	private depthRangeCache?: Pair;

	/**
	 * The depth range mapping from normalized device coordinates to window or viewport coordinates.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthRange | depthRange}
	 */
	public get depthRange(): Pair {
		return (this.depthRangeCache ??= this.doPrefillCache
			? new Float32Array([0, 1])
			: this.gl.getParameter(DEPTH_RANGE));
	}

	public set depthRange(value: Pair) {
		if (this.depthRange[0] === value[0] && this.depthRange[1] === value[1]) {
			return;
		}

		this.gl.depthRange(value[0], value[1]);
		this.depthRangeCache = value;
	}

	/**
	 * The alignment to use when unpacking pixel data from memory.
	 * @internal
	 */
	private unpackAlignmentCache?: 1 | 2 | 4 | 8;

	/** The alignment to use when unpacking pixel data from memory. */
	public get unpackAlignment(): 1 | 2 | 4 | 8 {
		return (this.unpackAlignmentCache ??= this.doPrefillCache
			? 4
			: this.gl.getParameter(UNPACK_ALIGNMENT));
	}

	public set unpackAlignment(value: 1 | 2 | 4 | 8) {
		if (this.unpackAlignment === value) {
			return;
		}

		this.gl.pixelStorei(UNPACK_ALIGNMENT, value);
		this.unpackAlignmentCache = value;
	}

	/**
	 * The alignment to use when packing pixel data into memory.
	 * @internal
	 */
	private packAlignmentCache?: 1 | 2 | 4 | 8;

	/** The alignment to use when packing pixel data into memory. */
	public get packAlignment(): 1 | 2 | 4 | 8 {
		return (this.packAlignmentCache ??= this.doPrefillCache
			? 4
			: this.gl.getParameter(PACK_ALIGNMENT));
	}

	public set packAlignment(value: 1 | 2 | 4 | 8) {
		if (this.packAlignment === value) {
			return;
		}

		this.gl.pixelStorei(PACK_ALIGNMENT, value);
		this.packAlignmentCache = value;
	}

	/**
	 * A map of already-enabled WebGL extensions.
	 * @internal
	 */
	private enabledExtensions: Map<Extension, ExtensionObject | null>;

	/**
	 * Enable the specified extension.
	 * @param extension - The extension.
	 * @returns The extension's implementation object.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension | getExtension}
	 */
	public enableExtension(extension: Extension): ExtensionObject | null {
		let out = this.enabledExtensions.get(extension);
		if (typeof out !== "undefined") {
			return out;
		}

		out = this.gl.getExtension(extension) as ExtensionObject | null;
		this.enabledExtensions.set(extension, out);
		return out;
	}

	/**
	 * A list of supported extensions.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions | getSupportedExtensions}
	 */
	public get supportedExtensions(): readonly Extension[] {
		return this.gl.getSupportedExtensions() as readonly Extension[];
	}

	/**
	 * Whether or not the scissor test is enabled.
	 * @internal
	 */
	private doScissorTestCache?: boolean;

	/** Whether or not the scissor test is enabled. */
	public get doScissorTest(): boolean {
		return (this.doScissorTestCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(SCISSOR_TEST));
	}

	public set doScissorTest(value: boolean) {
		if (this.doScissorTest === value) {
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
	 * @internal
	 */
	private scissorBoxCache?: Rectangle;

	/**
	 * The scissor box, which limits drawing to a specified rectangle.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor | scissor}
	 */
	public get scissorBox(): Rectangle {
		// Cannot be prefilled (depends on initial canvas size).
		return (this.scissorBoxCache ??= this.gl.getParameter(SCISSOR_BOX));
	}

	public set scissorBox(value: Rectangle) {
		if (
			this.scissorBox[0] === value[0] &&
			this.scissorBox[1] === value[1] &&
			this.scissorBox[2] === value[2] &&
			this.scissorBox[3] === value[3]
		) {
			return;
		}

		this.gl.scissor(value[0], value[1], value[2], value[3]);
		this.scissorBoxCache = value;
	}

	/**
	 * The maximum dimensions of the viewport.
	 * @internal
	 */
	private maxViewportDimsCache?: Pair;

	/** The maximum dimensions of the viewport. Effectively all systems support at least `[4096, 4096]`. */
	public get maxViewportDims(): Pair {
		// Cannot be prefilled (different for every system).
		return (this.maxViewportDimsCache ??= this.gl.getParameter(
			MAX_VIEWPORT_DIMS
		) as Int32Array & Pair);
	}

	/**
	 * The maximum available anisotropy.
	 * @internal
	 */
	private maxTextureMaxAnisotropyCache?: number;

	/**
	 * The maximum available anisotropy.
	 * @throws {@link UnsupportedOperationError} if the anisotropic filtering extension is not available.
	 */
	public get maxTextureMaxAnisotropy(): number {
		if (!this.enableExtension(Extension.TextureFilterAnisotropic)) {
			throw new UnsupportedOperationError(
				"The environment does not support anisotropic filtering."
			);
		}

		// Cannot be prefilled (different for every system).
		return (this.maxTextureMaxAnisotropyCache ??= this.gl.getParameter(
			MAX_TEXTURE_MAX_ANISOTROPY_EXT
		));
	}

	/**
	 * The viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @internal
	 */
	private viewportCache?: Rectangle;

	/**
	 * The viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport | viewport}
	 * @throws {@link BadValueError} if set larger than `MAX_VIEWPORT_DIMS`.
	 */
	public get viewport(): Rectangle {
		// Cannot be prefilled (depends on initial canvas size).
		return (this.viewportCache ??= this.gl.getParameter(VIEWPORT));
	}

	public set viewport(value: Rectangle) {
		if (
			this.viewport[0] === value[0] &&
			this.viewport[1] === value[1] &&
			this.viewport[2] === value[2] &&
			this.viewport[3] === value[3]
		) {
			return;
		}

		if (
			value[0] + value[2] > this.maxViewportDims[0] ||
			value[1] + value[3] > this.maxViewportDims[1]
		) {
			throw new BadValueError(
				`The viewport dimensions may not exceed (${this.maxViewportDims[0].toString()}, ${this.maxViewportDims[1].toString()})`
			);
		}

		this.gl.viewport(value[0], value[1], value[2], value[3]);
		this.viewportCache = value;
	}

	/**
	 * Whether or not stencil testing is enabled.
	 * @internal
	 */
	private doStencilTestCache?: boolean;

	/** Whether or not stencil testing is enabled. */
	public get doStencilTest(): boolean {
		return (this.doStencilTestCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(STENCIL_TEST));
	}

	public set doStencilTest(value: boolean) {
		if (value === this.doStencilTest) {
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
	 * @internal
	 */
	private frontStencilCache?: Stencil;

	/**
	 * The front stencil test function, reference, and mask.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate | stencilFuncSeparate}
	 */
	public get frontStencil(): Stencil {
		return (this.frontStencilCache ??= this.doPrefillCache
			? [TestFunction.ALWAYS, 0, 0x7fffffff]
			: [
					this.gl.getParameter(STENCIL_FUNC),
					this.gl.getParameter(STENCIL_REF),
					this.gl.getParameter(STENCIL_VALUE_MASK)
				]);
	}

	public set frontStencil(value: Stencil) {
		if (
			this.frontStencil[0] === value[0] &&
			this.frontStencil[1] === value[1] &&
			this.frontStencil[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFuncSeparate(Face.FRONT, value[0], value[1], value[2]);
	}

	/**
	 * The back stencil test function, reference, and mask.
	 * @internal
	 */
	private backStencilCache?: Stencil;

	/**
	 * The back stencil test function, reference, and mask.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate | stencilFuncSeparate}
	 */
	public get backStencil(): Stencil {
		return (this.backStencilCache ??= this.doPrefillCache
			? [TestFunction.ALWAYS, 0, 0x7fffffff]
			: [
					this.gl.getParameter(STENCIL_BACK_FUNC),
					this.gl.getParameter(STENCIL_BACK_REF),
					this.gl.getParameter(STENCIL_BACK_VALUE_MASK)
				]);
	}

	public set backStencil(value: Stencil) {
		if (
			this.backStencil[0] === value[0] &&
			this.backStencil[1] === value[1] &&
			this.backStencil[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFuncSeparate(Face.BACK, value[0], value[1], value[2]);
	}

	/**
	 * The front and back stencil test functions, references, and masks.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc | stencilFunc}
	 */
	public get stencil(): Stencil {
		return this.frontStencil;
	}

	public set stencil(value: Stencil) {
		if (
			this.frontStencil[0] === value[0] &&
			this.frontStencil[1] === value[1] &&
			this.frontStencil[2] === value[2] &&
			this.backStencil[0] === value[0] &&
			this.backStencil[1] === value[1] &&
			this.backStencil[2] === value[2]
		) {
			return;
		}

		this.gl.stencilFunc(value[0], value[1], value[2]);
		this.frontStencilCache = value;
		this.backStencilCache = value;
	}

	/**
	 * Whether or not primitives are discarded immediately before the rasterization stage.
	 * @internal
	 */
	private doRasterizerDiscardCache?: boolean;

	/** Whether or not primitives are discarded immediately before the rasterization stage. */
	public get doRasterizerDiscard(): boolean {
		return (this.doRasterizerDiscardCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(RASTERIZER_DISCARD));
	}

	public set doRasterizerDiscard(value: boolean) {
		if (this.doRasterizerDiscard === value) {
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
	 * The rotational orientation of front-facing polygons.
	 * @internal
	 */
	private frontFaceCache?: Orientation;

	/**
	 * The rotational orientation of front-facing polygons.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace | frontFace}
	 */
	public get frontFace(): Orientation {
		return (this.frontFaceCache ??= this.doPrefillCache
			? Orientation.CCW
			: this.gl.getParameter(FRONT_FACE));
	}

	public set frontFace(value: Orientation) {
		if (this.frontFace === value) {
			return;
		}

		this.gl.frontFace(value);
		this.frontFaceCache = value;
	}

	/**
	 * Whether or not adding an offset to depth values of polygon fragments is enabled.
	 * @internal
	 */
	private doPolygonOffsetFillCache?: boolean;

	/** Whether or not adding an offset to depth values of polygon fragments is enabled. */
	public get doPolygonOffsetFill(): boolean {
		return (this.doPolygonOffsetFillCache ??= this.doPrefillCache
			? false
			: this.gl.isEnabled(POLYGON_OFFSET_FILL));
	}

	public set doPolygonOffsetFill(value: boolean) {
		if (this.doPolygonOffsetFill === value) {
			return;
		}

		if (value) {
			this.gl.enable(POLYGON_OFFSET_FILL);
		} else {
			this.gl.disable(POLYGON_OFFSET_FILL);
		}

		this.doPolygonOffsetFillCache = value;
	}

	/**
	 * The scale factor for the variable depth offset for each polygon.
	 * @internal
	 */
	private polygonOffsetFactorCache?: number;

	/**
	 * The scale factor for the variable depth offset for each polygon.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset | polygonOffset}
	 */
	public get polygonOffsetFactor(): number {
		return (this.polygonOffsetFactorCache ??= this.doPrefillCache
			? 0
			: this.gl.getParameter(POLYGON_OFFSET_FACTOR));
	}

	public set polygonOffsetFactor(value: number) {
		if (value === this.polygonOffsetFactor) {
			return;
		}

		this.gl.polygonOffset(value, this.polygonOffsetUnits);
		this.polygonOffsetFactorCache = value;
	}

	/**
	 * The multiplier with which an implementation-specific value is multiplied to create a constant depth offset.
	 * @internal
	 */
	private polygonOffsetUnitsCache?: number;

	/**
	 * The multiplier with which an implementation-specific value is multiplied to create a constant depth offset.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset | polygonOffset}
	 */
	public get polygonOffsetUnits(): number {
		return (this.polygonOffsetUnitsCache ??= this.doPrefillCache
			? 0
			: this.gl.getParameter(POLYGON_OFFSET_UNITS));
	}

	public set polygonOffsetUnits(value: number) {
		if (value === this.polygonOffsetUnits) {
			return;
		}

		this.gl.polygonOffset(this.polygonOffsetFactor, value);
		this.polygonOffsetUnitsCache = value;
	}

	/**
	 * The maximum number of draw buffers.
	 * @internal
	 */
	private maxDrawBuffersCache?: number;

	/** The maximum number of draw buffers. */
	public get maxDrawBuffers(): number {
		// Cannot be prefilled (different for every system).
		return (this.maxDrawBuffersCache ??=
			this.gl.getParameter(MAX_DRAW_BUFFERS));
	}

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size.
	 * @returns Whether or not the drawing buffer was resized.
	 */
	public fitDrawingBuffer(): boolean {
		if (this.canvas instanceof OffscreenCanvas) {
			return false; // Cannot resize an offscreen canvas.
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

	/**
	 * Resize this rendering context's viewport to match the size of a drawing buffer.
	 * @param framebuffer - The framebuffer to fit the size of, or `undefined` for the default framebuffer (canvas).
	 * @throws {@link BadValueError} if the framebuffer is larger than `MAX_VIEWPORT_DIMS`.
	 */
	public fitViewport(framebuffer?: Framebuffer): void {
		this.viewport = framebuffer
			? [0, 0, framebuffer.width, framebuffer.height]
			: [0, 0, this.canvas.width, this.canvas.height];
	}

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size and resizes the viewport to match the given framebuffer.
	 * @param framebuffer - The framebuffer to fit the size of, or `undefined` for the default framebuffer (canvas).
	 * @throws {@link BadValueError} if the framebuffer is larger than `MAX_VIEWPORT_DIMS`.
	 * @returns Whether or not the drawing buffer was resized.
	 */
	public resize(framebuffer?: Framebuffer): boolean;

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size and resizes the viewport to match the given size.
	 * @param rectangle - The rectangle that represents the viewport.
	 * @throws {@link BadValueError} if the rectangle is larger than `MAX_VIEWPORT_DIMS`.
	 * @returns Whether or not the drawing buffer was resized.
	 */
	public resize(rectangle: Rectangle): boolean;

	public resize(shape?: Rectangle | Framebuffer): boolean {
		const out = this.fitDrawingBuffer();

		if (shape && 0 in shape) {
			this.viewport = shape;
		} else {
			this.fitViewport(shape);
		}

		return out;
	}

	/**
	 * Block execution until all previously-called commands are finished.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/finish | finish}
	 */
	public finish(): void {
		this.gl.finish();
	}

	/**
	 * Empty different buffer commands, causing all commands to be executed as quickly as possible.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/flush | flush}
	 */
	public flush(): void {
		this.gl.flush();
	}
}
