import Variable from "../Variable.js";
import type Program from "../../Program.js";
import type AttributeState from "../attributes/AttributeState.js";

/** Possible variable types for attributes. */
export enum AttributeType {
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

/** An input variable in a WebGL vertex shader. */
export default abstract class Attribute extends Variable {
	/**
	 * Creates an attribute for the given variable type.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public static create(program: Program, index: number): Attribute {
		const activeInfo: WebGLActiveInfo | null = program.gl.getActiveAttrib(program.program, index);
		if (!activeInfo) { throw new Error("Unable to get attribute active information."); }

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
				throw new Error("Unable to make attribute setter.");
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

		const activeInfo: WebGLActiveInfo | null = this.gl.getActiveAttrib(program.program, index);
		if (!activeInfo) { throw new Error("Unable to get attribute active information."); }
		this.activeInfo = activeInfo;

		this.location = this.gl.getAttribLocation(program.program, this.activeInfo.name);
	}

	/** The active information of this attribute. */
	public readonly activeInfo: WebGLActiveInfo;

	/** The location of this attribute. */
	public readonly location: number;

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	public abstract setter(value: AttributeState): void;

	/** Whether this attribute can get data from a buffer. */
	private enabledPrivate: boolean;

	/** Whether this attribute can get data from a buffer. */
	public get enabled(): boolean {
		return this.enabledPrivate;
	}

	public set enabled(value: boolean) {
		if (value) {
			this.gl.enableVertexAttribArray(this.location);
		} else {
			this.gl.disableVertexAttribArray(this.location);
		}

		this.enabledPrivate = value;
	}

	/** The value of this attribute. */
	private valuePrivate?: AttributeState;

	/** The value of this attribute. */
	public get value(): AttributeState | undefined {
		return this.valuePrivate;
	}

	public set value(value: AttributeState | undefined) {
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
	public setter(value: AttributeState): void {
		value.buffer.bind();
		this.enabled = true;
		this.gl.vertexAttribPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset);
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
	public setter(value: AttributeState): void {
		value.buffer.bind();
		this.enabled = true;
		this.gl.vertexAttribIPointer(this.location, value.size, value.type, value.stride, value.offset);
	}
}

/** A matrix input variable in a WebGL vertex shader. */
export class MatrixAttribute extends Attribute {
	/**
	 * Creates a matrix attribute.
	 * @param program The shader program that this attribute belongs to.
	 * @param index The index of this attribute.
	 */
	public constructor(program: Program, index: number, dim: number) {
		super(program, index);
		this.dim = dim;
	}

	/** The side length of values passed to this attribute. */
	public readonly dim: number;

	/**
	 * The setter method for this attribute.
	 * @param value The value to pass to the attribute.
	 */
	public setter(value: AttributeState): void {
		const stride: number = (this.dim * this.dim) * value.size;
		for (let i = 0; i < this.dim; i++) {
			const location: number = this.location + i;
			this.enabled = true;
			this.gl.vertexAttribPointer(location, value.size / this.dim, value.type, value.normalized, stride, value.offset + (stride / this.dim) * i);
		}
	}
}
