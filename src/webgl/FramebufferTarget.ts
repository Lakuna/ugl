import { WebGLConstant } from "../index.js";

/** Render targets for framebuffers. */
export enum FramebufferTarget {
	FRAMEBUFFER = WebGLConstant.FRAMEBUFFER,
	DRAW_FRAMEBUFFER = WebGLConstant.DRAW_FRAMEBUFFER,
	READ_FRAMEBUFFER = WebGLConstant.READ_FRAMEBUFFER
}