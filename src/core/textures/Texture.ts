import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type TextureTarget from "#TextureTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";
import getParameterForTextureTarget from "#getParameterForTextureTarget";
import type TextureMagFilter from "#TextureMagFilter";
import {
	TEXTURE_BASE_LEVEL,
	TEXTURE_COMPARE_FUNC,
	TEXTURE_COMPARE_MODE,
	TEXTURE_MAG_FILTER,
	TEXTURE_MAX_ANISOTROPY_EXT,
	TEXTURE_MAX_LEVEL,
	TEXTURE_MAX_LOD,
	TEXTURE_MIN_FILTER,
	TEXTURE_MIN_LOD,
	TEXTURE_WRAP_R,
	TEXTURE_WRAP_S,
	TEXTURE_WRAP_T
} from "#constants";
import TextureMinFilter from "#TextureMinFilter";
import type TextureWrapFunction from "#TextureWrapFunction";
import type TestFunction from "#TestFunction";
import type TextureCompareMode from "#TextureCompareMode";
import type MipmapTarget from "#MipmapTarget";
import type Mip from "#Mip";
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";

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
		Array<Map<TextureTarget, WebGLTexture | null>>
	>;

	/**
	 * Gets the currently-bound texture for a binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit, or `undefined` for the current
	 * texture unit.
	 * @param target The binding point.
	 * @returns The texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget
	): WebGLTexture | null {
		// Default to the texture unit that is already active.
		textureUnit ??= (context as DangerousExposedContext).activeTexture;

		// Get the full bindings cache.
		Texture.bindingsCache ??= new Map();

		// Get the context bindings cache.
		if (!Texture.bindingsCache.has((context as DangerousExposedContext).gl)) {
			Texture.bindingsCache.set((context as DangerousExposedContext).gl, []);
		}
		const contextBindingsCache: Array<Map<TextureTarget, WebGLTexture | null>> =
			Texture.bindingsCache.get((context as DangerousExposedContext).gl)!;

		// Get the texture unit bindings cache.
		contextBindingsCache[textureUnit] ??= new Map();
		const textureUnitBindingsCache: Map<TextureTarget, WebGLTexture | null> =
			contextBindingsCache[textureUnit]!;

		// Get the bound texture.
		if (!textureUnitBindingsCache.has(target)) {
			textureUnitBindingsCache.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForTextureTarget(target)
				)
			);
		}
		return textureUnitBindingsCache.get(target)!;
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
		// Default to the texture unit that is already active.
		textureUnit ??= (context as DangerousExposedContext).activeTexture;

		// Do nothing if the binding is already correct.
		if (Texture.getBound(context, textureUnit, target) === texture) {
			return;
		}

		// Bind the texture to the target.
		(context as DangerousExposedContext).activeTexture = textureUnit;
		(context as DangerousExposedContext).gl.bindTexture(target, texture);
		Texture.bindingsCache!.get((context as DangerousExposedContext).gl)![
			textureUnit
		]!.set(target, texture);
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
		// If a specific texture unit is given, unbind the texture from only that texture unit.
		if (typeof textureUnit === "number") {
			if (
				typeof texture != "undefined" &&
				Texture.getBound(context, textureUnit, target) != texture
			) {
				return;
			}
			Texture.bind(context, textureUnit, target, null);
			return;
		}

		// Otherwise, unbind the texture from every texture unit.
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
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	protected constructor(context: Context, target: TextureTarget);

	/**
	 * Creates an immutable-format texture.
	 * @param context The rendering context.
	 * @param target The target binding point of the texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param dims The dimensions of the texture.
	 * @see [`createTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture)
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	protected constructor(
		context: Context,
		target: TextureTarget,
		levels: number,
		format: TextureSizedInternalFormat,
		dims: Array<number>
	);

	protected constructor(
		context: Context,
		target: TextureTarget,
		levels?: number,
		format?: TextureSizedInternalFormat,
		dims?: Array<number>
	) {
		super(context);

		const texture: WebGLTexture | null = this.gl.createTexture();
		if (texture === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = texture;
		this.target = target;
		this.mips = new Map();
		this.isImmutableFormatCache = false;
		if (typeof levels === "number") {
			this.makeImmutableFormat(levels, format!, dims!);
		}
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
	protected readonly target: TextureTarget;

	/**
	 * The mips in this texture.
	 * @internal
	 */
	protected readonly mips: ReadonlyMap<MipmapTarget, Array<Mip>>;

	/** Whether this is an immutable-format texture. */
	private isImmutableFormatCache: boolean;

	/** Whether this is an immutable-format texture. */
	public get isImmutableFormat(): boolean {
		return this.isImmutableFormatCache;
	}

	/**
	 * Makes this into an immutable-format texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param dims The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D).
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 */
	public makeImmutableFormat(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: Array<number>
	): void {
		if (this.isImmutableFormat) {
			return;
		}

		this.makeImmutableFormatInternal(levels, format, dims);
		this.isImmutableFormatCache = true;
	}

	/**
	 * Makes this into an immutable-format texture.
	 * @param levels The number of levels in the texture.
	 * @param format The internal format of the texture.
	 * @param dims The dimensions of the texture.
	 * @see [`texStorage2D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage2D).
	 * @see [`texStorage3D`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texStorage3D)
	 * @internal
	 */
	protected abstract makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: Array<number>
	): void;

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private magFilterCache?: TextureMagFilter;

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get magFilter(): TextureMagFilter {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureMagFilter => {
			return (texture.magFilterCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MAG_FILTER
			));
		});
	}

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set magFilter(value: TextureMagFilter) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_MAG_FILTER, value);
			texture.magFilterCache = value;
		});
	}

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private minFilterCache?: TextureMinFilter;

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get minFilter(): TextureMinFilter {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureMinFilter => {
			return (texture.minFilterCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MIN_FILTER
			));
		});
	}

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minFilter(value: TextureMinFilter) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_MIN_FILTER, value);
			texture.minFilterCache = value;
		});
	}

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapSFunctionCache?: TextureWrapFunction;

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapSFunction(): TextureWrapFunction {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			return (texture.wrapSFunctionCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_WRAP_S
			));
		});
	}

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapSFunction(value: TextureWrapFunction) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_WRAP_S, value);
			texture.wrapSFunctionCache = value;
		});
	}

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapTFunctionCache?: TextureWrapFunction;

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapTFunction(): TextureWrapFunction {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			return (texture.wrapTFunctionCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_WRAP_T
			));
		});
	}

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapTFunction(value: TextureWrapFunction) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_WRAP_T, value);
			texture.wrapTFunctionCache = value;
		});
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxAnisotropyCache?: number;

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxAnisotropy(): number {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		// TODO: Automatically enable the `EXT_texture_filter_anisotropic` extension.
		return this.with(undefined, (texture: this): number => {
			return (texture.maxAnisotropyCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MAX_ANISOTROPY_EXT
			));
		});
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxAnisotropy(value: number) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		// TODO: Automatically enable the `EXT_texture_filter_anisotropic` extension.
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameterf(
				texture.target,
				TEXTURE_MAX_ANISOTROPY_EXT,
				value
			);
			texture.maxAnisotropyCache = value;
		});
	}

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private baseLevelCache?: number;

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get baseLevel(): number {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): number => {
			return (texture.baseLevelCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_BASE_LEVEL
			));
		});
	}

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set baseLevel(value: number) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_BASE_LEVEL, value);
			texture.baseLevelCache = value;
		});
	}

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private comparisonFunctionCache?: TestFunction;

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get comparisonFunction(): TestFunction {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TestFunction => {
			return (texture.comparisonFunctionCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_COMPARE_FUNC
			));
		});
	}

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonFunction(value: TestFunction) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_COMPARE_FUNC, value);
			texture.comparisonFunctionCache = value;
		});
	}

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private comparisonModeCache?: TextureCompareMode;

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get comparisonMode(): TextureCompareMode {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureCompareMode => {
			return (texture.comparisonModeCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_COMPARE_MODE
			));
		});
	}

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonMode(value: TextureCompareMode) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_COMPARE_MODE, value);
			texture.comparisonModeCache = value;
		});
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxLevelCache?: number;

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxLevel(): number {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): number => {
			return (texture.maxLevelCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MAX_LEVEL
			));
		});
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLevel(value: number) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_MAX_LEVEL, value);
			texture.maxLevelCache = value;
		});
	}

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxLodCache?: number;

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxLod(): number {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): number => {
			return (texture.maxLodCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MAX_LOD
			));
		});
	}

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLod(value: number) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameterf(texture.target, TEXTURE_MAX_LOD, value);
			texture.maxLodCache = value;
		});
	}

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private minLodCache?: number;

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get minLod(): number {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): number => {
			return (texture.minLodCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_MIN_LOD
			));
		});
	}

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minLod(value: number) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameterf(texture.target, TEXTURE_MIN_LOD, value);
			texture.minLodCache = value;
		});
	}

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapRFunctionCache?: TextureWrapFunction;

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapRFunction(): TextureWrapFunction {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			return (texture.wrapRFunctionCache ??= texture.gl.getTexParameter(
				texture.target,
				TEXTURE_WRAP_R
			));
		});
	}

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapRFunction(value: TextureWrapFunction) {
		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_WRAP_R, value);
			texture.wrapRFunctionCache = value;
		});
	}

	/**
	 * Whether this texture is texture complete.
	 */
	public get isTextureComplete(): boolean {
		if (this.isImmutableFormat) {
			return true;
		}

		if (
			this.minFilter === TextureMinFilter.LINEAR ||
			this.minFilter == TextureMinFilter.NEAREST
		) {
			return true;
		}

		// TODO: Return `true` if all mips have data.

		return false;
	}

	/**
	 * Generates a mipmap for this texture. Overwrites all mips except those at
	 * the top level. Does nothing for immutable-format textures.
	 * @see [`generateMipmap`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap)
	 * @internal
	 */
	protected generateMipmap(): void {
		// Does nothing for immutable-format textures anyway.
		if (this.isImmutableFormat) {
			return;
		}

		// TODO: Prefer `bind` to `with`. Changing this will require a way to bind to an unused texture unit (or to use an existing binding if one exists).
		this.with(
			undefined,
			(texture) => texture.gl.generateMipmap(texture.target) // TODO: Also overwrite cached mip data.
		);
	}

	/**
	 * Deletes this texture.
	 * @see [`deleteTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteTexture)
	 */
	public delete(): void {
		this.gl.deleteTexture(this.internal);
	}

	/**
	 * Binds this texture to its binding point.
	 * @param textureUnit The texture unit, or `undefined` for the current
	 * texture unit.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	protected bind(textureUnit?: number): void {
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
	 * @param textureUnit The texture unit, or `undefined` for the current
	 * texture unit.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 * @internal
	 */
	protected with<T>(
		textureUnit: number | undefined,
		funktion: (texture: this) => T
	): T {
		// TODO: Use an existing binding if one exists.
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

	// TODO: Add a way to update the data in the texture.

	// TODO: Add a function that calculates the expected size of the given mip.

	// TODO: Maybe save mip data as an array of modifications. Reset when full data is supplied and append when partial data is supplied. When the mip is updated, apply modifications in order. Save an index to prevent reapplying modifications.

	// TODO: Add a method that updates the texture when needed and a method that forces the texture to update. Update the texture when it's created and when it's about to be used (i.e. passed to a uniform). This method should also generate a mipmap automatically if the texture is not texture complete and it wouldn't override given data. This method should automatically use the correct unpack alignment if possible.
}
