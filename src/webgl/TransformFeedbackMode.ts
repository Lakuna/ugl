import { WebGLConstant } from "./WebGLConstant.js";

/** Possible modes for pulling transform feedback data from varyings. */
export enum TransformFeedbackMode {
	INTERLEAVED_ATTRIBS = WebGLConstant.INTERLEAVED_ATTRIBS,
	SEPARATE_ATTRIBS = WebGLConstant.SEPARATE_ATTRIBS
}