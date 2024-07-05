import FloatMatrix2x2Uniform from "#FloatMatrix2x2Uniform";
import FloatMatrix2x3Uniform from "#FloatMatrix2x3Uniform";
import FloatMatrix2x4Uniform from "#FloatMatrix2x4Uniform";
import FloatMatrix3x2Uniform from "#FloatMatrix3x2Uniform";
import FloatMatrix3x3Uniform from "#FloatMatrix3x3Uniform";
import FloatMatrix3x4Uniform from "#FloatMatrix3x4Uniform";
import FloatMatrix4x2Uniform from "#FloatMatrix4x2Uniform";
import FloatMatrix4x3Uniform from "#FloatMatrix4x3Uniform";
import FloatMatrix4x4Uniform from "#FloatMatrix4x4Uniform";
import FloatUniform from "#FloatUniform";
import FloatVector2Uniform from "#FloatVector2Uniform";
import FloatVector3Uniform from "#FloatVector3Uniform";
import FloatVector4Uniform from "#FloatVector4Uniform";
import IntegerUniform from "#IntegerUniform";
import IntegerVector2Uniform from "#IntegerVector2Uniform";
import IntegerVector3Uniform from "#IntegerVector3Uniform";
import IntegerVector4Uniform from "#IntegerVector4Uniform";
import type Program from "#Program";
import SamplerUniform from "#SamplerUniform";
import UniformType from "#UniformType";
import UnsignedIntegerUniform from "#UnsignedIntegerUniform";
import UnsignedIntegerVector2Uniform from "#UnsignedIntegerVector2Uniform";
import UnsignedIntegerVector3Uniform from "#UnsignedIntegerVector3Uniform";
import UnsignedIntegerVector4Uniform from "#UnsignedIntegerVector4Uniform";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * Create a wrapper object for a uniform.
 * @param program - The shader program that the uniform belongs to.
 * @param index - The index of the uniform.
 * @returns The uniform.
 * @throws {@link UnsupportedOperationError}
 * @internal
 */
export default function createUniform(program: Program, index: number) {
	const activeInfo = program.gl.getActiveUniform(program.internal, index);
	if (!activeInfo) {
		throw new UnsupportedOperationError();
	}

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
			return new SamplerUniform(program, index);
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
