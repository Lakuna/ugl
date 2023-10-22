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
export default abstract class Texture extends ContextDependent {
	/**
	 * The currently-bound texture cache.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<number, Map<TextureTarget, WebGLTexture | null>>
	>;

	/**
	 * Gets the currently-bound texture for a binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit.
	 * @param target The binding point.
	 * @returns The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		textureUnit: number,
		target: TextureTarget
	): WebGLTexture | null {
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has((context as DangerousExposedContext).gl)) {
			this.bindingsCache.set(
				(context as DangerousExposedContext).gl,
				new Map()
			);
		}
		const contextMap: Map<
			number,
			Map<TextureTarget, WebGLTexture | null>
		> = this.bindingsCache.get((context as DangerousExposedContext).gl)!;
		if (!contextMap.has(textureUnit)) {
			contextMap.set(textureUnit, new Map());
		}
		const textureUnitMap: Map<TextureTarget, WebGLTexture | null> =
			contextMap.get(textureUnit)!;
		if (!textureUnitMap.has(target)) {
			textureUnitMap.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForTextureTarget(target)
				)
			);
		}
		return textureUnitMap.get(target)!;
	}

	/**
	 * Binds a texture to a binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit, or `undefined` for the current
	 * texture unit.
	 * @param target The binding point.
	 * @param texture The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static override bind(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture: WebGLTexture | null
	): void {
		textureUnit ??= (context as DangerousExposedContext).activeTexture;
		if (Texture.getBound(context, textureUnit, target) == texture) {
			return;
		}
		(context as DangerousExposedContext).activeTexture = textureUnit;
		(context as DangerousExposedContext).gl.bindTexture(target, texture);
		context.throwIfError();
		Texture.bindingsCache!.get((context as DangerousExposedContext).gl)!
			.get(textureUnit)!
			.set(target, texture);
	}

	/**
	 * Unbinds the texture that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit.
	 * @param target The binding point.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		textureUnit: number,
		target: TextureTarget
	): void;

	/**
	 * Unbinds the given texture from the given binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit, or `undefined` for all texture
	 * units.
	 * @param target The binding point.
	 * @param texture The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture: WebGLTexture
	): void;

	protected static unbind(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture?: WebGLTexture
	): void {
		if (typeof textureUnit == "number") {
			if (
				typeof texture != "undefined" &&
				Texture.getBound(context, textureUnit, target) != texture
			) {
				return;
			}
			Texture.bind(context, textureUnit, target, null);
			return;
		}

		for (const textureUnit of Texture.bindingsCache
			?.get((context as DangerousExposedContext).gl)
			?.keys() ?? []) {
			Texture.unbind(context, textureUnit, target, texture as WebGLTexture);
		}
	}

	/**
	 * Creates a texture.
	 * @param context The rendering context.
	 * @param target The target binding point of the texture.
	 * @see [`createTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture)
	 * @internal
	 */
	protected constructor(context: Context, target: TextureTarget) {
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
	 * @see [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
	 * @internal
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
	 * @internal
	 */
	protected get target(): TextureTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected set target(value: TextureTarget) {
		this.unbind();
		this.targetCache = value;
	}

	/**
	 * Binds this texture to its binding point.
	 * @param textureUnit The texture unit.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected bind(textureUnit: number): void {
		Texture.bind(this.context, textureUnit, this.target, this.internal);
	}

	/**
	 * Unbinds this texture from its binding point.
	 * @param textureUnit The texture unit, or `undefined` for all texture
	 * units.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected unbind(textureUnit?: number): void {
		Texture.unbind(this.context, textureUnit, this.target, this.internal);
	}

	/**
	 * Executes the given function with this texture bound, then re-binds the
	 * previously-bound texture.
	 * @param textureUnit The texture unit.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 * @internal
	 */
	protected with<T>(textureUnit: number, funktion: (texture: this) => T): T {
		const previousBinding: WebGLTexture | null = Texture.getBound(
			this.context,
			textureUnit,
			this.target
		);
		this.bind(textureUnit);
		const out: T = funktion(this);
		Texture.bind(this.context, textureUnit, this.target, previousBinding);
		return out;
	}
}
