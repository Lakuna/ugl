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
import UnsignedIntegerUniform from "./UnsignedIntegerUniform.js";
import UnsignedIntegerVector2Uniform from "./UnsignedIntegerVector2Uniform.js";
import UnsignedIntegerVector3Uniform from "./UnsignedIntegerVector3Uniform.js";
import UnsignedIntegerVector4Uniform from "./UnsignedIntegerVector4Uniform.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";
import VariableType from "../../../constants/VariableType.js";

/**
 * Create a wrapper object for a uniform.
 * @param program - The shader program that the uniform belongs to.
 * @param index - The index of the uniform.
 * @returns The uniform.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform | getActiveUniform}
 * @internal
 */
export default function createUniform(program: Program, index: number) {
	// TODO: Add `@throws` documentation.

	const activeInfo = program.gl.getActiveUniform(program.internal, index);
	if (activeInfo === null) {
		throw new UnsupportedOperationError(
			"The environment does not support active information."
		);
	}

	switch (activeInfo.type as VariableType) {
		case VariableType.FLOAT:
			return new FloatUniform(program, activeInfo);
		case VariableType.FLOAT_VEC2:
			return new FloatVector2Uniform(program, activeInfo);
		case VariableType.FLOAT_VEC3:
			return new FloatVector3Uniform(program, activeInfo);
		case VariableType.FLOAT_VEC4:
			return new FloatVector4Uniform(program, activeInfo);
		case VariableType.SAMPLER_2D:
		case VariableType.SAMPLER_3D:
		case VariableType.SAMPLER_CUBE:
		case VariableType.SAMPLER_2D_SHADOW:
		case VariableType.SAMPLER_2D_ARRAY:
		case VariableType.SAMPLER_2D_ARRAY_SHADOW:
		case VariableType.SAMPLER_CUBE_SHADOW:
		case VariableType.INT_SAMPLER_2D:
		case VariableType.INT_SAMPLER_3D:
		case VariableType.INT_SAMPLER_CUBE:
		case VariableType.INT_SAMPLER_2D_ARRAY:
			return new SamplerUniform(program, activeInfo);
		case VariableType.BOOL:
		case VariableType.INT:
			return new IntegerUniform(program, activeInfo);
		case VariableType.BOOL_VEC2:
		case VariableType.INT_VEC2:
			return new IntegerVector2Uniform(program, activeInfo);
		case VariableType.BOOL_VEC3:
		case VariableType.INT_VEC3:
			return new IntegerVector3Uniform(program, activeInfo);
		case VariableType.BOOL_VEC4:
		case VariableType.INT_VEC4:
			return new IntegerVector4Uniform(program, activeInfo);
		case VariableType.UNSIGNED_INT:
			return new UnsignedIntegerUniform(program, activeInfo);
		case VariableType.UNSIGNED_INT_VEC2:
			return new UnsignedIntegerVector2Uniform(program, activeInfo);
		case VariableType.UNSIGNED_INT_VEC3:
			return new UnsignedIntegerVector3Uniform(program, activeInfo);
		case VariableType.UNSIGNED_INT_VEC4:
			return new UnsignedIntegerVector4Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT2:
			return new FloatMatrix2x2Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT3:
			return new FloatMatrix3x3Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT4:
			return new FloatMatrix4x4Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT2x3:
			return new FloatMatrix2x3Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT2x4:
			return new FloatMatrix2x4Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT3x2:
			return new FloatMatrix3x2Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT3x4:
			return new FloatMatrix3x4Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT4x2:
			return new FloatMatrix4x2Uniform(program, activeInfo);
		case VariableType.FLOAT_MAT4x3:
			return new FloatMatrix4x3Uniform(program, activeInfo);
		default:
			// Not possible as long as this function is only called internally.
			throw new UnsupportedOperationError(
				`The type \`${activeInfo.type.toString()}\` is not valid for uniforms.`
			);
	}
}
