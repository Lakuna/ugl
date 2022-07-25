import { Variable } from "./Variable.js";
import { Program } from "./Program.js";
import { AttributeType } from "./WebGLConstant.js";
import { AttributeState } from "./AttributeState.js";

/** An input variable in a WebGL vertex shader. */
export abstract class Attribute extends Variable {
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
