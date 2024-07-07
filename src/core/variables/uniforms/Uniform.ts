import type Program from "#Program";
import type Texture from "#Texture";
import type { UniformValue } from "#UniformValue";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Variable from "#Variable";

/** A global variable in a shader program. */
export default abstract class Uniform extends Variable {
	/**
	 * Create a uniform.
	 * @param program - The shader program that the uniform belongs to.
	 * @param index - The index of the uniform.
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	public constructor(program: Program, index: number) {
		super(program);

		const activeInfo = this.gl.getActiveUniform(program.internal, index);
		if (!activeInfo) {
			throw new UnsupportedOperationError();
		}
		this.activeInfo = activeInfo;

		const location = this.gl.getUniformLocation(
			program.internal,
			this.activeInfo.name
		);
		if (!location) {
			throw new UnsupportedOperationError();
		}
		this.location = location;
	}

	/**
	 * The active information of this uniform.
	 * @see [`getActiveUniform`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform)
	 * @internal
	 */
	protected override readonly activeInfo;

	/**
	 * The location of this uniform.
	 * @see [`getUniformLocation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation)
	 * @internal
	 */
	public readonly location: WebGLUniformLocation;

	/** The offset from the start of the given value to pass to WebGL. */
	public sourceOffset?: number;

	/** The length of the given value. Data is assumed to be tightly-packed if not set or set to zero. */
	public sourceLength?: number;

	/**
	 * Set the value of this uniform if the value is not iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @internal
	 */
	public abstract setter(value: number | Texture): void;

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see [`uniform[1234][uif][v]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform)
	 * @see [`uniformMatrix[234]x[234]fv`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniformMatrix)
	 * @internal
	 */
	public abstract iterableSetter(value: Iterable<number | Texture>): void;

	/**
	 * The value that is stored in this variable.
	 * @internal
	 */
	private valueCache?: UniformValue;

	/** Get the value that is stored in this uniform. */
	public get value(): UniformValue | undefined {
		return this.valueCache;
	}

	/** Set the value that is stored in this uniform. */
	public set value(value: UniformValue) {
		// Update even if the cached value is the same as the given value, since the data in the iterable could have updated.
		if (typeof value !== "number" && Symbol.iterator in value) {
			this.iterableSetter(value);
		} else {
			this.setter(value);
		}
		this.valueCache = value;
	}
}
