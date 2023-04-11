import type Box from "../types/Box.js";
import type Color from "../utility/Color.js";

/** A canvas. */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/** The bit mask for the color buffer. */
export const COLOR_BUFFER_BIT = 0x00004000;

/** The bit mask for the depth buffer. */
export const DEPTH_BUFFER_BIT = 0x00000100;

/** The bit mask for the stencil buffer. */
export const STENCIL_BUFFER_BIT = 0x00000400;

/** The depth test. */
export const DEPTH_TEST = 0x0B71;

/** The stencil test. */
export const STENCIL_TEST = 0x0B90

/** The scissor test. */
export const SCISSOR_TEST = 0x0C11;

/** Whether blending of the computed fragment color values is enabled. */
export const BLEND = 0x0BE2;

/** Whether polygons are culled. */
export const CULL_FACE = 0x0B44;

/** Whether color components are dithered before they get written to the color buffer. */
export const DITHER = 0x0BD0;

/** Whether an offset is added to depth values of polygons' fragments. */
export const POLYGON_OFFSET_FILL = 0x8037;

/** Whether a temporary coverage value determined by the alpha value is generated. */
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809E;

/** Whether fragments' coverages are combined with the temporary coverage value. */
export const SAMPLE_COVERAGE = 0x80A0;

/** Whether primitives are discarded immediately before the rasterization stage. */
export const RASTERIZER_DISCARD = 0x8C89;

/** The blend function for source RGB values. */
export const BLEND_SRC_RGB = 0x80C9;

/** The blend function for source alpha values. */
export const BLEND_SRC_ALPHA = 0x80CB;

/** The blend function for destination RGB values. */
export const BLEND_DST_RGB = 0x80C8;

/** The blend function for destination alpha values. */
export const BLEND_DST_ALPHA = 0x80CA;

/** The face direction that polygons will be culled in. */
export const CULL_FACE_MODE = 0x0B45;

/** The depth comparison function in use. */
export const DEPTH_FUNC = 0x0B74;

/** The polygon offset units. */
export const POLYGON_OFFSET_UNITS = 0x2A00;

/** The polygon offset factor. */
export const POLYGON_OFFSET_FACTOR = 0x8038;

/** The sample coverage value. */
export const SAMPLE_COVERAGE_VALUE = 0x80AA;

/** Whether the sample coverage is inverted. */
export const SAMPLE_COVERAGE_INVERT = 0x80AB;

/** The scissor box. */
export const SCISSOR_BOX = 0x0C10;

/** The front stencil function. */
export const STENCIL_FUNC = 0x0B92;

/** The front stencil reference value. */
export const STENCIL_REF = 0x0B97;

/** The front stencil mask. */
export const STENCIL_VALUE_MASK = 0x0B93;

/** The back stencil function. */
export const STENCIL_BACK_FUNC = 0x8800;

/** The back stencil reference value. */
export const STENCIL_BACK_REF = 0x8CA3;

/** The back stencil mask. */
export const STENCIL_BACK_VALUE_MASK = 0x8CA4;

/** The winding orientation that is considered the front face of a polygon. */
export const FRONT_FACE = 0x0B46;

/** The viewport box. */
export const VIEWPORT = 0x0BA2;

/** Blending functions. */
export const enum BlendFunction {
	/** Multiplies all colors by zero. */
	ZERO = 0,

	/** Multiplies all colors by one. */
	ONE = 1,

	/** Multiplies all colors by the source colors. */
	SRC_COLOR = 0x0300,

	/** Multiplies all colors by one minus each source color. */
	ONE_MINUS_SRC_COLOR = 0x0301,

	/** Multiplies all colors by the destination color. */
	DST_COLOR = 0x0306,

	/** Multiplies all colors by one minus the destination color. */
	ONE_MINUS_DST_COLOR = 0x0307,

	/** Multiplies all colors by the source alpha value. */
	SRC_ALPHA = 0x0302,

	/** Multiplies all colors by one minus the source alpha value. */
	ONE_MINUS_SRC_ALPHA = 0x0303,

	/** Multiplies all colors by the destination alpha value. */
	DST_ALPHA = 0x0304,

	/** Multiplies all colors by one minus the destination alpha value. */
	ONE_MINUS_DST_ALPHA = 0x0305,

	/** Multiplies all colors by a constant color. */
	CONSTANT_COLOR = 0x8001,

	/** Multiplies all colors by one minus a constant color. */
	ONE_MINUS_CONSTANT_COLOR = 0x8002,

	/** Multiplies all colors by a constant alpha value. */
	CONSTANT_ALPHA = 0x8003,

	/** Multiplies all colors by one minus a constant alpha value. */
	ONE_MINUS_CONSTANT_ALPHA = 0x8004,

	/** Multiplies the RGB colors by the smaller of either the source alpha value or the value of one minus the destination alpha value. The alpha value is multiplied by one. */
	SRC_ALPHA_SATURATE = 0x0308
}

