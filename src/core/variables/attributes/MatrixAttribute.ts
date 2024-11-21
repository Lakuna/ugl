import Attribute from "./Attribute.js";
import type AttributeValue from "../../../types/AttributeValue.js";
import type Program from "../../Program.js";
import getSizeOfDataType from "../../../utility/internal/getSizeOfDataType.js";

/**
 * A matrix input variable in a vertex shader.
 * @internal
 */
export default class MatrixAttribute extends Attribute {
	/**
	 * Create a matrix attribute.
	 * @param program - The shader program that the attribute belongs to.
	 * @param activeInfo - The information of the attribute.
	 * @param dim - The side length of the matrix.
	 * @internal
	 */
	public constructor(
		program: Program,
		activeInfo: WebGLActiveInfo,
		dim: 1 | 2 | 3 | 4
	) {
		super(program, activeInfo);
		this.dim = dim;
	}

	/**
	 * The side length of values passed to this attribute.
	 * @internal
	 */
	private readonly dim;

	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer | vertexAttribPointer}
	 * @internal
	 */
	protected override setterInternal(value: AttributeValue) {
		const normalized = value.normalized ?? false;
		const stride = value.stride ?? 0;
		const offset = value.offset ?? 0;
		const actualStride = stride || getSizeOfDataType(value.vbo.type);
		for (let i = 0; i < this.dim; i++) {
			this.gl.vertexAttribPointer(
				this.location + i,
				this.dim,
				value.vbo.type,
				normalized,
				stride,
				offset + actualStride * this.dim * i
			);
		}

		this.valueCache = value;
	}
}
