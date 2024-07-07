import AttributeType from "../../../constants/AttributeType.js";
import FloatAttribute from "./FloatAttribute.js";
import IntegerAttribute from "./IntegerAttribute.js";
import MatrixAttribute from "./MatrixAttribute.js";
import type Program from "../../Program.js";
import UnsupportedOperationError from "../../../utility/UnsupportedOperationError.js";

/**
 * Create a wrapper object for an attribute.
 * @param program - The shader program that the attribute belongs to.
 * @param index - The index of the attribute.
 * @returns The attribute.
 * @throws {@link UnsupportedOperationError}
 * @internal
 */
export default function createAttribute(program: Program, index: number) {
	const activeInfo = program.gl.getActiveAttrib(program.internal, index);
	if (!activeInfo) {
		throw new UnsupportedOperationError();
	}

	switch (activeInfo.type as AttributeType) {
		case AttributeType.FLOAT:
		case AttributeType.FLOAT_VEC2:
		case AttributeType.FLOAT_VEC3:
		case AttributeType.FLOAT_VEC4:
			return new FloatAttribute(program, activeInfo);
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
			return new IntegerAttribute(program, activeInfo);
		case AttributeType.FLOAT_MAT2:
			return new MatrixAttribute(program, activeInfo, 2);
		case AttributeType.FLOAT_MAT3:
			return new MatrixAttribute(program, activeInfo, 3);
		case AttributeType.FLOAT_MAT4:
			return new MatrixAttribute(program, activeInfo, 4);
		default:
			throw new UnsupportedOperationError();
	}
}
