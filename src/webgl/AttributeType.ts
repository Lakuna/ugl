import { WebGLConstant } from "../index.js";

/** Types of data for attributes. */
export enum AttributeType {
	BYTE = WebGLConstant.BYTE,
	SHORT = WebGLConstant.SHORT,
	UNSIGNED_BYTE = WebGLConstant.UNSIGNED_BYTE,
	UNSIGNED_SHORT = WebGLConstant.UNSIGNED_SHORT,
	FLOAT = WebGLConstant.FLOAT,
	HALF_FLOAT = WebGLConstant.HALF_FLOAT,
	UNSIGNED_INT = WebGLConstant.UNSIGNED_INT
}