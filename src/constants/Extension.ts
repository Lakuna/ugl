/**
 * WebGL extensions.
 * @public
 */
enum Extension {
	/**
	 * Allows the user to draw the same object (or groups of similar objects) multiple times if they share the same vertex data, primitive count, and type.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays | ANGLE_instanced_arrays}
	 * @deprecated Available in WebGL2 by default.
	 */
	InstancedArrays = "ANGLE_instanced_arrays",

	/**
	 * Extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax | EXT_blend_minmax}
	 * @deprecated Available in WebGL2 by default.
	 */
	BlendMinMax = "EXT_blend_minmax",

	/**
	 * Adds the ability to render a variety of floating point formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float | EXT_color_buffer_float}
	 */
	ExtColorBufferFloat = "EXT_color_buffer_float",

	/**
	 * Adds the ability to render to 16-bit floating-point color buffers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_half_float | EXT_color_buffer_half_float}
	 */
	ColorBufferHalfFloat = "EXT_color_buffer_half_float",

	/**
	 * Provides a way to measure the duration of a set of graphics library commands without stalling the rendering pipeline.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query | EXT_disjoint_timer_query}
	 */
	DisjointTimerQuery = "EXT_disjoint_timer_query",

	/**
	 * Allows blending and draw buffers with 32-bit floating-point components. Requires {@link Extension.WebglColorBufferFloat} or {@link Extension.ExtColorBufferFloat}.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_float_blend | EXT_float_blend}
	 */
	FloatBlend = "EXT_float_blend",

	/**
	 * Enables the ability to set a depth value of a fragment from within the fragment shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth | EXT_frag_depth}
	 * @deprecated Available in WebGL2 by default.
	 */
	FragDepth = "EXT_frag_depth",

	/**
	 * Adds additional texture functions to the OpenGL ES shading language that provide the shader writer with explicit control of level of detail.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_shader_texture_lod | EXT_shader_texture_lod}
	 * @deprecated Available in WebGL2 by default.
	 */
	ShaderTextureLod = "EXT_shader_texture_lod",

	/**
	 * Adds sRGB support to textures and framebuffer objects.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB | EXT_sRGB}
	 * @deprecated Available in WebGL2 by default.
	 */
	Srgb = "EXT_sRGB",

	/**
	 * Exposes 4 BPTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc | EXT_texture_compression_bptc}
	 */
	TextureCompressionBptc = "EXT_texture_compression_bptc",

	/**
	 * Exposes 4 RGTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc | EXT_texture_compression_rgtc}
	 */
	TextureCompressionRgtc = "EXT_texture_compression_rgtc",

	/**
	 * Exposes two constants for anisotropic filtering.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic | EXT_texture_filter_anisotropic}
	 */
	TextureFilterAnisotropic = "EXT_texture_filter_anisotropic",

	/**
	 * Provides a set of new 16-bit signed and unsigned normalized formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_norm16 | EXT_texture_norm16}
	 */
	TextureNorm16 = "EXT_texture_norm16",

	/**
	 * Enables a non-blocking poll operation so that compile and link status availability can be queried without potentially incurring stalls.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile | KHR_parallel_shader_compile}
	 */
	ParallelShaderCompile = "KHR_parallel_shader_compile",

	/**
	 * Enables the use of different blend options when writing to multiple color buffers simultaneously.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_draw_buffers_indexed | OES_draw_buffers_indexed}
	 */
	DrawBuffersIndexed = "OES_draw_buffers_indexed",

	/**
	 * Adds support for unsigned integer types when drawing with an element array buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_element_index_uint | OES_element_index_uint}
	 * @deprecated Available in WebGL2 by default.
	 */
	ElementIndexUint = "OES_element_index_uint",

	/**
	 * Makes it possible to attach any level of a texture to a framebuffer object.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_fbo_render_mipmap | OES_fbo_render_mipmap}
	 * @deprecated Available in WebGL2 by default.
	 */
	FboRenderMipmap = "OES_fbo_render_mipmap",

	/**
	 * Adds GLSL derivative functions.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives | OES_standard_derivatives}
	 * @deprecated Available in WebGL2 by default.
	 */
	StandardDerivatives = "OES_standard_derivatives",

