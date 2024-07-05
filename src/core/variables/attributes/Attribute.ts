import type AttributeValue from "#AttributeValue";
import BufferTarget from "#BufferTarget";
import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Variable from "#Variable";

/** An input variable for a vertex shader. */
export default abstract class Attribute extends Variable {
	/**
	 * Create an attribute.
	 * @param program - The shader program that the attribute belongs to.
	 * @param index - The index of the attribute.
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	protected constructor(program: Program, index: number) {
		super(program);

		const activeInfo = this.gl.getActiveAttrib(program.internal, index);
		if (!activeInfo) {
			throw new UnsupportedOperationError();
		}
		this.activeInfo = activeInfo;

		this.location = this.gl.getAttribLocation(program.internal, this.name);
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
	 * Whether or not this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 * @internal
	 */
	private enabledCache?: boolean;

	/**
	 * Get whether or not this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 */
	public get enabled() {
		return (this.enabledCache ??= false);
	}

	/**
	 * Set whether or not this attribute can read data from a buffer.
	 * @see [`enableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)
	 * @see [`disableVertexAttribArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disableVertexAttribArray)
	 */
	public set enabled(value) {
		if (this.enabledCache === value) {
			return;
		}

		if (value) {
			this.gl.enableVertexAttribArray(this.location);
		} else {
			this.gl.disableVertexAttribArray(this.location);
		}
		this.enabledCache = value;
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

	/** Set the value that is stored in this attribute. */
	public set value(value: AttributeValue) {
		// Update even if the cached value is the same as the given value, since the data in the buffer could have updated.
		this.enabled = true;
		value.buffer.bind(BufferTarget.ARRAY_BUFFER);
		this.setterInternal(value);
		this.valueCache = value;
	}
}
