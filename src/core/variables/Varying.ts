import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Variable from "#Variable";

/** An input variable in a WebGL fragment shader used for transform feedback. */
export default class Varying extends Variable {
	/**
	 * Create a transform feedback varying.
	 * @param program - The shader program that this transform feedback varying belongs to.
	 * @param index - The index of this transform feedback varying.
	 * @internal
	 */
	public constructor(program: Program, index: number) {
		super(program);

		const activeInfo = this.context.gl.getTransformFeedbackVarying(
			program.internal,
			index
		);
		if (!activeInfo) {
			throw new UnsupportedOperationError();
		}
		this.activeInfo = activeInfo;
	}

	/**
	 * The active information of this varying.
	 * @see [`getTransformFeedbackVarying`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getTransformFeedbackVarying)
	 * @internal
	 */
	protected override readonly activeInfo;

	/** Get the value that is stored in this varying. */
	public override get value() {
		return void this; // TODO
	}
}