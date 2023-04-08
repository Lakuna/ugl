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
	private extensions: Map<Extension, ExtensionObject>; // TODO

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
	public fitBuffer(): boolean {
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
	public resizeViewport(): void;

	/**
	 * Resizes this context's viewport to match the given size.
	 * @param x The horizontal offset of the viewport.
	 * @param y The vertical offset of the viewport.
	 * @param width The horizontal size of the viewport.
	 * @param height The vertical size of the viewport.
	 */
	public resizeViewport(x: number, y: number, width: number, height: number): void;

	public resizeViewport(x?: number, y?: number, width?: number, height?: number): void {
		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.gl.viewport(x, y, width, height);
		} else {
			this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		}
	}

	/** * Disables the scissor test. */
	public resizeScissor(): void;

	/**
	 * Resizes this context's scissor box to match the given size and enables the scissor test.
	 * @param x The horizontal offset of the scissor box.
	 * @param y The vertical offset of the scissor box.
	 * @param width The horizontal size of the scissor box.
	 * @param height The vertical size of the scissor box.
	 */
	public resizeScissor(x: number, y: number, width: number, height: number): void;

	public resizeScissor(x?: number, y?: number, width?: number, height?: number): void {
		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.gl.enable(SCISSOR_TEST);
			this.gl.scissor(x, y, width, height);
		} else {
			this.gl.disable(SCISSOR_TEST);
		}
	}

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, a viewport to match the drawing buffer, and disables the scissor test.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resizeContext(): boolean;

	/**
	 * Resizes this context's canvas' drawing buffer to match its physical size, the context's viewport and scissor box to match the given size, and enables the scissor test.
	 * @param x The horizontal offset of the viewport and scissor box.
	 * @param y The vertical offset of the viewport and scissor box.
	 * @param width The horizontal size of the viewport and scissor box.
	 * @param height The vertical size of the viewport and scissor box.
	 * @returns Whether the drawing buffer was resized.
	 */
	public resizeContext(x: number, y: number, width: number, height: number): boolean;

	public resizeContext(x?: number, y?: number, width?: number, height?: number): boolean {
		if (this.gl.canvas instanceof OffscreenCanvas) {
			throw new Error("Cannot resize an offscreen context.");
		}

		const out: boolean = this.fitBuffer();

		if (typeof x == "number" && typeof y == "number" && typeof width == "number" && typeof height == "number") {
			this.resizeViewport(x, y, width, height);
			this.resizeScissor(x, y, width, height);
		} else {
			this.resizeViewport();
			this.resizeScissor();
		}

		return out;
	}
}
