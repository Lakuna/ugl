import FloatMatrix2x2Uniform from "./FloatMatrix2x2Uniform.js";
import FloatMatrix2x3Uniform from "./FloatMatrix2x3Uniform.js";
import FloatMatrix2x4Uniform from "./FloatMatrix2x4Uniform.js";
import FloatMatrix3x2Uniform from "./FloatMatrix3x2Uniform.js";
import FloatMatrix3x3Uniform from "./FloatMatrix3x3Uniform.js";
import FloatMatrix3x4Uniform from "./FloatMatrix3x4Uniform.js";
import FloatMatrix4x2Uniform from "./FloatMatrix4x2Uniform.js";
import FloatMatrix4x3Uniform from "./FloatMatrix4x3Uniform.js";
import FloatMatrix4x4Uniform from "./FloatMatrix4x4Uniform.js";
import FloatUniform from "./FloatUniform.js";
import FloatVector2Uniform from "./FloatVector2Uniform.js";
import FloatVector3Uniform from "./FloatVector3Uniform.js";
import FloatVector4Uniform from "./FloatVector4Uniform.js";
import IntegerUniform from "./IntegerUniform.js";
import IntegerVector2Uniform from "./IntegerVector2Uniform.js";
import IntegerVector3Uniform from "./IntegerVector3Uniform.js";
import IntegerVector4Uniform from "./IntegerVector4Uniform.js";
import type Program from "../../Program.js";
import SamplerUniform from "./SamplerUniform.js";
import UniformType from "../../../constants/UniformType.js";
import UnsignedIntegerUniform from "./UnsignedIntegerUniform.js";
import UnsignedIntegerVector2Uniform from "./UnsignedIntegerVector2Uniform.js";
import UnsignedIntegerVector3Uniform from "./UnsignedIntegerVector3Uniform.js";
import UnsignedIntegerVector4Uniform from "./UnsignedIntegerVector4Uniform.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";

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
			return new FloatUniform(program, activeInfo);
		case UniformType.FLOAT_VEC2:
			return new FloatVector2Uniform(program, activeInfo);
		case UniformType.FLOAT_VEC3:
			return new FloatVector3Uniform(program, activeInfo);
		case UniformType.FLOAT_VEC4:
			return new FloatVector4Uniform(program, activeInfo);
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
			return new SamplerUniform(program, activeInfo);
		case UniformType.BOOL:
		case UniformType.INT:
			return new IntegerUniform(program, activeInfo);
		case UniformType.BOOL_VEC2:
		case UniformType.INT_VEC2:
			return new IntegerVector2Uniform(program, activeInfo);
		case UniformType.BOOL_VEC3:
		case UniformType.INT_VEC3:
			return new IntegerVector3Uniform(program, activeInfo);
		case UniformType.BOOL_VEC4:
		case UniformType.INT_VEC4:
			return new IntegerVector4Uniform(program, activeInfo);
		case UniformType.UNSIGNED_INT:
			return new UnsignedIntegerUniform(program, activeInfo);
		case UniformType.UNSIGNED_INT_VEC2:
			return new UnsignedIntegerVector2Uniform(program, activeInfo);
		case UniformType.UNSIGNED_INT_VEC3:
			return new UnsignedIntegerVector3Uniform(program, activeInfo);
		case UniformType.UNSIGNED_INT_VEC4:
			return new UnsignedIntegerVector4Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT2:
			return new FloatMatrix2x2Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT3:
			return new FloatMatrix3x3Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT4:
			return new FloatMatrix4x4Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT2x3:
			return new FloatMatrix2x3Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT2x4:
			return new FloatMatrix2x4Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT3x2:
			return new FloatMatrix3x2Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT3x4:
			return new FloatMatrix3x4Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT4x2:
			return new FloatMatrix4x2Uniform(program, activeInfo);
		case UniformType.FLOAT_MAT4x3:
			return new FloatMatrix4x3Uniform(program, activeInfo);
		default:
			throw new UnsupportedOperationError();
	}
}
