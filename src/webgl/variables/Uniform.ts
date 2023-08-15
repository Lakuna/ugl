import type { default as Texture, Mip } from "#textures/Texture";
import type MeasuredIterable from "#types/MeasuredIterable";
import Variable from "#variables/Variable";
import type Program from "#webgl/Program";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";

/** Possible variable types for uniforms. */
export const enum UniformType {
	/** A 32-bit signed floating-point value. */
	FLOAT = 0x1406,

	/** A two-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC2 = 0x8B50,

	/** A three-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC3 = 0x8B51,

	/** A four-dimensional vector of 32-bit signed floating-point values. */
	FLOAT_VEC4 = 0x8B52,

	/** A sampler of a 2D texture. */
	SAMPLER_2D = 0x8B5E,

	/** A sampler of a 3D texture. */
	SAMPLER_3D = 0x8B5F,

	/** A sampler of a cube texture. */
	SAMPLER_CUBE = 0x8B60,

	/** A sampler of a 2D shadow texture. */
	SAMPLER_2D_SHADOW = 0x8B62,

	/** A sampler of a 2D array texture. */
	SAMPLER_2D_ARRAY = 0x8DC1,

	/** A sampler of a 2D array shadow texture. */
	SAMPLER_2D_ARRAY_SHADOW = 0x8DC4,

	/** A sampler of a cube shadow texture. */
	SAMPLER_CUBE_SHADOW = 0x8DC5,

	/** An integer sampler of a 2D texture. */
	INT_SAMPLER_2D = 0x8DCA,

	/** An integer sampler of a 3D texture. */
	INT_SAMPLER_3D = 0x8DCB,

	/** An integer sampler of a cube texture. */
	INT_SAMPLER_CUBE = 0x8DCC,

	/** An integer sampler of a 2D array texture. */
	INT_SAMPLER_2D_ARRAY = 0x8DCF,

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
	FLOAT_MAT4 = 0x8B5C,

	/** A matrix of 32-bit signed floating-point values with two rows and three columns. */
	FLOAT_MAT2x3 = 0x8B65,

	/** A matrix of 32-bit signed floating-point values with two rows and four columns. */
	FLOAT_MAT2x4 = 0x8B66,

	/** A matrix of 32-bit signed floating-point values with three rows and two columns. */
	FLOAT_MAT3x2 = 0x8B67,

	/** A matrix of 32-bit signed floating-point values with three rows and four columns. */
	FLOAT_MAT3x4 = 0x8B68,

	/** A matrix of 32-bit signed floating-point values with four rows and two columns. */
	FLOAT_MAT4x2 = 0x8B69,

	/** A matrix of 32-bit signed floating-point values with four rows and three columns. */
	FLOAT_MAT4x3 = 0x8B6A
}

/** A value that can be stored in a uniform. */
export type UniformValue = number | Texture<Mip>;

/**
 * A global variable in a WebGL shader program.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/uniforms)
 */
