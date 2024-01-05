import type Shader from "#Shader";

/**
 * A modified version of `Shader` with access to certain protected properties,
 * methods, and accessors. This is required because there is no equivalent to
 * the `package` access modifier in TypeScript.
 * @internal
 */
export type DangerousExposedShader = Shader & {
	/**
	 * The API interface.
	 * @see [`WebGLShader`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader)
	 * @internal
	 */
	internal: WebGLShader;
};
