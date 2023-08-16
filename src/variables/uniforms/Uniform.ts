import Variable from "#Variable";
import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type MeasuredIterable from "#MeasuredIterable";
import type { UniformValue } from "#UniformValue";

/**
 * A global variable in a WebGL shader program.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/uniforms)
 */
export default abstract class Uniform extends Variable {
	/**
	 * Creates a uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 */
	public constructor(program: Program, index: number) {
		super(program);

		this.valuePrivate = [];

		const activeInfo: WebGLActiveInfo | null =
			this.context.internal.getActiveUniform(program.internal, index);
		if (!activeInfo) {
			throw new UnsupportedOperationError();
		}
		this.activeInfo = activeInfo;

		const location: WebGLUniformLocation | null =
			this.context.internal.getUniformLocation(
				program.internal,
				this.activeInfo.name
			);
		if (!location) {
			throw new UnsupportedOperationError();
		}
		this.location = location;
	}

	/** The active information of this uniform. */
	public readonly activeInfo: WebGLActiveInfo;

	/** The location of this uniform. */
	public readonly location: WebGLUniformLocation;

	/** The offset from the start of the given value to pass to WebGL. */
	public sourceOffset?: number;

	/** The length of the given value. Calculated automatically if not set. */
	public sourceLength?: number;

	/** The setter method for this uniform if the value is an array. */
	public abstract arraySetter(value: MeasuredIterable<UniformValue>): void;

	/** The value of this uniform. */
	protected valuePrivate: UniformValue | MeasuredIterable<UniformValue>;

	/** The value of this uniform. */
	public get value(): UniformValue | MeasuredIterable<UniformValue> {
		return this.valuePrivate;
	}

	/** The value of this uniform. */
	public set value(value: UniformValue | MeasuredIterable<UniformValue>) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			throw new UnsupportedOperationError();
		}

		this.valuePrivate = value;
	}
}
