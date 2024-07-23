// TODO: Ensure that parameters are never set over their limits; warn if set over the common level of support: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits.
// TODO: Remove various checks for production builds: https://webpack.js.org/plugins/define-plugin/.

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
	MAX_DRAW_BUFFERS,
	MAX_VIEWPORT_DIMS,
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
} from "../constants/constants.js";
import ApiInterface from "./internal/ApiInterface.js";
import BadValueError from "../utility/BadValueError.js";
import type BlendEquation from "../constants/BlendEquation.js";
import type BlendEquationSet from "../types/BlendEquationSet.js";
import type BlendFunction from "../constants/BlendFunction.js";
import type BlendFunctionFullSet from "../types/BlendFunctionFullSet.js";
import type BlendFunctionSet from "../types/BlendFunctionSet.js";
import type Color from "../types/Color.js";
import type ColorMask from "../types/ColorMask.js";
import ErrorCode from "../constants/ErrorCode.js";
import type Extension from "../constants/Extension.js";
import type { ExtensionObject } from "../types/ExtensionObject.js";
import Face from "../constants/Face.js";
import Framebuffer from "./Framebuffer.js";
import FramebufferTarget from "../constants/FramebufferTarget.js";
import type Orientation from "../constants/Orientation.js";
import type Rectangle from "../types/Rectangle.js";
import type Stencil from "../types/Stencil.js";
import type TestFunction from "../constants/TestFunction.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";
import WebglError from "../utility/WebglError.js";

