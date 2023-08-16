/** Binding points for texture faces. */
const enum MipmapTarget {
	/** A two-dimensional texture. */
	TEXTURE_2D = 0x0de1,

	/** A three-dimensional texture. */
	TEXTURE_3D = 0x806f,

	/** A two-dimensional array texture. */
	TEXTURE_2D_ARRAY = 0x8c1a,

	/** The positive X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,

	/** The negative X-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,

	/** The positive Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,

	/** The negative Y-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,

	/** The positive Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,

	/** The negative Z-axis face for a cube-mapped texture. */
	TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a
}

export default MipmapTarget;