/** A pair of blending functions. */
export interface BlendFunctionSet {
	/** The multiplier for the RGB source blending factors. */
	srcRgb: BlendFunction;

	/** The multiplier for the RGB destination blending factors. */
	dstRgb: BlendFunction;

	/** The multiplier for the alpha source blending factors. */
	srcAlpha: BlendFunction;

	/** The multiplier for the alpha destination blending factors. */
	dstAlpha: BlendFunction;
}

/** Directions that a face can point. */
export const enum FaceDirection {
	/** The front of a face. */
	FRONT = 0x0404,

	/** The back of a face. */
	BACK = 0x0405,

	/** Both sides of a face. */
	FRONT_AND_BACK = 0x0408
}

/** Test functions. */
export const enum TestFunction {
	/** Never passes. */
	NEVER = 0x0200,

	/** Passes if the incoming value is less than the buffer value. */
	LESS = 0x0201,

	/** Passes if the incoming value is equal to the buffer value. */
	EQUAL = 0x0202,

	/** Passes if the incoming value is less than or equal to the buffer value. */
	LEQUAL = 0x0203,

	/** Passes if the incoming value is greater than the buffer value. */
	GREATER = 0x0204,

	/** Passes if the incoming value is not equal to the buffer value. */
	NOTEQUAL = 0x0205,

	/** Passes if the incoming value is greater than or equal to the buffer value. */
	GEQUAL = 0x0206,

	/** Always passes. */
	ALWAYS = 0x0207
}

