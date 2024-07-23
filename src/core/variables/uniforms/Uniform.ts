import type Program from "../../Program.js";
import type Texture from "../../textures/Texture.js";
import type { UniformValue } from "../../../types/UniformValue.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";
import Variable from "../Variable.js";

/**
 * A global variable in a shader program.
 * @public
 */
export default abstract class Uniform extends Variable {
	/**
	 * Create a uniform.
	 * @param program - The shader program that the uniform belongs to.
	 * @param activeInfo - The information of the uniform.
	 * @throws {@link UnsupportedOperationError} if the location of the uniform cannot be retrieved.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation | getUniformLocation}
	 * @internal
	 */
	public constructor(program: Program, activeInfo: WebGLActiveInfo) {
		super(program);
		this.activeInfo = activeInfo;

		const location = this.gl.getUniformLocation(
			program.internal,
			this.activeInfo.name
		);
		if (!location) {
			throw new UnsupportedOperationError(
				"The environment does not support uniform locations."
			);
		}
		this.location = location;
	}

	/**
	 * The active information of this uniform.
	 * @internal
	 */
	protected override readonly activeInfo;

	/**
	 * The location of this uniform.
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
	 * @internal
	 */
	public abstract setter(value: number | Texture): void;

	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @internal
	 */
	public abstract iterableSetter(value: Iterable<number | Texture>): void;

	/**
	 * The value that is stored in this variable.
	 * @internal
	 */
	private valueCache?: UniformValue;

	/** The value that is stored in this uniform. */
	public get value(): UniformValue | undefined {
		return this.valueCache;
	}

	public set value(value: UniformValue) {
		if (typeof value !== "number" && Symbol.iterator in value) {
			// It is slow to compare every value between two iterables, so always update iterable values.
			this.iterableSetter(value);
		} else {
			if (this.value === value) {
				return;
			}

			this.setter(value);
		}

		this.valueCache = value;
	}
}
