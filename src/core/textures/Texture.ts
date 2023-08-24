import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type TextureTarget from "#TextureTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";

/**
 * A randomly-accessible array.
 * @see [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
 */
export default class Texture extends ContextDependent {
	/**
	 * Unbinds the texture that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public static unbind(context: Context, target: TextureTarget): void {
		// TODO: Do nothing if already unbound.
		(context as DangerousExposedContext).gl.bindTexture(target, null);
	}

	/**
	 * Creates a texture.
	 * @param context The rendering context.
	 * @see [`createTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture)
	 */
	public constructor(context: Context) {
		super(context);

		const texture: WebGLTexture | null = this.gl.createTexture();
		if (texture == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = texture;
	}

	/**
	 * The API interface of this texture.
	 * @internal
	 * @see [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
	 */
	protected readonly internal: WebGLTexture;

	/**
	 * Binds this texture to the given binding point.
	 * @param target The binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public bind(target: TextureTarget): void {
		// TODO: Do nothing if already bound.
		this.gl.bindTexture(target, this.internal);
	}
}