/** WebGL extensions. */
export const enum Extension {
	/**
	 * Allows the user to draw the same object (or groups of similar objects) multiple times if they share the same vertex data, primitive count, and type. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays)
	 */
	InstancedArrays = "ANGLE_instanced_arrays",

	/**
	 * Extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax)
	 */
	BlendMinMax = "EXT_blend_minmax",

	/**
	 * Adds the ability to render a variety of floating point formats.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float)
	 */
	ExtColorBufferFloat = "EXT_color_buffer_float",

	/**
	 * Adds the ability to render to 16-bit floating-point color buffers.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_half_float)
	 */
	ColorBufferHalfFloat = "EXT_color_buffer_half_float",

	/**
	 * Provides a way to measure the duration of a set of graphics library commands without stalling the rendering pipeline.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query)
	 */
	DisjointTimerQuery = "EXT_disjoint_timer_query",

	/**
	 * Allows blending and draw buffers with 32-bit floating-point components. Requires `WebglColorBufferFloat` or `ExtColorBufferFloat`.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_float_blend)
	 */
	FloatBlend = "EXT_float_blend",

	/**
	 * Enables the ability to set a depth value of a fragment from within the fragment shader. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth)
	 */
	FragDepth = "EXT_frag_depth",

	/**
	 * Adds additional texture functions to the OpenGL ES shading language that provide the shader writer with explicit control of level of detail. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_shader_texture_lod)
	 */
	ShaderTextureLod = "EXT_shader_texture_lod",

	/**
	 * Adds sRGB support to textures and framebuffer objects. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 */
	Srgb = "EXT_sRGB",

	/**
	 * Exposes 4 BPTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	TextureCompressionBptc = "EXT_texture_compression_bptc",

	/**
	 * Exposes 4 RGTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	TextureCompressionRgtc = "EXT_texture_compression_rgtc",

	/**
	 * Exposes two constants for anisotropic filtering.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic)
	 */
	TextureFilterAnisotropic = "EXT_texture_filter_anisotropic",

	/**
	 * Provides a set of new 16-bit signed and unsigned normalized formats.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_norm16)
	 */
	TextureNorm16 = "EXT_texture_norm16",

	/**
	 * Enables a non-blocking poll operation so that compile and link status availability can be queried without potentially incurring stalls.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile)
	 */
	ParallelShaderCompile = "KHR_parallel_shader_compile",

	/**
	 * Enables the use of different blend options when writing to multiple color buffers simultaneously.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_draw_buffers_indexed)
	 */
	DrawBuffersIndexed = "OES_draw_buffers_indexed",

	/**
	 * Adds support for unsigned integer types when drawing with an element array buffer. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_element_index_uint)
	 */
	ElementIndexUint = "OES_element_index_uint",

	/**
	 * Makes it possible to attach any level of a texture to a framebuffer object. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_fbo_render_mipmap)
	 */
	FboRenderMipmap = "OES_fbo_render_mipmap",

	/**
	 * Adds GLSL derivative functions. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives)
	 */
	StandardDerivatives = "OES_standard_derivatives",

	/**
	 * Exposes floating-point pixel types for textures. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float)
	 */
	TextureFloat = "OES_texture_float",

	/**
	 * Allows linear filtering with floating-point pixel types for textures.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear)
	 */
	TextureFloatLinear = "OES_texture_float_linear",

	/**
	 * Adds texture formats with 16- and 32-bit floating-point components. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float)
	 */
	TextureHalfFloat = "OES_texture_half_float",

	/**
	 * Allows linear filtering with half floating-point pixel types for textures.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear)
	 */
	TextureHalfFloatLinear = "OES_texture_half_float_linear",

	/**
	 * Provides vertex array objects that encapsulate vertex array states. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object)
	 */
	VertexArrayObject = "OES_vertex_array_object",

	/**
	 * Adds support for rendering into multiple views simultaneously. Support depends on the system's graphics driver.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/OVR_multiview2)
	 */
	Multiview2 = "OVR_multiview2",

	/**
	 * Adds the ability to render to 32-bit floating-point color buffers. Use `ExtColorBufferFloat` instead for WebGL2.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float)
	 */
	WebglColorBufferFloat = "WEBGL_color_buffer_float",

	/**
	 * Exposes adaptive scalable texture compression compressed texture formats to WebGL. Typically available on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	CompressedTextureAstc = "WEBGL_compressed_texture_astc",

	/**
	 * Exposes ten ETC/EAC compressed texture formats.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	CompressedTextureEtc = "WEBGL_compressed_texture_etc",

	/**
	 * Exposes the ETC1 compressed texture format.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc1)
	 */
	CompressedTextureEtc1 = "WEBGL_compressed_texture_etc1",

	/**
	 * Exposes four PVRTC compressed texture formats. Typically only available on mobile devices with PowerVR chipsets.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	CompressedTexturePvrtc = "WEBGL_compressed_texture_pvrtc",

	/**
	 * Exposes four S3TC compressed texture formats.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	CompressedTextureS3tc = "WEBGL_compressed_texture_s3tc",

	/**
	 * Exposes four S3TC compressed texture formats for the sRGB color space.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	CompressedTextureS3tcSrgb = "WEBGL_compressed_texture_s3tc_srgb",

	/**
	 * Exposes two constants with information about the graphics driver for debugging purposes. Might not be available depending on the privacy of the browser.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info)
	 */
	DebugRendererInfo = "WEBGL_debug_renderer_info",

	/**
	 * Exposes a method to debug shaders from priveliged contexts. Might not be available depending on the privacy of the browser.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders)
	 */
	DebugShaders = "WEBGL_debug_shaders",

	/**
	 * Defines 2D depth and depth-stencil textures. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture)
	 */
	DepthTexture = "WEBGL_depth_texture",

	/**
	 * Enables a fragment shader to write to several textures. The functionality of this extension is available in WebGL2 by default.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers)
	 */
	DrawBuffers = "WEBGL_draw_buffers",

	/**
	 * Exposes functions to simulate losing and restoring a context.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context)
	 */
	LoseContext = "WEBGL_lose_context",

	/**
	 * Allows rendering more than one primitive with a single function call.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_multi_draw)
	 */
	MultiDraw = "WEBGL_multi_draw"
}

