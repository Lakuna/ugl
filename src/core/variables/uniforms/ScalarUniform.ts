import type Program from "../../Program.js";
import Uniform from "./Uniform.js";

/**
 * A scalar global variable in a shader program.
 * @internal
 */
export default abstract class ScalarUniform extends Uniform {
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
		this.valueCache = 0;
		this.scalarValueCache = 0;
	}

	/**
	 * The value that is stored in this scalar uniform.
	 * @internal
	 */
	protected scalarValueCache: number;

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetter(value: Iterable<number>): void {
		// Can only accept one value.
		const [x] = [...value];
		if (typeof x === "undefined" || x === this.scalarValueCache) {
			return;
		}

		this.iterableSetterInternal(value);
		this.scalarValueCache = x;
	}

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public abstract iterableSetterInternal(value: Iterable<number>): void;

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override setter(value: number): void {
		if (value === this.scalarValueCache) {
			return;
		}

		this.setterInternal(value);
		this.scalarValueCache = value;
	}

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public abstract setterInternal(value: number): void;
}
