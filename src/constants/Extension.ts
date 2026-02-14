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
	INSTANCED_ARRAYS = "ANGLE_instanced_arrays",

	/**
	 * Extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax | EXT_blend_minmax}
	 * @deprecated Available in WebGL2 by default.
	 */
	BLEND_MIN_MAX = "EXT_blend_minmax",

	/**
	 * Adds the ability to render a variety of floating point formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float | EXT_color_buffer_float}
	 */
	EXT_COLOR_BUFFER_FLOAT = "EXT_color_buffer_float",

	/**
	 * Adds the ability to render to 16-bit floating-point color buffers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_half_float | EXT_color_buffer_half_float}
	 */
	COLOR_BUFFER_HALF_FLOAT = "EXT_color_buffer_half_float",

	/**
	 * Provides a way to measure the duration of a set of graphics library commands without stalling the rendering pipeline.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query | EXT_disjoint_timer_query}
	 */
	DISJOINT_TIMER_QUERY = "EXT_disjoint_timer_query",

	/**
	 * Allows blending and draw buffers with 32-bit floating-point components. Requires {@link Extension.WEBGL_COLOR_BUFFER_FLOAT} or {@link Extension.EXT_COLOR_BUFFER_FLOAT}.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_float_blend | EXT_float_blend}
	 */
	FLOAT_BLEND = "EXT_float_blend",

	/**
	 * Enables the ability to set a depth value of a fragment from within the fragment shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth | EXT_frag_depth}
	 * @deprecated Available in WebGL2 by default.
	 */
	FRAG_DEPTH = "EXT_frag_depth",

	/**
	 * Adds additional texture functions to the OpenGL ES shading language that provide the shader writer with explicit control of level of detail.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_shader_texture_lod | EXT_shader_texture_lod}
	 * @deprecated Available in WebGL2 by default.
	 */
	SHADER_TEXTURE_LOD = "EXT_shader_texture_lod",

	/**
	 * Adds sRGB support to textures and framebuffer objects.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB | EXT_sRGB}
	 * @deprecated Available in WebGL2 by default.
	 */
	SRGB = "EXT_sRGB",

	/**
	 * Exposes 4 BPTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_bptc | EXT_texture_compression_bptc}
	 */
	TEXTURE_COMPRESSION_BPTC = "EXT_texture_compression_bptc",

	/**
	 * Exposes 4 RGTC compressed texture formats. Support depends on the system's graphics driver. Not supported by Windows.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_compression_rgtc | EXT_texture_compression_rgtc}
	 */
	TEXTURE_COMPRESSION_RGTC = "EXT_texture_compression_rgtc",

	/**
	 * Exposes two constants for anisotropic filtering.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic | EXT_texture_filter_anisotropic}
	 */
	TEXTURE_FILTER_ANISOTROPIC = "EXT_texture_filter_anisotropic",

	/**
	 * Provides a set of new 16-bit signed and unsigned normalized formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_norm16 | EXT_texture_norm16}
	 */
	TEXTURE_NORM16 = "EXT_texture_norm16",

	/**
	 * Enables a non-blocking poll operation so that compile and link status availability can be queried without potentially incurring stalls.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile | KHR_parallel_shader_compile}
	 */
	PARALLEL_SHADER_COMPILE = "KHR_parallel_shader_compile",

	/**
	 * Enables the use of different blend options when writing to multiple color buffers simultaneously.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_draw_buffers_indexed | OES_draw_buffers_indexed}
	 */
	DRAW_BUFFERS_INDEXED = "OES_draw_buffers_indexed",

	/**
	 * Adds support for unsigned integer types when drawing with an element array buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_element_index_uint | OES_element_index_uint}
	 * @deprecated Available in WebGL2 by default.
	 */
	ELEMENT_INDEX_UINT = "OES_element_index_uint",

	/**
	 * Makes it possible to attach any level of a texture to a framebuffer object.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_fbo_render_mipmap | OES_fbo_render_mipmap}
	 * @deprecated Available in WebGL2 by default.
	 */
	FBO_RENDER_MIPMAP = "OES_fbo_render_mipmap",

	/**
	 * Adds GLSL derivative functions.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives | OES_standard_derivatives}
	 * @deprecated Available in WebGL2 by default.
	 */
	STANDARD_DERIVATIVES = "OES_standard_derivatives",

	/**
	 * Exposes floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float | OES_texture_float}
	 * @deprecated Available in WebGL2 by default.
	 */
	TEXTURE_FLOAT = "OES_texture_float",

	/**
	 * Allows linear filtering with floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear | OES_texture_float_linear}
	 */
	TEXTURE_FLOAT_LINEAR = "OES_texture_float_linear",

	/**
	 * Adds texture formats with 16- and 32-bit floating-point components.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float | OES_texture_half_float}
	 * @deprecated Available in WebGL2 by default.
	 */
	TEXTURE_HALF_FLOAT = "OES_texture_half_float",

	/**
	 * Allows linear filtering with half floating-point pixel types for textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear | OES_texture_half_float_linear}
	 */
	TEXTURE_HALF_FLOAT_LINEAR = "OES_texture_half_float_linear",

	/**
	 * Provides vertex array objects that encapsulate vertex array states.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object | OES_vertex_array_object}
	 * @deprecated Available in WebGL2 by default.
	 */
	VERTEX_ARRAY_OBJECT = "OES_vertex_array_object",

	/**
	 * Adds support for rendering into multiple views simultaneously. Support depends on the system's graphics driver.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/OVR_multiview2 | OVR_multiview2}
	 */
	MULTIVIEW2 = "OVR_multiview2",

	/**
	 * Adds the ability to render to 32-bit floating-point color buffers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float | WEBGL_color_buffer_float}
	 * @deprecated Use {@link Extension.EXT_COLOR_BUFFER_FLOAT} instead for WebGL2.
	 */
	WEBGL_COLOR_BUFFER_FLOAT = "WEBGL_color_buffer_float",

	/**
	 * Exposes adaptive scalable texture compression compressed texture formats to WebGL. Typically available only on Mali ARM GPUs, Intel GPUs, and NVIDIA Tegra chips.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc | WEBGL_compressed_texture_astc}
	 */
	COMPRESSED_TEXTURE_ASTC = "WEBGL_compressed_texture_astc",

	/**
	 * Exposes ten ETC/EAC compressed texture formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc | WEBGL_compressed_texture_etc}
	 */
	COMPRESSED_TEXTURE_ETC = "WEBGL_compressed_texture_etc",

	/**
	 * Exposes the ETC1 compressed texture format.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_etc1 | WEBGL_compressed_texture_etc1}
	 */
	COMPRESSED_TEXTURE_ETC1 = "WEBGL_compressed_texture_etc1",

	/**
	 * Exposes four PVRTC compressed texture formats. Typically only available on mobile devices with PowerVR chipsets.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc | WEBGL_compressed_texture_pvrtc}
	 */
	COMPRESSED_TEXTURE_PVRTC = "WEBGL_compressed_texture_pvrtc",

	/**
	 * Exposes four S3TC compressed texture formats.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc | WEBGL_compressed_texture_s3tc}
	 */
	COMPRESSED_TEXTURE_S3TC = "WEBGL_compressed_texture_s3tc",

	/**
	 * Exposes four S3TC compressed texture formats for the sRGB color space.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb | WEBGL_compressed_texture_s3tc_srgb}
	 */
	COMPRESSED_TEXTURE_S3TC_SRGB = "WEBGL_compressed_texture_s3tc_srgb",

	/**
	 * Exposes two constants with information about the graphics driver for debugging purposes. Might not be available depending on the privacy settings of the browser.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info | WEBGL_debug_renderer_info}
	 */
	DEBUG_RENDERER_INFO = "WEBGL_debug_renderer_info",

	/**
	 * Exposes a method to debug shaders from priveliged contexts. Might not be available depending on the privacy settings of the browser.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders | WEBGL_debug_shaders}
	 */
	DEBUG_SHADERS = "WEBGL_debug_shaders",

	/**
	 * Defines 2D depth and depth-stencil textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture | WEBGL_depth_texture}
	 * @deprecated Available in WebGL2 by default.
	 */
	DEPTH_TEXTURE = "WEBGL_depth_texture",

	/**
	 * Enables a fragment shader to write to several textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers | WEBGL_draw_buffers}
	 * @deprecated Available in WebGL2 by default.
	 */
	DRAW_BUFFERS = "WEBGL_draw_buffers",

	/**
	 * Exposes functions to simulate losing and restoring a context.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context | WEBGL_lose_context}
	 */
	LOSE_CONTEXT = "WEBGL_lose_context",

	/**
	 * Allows rendering more than one primitive with a single function call.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_multi_draw | WEBGL_multi_draw}
	 */
	MULTI_DRAW = "WEBGL_multi_draw"
}

export default Extension;
