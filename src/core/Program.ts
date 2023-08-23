import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import type Shader from "#Shader";

/**
 * A WebGL2 shader program.
 * @see [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram)
 */
export default class Program extends ContextDependent {
	/**
	 * Creates a shader program.
	 * @param context The rendering context.
	 * @param vertexShader The vertex shader.
	 * @param fragmentShader The fragment shader.
	 */
	public constructor(
		context: Context,
		vertexShader: Shader,
		fragmentShader: Shader
	) {
		super(context);
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
	}

	/** The vertex shader of this shader program. */
	public readonly vertexShader: Shader;

	/** The fragment shader of this shader program. */
	public readonly fragmentShader: Shader;
}
