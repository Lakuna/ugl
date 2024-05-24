import type Framebuffer from "#Framebuffer";
import type FramebufferTarget from "#FramebufferTarget";

/**
 * A modified version of `Framebuffer` with access to certain protected properties,
 * methods, and accessors. This is required because there is no equivalent to
 * the `package` access modifier in TypeScript.
 * @internal
 */
export type DangerousExposedFramebuffer = Framebuffer & {
	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	target: FramebufferTarget;

	/**
	 * Binds this framebuffer to its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	bind(): void;
};
