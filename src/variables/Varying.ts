import Variable from "#Variable";
import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * An input variable in a WebGL fragment shader used for transform feedback.
 * @see [GPGPU](https://www.lakuna.pw/a/webgl/gpgpu)
 */
export default class Varying extends Variable {
	/**
	 * Creates a transform feedback varying. This should only be called by the
	 * `Program` constructor.
	 * @param program The shader program that this transform feedback varying
	 * belongs to.
	 * @param index The index of this transform feedback varying.
	 */
	public constructor(program: Program, index: number) {
		super(program);

		const activeInfo: WebGLActiveInfo | null =
			this.context.internal.getTransformFeedbackVarying(
				program.internal,
				index
			);
		if (!activeInfo) {
			throw new UnsupportedOperationError();
		}
		this.activeInfo = activeInfo;
	}

	/** The active information of this attribute. */
	public readonly activeInfo: WebGLActiveInfo;

	/** Does nothing; transform feedback varyings cannot be set. */
	protected readonly setter?: () => void;

	/** Does nothing; transform feedback varyings cannot be set. */
	protected readonly arraySetter?: () => void;
}
