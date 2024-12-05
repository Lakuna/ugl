import MatrixUniform from "./MatrixUniform.js";
import type Program from "../../Program.js";

/**
 * An eight-value matrix global variable in a shader program.
 * @internal
 */
export default abstract class MatrixUniform8 extends MatrixUniform {
	/**
	 * Create a scalar uniform.
	 * @param program - The shader program that the uniform belongs to.
	 * @param activeInfo - The information of the uniform.
	 * @throws {@link UnsupportedOperationError} if the location of the uniform cannot be retrieved.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation | getUniformLocation}
	 * @internal
	 */
	public constructor(program: Program, activeInfo: WebGLActiveInfo) {
		super(program, activeInfo);
		this.valueCache = [0, 0, 0, 0, 0, 0, 0, 0];
		this.matrixValueCache = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	/**
	 * The value that is stored in this matrix uniform.
	 * @internal
	 */
	protected matrixValueCache: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	];

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>): void {
		// Can only accept eight values.
		const [i0, i1, i2, i3, i4, i5, i6, i7] = [...value];
		if (
			(i0 === this.matrixValueCache[0] &&
				i1 === this.matrixValueCache[1] &&
				i2 === this.matrixValueCache[2] &&
				i3 === this.matrixValueCache[3] &&
				i4 === this.matrixValueCache[4] &&
				i5 === this.matrixValueCache[5] &&
				i6 === this.matrixValueCache[6] &&
				i7 === this.matrixValueCache[7]) ||
			typeof i0 === "undefined" ||
			typeof i1 === "undefined" ||
			typeof i2 === "undefined" ||
			typeof i3 === "undefined" ||
			typeof i4 === "undefined" ||
			typeof i5 === "undefined" ||
			typeof i6 === "undefined" ||
			typeof i7 === "undefined"
		) {
			return;
		}

		this.iterableSetterInternal(value);
		this.matrixValueCache = [i0, i1, i2, i3, i4, i5, i6, i7];
	}

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public abstract iterableSetterInternal(value: Iterable<number>): void;
}
