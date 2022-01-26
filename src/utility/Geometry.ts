/** A shape. */
export class Geometry {
	/**
	 * Creates a shape.
	 * @param positions - The clip-space coordinates of the vertices of the shape.
	 * @param texcoords - The texture-space coordinates of textures applied to the shape.
	 * @param normals - The normal values of the vertices of the shape.
	 * @param indices - The indices of the shape.
	 */
	constructor(positions: number[] = [], texcoords: number[] = [], normals: number[] = [], indices: number[]) {
		this.positions = positions;
		this.texcoords = texcoords;
		this.normals = normals;
		this.indices = indices;
	}

	/** The clip-space coordinates of the vertices of this shape. */
	positions: number[];

	/** The texture-space coordinates of textures applied to this shape. */
	texcoords: number[];

	/** The normal values of the vertices of this shape. */
	normals: number[];

	/** The indices of this shape. */
	indices?: number[];
}