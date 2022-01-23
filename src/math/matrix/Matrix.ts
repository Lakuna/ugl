import { IMatrix } from "./IMatrix.js";

/** An immutable column-major matrix of any size. Other types of matrices will be faster. */
export class Matrix extends Array<number> implements IMatrix, ReadonlyArray<number> {
	/**
	 * Creates a matrix from a rule.
	 * @param width - The width of the matrix.
	 * @param height - The height of the matrix.
	 * @param rule - The rule to follow to calculate the values in the matrix.
	 * @returns A matrix.
	 */
	static fromRule(width: number, height: number, rule: (x: number, y: number) => number): Matrix {
		const columns: number[][] = [];
		for (let x = 0; x < width; x++) {
			const column: number[] = [];
			for (let y = 0; y < height; y++) {
				column.push(rule(x, y));
			}
			columns.push(column);
		}
		return new Matrix(...columns);
	}

	/** Creates a 4x4 identity matrix. */
	constructor();

	/**
	 * Creates a rectangular matrix with the given columns.
	 * @param columns - The columns of numbers in the matrix.
	 */
	constructor(...columns: number[][]);

	/**
	 * Creates a square matrix with the given data in column-major order.
	 * @param data - The numbers in the matrix in column-major order.
	 */
	constructor(...data: number[]);

	constructor(...data: (number | number[])[]) {
		if (data.length) {
			if (typeof data[0] == "number") {
				const dim: number = Math.sqrt(data.length);
				if (dim % 1) { throw new Error("This constructor can only create square matrices."); }
				super(...data as number[]);
				this.#height = dim;
				this.#width = dim;
			} else {
				super(...([] as number[]).concat(...data as number[][]));
				this.#height = (data[0] as number[]).length;
				this.#width = data.length;
			}
		} else {
			super(
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);
			this.#height = 4;
			this.#width = 4;
		}
	}

	/**
	 * Adds two matrices.
	 * @param m - The other matrix.
	 * @returns The sum of the matrices.
	 */
	add(m: IMatrix): IMatrix {
		if (this.width != m.width || this.height != m.height) { throw new Error("Matrices must have equivalent dimensions to be added together."); }
		return Matrix.fromRule(this.width, this.height, (x: number, y: number) => this.get(x, y) + m.get(x, y));
	}

	readonly #height: number;

	readonly #width: number;
}