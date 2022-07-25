import { Variable } from "./Variable.js";
import { Program } from "./Program.js";
import { UniformType } from "./WebGLConstant.js";
import { Texture } from "./Texture.js";

/** A global variable in a WebGL shader program. */
export abstract class Uniform extends Variable {
	/**
	 * Creates a uniform for the given variable type.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 * @param textureUnit The texture unit to assign to this uniform if it ends up being a sampler.
	 */
	public static create(program: Program, index: number, textureUnit: number): Uniform {
		const activeInfo: WebGLActiveInfo | null = program.gl.getActiveUniform(program.program, index);
		if (!activeInfo) { throw new Error("Unable to get uniform active information."); }

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
				throw new Error("Unable to make uniform setter.");
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

		const activeInfo: WebGLActiveInfo | null = this.gl.getActiveUniform(program.program, index);
		if (!activeInfo) { throw new Error("Unable to get uniform active information."); }
		this.activeInfo = activeInfo;

		const location: WebGLUniformLocation | null = this.gl.getUniformLocation(program.program, this.activeInfo.name);
		if (!location) { throw new Error("Unable to get uniform location."); }
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
	public abstract arraySetter(value: Array<number> | Array<Texture>): void;

	/** The value of this uniform. */
	protected valuePrivate: number | Array<number> | Texture | Array<Texture>;

	/** The value of this uniform. */
	public get value(): number | Array<number> | Texture | Array<Texture> {
		return this.valuePrivate;
	}

	public set value(value: number | Array<number> | Texture | Array<Texture>) {
		if (Array.isArray(value)) {
			this.arraySetter(value);
		} else {
			throw new Error("Cannot pass a scalar value to this uniform.");
		}

		this.valuePrivate = value;
	}
}

/** A global variable that can hold one value in a WebGL shader program. */
export abstract class SingleValuedUniform extends Uniform {
	/** The setter method for this uniform. */
	public abstract setter(value: number | Texture): void;

	/** The value of this uniform. */
	public override set value(value: number | Array<number> | Texture | Array<Texture>) {
		if (Array.isArray(value)) {
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
	public arraySetter(value: Array<Texture>): void {
		const textureUnits: Int32Array = new Int32Array(value.length);
		for (let i = 0; i < value.length; i++) { textureUnits[i] = (this.textureUnit) + i; }
		this.gl.uniform1iv(this.location, textureUnits, this.sourceOffset, this.sourceLength);
		for (const [i, texture] of value.entries()) {
			texture.assign(textureUnits[i] as number);
		}
	}

	/** The setter method for this uniform. */
	public setter(value: Texture): void {
		value.assign(this.textureUnit);
		this.gl.uniform1i(this.location, this.textureUnit);
	}

	/** The value of this uniform. */
	public override get value(): Texture | Array<Texture> {
		return this.valuePrivate as Texture | Array<Texture>;
	}

	public override set value(value: Texture | Array<Texture>) {
		if (Array.isArray(value)) {
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
	public override get value(): number | Array<number> {
		return this.valuePrivate as number | Array<number>;
	}

	public override set value(value: number | Array<number>) {
		if (Array.isArray(value)) {
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
	public arraySetter(value: Array<number>): void {
		this.gl.uniform1fv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.gl.uniform1f(this.location, value);
	}
}

/** An integer or boolean global variable in a WebGL shader program. */
export class IntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform1iv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.gl.uniform1i(this.location, value);
	}
}

/** An unsigned integer global variable in a WebGL shader program. */
export class UnsignedIntegerUniform extends ScalarUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform1uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}

	/** The setter method for this uniform. */
	public setter(value: number): void {
		this.gl.uniform1ui(this.location, value);
	}
}

/** A global variable that can only hold multiple values in a WebGL shader program. */
export abstract class MultipleValuedUniform extends Uniform {
	/** The value of this uniform. */
	public override get value(): Array<number> {
		return this.valuePrivate as Array<number>;
	}

	public override set value(value: Array<number>) {
		this.arraySetter(value);
		this.valuePrivate = value;
	}
}

/** A float 2D vector global variable in a WebGL shader program. */
export class FloatVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform2fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3D vector global variable in a WebGL shader program. */
export class FloatVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform3fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4D vector global variable in a WebGL shader program. */
export class FloatVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform4fv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 2D vector global variable in a WebGL shader program. */
export class IntegerVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform2iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 3D vector global variable in a WebGL shader program. */
export class IntegerVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform3iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An integer or boolean 4D vector global variable in a WebGL shader program. */
export class IntegerVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform4iv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 2D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector2Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform2uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 3D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector3Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform3uiv(this.location, value, this.sourceOffset, this.sourceLength);
	}
}

/** An unsigned integer 4D vector global variable in a WebGL shader program. */
export class UnsignedIntegerVector4Uniform extends MultipleValuedUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniform4uiv(this.location, value, this.sourceOffset, this.sourceLength);
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
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x3 matrix global variable in a WebGL shader program. */
export class FloatMatrix2x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix2x3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix2x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix2x4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x2 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix3x2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x3 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 3x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix3x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix3x4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4x2 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x2Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix4x2fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 2x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x3Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix4x3fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}

/** A float 4x4 matrix global variable in a WebGL shader program. */
export class FloatMatrix4x4Uniform extends MatrixUniform {
	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: Array<number>): void {
		this.gl.uniformMatrix4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
	}
}
