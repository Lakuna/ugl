import type BufferParent from "#BufferParent";
import type BufferTarget from "#BufferTarget";

/**
 * A modified version of `BufferParent` with access to certain protected properties,
 * methods, and accessors. This is required because there is no equivalent to
 * the `package` access modifier in TypeScript.
 * @internal
 */
export type DangerousExposedBuffer = BufferParent & {
	/**
	 * The binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	target: BufferTarget;

	/**
	 * Binds this buffer to its binding point.
	 * @param target The new binding point to bind to, or `undefined` for the
	 * previous binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	bind(target?: BufferTarget): void;
};
