import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type TextureTarget from "#TextureTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";
import getParameterForTextureTarget from "#getParameterForTextureTarget";

/**
 * A randomly-accessible array.
 * @see [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
 */
export default class Texture extends ContextDependent {
	/**
	 * The currently-bound texture cache.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	private static bindingsCache?: Map<
		Context,
		Map<TextureTarget, WebGLTexture | null>
	>;

	/**
	 * Gets the currently-bound texture for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @returns The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		target: TextureTarget
	): WebGLTexture | null {
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has(context)) {
			this.bindingsCache.set(context, new Map());
		}
		const contextMap: Map<TextureTarget, WebGLTexture | null> =
			this.bindingsCache.get(context)!;
		if (!contextMap.has(target)) {
			contextMap.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForTextureTarget(target)
				)
			);
		}
		return contextMap.get(target)!;
	}

	/**
	 * Binds a texture to a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param texture The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static override bind(
		context: Context,
		target: TextureTarget,
		texture: WebGLTexture | null
	): void {
		if (Texture.getBound(context, target) == texture) {
			return;
		}
		(context as DangerousExposedContext).gl.bindTexture(target, texture);
		context.throwIfError();
		Texture.bindingsCache!.get(context)!.set(target, texture);
	}

	/**
	 * Unbinds the texture that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static unbind(context: Context, target: TextureTarget): void;

	/**
	 * Unbinds the given texture from the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param texture The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		target: TextureTarget,
		texture: WebGLTexture
	): void;

	protected static unbind(
		context: Context,
		target: TextureTarget,
		texture?: WebGLTexture
	): void {
		if (
			typeof texture != "undefined" &&
			Texture.getBound(context, target) != texture
		) {
			return;
		}
		Texture.bind(context, target, null);
	}

	/**
	 * Creates a texture.
	 * @param context The rendering context.
	 * @param target The target binding point of the texture.
	 * @see [`createTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture)
	 */
	public constructor(context: Context, target: TextureTarget) {
		super(context);

		const texture: WebGLTexture | null = this.gl.createTexture();
		if (texture == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = texture;
		this.targetCache = target;
	}

	/**
	 * The API interface of this texture.
	 * @internal
	 * @see [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
	 */
	protected readonly internal: WebGLTexture;

	/**
	 * The binding point of this texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	private targetCache: TextureTarget;

	/**
	 * The binding point of this texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public get target(): TextureTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public set target(value: TextureTarget) {
		this.unbind();
		this.targetCache = value;
	}

	/**
	 * Binds this texture to its binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public bind(): void {
		Texture.bind(this.context, this.target, this.internal);
	}

	/**
	 * Unbinds this texture from its binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 */
	public unbind(): void {
		Texture.unbind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this texture bound, then re-binds the
	 * previously-bound texture.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(funktion: (texture: this) => T): T {
		const previousBinding: WebGLTexture | null = Texture.getBound(
			this.context,
			this.target
		);
		this.bind();
		const out: T = funktion(this);
		Texture.bind(this.context, this.target, previousBinding);
		return out;
	}
}
