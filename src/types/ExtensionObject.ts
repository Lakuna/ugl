/**
 * WebGL extension implementations.
 * @public
 */
export type ExtensionObject =
	// eslint-disable-next-line camelcase
	| ANGLE_instanced_arrays
	// eslint-disable-next-line camelcase
	| EXT_blend_minmax
	// eslint-disable-next-line camelcase
	| EXT_color_buffer_float
	// eslint-disable-next-line camelcase
	| EXT_color_buffer_half_float
	// EXT_disjoint_timer_query
	// eslint-disable-next-line camelcase
	| EXT_float_blend
	// eslint-disable-next-line camelcase
	| EXT_frag_depth
	// eslint-disable-next-line camelcase
	| EXT_shader_texture_lod
	// eslint-disable-next-line camelcase
	| EXT_sRGB
	// eslint-disable-next-line camelcase
	| EXT_texture_compression_bptc
	// eslint-disable-next-line camelcase
	| EXT_texture_compression_rgtc
	// eslint-disable-next-line camelcase
	| EXT_texture_filter_anisotropic
	// eslint-disable-next-line camelcase
	| EXT_texture_norm16
	// eslint-disable-next-line camelcase
	| KHR_parallel_shader_compile
	// eslint-disable-next-line camelcase
	| OES_draw_buffers_indexed
	// eslint-disable-next-line camelcase
	| OES_element_index_uint
	// eslint-disable-next-line camelcase
	| OES_fbo_render_mipmap
	// eslint-disable-next-line camelcase
	| OES_standard_derivatives
	// eslint-disable-next-line camelcase
	| OES_texture_float
	// eslint-disable-next-line camelcase
	| OES_texture_float_linear
	// eslint-disable-next-line camelcase
	| OES_texture_half_float
	// eslint-disable-next-line camelcase
	| OES_texture_half_float_linear
	// eslint-disable-next-line camelcase
	| OES_vertex_array_object
	// eslint-disable-next-line camelcase
	| OVR_multiview2
	// eslint-disable-next-line camelcase
	| WEBGL_color_buffer_float
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_astc
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_etc
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_etc1
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_pvrtc
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_s3tc
	// eslint-disable-next-line camelcase
	| WEBGL_compressed_texture_s3tc_srgb
	// eslint-disable-next-line camelcase
	| WEBGL_debug_renderer_info
	// eslint-disable-next-line camelcase
	| WEBGL_debug_shaders
	// eslint-disable-next-line camelcase
	| WEBGL_depth_texture
	// eslint-disable-next-line camelcase
	| WEBGL_draw_buffers
	// eslint-disable-next-line camelcase
	| WEBGL_lose_context
	// eslint-disable-next-line camelcase
	| WEBGL_multi_draw;
