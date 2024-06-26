/**
 * WebGL extensions.
 * @see [`getExtension`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension)
 * @see [`getSupportedExtensions`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getSupportedExtensions)
 */
enum Extension {
	/**
	 * Allows the user to draw the same object (or groups of similar objects)
	 * multiple times if they share the same vertex data, primitive count, and
	 * type. The functionality of this extension is available in WebGL2 by
	 * default.
	 * @see [ANGLE_instanced_arrays](https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays)
	 * @deprecated Available in WebGL2 by default.
	 */
	InstancedArrays = "ANGLE_instanced_arrays",

	/**
	 * Extends blending capabilities by adding two new blend equations: the
	 * minimum or maximum color components of the source and destination
	 * colors. The functionality of this extension is available in WebGL2 by
	 * default.
	 * @see [EXT_blend_minmax](https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax)
	 * @deprecated Available in WebGL2 by default.
	 */
	BlendMinMax = "EXT_blend_minmax",

	/**
	 * Adds the ability to render a variety of floating point formats.
	 * @see [EXT_color_buffer_float](https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float)
	 */
	ExtColorBufferFloat = "EXT_color_buffer_float",

	/**
	 * Adds the ability to render to 16-bit floating-point color buffers.
	 * @see [EXT_color_buffer_half_float](https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_half_float)
	 */
	ColorBufferHalfFloat = "EXT_color_buffer_half_float",

	/**
	 * Provides a way to measure the duration of a set of graphics library
	 * commands without stalling the rendering pipeline.
	 * @see [EXT_disjoint_timer_query](https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query)
	 */
	DisjointTimerQuery = "EXT_disjoint_timer_query",

	/**
	 * Allows blending and draw buffers with 32-bit floating-point components.
	 * Requires `WebglColorBufferFloat` or `ExtColorBufferFloat`.
	 * @see [EXT_float_blend](https://developer.mozilla.org/en-US/docs/Web/API/EXT_float_blend)
	 */
	FloatBlend = "EXT_float_blend",

	/**
	 * Enables the ability to set a depth value of a fragment from within the
	 * fragment shader. The functionality of this extension is available in
	 * WebGL2 by default.
	 * @see [EXT_frag_depth](https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth)
	 * @deprecated Available in WebGL2 by default.
	 */
	FragDepth = "EXT_frag_depth",

	/**
	 * Adds additional texture functions to the OpenGL ES shading language that
	 * provide the shader writer with explicit control of level of detail. The
	 * functionality of this extension is available in WebGL2 by default.
	 * @see [EXT_shader_texture_lod](https://developer.mozilla.org/en-US/docs/Web/API/EXT_shader_texture_lod)
	 * @deprecated Available in WebGL2 by default.
	 */
	ShaderTextureLod = "EXT_shader_texture_lod",

	/**
	 * Adds sRGB support to textures and framebuffer objects. The functionality
	 * of this extension is available in WebGL2 by default.
	 * @see [EXT_sRGB](https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB)
	 * @deprecated Available in WebGL2 by default.
	 */
	Srgb = "EXT_sRGB",

	/**
	 * Exposes 4 BPTC compressed texture formats. Support depends on the
	 * system's graphics driver. Not supported by Windows.
	 * @see [EXT_texture_compression_bptc](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc)
	 */
	TextureCompressionBptc = "EXT_texture_compression_bptc",

	/**
	 * Exposes 4 RGTC compressed texture formats. Support depends on the
	 * system's graphics driver. Not supported by Windows.
	 * @see [EXT_texture_compression_rgtc](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc)
	 */
	TextureCompressionRgtc = "EXT_texture_compression_rgtc",

	/**
	 * Exposes two constants for anisotropic filtering.
	 * @see [EXT_texture_filter_anisotropic](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic)
	 */
	TextureFilterAnisotropic = "EXT_texture_filter_anisotropic",

	/**
	 * Provides a set of new 16-bit signed and unsigned normalized formats.
	 * @see [EXT_texture_norm16](https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_norm16)
	 */
	TextureNorm16 = "EXT_texture_norm16",

	/**
	 * Enables a non-blocking poll operation so that compile and link status
	 * availability can be queried without potentially incurring stalls.
	 * @see [KHR_parallel_shader_compile](https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile)
	 */
	ParallelShaderCompile = "KHR_parallel_shader_compile",

	/**
	 * Enables the use of different blend options when writing to multiple
	 * color buffers simultaneously.
	 * @see [OES_draw_buffers_indexed](https://developer.mozilla.org/en-US/docs/Web/API/OES_draw_buffers_indexed)
	 */
	DrawBuffersIndexed = "OES_draw_buffers_indexed",

	/**
	 * Adds support for unsigned integer types when drawing with an element
	 * array buffer. The functionality of this extension is available in WebGL2
	 * by default.
	 * @see [OES_element_index_uint](https://developer.mozilla.org/en-US/docs/Web/API/OES_element_index_uint)
	 * @deprecated Available in WebGL2 by default.
	 */
	ElementIndexUint = "OES_element_index_uint",

	/**
	 * Makes it possible to attach any level of a texture to a framebuffer
	 * object. The functionality of this extension is available in WebGL2 by
	 * default.
	 * @see [OES_fbo_render_mipmap](https://developer.mozilla.org/en-US/docs/Web/API/OES_fbo_render_mipmap)
	 * @deprecated Available in WebGL2 by default.
	 */
	FboRenderMipmap = "OES_fbo_render_mipmap",

