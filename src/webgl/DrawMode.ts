import { WebGLConstant } from "./WebGLConstant.js";

/** Primitives that can be drawn with vertices. */
export enum DrawMode {
	POINTS = WebGLConstant.POINTS,
	LINE_STRIP = WebGLConstant.LINE_STRIP,
	LINE_LOOP = WebGLConstant.LINE_LOOP,
	LINES = WebGLConstant.LINES,
	TRIANGLE_STRIP = WebGLConstant.TRIANGLE_STRIP,
	TRIANGLE_FAN = WebGLConstant.TRIANGLE_FAN,
	TRIANGLES = WebGLConstant.TRIANGLES
}