/** Modifiers applied before the depth test is performed. */
export interface PolygonOffset {
	/** The scale factor for the variable depth offset for each polygon. */
	factor: number;

	/** The multiplier by which an implementation-specific value is multiplied to create a constant depth offset. */
	units: number;
}

/** Multi-sample coverage parameters for anti-aliasing effects. */
export interface MultiSampleCoverageParameters {
	/** A single floating-point coverage value clamped to the range `[0,1]`. */
	value: number;

	/** Whether or not the coverage masks should be inverted. */
	invert: boolean;
}

/**
 * Parameters for stencil testing.
 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
 */
export interface StencilTestParameters {
	/** The test function. */
	func: TestFunction;

	/** The reference value for the stencil test. */
	ref: number;

	/** A bit-wise mask that is combined with the reference value and the stored stencil value when the test is done. */
	mask: number;
}

/**
 * A set of stencil test parameters.
 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
 */
export interface StencilTestSet {
	/** The parameters for the front stencil test. */
	front: StencilTestParameters;

	/** The parameters for the back stencil test. */
	back: StencilTestParameters;
}

/** Winding orientations. */
export const enum WindingOrientation {
	/** Clockwise. */
	CW = 0x0900,

	/** Counter-clockwise. */
	CCW = 0x0901
}

/** WebGL extension implementations. */
export type ExtensionObject =
	ANGLE_instanced_arrays
	| EXT_blend_minmax
	| EXT_color_buffer_float
	| EXT_color_buffer_half_float
	// EXT_disjoint_timer_query
	| EXT_float_blend
	| EXT_frag_depth
	| EXT_shader_texture_lod
	| EXT_sRGB
	| EXT_texture_compression_bptc
	| EXT_texture_compression_rgtc
	| EXT_texture_filter_anisotropic
	| EXT_texture_norm16
	| KHR_parallel_shader_compile
	| OES_draw_buffers_indexed
	| OES_element_index_uint
	| OES_fbo_render_mipmap
	| OES_standard_derivatives
	| OES_texture_float
	| OES_texture_float_linear
	| OES_texture_half_float
	| OES_texture_half_float_linear
	| OES_vertex_array_object
	| OVR_multiview2
	| WEBGL_color_buffer_float
	| WEBGL_compressed_texture_astc
	| WEBGL_compressed_texture_etc
	| WEBGL_compressed_texture_etc1
	// WEBGL_compressed_texture_pvrtc
	| WEBGL_compressed_texture_s3tc
	| WEBGL_compressed_texture_s3tc_srgb
	| WEBGL_debug_renderer_info
	| WEBGL_debug_shaders
	| WEBGL_depth_texture
	| WEBGL_draw_buffers
	| WEBGL_lose_context
	| WEBGL_multi_draw;

/** Hint to the user agent indicating what configuration of GPU is suitable for a WebGL context. */
export const enum PowerPreference {
	/** Lets the user agent decide which GPU configuration is most suitable. */
	Default = "default",

	/** Prioritizes rendering performance over power consumption. */
	HighPerformance = "high-performance",

	/** Prioritizes power saving over rendering performance. */
	LowPower = "low-power"
}

// For internal use for making a fullscreen canvas.
function recursiveFullscreen(element: HTMLElement): void {
	element.style.width = "100%";
	element.style.height = "100%";
	element.style.margin = "0px";
	element.style.padding = "0px";
	element.style.display = "block";

	if (element.parentElement) {
		recursiveFullscreen(element.parentElement);
	}
}

/** A WebGL2 rendering context. */
export default class Context {
	/**
	 * Creates a fullscreen rendering context. Destroys all other content in the DOM.
	 * @returns A fullscreen rendering context.
	 */
	public static makeFullscreen(): Context {
		if (typeof document == "undefined") {
			throw new Error("Cannot create a canvas in a headless environment.");
		}

		const canvas: HTMLCanvasElement = document.createElement("canvas");
		canvas.style.touchAction = "none";

		document.body = document.createElement("body");
		document.body.appendChild(canvas);

		recursiveFullscreen(canvas);

		return new Context(canvas);
	}