export default abstract class Uniform extends Variable {
	/**
	 * Creates a uniform for the given variable type.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 * @param textureUnit The texture unit to assign to this uniform if it ends up being a sampler.
	 */
	public static create(program: Program, index: number, textureUnit: number): Uniform {
		const activeInfo: WebGLActiveInfo | null = program.context.internal.getActiveUniform(program.internal, index);
		if (!activeInfo) { throw new UnsupportedOperationError(); }

		switch (activeInfo.type as UniformType) {
			case UniformType.FLOAT:
				return new FloatUniform(program, index);
			case UniformType.FLOAT_VEC2:
				return new FloatVector2Uniform(program, index);
			case UniformType.FLOAT_VEC3:
				return new FloatVector3Uniform(program, index);
			case UniformType.FLOAT_VEC4:
				return new FloatVector4Uniform(program, index);
			case UniformType.SAMPLER_2D:
			case UniformType.SAMPLER_3D:
			case UniformType.SAMPLER_CUBE:
			case UniformType.SAMPLER_2D_SHADOW:
			case UniformType.SAMPLER_2D_ARRAY:
			case UniformType.SAMPLER_2D_ARRAY_SHADOW:
			case UniformType.SAMPLER_CUBE_SHADOW:
			case UniformType.INT_SAMPLER_2D:
			case UniformType.INT_SAMPLER_3D:
			case UniformType.INT_SAMPLER_CUBE:
			case UniformType.INT_SAMPLER_2D_ARRAY:
				return new SamplerUniform(program, index, textureUnit);
			case UniformType.BOOL:
			case UniformType.INT:
				return new IntegerUniform(program, index);
			case UniformType.BOOL_VEC2:
			case UniformType.INT_VEC2:
				return new IntegerVector2Uniform(program, index);
			case UniformType.BOOL_VEC3:
			case UniformType.INT_VEC3:
				return new IntegerVector3Uniform(program, index);
			case UniformType.BOOL_VEC4:
			case UniformType.INT_VEC4:
				return new IntegerVector4Uniform(program, index);
			case UniformType.UNSIGNED_INT:
				return new UnsignedIntegerUniform(program, index);
			case UniformType.UNSIGNED_INT_VEC2:
				return new UnsignedIntegerVector2Uniform(program, index);
			case UniformType.UNSIGNED_INT_VEC3:
				return new UnsignedIntegerVector3Uniform(program, index);
			case UniformType.UNSIGNED_INT_VEC4:
				return new UnsignedIntegerVector4Uniform(program, index);
			case UniformType.FLOAT_MAT2:
				return new FloatMatrix2x2Uniform(program, index);
			case UniformType.FLOAT_MAT3:
				return new FloatMatrix3x3Uniform(program, index);
			case UniformType.FLOAT_MAT4:
				return new FloatMatrix4x4Uniform(program, index);
			case UniformType.FLOAT_MAT2x3:
				return new FloatMatrix2x3Uniform(program, index);
			case UniformType.FLOAT_MAT2x4:
				return new FloatMatrix2x4Uniform(program, index);
			case UniformType.FLOAT_MAT3x2:
				return new FloatMatrix3x2Uniform(program, index);
			case UniformType.FLOAT_MAT3x4:
				return new FloatMatrix3x4Uniform(program, index);
			case UniformType.FLOAT_MAT4x2:
				return new FloatMatrix4x2Uniform(program, index);
			case UniformType.FLOAT_MAT4x3:
				return new FloatMatrix4x3Uniform(program, index);
			default:
				throw new UnsupportedOperationError();
		}
	}

	/**
	 * Creates a uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 */
	public constructor(program: Program, index: number) {
		super(program);

		this.valuePrivate = [];

		const activeInfo: WebGLActiveInfo | null = this.context.internal.getActiveUniform(program.internal, index);
		if (!activeInfo) { throw new UnsupportedOperationError(); }
		this.activeInfo = activeInfo;

		const location: WebGLUniformLocation | null = this.context.internal.getUniformLocation(program.internal, this.activeInfo.name);
		if (!location) { throw new UnsupportedOperationError(); }
		this.location = location;
	}

	/** The active information of this uniform. */
	public readonly activeInfo: WebGLActiveInfo;

	/** The location of this uniform. */
	public readonly location: WebGLUniformLocation;

	/** The offset from the start of the given value to pass to WebGL. */
	public sourceOffset?: number;

	/** The length of the given value. Calculated automatically if not set. */
	public sourceLength?: number;

	/** The setter method for this uniform if the value is an array. */
	public abstract arraySetter(value: MeasuredIterable<UniformValue>): void;

	/** The value of this uniform. */
	protected valuePrivate: UniformValue | MeasuredIterable<UniformValue>;

	/** The value of this uniform. */
	public get value(): UniformValue | MeasuredIterable<UniformValue> {
		return this.valuePrivate;
	}

	/** The value of this uniform. */
	public set value(value: UniformValue | MeasuredIterable<UniformValue>) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			throw new UnsupportedOperationError();
		}

		this.valuePrivate = value;
	}
}

/** A global variable that can hold one value in a WebGL shader program. */
export abstract class SingleValuedUniform extends Uniform {
	/** The setter method for this uniform. */
	public abstract setter(value: UniformValue): void;

