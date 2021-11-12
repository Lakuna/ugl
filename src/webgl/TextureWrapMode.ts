import { WebGLConstant } from "./WebGLConstant.js";

/** Wrap modes for textures. */
export enum TextureWrapMode {
	REPEAT = WebGLConstant.REPEAT,
	CLAMP_TO_EDGE = WebGLConstant.CLAMP_TO_EDGE,
	MIRRORED_REPEAT = WebGLConstant.MIRRORED_REPEAT
}