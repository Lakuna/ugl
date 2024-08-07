// WebGL extension objects don't use camel case.
/* eslint-disable camelcase */

/**
 * WebGL extension implementations.
 * @public
 */
export type ExtensionObject =
	| ANGLE_instanced_arrays
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
	| WEBGL_compressed_texture_pvrtc
	| WEBGL_compressed_texture_s3tc
	| WEBGL_compressed_texture_s3tc_srgb
	| WEBGL_debug_renderer_info
	| WEBGL_debug_shaders
	| WEBGL_depth_texture
	| WEBGL_draw_buffers
	| WEBGL_lose_context
	| WEBGL_multi_draw;