	/** The value of this uniform. */
	public override set value(value: UniformValue | MeasuredIterable<UniformValue>) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}

/** A sampler global variable in a WebGL shader program. */
export class SamplerUniform extends SingleValuedUniform {
	/**
	 * Creates a sampler uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 * @param textureUnit The texture unit to use.
	 */
	public constructor(program: Program, index: number, textureUnit: number) {
		super(program, index);
		this.textureUnit = textureUnit;
	}

	/** The texture unit of this uniform. */
	public readonly textureUnit: number;

	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<Texture<Mip>>): void {
		const textureUnits: Int32Array = new Int32Array(value.length);
		for (let i = 0; i < value.length; i++) { textureUnits[i] = this.textureUnit + i; }
		for (let i = 0; i < value.length; i++) {
			(value[i] as Texture<Mip>).update();
			(value[i] as Texture<Mip>).assign(textureUnits[i] as number);
		}
		this.context.internal.uniform1iv(this.location, textureUnits, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: Texture<Mip>): void {
		this.context.internal.uniform1i(this.location, this.textureUnit);
		value.assign(this.textureUnit);
		value.update();
	}

	/** The value of this uniform. */
	public override get value(): Texture<Mip> | MeasuredIterable<Texture<Mip>> {
		return this.valuePrivate as Texture<Mip> | MeasuredIterable<Texture<Mip>>;
	}

	/** The value of this uniform. */
	public override set value(value: Texture<Mip> | MeasuredIterable<Texture<Mip>>) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}

/** A scalar global variable in a WebGL shader program. */
export abstract class ScalarUniform extends SingleValuedUniform {
	/** The value of this uniform. */
	public override get value(): number | MeasuredIterable<number> {
		return this.valuePrivate as number | MeasuredIterable<number>;
	}

	/** The value of this uniform. */
	public override set value(value: number | MeasuredIterable<number>) {
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}

/** A float global variable in a WebGL shader program. */
export class FloatUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform1fv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.context.internal.uniform1f(this.location, value);
	}
}

/** An integer or boolean global variable in a WebGL shader program. */
export class IntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform1iv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.context.internal.uniform1i(this.location, value);
	}
}

/** An unsigned integer global variable in a WebGL shader program. */
export class UnsignedIntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform1uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.context.internal.uniform1ui(this.location, value);
	}
}

/** A global variable that can only hold multiple values in a WebGL shader program. */
export abstract class MultipleValuedUniform extends Uniform {
	/** The value of this uniform. */
	public override get value(): MeasuredIterable<number> {
		return this.valuePrivate as MeasuredIterable<number>;
	}

	/** The value of this uniform. */
	public override set value(value: MeasuredIterable<number>) {
		this.arraySetter(value);
		this.valuePrivate = value;
	}
}

/** A float 2D vector global variable in a WebGL shader program. */
export class FloatVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform2fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3D vector global variable in a WebGL shader program. */
export class FloatVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform3fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4D vector global variable in a WebGL shader program. */
export class FloatVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform4fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 2D vector global variable in a WebGL shader program. */
export class IntegerVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform2iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 3D vector global variable in a WebGL shader program. */
export class IntegerVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform3iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 4D vector global variable in a WebGL shader program. */
export class IntegerVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform4iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 2D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform2uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 3D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform3uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 4D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniform4uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** A matrix global variable in a WebGL shader program. */
export abstract class MatrixUniform extends MultipleValuedUniform {
	/**
	 * Creates a matrix uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 */
	public constructor(program: Program, index: number) {
		super(program, index);
		this.transpose = false;
	}

	/** Whether to transpose the value of this uniform when passing it to WebGL. */
	public transpose: boolean;
}

/** A float 2x2 matrix global variable in a WebGL shader program. */
export class FloatMatrix2x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x3 matrix global variable in a WebGL shader program. */
export class FloatMatrix2x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix2x3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix2x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix2x4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x2 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix3x2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x3 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix3x4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4x2 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix4x2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix4x3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<number>): void {
		this.context.internal.uniformMatrix4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}
