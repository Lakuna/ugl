import type AttributeValue from "../../../types/AttributeValue.js";
import type Buffer from "../../buffers/Buffer.js";
import BufferTarget from "../../../constants/BufferTarget.js";
import type Program from "../../Program.js";
import Vao from "../../Vao.js";
import Variable from "../Variable.js";

/** An input variable for a vertex shader. */
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
	 * @see [`getActiveAttrib`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib)
	 * @internal
	 */
	protected override readonly activeInfo;

	/**
	 * The location of this attribute.
	 * @see [`getAttribLocation`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation)
	 * @internal
	 */
	public readonly location;

	/**
	 * Set the value of this attribute.
	 * @param value - The value to pass to the attribute.
	 * @see [`vertexAttribPointer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer)
	 * @see [`vertexAttribIPointer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribIPointer)
	 * @internal
	 */
	protected abstract setterInternal(value: AttributeValue): void;

	/**
	 * The VAOs for which this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 * @internal
	 */
	private enabledVaosCache: WebGLVertexArrayObject[];

	/**
	 * Get whether or not this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 */
	public get enabled() {
		const vao = Vao.getBound(this.gl);
		if (vao === null) {
			return false;
		}

		return this.enabledVaosCache.includes(vao);
	}

	/**
	 * Set whether or not this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 */
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
	private valueCache?: AttributeValue;

	/** Get the value that is stored in this attribute. */
	public override get value(): AttributeValue | undefined {
		return this.valueCache;
	}

	/**
	 * Set the value that is stored in this attribute.
	 * @internal
	 */
	public set value(value: AttributeValue | Buffer) {
		// Update even if the cached value is the same as the given value, since the data in the buffer could have updated.
		this.enabled = true;
		const realValue = "buffer" in value ? value : { buffer: value };
		realValue.buffer.bind(BufferTarget.ARRAY_BUFFER);
		this.setterInternal(realValue);
		this.valueCache = realValue;
	}
}
