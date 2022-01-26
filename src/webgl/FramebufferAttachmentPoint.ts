import { WebGLConstant } from "./WebGLConstant.js";

/** Attachment points for framebuffers. */
export enum FramebufferAttachmentPoint {
	COLOR_ATTACHMENT0 = WebGLConstant.COLOR_ATTACHMENT0,
	DEPTH_ATTACHMENT = WebGLConstant.DEPTH_ATTACHMENT,
	DEPTH_STENCIL_ATTACHMENT = WebGLConstant.DEPTH_STENCIL_ATTACHMENT,
	STENCIL_ATTACHMENT = WebGLConstant.STENCIL_ATTACHMENT
}