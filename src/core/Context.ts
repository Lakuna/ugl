import HeadlessEnvironmentError from "#HeadlessEnvironmentError";
import type { Canvas } from "#Canvas";
import type PowerPreference from "#PowerPreference";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type BlendFunctionSet from "#BlendFunctionSet";
import {
	BLEND,
	BLEND_SRC_RGB,
	BLEND_SRC_ALPHA,
	BLEND_DST_RGB,
	BLEND_DST_ALPHA,
	CULL_FACE,
	CULL_FACE_MODE,
	DITHER,
	DEPTH_TEST,
	DEPTH_FUNC,
	POLYGON_OFFSET_FILL,
	POLYGON_OFFSET_FACTOR,
	POLYGON_OFFSET_UNITS,
	SAMPLE_ALPHA_TO_COVERAGE,
	SAMPLE_COVERAGE,
	SAMPLE_COVERAGE_VALUE,
	SAMPLE_COVERAGE_INVERT,
	SCISSOR_TEST,
	SCISSOR_BOX,
	VIEWPORT,
	STENCIL_TEST,
	STENCIL_FUNC,
	STENCIL_REF,
	STENCIL_VALUE_MASK,
	STENCIL_BACK_FUNC,
	STENCIL_BACK_REF,
	STENCIL_BACK_VALUE_MASK,
	RASTERIZER_DISCARD,
	FRONT_FACE,
	COLOR_BUFFER_BIT,
	DEPTH_BUFFER_BIT,
	STENCIL_BUFFER_BIT
} from "#constants";
import FaceDirection from "#FaceDirection";
import type TestFunction from "#TestFunction";
import type PolygonOffset from "#PolygonOffset";
import type MultiSampleCoverageParameters from "#MultiSampleCoverageParameters";
import type Box from "#Box";
import type StencilTestSet from "#StencilTestSet";
import type WindingOrientation from "#WindingOrientation";
import type Extension from "#Extension";
import type { ExtensionObject } from "#ExtensionObject";
import type { ColorLike } from "#ColorLike";

/** A WebGL2 rendering context. */
export default class Context {
	/**
	 * Creates a rendering context.
	 * @param gl The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Creates a rendering context.
	 * @param canvas The canvas of the rendering context.
	 * @param alpha Whether the canvas contains an alpha buffer.
	 * @param depth Whether the drawing buffer should have a depth buffer of at
	 * least 16 bits.
	 * @param stencil Whether the drawing buffer should have a stencil buffer
	 * of at least 8 bits.
	 * @param desynchronized Whether the user agent should reduce latency by
	 * desynchronizing the canvas paint cycle from the event loop.
	 * @param antialias Whether or not to perform anti-aliasing if possible.
	 * @param failIfMajorPerformanceCaveat Whether the context will fail to be
	 * created if the system performance is low or if no hardware GPU is
	 * available.
	 * @param powerPreference Which configuration of GPU is suitable for the
	 * context.
	 * @param premultipliedAlpha Whether the page compositor will assume that
	 * the drawing buffer contains colors with pre-multiplied alpha.
	 * @param preserveDrawingBuffer Whether the buffers will preserve their
	 * values until cleared or overwritten by the author.
	 */
	public constructor(
		canvas: Canvas,
		alpha?: boolean,
		depth?: boolean,
		stencil?: boolean,
		desynchronized?: boolean,
		antialias?: boolean,
		failIfMajorPerformanceCaveat?: boolean,
		powerPreference?: PowerPreference,
		premultipliedAlpha?: boolean,
		preserveDrawingBuffer?: boolean
	);

	public constructor(
		src: WebGL2RenderingContext | Canvas,
		alpha?: boolean,
		depth?: boolean,
		stencil?: boolean,
		desynchronized?: boolean,
		antialias?: boolean,
		failIfMajorPerformanceCaveat?: boolean,
		powerPreference?: PowerPreference,
		premultipliedAlpha?: boolean,
		preserveDrawingBuffer?: boolean
	) {
		if (typeof document == "undefined") {
			throw new HeadlessEnvironmentError();
		}
		if (typeof WebGL2RenderingContext == "undefined") {
			throw new UnsupportedOperationError();
		}

		if (src instanceof WebGL2RenderingContext) {
			this.internal = src;
			this.canvas = src.canvas;
		} else {
			this.canvas = src;
			const gl: WebGL2RenderingContext | null = src.getContext("webgl2", {
				alpha,
				depth,
				stencil,
				desynchronized,
				antialias,
				failIfMajorPerformanceCaveat,
				powerPreference,
				premultipliedAlpha,
				preserveDrawingBuffer
			}) as WebGL2RenderingContext | null;
			if (!gl) {
				throw new UnsupportedOperationError();
			}
			this.internal = gl;
		}

		this.extensions = new Map();
	}

