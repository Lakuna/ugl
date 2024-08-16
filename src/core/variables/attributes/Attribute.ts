import type AttributeValue from "../../../types/AttributeValue.js";
import BufferTarget from "../../../constants/BufferTarget.js";
import type Program from "../../Program.js";
import Vao from "../../Vao.js";
import Variable from "../Variable.js";
import type Vbo from "../../buffers/Vbo.js";

/**
 * An input variable for a vertex shader.
 * @public
 */
export default abstract class Attribute extends Variable {
	/**
	 * Create an attribute.
	 * @param program - The shader program that the attribute belongs to.
	 * @param activeInfo - The information of the attribute.
	 * @internal
	 */
	public constructor(program: Program, activeInfo: WebGLActiveInfo) {
		super(program);
		this.activeInfo = activeInfo;
		this.location = this.gl.getAttribLocation(program.internal, this.name);
		this.enabledVaosCache = [];
	}

	/**
	 * The active information of this attribute.
	 * @internal
	 */
	protected override readonly activeInfo;

	/**
	 * The location of this attribute.
	 * @internal
	 */
	public readonly location;

	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @internal
	 */
	protected abstract setterInternal(value: AttributeValue): void;

	/**
	 * The VAOs for which this attribute can read data from a buffer.
	 * @internal
	 */
	private enabledVaosCache: WebGLVertexArrayObject[];

	/**
	 * Whether or not this attribute can read data from a buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray | enableVertexAttribArray}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray | disableVertexAttribArray}
	 */
	public get enabled(): boolean {
		const vao = Vao.getBound(this.gl);
		if (vao === null) {
			return false;
		}

		return this.enabledVaosCache.includes(vao);
	}

	public set enabled(value) {
		if (this.enabled === value) {
			return;
		}

		const vao = Vao.getBound(this.gl);

		// Enable.
		if (value) {
			this.gl.enableVertexAttribArray(this.location);
			if (vao !== null && !this.enabledVaosCache.includes(vao)) {
				this.enabledVaosCache.push(vao);
			}
			return;
		}

		// Disable.
		this.gl.disableVertexAttribArray(this.location);
		if (vao !== null && this.enabledVaosCache.includes(vao)) {
			this.enabledVaosCache.splice(this.enabledVaosCache.indexOf(vao), 1);
		}
	}

	/**
	 * The value of this attribute.
	 * @internal
	 */
	protected valueCache?: AttributeValue;

	/** The value that is stored in this attribute. */
	public override get value(): AttributeValue | undefined {
		return this.valueCache;
	}

	/**
	 * Set the value of this attribute. Should only be called from within `Vao`.
	 * @param value - The new value for this attribute.
	 * @internal
	 */
	public setValue(value: AttributeValue | Vbo | undefined): void {
		if (typeof value === "undefined") {
			this.enabled = false;
			delete this.valueCache;
			return;
		}

		const realValue = "vbo" in value ? { ...value } : { vbo: value };
		this.enabled = true;
		realValue.vbo.bind(BufferTarget.ARRAY_BUFFER);
		this.setterInternal(realValue);
	}
}