	/**
	 * Creates a rendering context.
	 * @param gl The rendering context.
	 */
	public constructor(gl: WebGL2RenderingContext);

	/**
	 * Creates a rendering context.
	 * @param canvas The canvas of the rendering context.
	 * @param alpha Whether the canvas contains an alpha buffer.
	 * @param depth Whether the drawing buffer should have a depth buffer of at least 16 bits.
	 * @param stencil Whether the drawing buffer should have a stencil buffer of at least 8 bits.
	 * @param desynchronized Whether the user agent should reduce latency by desynchronizing the canvas paint cycle from the event loop.
	 * @param antialias Whether or not to perform anti-aliasing if possible.
	 * @param failIfMajorPerformanceCaveat Whether the context will fail to be created if the system performance is low or if no hardware GPU is available.
	 * @param powerPreference Which configuration of GPU is suitable for the context.
	 * @param premultipliedAlpha Whether the page compositor will assume that the drawing buffer contains colors with pre-multiplied alpha.
	 * @param preserveDrawingBuffer Whether the buffers will preserve their values until cleared or overwritten by the author.
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
		preserveDrawingBuffer?: boolean);

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
		if (src instanceof WebGL2RenderingContext) {
			this.gl = src;
		} else {
			const gl: WebGL2RenderingContext | null = (src as HTMLCanvasElement).getContext("webgl2", {
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
			if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
			this.gl = gl;
		}

		this.extensions = new Map();
	}

	/** This rendering context. */
	public readonly gl: WebGL2RenderingContext;

	/** The canvas of this rendering context. */
	public get canvas(): Canvas {
		return this.gl.canvas;
	}

	/**
	 * The blending functions. Disables blending if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc)
	 */
	public get blendFunctions(): BlendFunctionSet | undefined {
		if (!this.gl.isEnabled(BLEND)) {
			return undefined;
		}

		return {
			srcRgb: this.gl.getParameter(BLEND_SRC_RGB),
			srcAlpha: this.gl.getParameter(BLEND_SRC_ALPHA),
			dstRgb: this.gl.getParameter(BLEND_DST_RGB),
			dstAlpha: this.gl.getParameter(BLEND_DST_ALPHA)
		};
	}

