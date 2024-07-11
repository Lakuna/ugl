import {
	DRAW_FRAMEBUFFER_BINDING,
	FRAMEBUFFER_BINDING,
	READ_FRAMEBUFFER_BINDING
} from "../../constants/constants.js";
import FramebufferTarget from "../../constants/FramebufferTarget.js";

/**
 * Get the constant value representing the context property of the given buffer binding point.
 * @param target - The buffer binding point.
 * @returns The constant value.
 * @internal
 */
export default function getParameterForFramebufferTarget(
	target: FramebufferTarget
) {
	switch (target) {
		case FramebufferTarget.DRAW_FRAMEBUFFER:
			return DRAW_FRAMEBUFFER_BINDING;
		case FramebufferTarget.FRAMEBUFFER:
			return FRAMEBUFFER_BINDING;
		case FramebufferTarget.READ_FRAMEBUFFER:
			return READ_FRAMEBUFFER_BINDING;
		default:
			throw new RangeError();
	}
}
