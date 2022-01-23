export interface IMatrix extends Iterable<number> {
	/**
	 * Adds two matrices.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: IMatrix): IMatrix;

	/**
	 * Calculates the adjugate of this matrix.
	 * @returns The adjugate of this matrix.
	 */
	adjoint(): IMatrix;

	/**
	 * Creates a new matrix, initialized with values from this matrix.
	 * @returns A clone of this matrix.
	 */
	clone(): IMatrix;

	/** The determinant of this matrix. */
	get determinant(): number;

	/**
	 * Whether two matrices are approximately equivalent.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are approximately equivalent.
	 */
	equals(m: IMatrix): boolean;

	/**
	 * Whether two matrices are exactly equivalent.
	 * @param m - The other matrix.
	 * @returns Whether the matrices are exactly equivalent.
	 */
	exactEquals(m: IMatrix): boolean;

	/** The Frobenius normal of this matrix. */
	get frob(): number;

	/**
	 * Gets the value at the given point.
	 * @param x - The horizontal coordinate of the point.
	 * @param y - The vertical coordinate of the point.
	 * @returns The value at the given point.
	 */
	get(x: number, y: number): number;

	/** The number of rows in this matrix. */
	get height(): number;

	/**
	 * Inverts this matrix.
	 * @returns The inverted matrix.
	 */
	invert(): IMatrix;

	/**
	 * Multiplies two matrices.
	 * @param m - The other matrix.
	 * @returns The product of the matrices.
	 */
	multiply(m: IMatrix): IMatrix;

	/**
	 * Multiplies each element of this matrix by a scalar.
	 * @param s - The scalar.
	 * @returns The product of the matrix and the scalar.
	 */
	multiplyScalar(s: number): IMatrix;

	/**
	 * Subtracts two matrices.
	 * @param m - The other matrix.
	 * @returns The difference between the matrices.
	 */
	subtract(m: IMatrix): IMatrix;

	/**
	 * Transposes this matrix.
	 * @returns The transposed matrix.
	 */
	transpose(): IMatrix;

	/** The number of columns in this matrix. */
	get width(): number;
}