	/** This rendering context. */
	public readonly internal: WebGL2RenderingContext;

	/** The canvas of this rendering context. */
	public readonly canvas: Canvas;

	/**
	 * The blending functions. Disables blending if not defined.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public get blendFunctions(): BlendFunctionSet | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(BLEND)) {
			return undefined;
		}

		return {
			srcRgb: this.internal.getParameter(BLEND_SRC_RGB),
			srcAlpha: this.internal.getParameter(BLEND_SRC_ALPHA),
			dstRgb: this.internal.getParameter(BLEND_DST_RGB),
			dstAlpha: this.internal.getParameter(BLEND_DST_ALPHA)
		};
	}

	/**
	 * The blending functions. Disables blending if not defined.
	 * @see [`blendFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public set blendFunctions(value: BlendFunctionSet | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(BLEND);
		} else {
			this.internal.enable(BLEND);
			this.internal.blendFuncSeparate(
				value.srcRgb,
				value.dstRgb,
				value.srcAlpha,
				value.dstAlpha
			);
		}
	}

	/**
	 * The direction that polygons face to be culled. Disables polygon culling
	 * if not defined.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public get cullFace(): FaceDirection | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(CULL_FACE)) {
			return undefined;
		}

		return this.internal.getParameter(CULL_FACE_MODE);
	}

	/**
	 * The direction that polygons face to be culled. Disables polygon culling
	 * if not defined.
	 * @see [`cullFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public set cullFace(value: FaceDirection | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(CULL_FACE);
		} else {
			this.internal.enable(CULL_FACE);
			this.internal.cullFace(value);
		}
	}

	/**
	 * Whether color components are dithered before they get written to the
	 * color buffer.
	 */
	public get doDither(): boolean {
		// TODO: Optional caching.
		return this.internal.isEnabled(DITHER);
	}

	/**
	 * Whether color components are dithered before they get written to the
	 * color buffer.
	 */
	public set doDither(value: boolean) {
		// TODO: Optional caching.
		if (value) {
			this.internal.enable(DITHER);
		} else {
			this.internal.disable(DITHER);
		}
	}

