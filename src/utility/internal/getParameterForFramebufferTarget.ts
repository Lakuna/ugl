import FramebufferTarget from "#FramebufferTarget";
import {
	DRAW_FRAMEBUFFER_BINDING,
	FRAMEBUFFER_BINDING,
	READ_FRAMEBUFFER_BINDING
} from "#constants";

/**
 * Gets the constant value representing the context property of the given
 * buffer binding point.
 * @param target The buffer binding point.
 * @returns The constant value.
 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
 * @internal
 */
export default function getParameterForFramebufferTarget(
	target: FramebufferTarget
): number {
	switch (target) {
		case FramebufferTarget.DRAW_FRAMEBUFFER:
			return DRAW_FRAMEBUFFER_BINDING;
		case FramebufferTarget.FRAMEBUFFER:
			return FRAMEBUFFER_BINDING;
		case FramebufferTarget.READ_FRAMEBUFFER:
			return READ_FRAMEBUFFER_BINDING;
	}
}
