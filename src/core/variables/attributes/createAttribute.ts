import FloatAttribute from "./FloatAttribute.js";
import IntegerAttribute from "./IntegerAttribute.js";
import MatrixAttribute from "./MatrixAttribute.js";
import type Program from "../../Program.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";
import VariableType from "../../../constants/VariableType.js";

/**
 * Create a wrapper object for an attribute.
 * @param program - The shader program that the attribute belongs to.
 * @param index - The index of the attribute.
 * @returns The attribute.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib | getActiveAttrib}
 * @internal
 */
export default function createAttribute(program: Program, index: number) {
	// TODO: Add `@throws` documentation.

	const activeInfo = program.gl.getActiveAttrib(program.internal, index);
	if (activeInfo === null) {
		throw new UnsupportedOperationError(
			"The environment does not support active information."
		);
	}

	switch (activeInfo.type as VariableType) {
		case VariableType.FLOAT:
		case VariableType.FLOAT_VEC2:
		case VariableType.FLOAT_VEC3:
		case VariableType.FLOAT_VEC4:
			return new FloatAttribute(program, activeInfo);
		case VariableType.INT:
		case VariableType.INT_VEC2:
		case VariableType.INT_VEC3:
		case VariableType.INT_VEC4:
		case VariableType.UNSIGNED_INT:
		case VariableType.UNSIGNED_INT_VEC2:
		case VariableType.UNSIGNED_INT_VEC3:
		case VariableType.UNSIGNED_INT_VEC4:
		case VariableType.BOOL:
		case VariableType.BOOL_VEC2:
		case VariableType.BOOL_VEC3:
		case VariableType.BOOL_VEC4:
			return new IntegerAttribute(program, activeInfo);
		case VariableType.FLOAT_MAT2:
			return new MatrixAttribute(program, activeInfo, 2);
		case VariableType.FLOAT_MAT3:
			return new MatrixAttribute(program, activeInfo, 3);
		case VariableType.FLOAT_MAT4:
			return new MatrixAttribute(program, activeInfo, 4);
		default:
			// Not possible as long as this function is only called internally.
			throw new UnsupportedOperationError(
				`The type \`${activeInfo.type.toString()}\` is not valid for attributes.`
			);
	}
}
