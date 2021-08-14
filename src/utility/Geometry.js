/** Class representing a shape. */
export class Geometry {
	/**
	 * Create a shape.
	 * @param {number[]|Vector[]} [positions=[]] - The clip space coordinates of the vertices of this shape.
	 * @param {number[]|Vector[]} [texcoords=[]] - The texture coordinates of this shape.
	 * @param {number[]|Vector[]} [normals=[]] - The normal values of this shape.
	 * @param {number[]} [indices] - The indices of this shape, if any.
	 */
	constructor(positions = [], texcoords = [], normals = [], indices) {
		/**
		 * The clip space coordinates of the vertices of this shape.
		 * @type {number[]|Vector[]}
		 */
		this.positions = positions;

		/**
		 * The texture coordinates of this shape.
		 * @type {number[]|Vector[]}
		 */
		this.texcoords = texcoords;

		/**
		 * The normal values of this shape.
		 * @type {number[]|Vector[]}
		 */
		this.normals = normals;

		/**
		 * The indices of this shape, if any.
		 * @type {number[]}
		 */
		this.indices = indices;
	}
}