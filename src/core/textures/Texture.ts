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
import type TextureMinFilter from "#TextureMinFilter";
import type TextureWrapFunction from "#TextureWrapFunction";
import type TestFunction from "#TestFunction";
import type TextureCompareMode from "#TextureCompareMode";

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
		textureUnit ??= (context as DangerousExposedContext).activeTexture;
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has((context as DangerousExposedContext).gl)) {
			this.bindingsCache.set((context as DangerousExposedContext).gl, []);
		}
		const contextArray: Array<Map<TextureTarget, WebGLTexture | null>> =
			this.bindingsCache.get((context as DangerousExposedContext).gl)!;
		if (typeof contextArray[textureUnit] == "undefined") {
			contextArray[textureUnit] = new Map();
		}
		const textureUnitMap: Map<TextureTarget, WebGLTexture | null> =
			contextArray[textureUnit]!;
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
		this.target = target;
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
		return this.with(undefined, (texture: this): TextureMagFilter => {
			if (typeof texture.magFilterCache == "undefined") {
				texture.magFilterCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MAG_FILTER
				);
			}
			return texture.magFilterCache!;
		});
	}

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set magFilter(value: TextureMagFilter) {
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
		return this.with(undefined, (texture: this): TextureMinFilter => {
			if (typeof texture.minFilterCache == "undefined") {
				texture.minFilterCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MIN_FILTER
				);
			}
			return texture.minFilterCache!;
		});
	}

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minFilter(value: TextureMinFilter) {
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
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			if (typeof texture.wrapSFunctionCache == "undefined") {
				texture.wrapSFunctionCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_WRAP_S
				);
			}
			return texture.wrapSFunctionCache!;
		});
	}

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapSFunction(value: TextureWrapFunction) {
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
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			if (typeof texture.wrapTFunctionCache == "undefined") {
				texture.wrapTFunctionCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_WRAP_T
				);
			}
			return texture.wrapTFunctionCache!;
		});
	}

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapTFunction(value: TextureWrapFunction) {
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
		return this.with(undefined, (texture: this): number => {
			if (typeof texture.maxAnisotropyCache == "undefined") {
				texture.maxAnisotropyCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MAX_ANISOTROPY_EXT
				);
			}
			return texture.maxAnisotropyCache!;
		});
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxAnisotropy(value: number) {
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
		return this.with(undefined, (texture: this): number => {
			if (typeof texture.baseLevelCache == "undefined") {
				texture.baseLevelCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_BASE_LEVEL
				);
			}
			return texture.baseLevelCache!;
		});
	}

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set baseLevel(value: number) {
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
		return this.with(undefined, (texture: this): TestFunction => {
			if (typeof texture.comparisonFunctionCache == "undefined") {
				texture.comparisonFunctionCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_COMPARE_FUNC
				);
			}
			return texture.comparisonFunctionCache!;
		});
	}

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonFunction(value: TestFunction) {
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
		return this.with(undefined, (texture: this): TextureCompareMode => {
			if (typeof texture.comparisonModeCache == "undefined") {
				texture.comparisonModeCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_COMPARE_MODE
				);
			}
			return texture.comparisonModeCache!;
		});
	}

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonMode(value: TextureCompareMode) {
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
		return this.with(undefined, (texture: this): number => {
			if (typeof texture.maxLevelCache == "undefined") {
				texture.maxLevelCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MAX_LEVEL
				);
			}
			return texture.maxLevelCache!;
		});
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLevel(value: number) {
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
		return this.with(undefined, (texture: this): number => {
			if (typeof texture.maxLodCache == "undefined") {
				texture.maxLodCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MAX_LOD
				);
			}
			return texture.maxLodCache!;
		});
	}

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLod(value: number) {
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
		return this.with(undefined, (texture: this): number => {
			if (typeof texture.minLodCache == "undefined") {
				texture.minLodCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_MIN_LOD
				);
			}
			return texture.minLodCache!;
		});
	}

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minLod(value: number) {
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
		return this.with(undefined, (texture: this): TextureWrapFunction => {
			if (typeof texture.wrapRFunctionCache == "undefined") {
				texture.wrapRFunctionCache = texture.gl.getTexParameter(
					texture.target,
					TEXTURE_WRAP_R
				);
			}
			return texture.wrapRFunctionCache!;
		});
	}

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapRFunction(value: TextureWrapFunction) {
		this.with(undefined, (texture: this): void => {
			texture.gl.texParameteri(texture.target, TEXTURE_WRAP_R, value);
			texture.wrapRFunctionCache = value;
		});
	}

	/**
	 * Generates a mipmap for this texture.
	 * @see [`generateMipmap`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap)
	 * @internal
	 */
	protected generateMipmap(): void {
		this.with(undefined, (texture) =>
			texture.gl.generateMipmap(texture.target)
		);
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

	/**
	 * Deletes this texture.
	 * @see [`deleteTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteTexture)
	 */
	public delete(): void {
		this.gl.deleteTexture(this.internal);
	}
}
