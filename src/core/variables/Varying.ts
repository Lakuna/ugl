import type Program from "../Program.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import Variable from "./Variable.js";

/**
 * An input variable in a WebGL fragment shader used for transform feedback.
 * @public
 */
export default class Varying extends Variable {
	/**
	 * Create a transform feedback varying.
	 * @param program - The shader program that this transform feedback varying belongs to.
	 * @param index - The index of this transform feedback varying.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getTransformFeedbackVarying | getTransformFeedbackVarying}
	 * @internal
	 */
	public constructor(program: Program, index: number) {
		// TODO: Add `@throws` documentation.

		super(program);

		const activeInfo = this.context.gl.getTransformFeedbackVarying(
			program.internal,
			index
		);
		if (!activeInfo) {
			throw new UnsupportedOperationError(
				"The environment does not support active information."
			);
		}
		this.activeInfo = activeInfo;
	}

	/**
	 * The active information of this varying.
	 * @internal
	 */
	protected override readonly activeInfo;

	/** The value that is stored in this varying. */
	public override get value(): void {
		return void this; // TODO: Add transform feedback support.
	}
}
