import type Shader from "#Shader";

/**
 * A modified version of `Shader` with access to the protected `internal`
 * property. This is required because there is no equivalent to the `package`
 * access modifier in TypeScript.
 * @internal
 */
export type DangerousExposedShader = Shader & {
	/**
	 * The API interface.
	 * @internal
	 */
	internal: WebGLShader;
};