/**
 * A WebGL2 rendering context.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext | WebGL2RenderingContext}
 * @public
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext | getContext}
	 * @throws {@link UnsupportedOperationError} if a WebGL2 context cannot be created.
	 */
	public constructor(
		canvas: HTMLCanvasElement | OffscreenCanvas,
		options?: WebGLContextAttributes
	);

	public constructor(
		source: WebGL2RenderingContext | HTMLCanvasElement | OffscreenCanvas,
		options?: WebGLContextAttributes
	) {
		if (source instanceof WebGL2RenderingContext) {
			super(source);
		} else {
			const gl = source.getContext("webgl2", options);
			// Second clause is necessary because TypeDoc incorrectly identifies `gl` as a `RenderingContext`.
			if (gl === null || !(gl instanceof WebGL2RenderingContext)) {
				throw new UnsupportedOperationError(
					"The environment does not support WebGL2."
				);
			}
			super(gl);
		}

		this.canvas = this.gl.canvas;
		this.enabledExtensions = new Map();
	}

	/** The canvas of this rendering context. */
	public readonly canvas: HTMLCanvasElement | OffscreenCanvas;

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

	public set drawingBufferColorSpace(value) {
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
		return (this.activeTextureCache ??=
			this.gl.getParameter(ACTIVE_TEXTURE) - TEXTURE0);
	}

	public set activeTexture(value) {
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
	 * The blend color.
	 * @internal
	 */
	private blendColorCache?: Color;

	/**
	 * The blend color.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor | blendColor}
	 */
	public get blendColor(): Color {
		return (this.blendColorCache ??= this.gl.getParameter(BLEND_COLOR));
	}

	public set blendColor(value) {
		if (
			typeof this.blendColor !== "undefined" &&
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
	private makeBlendEquationCache() {
		return new Uint8Array([
			this.gl.getParameter(BLEND_EQUATION_RGB),
			this.gl.getParameter(BLEND_EQUATION_ALPHA)
		]) as Uint8Array & BlendEquationSet;
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
			if (
				typeof this.blendEquation !== "undefined" &&
				this.blendEquation[0] === value &&
				this.blendEquation[1] === value
			) {
				return;
			}

			this.gl.blendEquation(value);

			this.blendEquationCache = new Uint8Array([value, value]) as Uint8Array &
				BlendEquationSet;

			return;
		}

		// Set of values.
		if (
			typeof this.blendEquation !== "undefined" &&
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
		return (this.doBlendCache ??= this.gl.isEnabled(BLEND));
	}

	public set doBlend(value) {
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
	private makeBlendFunctionCache() {
		return new Uint8Array([
			this.gl.getParameter(BLEND_SRC_RGB),
			this.gl.getParameter(BLEND_DST_RGB),
			this.gl.getParameter(BLEND_SRC_ALPHA),
			this.gl.getParameter(BLEND_DST_ALPHA)
		]) as Uint8Array & BlendFunctionFullSet;
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
				typeof this.blendFunction !== "undefined" &&
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
			typeof this.blendFunction !== "undefined" &&
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
		return (this.clearColorCache ??= this.gl.getParameter(COLOR_CLEAR_VALUE));
	}

	public set clearColor(value) {
		if (
			typeof this.clearColor !== "undefined" &&
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
		return (this.clearDepthCache ??= this.gl.getParameter(DEPTH_CLEAR_VALUE));
	}

	public set clearDepth(value) {
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
		return (this.clearStencilCache ??=
			this.gl.getParameter(STENCIL_CLEAR_VALUE));
	}

	public set clearStencil(value) {
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
		return (this.colorMaskCache ??= this.gl.getParameter(COLOR_WRITEMASK));
	}

	public set colorMask(value) {
		if (
			typeof this.colorMask !== "undefined" &&
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

	/** The maximum number of texture units that can be used. */
	public get maxCombinedTextureImageUnits(): number {
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
		return (this.doCullFaceCache ??= this.gl.isEnabled(CULL_FACE));
	}

	public set doCullFace(value) {
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
		return (this.cullFaceCache ??= this.gl.getParameter(CULL_FACE_MODE));
	}

	public set cullFace(value) {
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
		return (this.doDitherCache ??= this.gl.isEnabled(DITHER));
	}

	public set doDither(value) {
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
		return (this.doDepthTestCache ??= this.gl.isEnabled(DEPTH_TEST));
	}

	public set doDepthTest(value) {
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
	 * The depth comparison function to use.
	 * @internal
	 */
	private depthFunctionCache?: TestFunction;

	/**
	 * The depth comparison function to use.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc | depthFunc}
	 */
	public get depthFunction(): TestFunction {
		return (this.depthFunctionCache ??= this.gl.getParameter(DEPTH_FUNC));
	}

	public set depthFunction(value) {
		if (this.depthFunction === value) {
			return;
		}

		this.gl.depthFunc(value);
		this.depthFunctionCache = value;
	}

	/**
	 * The alignment to use when unpacking pixel data from memory.
	 * @internal
	 */
	private unpackAlignmentCache?: 1 | 2 | 4 | 8;

	/** The alignment to use when unpacking pixel data from memory. */
	public get unpackAlignment(): 1 | 2 | 4 | 8 {
		return (this.unpackAlignmentCache ??=
			this.gl.getParameter(UNPACK_ALIGNMENT));
	}

	public set unpackAlignment(value) {
		if (this.unpackAlignment === value) {
			return;
		}

		this.gl.pixelStorei(UNPACK_ALIGNMENT, value);
		this.unpackAlignmentCache = value;
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
	public get supportedExtensions() {
		return this.gl.getSupportedExtensions() as Extension[];
	}

	/**
	 * Whether or not the scissor test is enabled.
	 * @internal
	 */
	private doScissorTestCache?: boolean;

	/** Whether or not the scissor test is enabled. */
	public get doScissorTest(): boolean {
		return (this.doScissorTestCache ??= this.gl.isEnabled(SCISSOR_TEST));
	}

	public set doScissorTest(value) {
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
		return (this.scissorBoxCache ??= this.gl.getParameter(SCISSOR_BOX));
	}

	public set scissorBox(value) {
		if (
			typeof this.scissorBox !== "undefined" &&
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
	private maxViewportDimsCache?: Rectangle;

	/** The maximum dimensions of the viewport. */
	public get maxViewportDims(): Rectangle {
		if (typeof this.maxViewportDimsCache === "undefined") {
			const dims = this.gl.getParameter(MAX_VIEWPORT_DIMS) as [number, number];
			this.maxViewportDimsCache = new Int32Array([
				0,
				0,
				dims[0],
				dims[1]
			]) as Int32Array & Rectangle;
		}

		return this.maxViewportDimsCache;
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
		return (this.viewportCache ??= this.gl.getParameter(VIEWPORT));
	}

	public set viewport(value) {
		if (
			typeof this.viewport !== "undefined" &&
			this.viewport[0] === value[0] &&
			this.viewport[1] === value[1] &&
			this.viewport[2] === value[2] &&
			this.viewport[3] === value[3]
		) {
			return;
		}

		if (
			value[0] + value[2] > this.maxViewportDims[2] ||
			value[1] + value[3] > this.maxViewportDims[3]
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
		return (this.doStencilTestCache ??= this.gl.isEnabled(STENCIL_TEST));
	}

	public set doStencilTest(value) {
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
		return (this.frontStencilCache ??= [
			this.gl.getParameter(STENCIL_FUNC),
			this.gl.getParameter(STENCIL_REF),
			this.gl.getParameter(STENCIL_VALUE_MASK)
		]);
	}

	public set frontStencil(value) {
		if (
			typeof this.frontStencil !== "undefined" &&
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
		return (this.backStencilCache ??= [
			this.gl.getParameter(STENCIL_BACK_FUNC),
			this.gl.getParameter(STENCIL_BACK_REF),
			this.gl.getParameter(STENCIL_BACK_VALUE_MASK)
		]);
	}

	public set backStencil(value) {
		if (
			typeof this.backStencil !== "undefined" &&
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

	public set stencil(value) {
		if (
			typeof this.frontStencil !== "undefined" &&
			this.frontStencil[0] === value[0] &&
			this.frontStencil[1] === value[1] &&
			this.frontStencil[2] === value[2] &&
			typeof this.backStencil !== "undefined" &&
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
		return (this.doRasterizerDiscardCache ??=
			this.gl.isEnabled(RASTERIZER_DISCARD));
	}

	public set doRasterizerDiscard(value) {
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
		return (this.frontFaceCache ??= this.gl.getParameter(FRONT_FACE));
	}

	public set frontFace(value) {
		if (this.frontFace === value) {
			return;
		}

		this.gl.frontFace(value);
		this.frontFaceCache = value;
	}

	/**
	 * The maximum number of draw buffers.
	 * @internal
	 */
	private maxDrawBuffersCache?: number;

	/** The maximum number of draw buffers. */
	public get maxDrawBuffers(): number {
		return (this.maxDrawBuffersCache ??=
			this.gl.getParameter(MAX_DRAW_BUFFERS));
	}

	/**
	 * Clear the specified buffers to the specified values.
	 * @param color - The value to clear the color buffer to or a boolean to use the previous clear color.
	 * @param depth - The value to clear the depth buffer to or a boolean to use the previous clear depth.
	 * @param stencil - The value to clear the stencil buffer to or a boolean to use the previous clear stencil.
	 * @param framebuffer - The framebuffer to clear, or `null` for the default framebuffer (canvas).
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear | clear}
	 */
	public clear(
		color: Color | boolean = true,
		depth: number | boolean = true,
		stencil: number | boolean = true,
		framebuffer: Framebuffer | null = null
	): void {
		let colorBit = color ? COLOR_BUFFER_BIT : 0;
		if (typeof color !== "boolean") {
			this.clearColor = color;
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = depth ? DEPTH_BUFFER_BIT : 0;
		if (typeof depth !== "boolean") {
			this.clearDepth = depth;
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = stencil ? STENCIL_BUFFER_BIT : 0;
		if (typeof stencil !== "boolean") {
			this.clearStencil = stencil;
			stencilBit = STENCIL_BUFFER_BIT;
		}

		if (framebuffer === null) {
			Framebuffer.unbindGl(this.gl, FramebufferTarget.DRAW_FRAMEBUFFER);
		} else {
			framebuffer.bind(FramebufferTarget.DRAW_FRAMEBUFFER);
		}

		this.gl.clear(colorBit | depthBit | stencilBit);
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
	 * Resize this rendering context's viewport to match the size of its current drawing buffer.
	 * @throws {@link BadValueError} if the canvas is larger than `MAX_VIEWPORT_DIMS`.
	 */
	public fitViewport(): void {
		this.viewport = [0, 0, this.canvas.width, this.canvas.height];
	}

	/**
	 * Resize this rendering context's canvas' drawing buffer to match its physical size and resizes the viewport to match the given size.
	 * @param rectangle - The rectangle that represents the viewport, or `undefined` to match the viewport to the drawing buffer.
	 * @throws {@link BadValueError} if the rectangle (or canvas) is larger than `MAX_VIEWPORT_DIMS`.
	 * @returns Whether or not the drawing buffer was resized.
	 */
	public resize(rectangle?: Rectangle): boolean {
		const out = this.fitDrawingBuffer();

		if (typeof rectangle === "undefined") {
			this.fitViewport();
		} else {
			this.viewport = rectangle;
		}

		return out;
	}
}
