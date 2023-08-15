import Variable from "#Variable";
import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import AttributeType from "#AttributeType";
import FloatAttribute from "#FloatAttribute";
import IntegerAttribute from "#IntegerAttribute";
import MatrixAttribute from "#MatrixAttribute";
import type BufferInfo from "#BufferInfo";
import BufferTarget from "#BufferTarget";
import BufferTargetError from "#BufferTargetError";

/**
 * An input variable in a WebGL vertex shader.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/attributes)
 */
export default abstract class Attribute extends Variable {
	/**
	 * Creates an attribute for the given variable type.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public static create(program: Program, index: number): Attribute {
		const activeInfo: WebGLActiveInfo | null = program.context.internal.getActiveAttrib(program.internal, index);
		if (!activeInfo) { throw new UnsupportedOperationError(); }

		switch (activeInfo.type as AttributeType) {
			case AttributeType.FLOAT:
			case AttributeType.FLOAT_VEC2:
			case AttributeType.FLOAT_VEC3:
			case AttributeType.FLOAT_VEC4:
				return new FloatAttribute(program, index);
			case AttributeType.INT:
			case AttributeType.INT_VEC2:
			case AttributeType.INT_VEC3:
			case AttributeType.INT_VEC4:
			case AttributeType.UNSIGNED_INT:
			case AttributeType.UNSIGNED_INT_VEC2:
			case AttributeType.UNSIGNED_INT_VEC3:
			case AttributeType.UNSIGNED_INT_VEC4:
			case AttributeType.BOOL:
			case AttributeType.BOOL_VEC2:
			case AttributeType.BOOL_VEC3:
			case AttributeType.BOOL_VEC4:
				return new IntegerAttribute(program, index);
			case AttributeType.FLOAT_MAT2:
				return new MatrixAttribute(program, index, 2);
			case AttributeType.FLOAT_MAT3:
				return new MatrixAttribute(program, index, 3);
			case AttributeType.FLOAT_MAT4:
				return new MatrixAttribute(program, index, 4);
			default:
				throw new UnsupportedOperationError();
		}
	}

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