	/**
	 * Exposes floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float | OES_texture_float}
	 * @deprecated Available in WebGL2 by default.
	 */
	TextureFloat = "OES_texture_float",

	/**
	 * Allows linear filtering with floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear | OES_texture_float_linear}
	 */
	TextureFloatLinear = "OES_texture_float_linear",

	/**
	 * Adds texture formats with 16- and 32-bit floating-point components.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float | OES_texture_half_float}
	 * @deprecated Available in WebGL2 by default.
	 */
	TextureHalfFloat = "OES_texture_half_float",

	/**
	 * Allows linear filtering with half floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear | OES_texture_half_float_linear}
	 */
	TextureHalfFloatLinear = "OES_texture_half_float_linear",

	/**
	 * Provides vertex array objects that encapsulate vertex array states.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object | OES_vertex_array_object}
	 * @deprecated Available in WebGL2 by default.
	 */
	VertexArrayObject = "OES_vertex_array_object",

	/**
	 * Adds support for rendering into multiple views simultaneously. Support depends on the system's graphics driver.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OVR_multiview2 | OVR_multiview2}
	 */
	Multiview2 = "OVR_multiview2",

	/**
	 * Adds the ability to render to 32-bit floating-point color buffers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float | WEBGL_color_buffer_float}
	 * @deprecated Use {@link Extension.ExtColorBufferFloat} instead for WebGL2.
	 */
	WebglColorBufferFloat = "WEBGL_color_buffer_float",

	/**
	 * Exposes adaptive scalable texture compression compressed texture formats to WebGL. Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc | WEBGL_compressed_texture_astc}
	 */
	CompressedTextureAstc = "WEBGL_compressed_texture_astc",

	/**
	 * Exposes ten ETC/EAC compressed texture formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc | WEBGL_compressed_texture_etc}
	 */
	CompressedTextureEtc = "WEBGL_compressed_texture_etc",

	/**
	 * Exposes the ETC1 compressed texture format.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc1 | WEBGL_compressed_texture_etc1}
	 */
	CompressedTextureEtc1 = "WEBGL_compressed_texture_etc1",

	/**
	 * Exposes four PVRTC compressed texture formats. Typically only available on mobile devices with PowerVR chipsets.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc | WEBGL_compressed_texture_pvrtc}
	 */
	CompressedTexturePvrtc = "WEBGL_compressed_texture_pvrtc",

	/**
	 * Exposes four S3TC compressed texture formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc | WEBGL_compressed_texture_s3tc}
	 */
	CompressedTextureS3tc = "WEBGL_compressed_texture_s3tc",

	/**
	 * Exposes four S3TC compressed texture formats for the sRGB color space.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb | WEBGL_compressed_texture_s3tc_srgb}
	 */
	CompressedTextureS3tcSrgb = "WEBGL_compressed_texture_s3tc_srgb",

	/**
	 * Exposes two constants with information about the graphics driver for debugging purposes. Might not be available depending on the privacy settings of the browser.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info | WEBGL_debug_renderer_info}
	 */
	DebugRendererInfo = "WEBGL_debug_renderer_info",

	/**
	 * Exposes a method to debug shaders from priveliged contexts. Might not be available depending on the privacy settings of the browser.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders | WEBGL_debug_shaders}
	 */
	DebugShaders = "WEBGL_debug_shaders",

	/**
	 * Defines 2D depth and depth-stencil textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture | WEBGL_depth_texture}
	 * @deprecated Available in WebGL2 by default.
	 */
	DepthTexture = "WEBGL_depth_texture",

	/**
	 * Enables a fragment shader to write to several textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers | WEBGL_draw_buffers}
	 * @deprecated Available in WebGL2 by default.
	 */
	DrawBuffers = "WEBGL_draw_buffers",

	/**
	 * Exposes functions to simulate losing and restoring a context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context | WEBGL_lose_context}
	 */
	LoseContext = "WEBGL_lose_context",

	/**
	 * Allows rendering more than one primitive with a single function call.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_multi_draw | WEBGL_multi_draw}
	 */
	MultiDraw = "WEBGL_multi_draw"
}

export default Extension;
