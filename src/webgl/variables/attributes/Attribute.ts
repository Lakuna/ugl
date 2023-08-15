import type BufferInfo from "#attributes/BufferInfo";
import Variable from "#variables/Variable";
import type Program from "#webgl/Program";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";
import { BufferTarget } from "#webgl/variables/attributes/Buffer";
import BufferTargetError from "#utility/BufferTargetError";

/** Possible variable types for attributes. */
export const enum AttributeType {
	/** A 32-bit signed floating-point value. */
	FLOAT = 0x1406,

	/** A two-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC2 = 0x8B50,

	/** A three-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC3 = 0x8B51,

	/** A four-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC4 = 0x8B52,

	/** A boolean value. */
	BOOL = 0x8B56,

	/** A 32-bit signed integer value. */
	INT = 0x1404,

	/** A two-dimensional vector of boolean values. */
	BOOL_VEC2 = 0x8B57,

	/** A two-dimensional vector of 32-bit signed integer values. */
	INT_VEC2 = 0x8B53,

	/** A three-dimensional vector of boolean values. */
	BOOL_VEC3 = 0x8B58,

	/** A three-dimensional vector of 32-bit signed integer values. */
	INT_VEC3 = 0x8B54,

	/** A four-dimensional vector of boolean values. */
	BOOL_VEC4 = 0x8B59,

	/** A four-dimensional vector of 32-bit signed integer values. */
	INT_VEC4 = 0x8B55,

	/** A 32-bit signed uninteger value. */
	UNSIGNED_INT = 0x1405,

	/** A two-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC2 = 0x8DC6,

	/** A three-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC3 = 0x8DC7,

	/** A four-dimensional vector of 32-bit unsigned integer values. */
	UNSIGNED_INT_VEC4 = 0x8DC8,

	/** A matrix of 32-bit signed floating-point values with two rows and two columns. */
	FLOAT_MAT2 = 0x8B5A,

	/** A matrix of 32-bit signed floating-point values with three rows and three columns. */
	FLOAT_MAT3 = 0x8B5B,

	/** A matrix of 32-bit signed floating-point values with four rows and four columns. */
	FLOAT_MAT4 = 0x8B5C
}

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

/** A float input variable in a WebGL vertex shader. */
export class FloatAttribute extends Attribute {
	/**
	 * Creates a float attribute.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public constructor(program: Program, index: number) {
		super(program, index);
	}

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	protected setterInternal(value: BufferInfo): void {
		this.context.internal.vertexAttribPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset);
	}
}

/** An integer, unsigned integer, or boolean input variable in a WebGL vertex shader. */
export class IntegerAttribute extends Attribute {
	/**
	 * Creates an integer, unsigned integer, or boolean attribute.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public constructor(program: Program, index: number) {
		super(program, index);
	}

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	protected setterInternal(value: BufferInfo): void {
		this.context.internal.vertexAttribIPointer(this.location, value.size, value.type, value.stride, value.offset);
	}
}

/** A matrix input variable in a WebGL vertex shader. */
export class MatrixAttribute extends Attribute {
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
			this.context.internal.vertexAttribPointer(this.location + i, this.dim, value.type, value.normalized, value.stride, value.offset + (value.stride || value.buffer.elementSize) * this.dim * i);
		}
	}
}