	/**
	 * The depth comparison function in use. Disables the depth test if not
	 * defined.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public get depthFunction(): TestFunction | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(DEPTH_TEST)) {
			return undefined;
		}

		return this.internal.getParameter(DEPTH_FUNC);
	}

	/**
	 * The depth comparison function in use. Disables the depth test if not
	 * defined.
	 * @see [`depthFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public set depthFunction(value: TestFunction | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(DEPTH_TEST);
		} else {
			this.internal.enable(DEPTH_TEST);
			this.internal.depthFunc(value);
		}
	}

	/**
	 * The scale factor and units used to calculate depth values. Disables
	 * polygon offset fill if not defined.
	 * @see [`polygonOffset`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset)
	 */
	public get polygonOffset(): PolygonOffset | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(POLYGON_OFFSET_FILL)) {
			return undefined;
		}

		return {
			factor: this.internal.getParameter(POLYGON_OFFSET_FACTOR),
			units: this.internal.getParameter(POLYGON_OFFSET_UNITS)
		};
	}

	/**
	 * The scale factor and units used to calculate depth values. Disables
	 * polygon offset fill if not defined.
	 * @see [`polygonOffset`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset)
	 */
	public set polygonOffset(value: PolygonOffset | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(POLYGON_OFFSET_FILL);
		} else {
			this.internal.enable(POLYGON_OFFSET_FILL);
			this.internal.polygonOffset(value.factor, value.units);
		}
	}

	/**
	 * Whether a temporary coverage value is computed based on the alpha value.
	 */
	public get doSampleAlphaToCoverage(): boolean {
		// TODO: Optional caching.
		return this.internal.isEnabled(SAMPLE_ALPHA_TO_COVERAGE);
	}

	/**
	 * Whether a temporary coverage value is computed based on the alpha value.
	 */
	public set doSampleAlphaToCoverage(value: boolean) {
		// TODO: Optional caching.
		if (value) {
			this.internal.enable(SAMPLE_ALPHA_TO_COVERAGE);
		} else {
			this.internal.disable(SAMPLE_ALPHA_TO_COVERAGE);
		}
	}

	/**
	 * Whether fragments should be combined with the temporary coverage value.
	 * Disabled if not defined.
	 */
	public get sampleCoverage(): MultiSampleCoverageParameters | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(SAMPLE_COVERAGE)) {
			return undefined;
		}

		return {
			value: this.internal.getParameter(SAMPLE_COVERAGE_VALUE),
			invert: this.internal.getParameter(SAMPLE_COVERAGE_INVERT)
		};
	}

	/**
	 * Whether fragments should be combined with the temporary coverage value.
	 * Disabled if not defined.
	 */
	public set sampleCoverage(value: MultiSampleCoverageParameters | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(SAMPLE_COVERAGE);
		} else {
			this.internal.enable(SAMPLE_COVERAGE);
			this.internal.sampleCoverage(value.value, value.invert);
		}
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle. Disabled
	 * if not defined.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public get scissorBox(): Box | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(SCISSOR_TEST)) {
			return undefined;
		}

		const raw: Int32Array = this.internal.getParameter(SCISSOR_BOX);
		return {
			x: raw[0] as number,
			y: raw[1] as number,
			width: raw[2] as number,
			height: raw[3] as number
		};
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle. Disabled
	 * if not defined.
	 * @see [`scissor`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public set scissorBox(value: Box | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(SCISSOR_TEST);
		} else {
			this.internal.enable(SCISSOR_TEST);
			this.internal.scissor(value.x, value.y, value.width, value.height);
		}
	}

	/**
	 * The viewport box, which specifies the affine transformation of
	 * coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public get viewport(): Box {
		// TODO: Optional caching.
		const raw: Int32Array = this.internal.getParameter(VIEWPORT);
		return {
			x: raw[0] as number,
			y: raw[1] as number,
			width: raw[2] as number,
			height: raw[3] as number
		};
	}

	/**
	 * The viewport box, which specifies the affine transformation of
	 * coordinates from normalized device coordinates to window coordinates.
	 * @see [`viewport`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public set viewport(value: Box) {
		// TODO: Optional caching.
		this.internal.viewport(value.x, value.y, value.width, value.height);
	}

	/**
	 * The stencil test function and reference value. The stencil test is
	 * disabled if not defined.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public get stencilFunctions(): StencilTestSet | undefined {
		// TODO: Optional caching.
		if (!this.internal.isEnabled(STENCIL_TEST)) {
			return undefined;
		}

		return {
			front: {
				func: this.internal.getParameter(STENCIL_FUNC),
				ref: this.internal.getParameter(STENCIL_REF),
				mask: this.internal.getParameter(STENCIL_VALUE_MASK)
			},
			back: {
				func: this.internal.getParameter(STENCIL_BACK_FUNC),
				ref: this.internal.getParameter(STENCIL_BACK_REF),
				mask: this.internal.getParameter(STENCIL_BACK_VALUE_MASK)
			}
		};
	}

	/**
	 * The stencil test function and reference value. The stencil test is
	 * disabled if not defined.
	 * @see [`stencilFunc`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public set stencilFunctions(value: StencilTestSet | undefined) {
		// TODO: Optional caching.
		if (typeof value == "undefined") {
			this.internal.disable(STENCIL_TEST);
		} else {
			this.internal.enable(STENCIL_TEST);
			this.internal.stencilFuncSeparate(
				FaceDirection.FRONT,
				value.front.func,
				value.front.ref,
				value.front.mask
			);
			this.internal.stencilFuncSeparate(
				FaceDirection.BACK,
				value.back.func,
				value.back.ref,
				value.back.mask
			);
		}
	}

	/**
	 * Whether primitives are discarded immediately before the rasterization
	 * stage.
	 * @see [GPGPU](https://www.lakuna.pw/a/webgl/gpgpu)
	 */
	public get doRasterizerDiscard(): boolean {
		// TODO: Optional caching.
		return this.internal.isEnabled(RASTERIZER_DISCARD);
	}

	/**
	 * Whether primitives are discarded immediately before the rasterization
	 * stage.
	 * @see [GPGPU](https://www.lakuna.pw/a/webgl/gpgpu)
	 */
	public set doRasterizerDiscard(value: boolean) {
		// TODO: Optional caching.
		if (value) {
			this.internal.enable(RASTERIZER_DISCARD);
		} else {
			this.internal.disable(RASTERIZER_DISCARD);
		}
	}

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public get frontFace(): WindingOrientation {
		// TODO: Optional caching.
		return this.internal.getParameter(FRONT_FACE);
	}

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [`frontFace`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public set frontFace(value: WindingOrientation) {
		// TODO: Optional caching.
		this.internal.frontFace(value);
	}

	/**
	 * Makes this context XR-compatible.
	 * @returns A promise that resolves once the WebGL context is ready to be
	 * used for rendering WebXR content.
	 * @see [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
	 */
	public async makeXrCompatible(): Promise<void> {
		return this.internal.makeXRCompatible().catch(() => {
			throw new UnsupportedOperationError();
		});
	}

	/**
	 * Gets a list of all of the supported extensions.
	 * @returns A list of all of the supported extensions.
	 */
	public getSupportedExtensions(): Array<Extension> {
		return (this.internal.getSupportedExtensions() ?? []) as Array<Extension>;
	}

	/** A map of enabled extensions to their names. */
	private extensions: Map<Extension, ExtensionObject>;

	/**
	 * Gets the requested extension.
	 * @param extension The extension's name.
	 * @returns The extension.
	 */
	public getExtension(extension: Extension): ExtensionObject | undefined {
		if (!this.extensions.has(extension)) {
			this.extensions.set(extension, this.internal.getExtension(extension));
		}

		return this.extensions.get(extension);
	}

	/**
	 * Clears the specified buffers to the specified values.
	 * @param gl The rendering context to clear.
	 * @param color The color to clear the color buffer to, if any.
	 * @param depth The value to clear the depth buffer to, if any.
	 * @param stencil The value to clear the stencil buffer to, if any.
	 */
	public clear(
		color?: ColorLike | undefined,
		depth?: number | undefined,
		stencil?: number | undefined
	): void {
		let colorBit = 0;
		if (color) {
			this.internal.clearColor(
				color[0] ?? 0,
				color[1] ?? 0,
				color[2] ?? 0,
				color[3] ?? 0
			);
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = 0;
		if (typeof depth == "number") {
			this.internal.enable(DEPTH_TEST);
			this.internal.clearDepth(depth);
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = 0;
		if (typeof stencil == "number") {
			this.internal.enable(STENCIL_TEST);
			this.internal.clearStencil(stencil);
			stencilBit = STENCIL_BUFFER_BIT;
		}

		this.internal.clear(colorBit | depthBit | stencilBit);
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size.
	 * @returns Whether the drawing buffer was resized.
	 */
	public fitDrawingBuffer(): boolean {
		if (this.canvas instanceof OffscreenCanvas) {
			return false;
		}

		// Physical size.
		const displayWidth: number = this.canvas.clientWidth;
		const displayHeight: number = this.canvas.clientHeight;

		if (
			this.canvas.width != displayWidth ||
			this.canvas.height != displayHeight
		) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;

			return true;
		}

		return false;
	}

	/**
	 * Resizes this context's viewport to match the size of its current drawing
	 * buffer.
	 */
	public fitViewport(): void {
		this.viewport = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height
		};
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical
	 * size, a viewport to match the drawing buffer, and disables the scissor
	 * test.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resize(): boolean;

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical
	 * size, the context's viewport and scissor box to match the given size,
	 * and enables the scissor test.
	 * @param x The horizontal offset of the viewport and scissor box.
	 * @param y The vertical offset of the viewport and scissor box.
	 * @param width The horizontal size of the viewport and scissor box.
	 * @param height The vertical size of the viewport and scissor box.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resize(x: number, y: number, width: number, height: number): boolean;

	public resize(
		x?: number,
		y?: number,
		width?: number,
		height?: number
	): boolean {
		if (this.internal.canvas instanceof OffscreenCanvas) {
			throw new HeadlessEnvironmentError();
		}

		const out: boolean = this.fitDrawingBuffer();

		if (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof width == "number" &&
			typeof height == "number"
		) {
			this.viewport = { x, y, width, height };
			this.scissorBox = { x, y, width, height };
		} else {
			this.fitViewport();
			this.scissorBox = undefined;
		}

		return out;
	}
}
