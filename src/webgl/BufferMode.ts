import { WebGLConstant } from "../index.js";

/** Usage modes for buffers. */
export enum BufferMode {
	STATIC_DRAW = WebGLConstant.STATIC_DRAW,
	DYNAMIC_DRAW = WebGLConstant.DYNAMIC_DRAW,
	STREAM_DRAW = WebGLConstant.STREAM_DRAW,
	STATIC_READ = WebGLConstant.STATIC_READ,
	DYNAMIC_READ = WebGLConstant.DYNAMIC_READ,
	STREAM_READ = WebGLConstant.STREAM_READ,
	STATIC_COPY = WebGLConstant.STATIC_COPY,
	DYNAMIC_COPY = WebGLConstant.DYNAMIC_COPY,
	STREAM_COPY = WebGLConstant.STREAM_COPY
}