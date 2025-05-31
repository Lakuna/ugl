import type Program from "../Program.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import Variable from "./Variable.js";
import type VertexBuffer from "../buffers/VertexBuffer.js";

/**
 * An input variable in a WebGL fragment shader used for transform feedback.
 * @public
 */
export default class Varying extends Variable {
	/**
	 * Create a transform feedback varying.
	 * @param program - The shader program that this transform feedback varying belongs to.
	 * @param index - The index of this transform feedback varying.
	 * @throws {@link UnsupportedOperationError} if the active information of the varying cannot be retrieved.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getTransformFeedbackVarying | getTransformFeedbackVarying}
	 * @internal
	 */
	public constructor(program: Program, index: number) {
		const activeInfo = program.context.gl.getTransformFeedbackVarying(
			program.internal,
			index
		);
		if (!activeInfo) {
			throw new UnsupportedOperationError(
				"The environment does not support active information."
			);
		}

		super(program, activeInfo);
	}

	/**
	 * The value of this varying.
	 * @internal
	 */
	protected valueCache?: VertexBuffer;

	/** The value that is stored in this varying. */
	public override get value(): VertexBuffer | undefined {
		return this.valueCache;
	}

	/**
	 * Set the value of this varying. Should only be called from within `TransformFeedback`.
	 * @param value - The new value for this varying.
	 * @returns Whether or not the value was updated.
	 * @internal
	 */
	public setValue(value: VertexBuffer | undefined): boolean {
		void this;
		void value;
		return false; // TODO: Add transform feedback support. Base off of `Attribute.prototype.setValue`.
	}
}
