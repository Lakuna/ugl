/** A shape. */
export class Geometry {
  /**
   * Creates a shape.
   * @param positions - The clip space coordinates of the vertices of the shape.
   * @param texcoords - The texture space coordinates of the vertices of the shape for the texture applied to the shape.
   * @param normals - The normal values of the vertices of the shape.
   * @param indices - The indices of the shape.
   */
  constructor(positions: Float32Array, texcoords?: Float32Array, normals?: Float32Array, indices?: Uint8Array) {
    this.positions = positions;
    if (texcoords) { this.texcoords = texcoords; }
    if (normals) { this.normals = normals; }
    if (indices) { this.indices = indices; }
  }

  /** The clip space coordinates of the vertices of this shape. */
  readonly positions: Float32Array;

  /** The texture space coordinates of the vertices of this shape for the texture applied to this shape. */
  readonly texcoords?: Float32Array;

  /** The normal values of the vertices of this shape. */
  readonly normals?: Float32Array;

  /** The indices of this shape. */
  readonly indices?: Uint8Array;
}