	/**
	 * Adds GLSL derivative functions. The functionality of this extension is
	 * available in WebGL2 by default.
	 * @see [OES_standard_derivatives](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives)
	 * @deprecated Available in WebGL2 by default.
	 */
	StandardDerivatives = "OES_standard_derivatives",

	/**
	 * Exposes floating-point pixel types for textures. The functionality of
	 * this extension is available in WebGL2 by default.
	 * @see [OES_texture_float](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float)
	 * @deprecated Available in WebGL2 by default.
	 */
	TextureFloat = "OES_texture_float",

	/**
	 * Allows linear filtering with floating-point pixel types for textures.
	 * @see [OES_texture_float_linear](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear)
	 */
	TextureFloatLinear = "OES_texture_float_linear",

	/**
	 * Adds texture formats with 16- and 32-bit floating-point components. The
	 * functionality of this extension is available in WebGL2 by default.
	 * @see [OES_texture_half_float](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float)
	 * @deprecated Available in WebGL2 by default.
	 */
	TextureHalfFloat = "OES_texture_half_float",

	/**
	 * Allows linear filtering with half floating-point pixel types for
	 * textures.
	 * @see [OES_texture_half_float_linear](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear)
	 */
	TextureHalfFloatLinear = "OES_texture_half_float_linear",

	/**
	 * Provides vertex array objects that encapsulate vertex array states. The
	 * functionality of this extension is available in WebGL2 by default.
	 * @see [OES_vertex_array_object](https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object)
	 * @deprecated Available in WebGL2 by default.
	 */
	VertexArrayObject = "OES_vertex_array_object",

	/**
	 * Adds support for rendering into multiple views simultaneously. Support
	 * depends on the system's graphics driver.
	 * @see [OVR_multiview2](https://developer.mozilla.org/en-US/docs/Web/API/OVR_multiview2)
	 */
	Multiview2 = "OVR_multiview2",

	/**
	 * Adds the ability to render to 32-bit floating-point color buffers. Use
	 * `ExtColorBufferFloat` instead for WebGL2.
	 * @see [WEBGL_color_buffer_float](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float)
	 * @deprecated Use `ExtColorBufferFloat` instead.
	 */
	WebglColorBufferFloat = "WEBGL_color_buffer_float",

	/**
	 * Exposes adaptive scalable texture compression compressed texture formats
	 * to WebGL. Typically available on Mali ARM GPUs, Intel GPUs, and NVIDIA
	 * Tegra chips.
	 * @see [WEBGL_compressed_texture_astc](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc)
	 */
	CompressedTextureAstc = "WEBGL_compressed_texture_astc",

	/**
	 * Exposes ten ETC/EAC compressed texture formats.
	 * @see [WEBGL_compressed_texture_etc](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc)
	 */
	CompressedTextureEtc = "WEBGL_compressed_texture_etc",

	/**
	 * Exposes the ETC1 compressed texture format.
	 * @see [WEBGL_compressed_texture_etc1](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc1)
	 */
	CompressedTextureEtc1 = "WEBGL_compressed_texture_etc1",

	/**
	 * Exposes four PVRTC compressed texture formats. Typically only available
	 * on mobile devices with PowerVR chipsets.
	 * @see [WEBGL_compressed_texture_pvrtc](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc)
	 */
	CompressedTexturePvrtc = "WEBGL_compressed_texture_pvrtc",

	/**
	 * Exposes four S3TC compressed texture formats.
	 * @see [WEBGL_compressed_texture_s3tc](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc)
	 */
	CompressedTextureS3tc = "WEBGL_compressed_texture_s3tc",

	/**
	 * Exposes four S3TC compressed texture formats for the sRGB color space.
	 * @see [WEBGL_compressed_texture_s3tc_srgb](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb)
	 */
	CompressedTextureS3tcSrgb = "WEBGL_compressed_texture_s3tc_srgb",

	/**
	 * Exposes two constants with information about the graphics driver for
	 * debugging purposes. Might not be available depending on the privacy of
	 * the browser.
	 * @see [WEBGL_debug_renderer_info](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info)
	 */
	DebugRendererInfo = "WEBGL_debug_renderer_info",

	/**
	 * Exposes a method to debug shaders from priveliged contexts. Might not be
	 * available depending on the privacy of the browser.
	 * @see [WEBGL_debug_shaders](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders)
	 */
	DebugShaders = "WEBGL_debug_shaders",

	/**
	 * Defines 2D depth and depth-stencil textures. The functionality of this
	 * extension is available in WebGL2 by default.
	 * @see [WEBGL_depth_texture](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture)
	 * @deprecated Available in WebGL2 by default.
	 */
	DepthTexture = "WEBGL_depth_texture",

	/**
	 * Enables a fragment shader to write to several textures. The
	 * functionality of this extension is available in WebGL2 by default.
	 * @see [WEBGL_draw_buffers](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers)
	 * @deprecated Available in WebGL2 by default.
	 */
	DrawBuffers = "WEBGL_draw_buffers",

	/**
	 * Exposes functions to simulate losing and restoring a context.
	 * @see [WEBGL_lose_context](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context)
	 */
	LoseContext = "WEBGL_lose_context",

	/**
	 * Allows rendering more than one primitive with a single function call.
	 * @see [WEBGL_multi_draw](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_multi_draw)
	 */
	MultiDraw = "WEBGL_multi_draw"
}

export default Extension;
