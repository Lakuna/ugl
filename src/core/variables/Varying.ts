import type VaryingValue from "../../types/VaryingValue.js";
import type VertexBuffer from "../buffers/VertexBuffer.js";
import type Program from "../Program.js";

import BufferTarget from "../../constants/BufferTarget.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import Variable from "./Variable.js";

/**
 * An input variable in a WebGL fragment shader used for transform feedback.
 * @public
 */
export default class Varying extends Variable {
	/** The value that is stored in this varying. */
	public override get value(): Readonly<VaryingValue> | undefined {
		return this.valueCache;
	}

	// Should only be called from within `TransformFeedback`.
	/** @internal */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public override set value(value: undefined | VaryingValue | VertexBuffer) {
		if (!value) {
			return;
		}

		const realValue = "vbo" in value ? { ...value } : { vbo: value };
		realValue.offset ??= 0;

		if (realValue.size) {
			this.gl.bindBufferRange(
				BufferTarget.TRANSFORM_FEEDBACK_BUFFER,
				this.program.varyings
					.keys()
					.toArray()
					.findIndex((name) => name === this.name),
				realValue.vbo.internal,
				realValue.offset,
				realValue.size
			);
		} else {
			this.gl.bindBufferBase(
				BufferTarget.TRANSFORM_FEEDBACK_BUFFER,
				this.program.varyings
					.keys()
					.toArray()
					.findIndex((name) => name === this.name),
				realValue.vbo.internal
			);
		}

		this.valueCache = realValue;
	}

	/**
	 * The value of this varying.
	 * @internal
	 */
	private valueCache?: VaryingValue;

	/**
	 * Create a transform feedback varying.
	 * @param program - The shader program that this transform feedback varying belongs to.
	 * @param index - The index of this transform feedback varying.
	 * @throws {@link UnsupportedOperationError} if the active information of the varying cannot be retrieved.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getTransformFeedbackVarying | getTransformFeedbackVarying}
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
}
