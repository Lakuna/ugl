import Variable from "#Variable";
import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type BufferInfo from "#BufferInfo";
import BufferTarget from "#BufferTarget";
import BufferTargetError from "#BufferTargetError";

/**
 * An input variable in a WebGL vertex shader.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/attributes)
 */
export default abstract class Attribute extends Variable {
	/**
	 * Creates an attribute.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public constructor(program: Program, index: number) {
		super(program);

		this.enabledPrivate = false;
		this.enabled = true;

		const activeInfo: WebGLActiveInfo | null = this.context.internal.getActiveAttrib(program.internal, index);
		if (!activeInfo) { throw new UnsupportedOperationError(); }
		this.activeInfo = activeInfo;

		this.location = this.context.internal.getAttribLocation(program.internal, this.activeInfo.name);
	}

	/** The active information of this attribute. */
	public readonly activeInfo: WebGLActiveInfo;

	/** The location of this attribute. */
	public readonly location: number;

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	public setter(value: BufferInfo): void {
		if (value.buffer.target != BufferTarget.ARRAY_BUFFER) {
			throw new BufferTargetError();
		}

		this.enabled = true;

		return value.buffer.with((): void => {
			this.setterInternal(value);
		});
	}

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	protected abstract setterInternal(value: BufferInfo): void;

	/** Whether this attribute can get data from a buffer. */
	private enabledPrivate: boolean;

	/** Whether this attribute can get data from a buffer. */
	public get enabled(): boolean {
		return this.enabledPrivate;
	}

	/** Whether this attribute can get data from a buffer. */
	public set enabled(value: boolean) {
		if (value) {
			this.context.internal.enableVertexAttribArray(this.location);
		} else {
			this.context.internal.disableVertexAttribArray(this.location);
		}

		this.enabledPrivate = value;
	}

	/** The value of this attribute. */
	private valuePrivate?: BufferInfo;

	/** The value of this attribute. */
	public get value(): BufferInfo | undefined {
		return this.valuePrivate;
	}

	/** The value of this attribute. */
	public set value(value: BufferInfo | undefined) {
		if (!value) { return; }
		this.setter(value);
		this.valuePrivate = value;
	}
}