	public set blendFunctions(value: BlendFunctionSet | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(BLEND);
		} else {
			this.gl.enable(BLEND);
			this.gl.blendFuncSeparate(value.srcRgb, value.dstRgb, value.srcAlpha, value.dstAlpha);
		}
	}

	/**
	 * The direction that polygons face to be culled. Disables polygon culling if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace)
	 */
	public get cullFace(): FaceDirection | undefined {
		if (!this.gl.isEnabled(CULL_FACE)) {
			return undefined;
		}

		return this.gl.getParameter(CULL_FACE_MODE);
	}

	public set cullFace(value: FaceDirection | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(CULL_FACE);
		} else {
			this.gl.enable(CULL_FACE);
			this.gl.cullFace(value);
		}
	}

	/** Whether color components are dithered before they get written to the color buffer. */
	public get doDither(): boolean {
		return this.gl.isEnabled(DITHER);
	}

	public set doDither(value: boolean) {
		if (value) {
			this.gl.enable(DITHER);
		} else {
			this.gl.disable(DITHER);
		}
	}

	/**
	 * The depth comparison function in use. Disables the depth test if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
	 */
	public get depthFunction(): TestFunction | undefined {
		if (!this.gl.isEnabled(DEPTH_TEST)) {
			return undefined;
		}

		return this.gl.getParameter(DEPTH_FUNC);
	}

	public set depthFunction(value: TestFunction | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(DEPTH_TEST);
		} else {
			this.gl.enable(DEPTH_TEST);
			this.gl.depthFunc(value);
		}
	}

	/**
	 * The scale factor and units used to calculate depth values. Disables polygon offset fill if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset)
	 */
	public get polygonOffset(): PolygonOffset | undefined {
		if (!this.gl.isEnabled(POLYGON_OFFSET_FILL)) {
			return undefined;
		}

		return {
			factor: this.gl.getParameter(POLYGON_OFFSET_FACTOR),
			units: this.gl.getParameter(POLYGON_OFFSET_UNITS)
		};
	}

	public set polygonOffset(value: PolygonOffset | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(POLYGON_OFFSET_FILL);
		} else {
			this.gl.enable(POLYGON_OFFSET_FILL);
			this.gl.polygonOffset(value.factor, value.units);
		}
	}

	/** Whether a temporary coverage value is computed based on the alpha value. */
	public get doSampleAlphaToCoverage(): boolean {
		return this.gl.isEnabled(SAMPLE_ALPHA_TO_COVERAGE);
	}

	public set doSampleAlphaToCoverage(value: boolean) {
		if (value) {
			this.gl.enable(SAMPLE_ALPHA_TO_COVERAGE);
		} else {
			this.gl.disable(SAMPLE_ALPHA_TO_COVERAGE);
		}
	}

	/** Whether fragments should be combined with the temporary coverage value. Disabled if not defined. */
	public get sampleCoverage(): MultiSampleCoverageParameters | undefined {
		if (!this.gl.isEnabled(SAMPLE_COVERAGE)) {
			return undefined;
		}

		return {
			value: this.gl.getParameter(SAMPLE_COVERAGE_VALUE),
			invert: this.gl.getParameter(SAMPLE_COVERAGE_INVERT)
		};
	}

	public set sampleCoverage(value: MultiSampleCoverageParameters | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(SAMPLE_COVERAGE);
		} else {
			this.gl.enable(SAMPLE_COVERAGE);
			this.gl.sampleCoverage(value.value, value.invert);
		}
	}

	/**
	 * The scissor box, which limits drawing to a specified rectangle. Disabled if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor)
	 */
	public get scissorBox(): Box | undefined {
		if (!this.gl.isEnabled(SCISSOR_TEST)) {
			return undefined;
		}

		const raw: Int32Array = this.gl.getParameter(SCISSOR_BOX);
		return {
			x: raw[0] as number,
			y: raw[1] as number,
			width: raw[2] as number,
			height: raw[3] as number
		};
	}

	public set scissorBox(value: Box | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(SCISSOR_TEST);
		} else {
			this.gl.enable(SCISSOR_TEST);
			this.gl.scissor(value.x, value.y, value.width, value.height);
		}
	}

	/**
	 * The viewport box, which specifies the affine transformation of coordinates from normalized device coordinates to window coordinates.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport)
	 */
	public get viewport(): Box {
		const raw: Int32Array = this.gl.getParameter(VIEWPORT);
		return {
			x: raw[0] as number,
			y: raw[1] as number,
			width: raw[2] as number,
			height: raw[3] as number
		};
	}

	public set viewport(value: Box) {
		this.gl.viewport(value.x, value.y, value.width, value.height);
	}

	/**
	 * The stencil test function and reference value. The stencil test is disabled if not defined.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc)
	 */
	public get stencilFunctions(): StencilTestSet | undefined {
		if (!this.gl.isEnabled(STENCIL_TEST)) {
			return undefined;
		}

		return {
			front: {
				func: this.gl.getParameter(STENCIL_FUNC),
				ref: this.gl.getParameter(STENCIL_REF),
				mask: this.gl.getParameter(STENCIL_VALUE_MASK)
			},
			back: {
				func: this.gl.getParameter(STENCIL_BACK_FUNC),
				ref: this.gl.getParameter(STENCIL_BACK_REF),
				mask: this.gl.getParameter(STENCIL_BACK_VALUE_MASK)
			}
		};
	}

	public set stencilFunctions(value: StencilTestSet | undefined) {
		if (typeof value == "undefined") {
			this.gl.disable(STENCIL_TEST);
		} else {
			this.gl.enable(STENCIL_TEST);
			this.gl.stencilFuncSeparate(FaceDirection.FRONT, value.front.func, value.front.ref, value.front.mask);
			this.gl.stencilFuncSeparate(FaceDirection.BACK, value.back.func, value.back.ref, value.back.mask);
		}
	}

	/**
	 * Whether primitives are discarded immediately before the rasterization stage.
	 * @see [Tutorial](https://www.lakuna.pw/a/webgl/gpgpu)
	 */
	public get doRasterizerDiscard(): boolean {
		return this.gl.isEnabled(RASTERIZER_DISCARD);
	}

	public set doRasterizerDiscard(value: boolean) {
		if (value) {
			this.gl.enable(RASTERIZER_DISCARD);
		} else {
			this.gl.disable(RASTERIZER_DISCARD);
		}
	}

	/**
	 * The winding orientation of front-facing polygons.
	 * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace)
	 */
	public get frontFace(): WindingOrientation {
		return this.gl.getParameter(FRONT_FACE);
	}

	public set frontFace(value: WindingOrientation) {
		this.gl.frontFace(value);
	}

	/**
	 * Makes this context XR-compatible.
	 * @returns A promise that resolves once the WebGL context is ready to be used for rendering WebXR content.
	 * @see [WebXR API documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
	 */
	public async makeXrCompatible(): Promise<void> {
		return (this.gl as unknown as { makeXRCompatible: () => Promise<void> }).makeXRCompatible()
			.catch(() => { throw new Error("Failed to make the context XR-compatible."); });
	}

	/**
	 * Gets a list of all of the supported extensions.
	 * @returns A list of all of the supported extensions.
	 */
	public getSupportedExtensions(): Array<Extension> {
		return (this.gl.getSupportedExtensions() ?? []) as Array<Extension>;
	}

	/** A map of enabled extensions to their names. */
	private extensions: Map<Extension, ExtensionObject>;

	/**
	 * Gets the requested extension.
	 * @param extension The extension's name.
	 * @returns The extension.
	 */
	public getExtension(extension: Extension): ExtensionObject {
		if (!this.extensions.has(extension)) {
			this.extensions.set(extension, this.gl.getExtension(extension));
		}

		return this.extensions.get(extension) as ExtensionObject;
	}

	/**
	 * Clears the specified buffers to the specified values.
	 * @param gl The rendering context to clear.
	 * @param color The color to clear the color buffer to, if any.
	 * @param depth The value to clear the depth buffer to, if any.
	 * @param stencil The value to clear the stencil buffer to, if any.
	 */
	public clear(color?: Color | undefined, depth?: number | undefined, stencil?: number | undefined): void {
		let colorBit = 0;
		if (color) {
			this.gl.clearColor(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3] ?? 0);
			colorBit = COLOR_BUFFER_BIT;
		}

		let depthBit = 0;
		if (typeof depth == "number") {
			this.gl.enable(DEPTH_TEST);
			this.gl.clearDepth(depth);
			depthBit = DEPTH_BUFFER_BIT;
		}

		let stencilBit = 0;
		if (typeof stencil == "number") {
			this.gl.enable(STENCIL_TEST);
			this.gl.clearStencil(stencil);
			stencilBit = STENCIL_BUFFER_BIT
		}

		this.gl.clear(colorBit | depthBit | stencilBit);
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

		if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;

			return true;
		}

		return false;
	}

	/** Resizes this context's viewport to match the size of its current drawing buffer. */
	public fitViewport(): void {
		this.viewport = { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, a viewport to match the drawing buffer, and disables the scissor test.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resize(): boolean;

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, the context's viewport and scissor box to match the given size, and enables the scissor test.
	 * @param x The horizontal offset of the viewport and scissor box.
	 * @param y The vertical offset of the viewport and scissor box.
	 * @param width The horizontal size of the viewport and scissor box.
	 * @param height The vertical size of the viewport and scissor box.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resize(x: number, y: number, width: number, height: number): boolean;

	public resize(x?: number, y?: number, width?: number, height?: number): boolean {
		if (this.gl.canvas instanceof OffscreenCanvas) {
			throw new Error("Cannot resize an offscreen context.");
		}

		const out: boolean = this.fitDrawingBuffer();

		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.viewport = { x, y, width, height };
			this.scissorBox = { x, y, width, height };
		} else {
			this.fitViewport();
			this.scissorBox = undefined;
		}

		return out;
	}
}
