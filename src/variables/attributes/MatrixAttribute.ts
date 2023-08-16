import Attribute from "#Attribute";
import type Program from "#Program";
import type BufferInfo from "#BufferInfo";

/** A matrix input variable in a WebGL vertex shader. */
export default class MatrixAttribute extends Attribute {
	/**
	 * Creates a matrix attribute.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public constructor(program: Program, index: number, dim: 1 | 2 | 3 | 4) {
		super(program, index);
		this.dim = dim;
	}

	/** The side length of values passed to this attribute. */
	public readonly dim: 1 | 2 | 3 | 4;

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	protected setterInternal(value: BufferInfo): void {
		for (let i = 0; i < this.dim; i++) {
			this.context.internal.vertexAttribPointer(
				this.location + i,
				this.dim,
				value.type,
				value.normalized,
				value.stride,
				value.offset + (value.stride || value.buffer.elementSize) * this.dim * i
			);
		}
	}
}
