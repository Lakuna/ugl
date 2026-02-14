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
} from "../../constants/constants.js";
import BadValueError from "../../utility/BadValueError.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import type CubeFace from "../../constants/CubeFace.js";
import Extension from "../../constants/Extension.js";
import Framebuffer from "../Framebuffer.js";
import ImmutableError from "../../utility/ImmutableError.js";
import type MipmapTarget from "../../constants/MipmapTarget.js";
import type Prism from "../../types/Prism.js";
import type Rectangle from "../../types/Rectangle.js";
import TestFunction from "../../constants/TestFunction.js";
import TextureCompareMode from "../../constants/TextureCompareMode.js";
import type TextureDataFormat from "../../constants/TextureDataFormat.js";
import TextureDataType from "../../constants/TextureDataType.js";
import TextureFilter from "../../constants/TextureFilter.js";
import TextureFormat from "../../constants/TextureFormat.js";
import TextureFormatError from "../../utility/TextureFormatError.js";
import type TextureTarget from "../../constants/TextureTarget.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import VertexBuffer from "../buffers/VertexBuffer.js";
import WrapMode from "../../constants/WrapMode.js";
import getExtensionForTextureFormat from "../../utility/internal/getExtensionForTextureFormat.js";
import getMipmapTargetForCubeFace from "../../utility/internal/getMipmapTargetForCubeFace.js";
import getParameterForTextureTarget from "../../utility/internal/getParameterForTextureTarget.js";
import getTextureDataFormatForTextureFormat from "../../utility/internal/getTextureDataFormatForTextureFormat.js";
import getTextureDataTypesForTextureFormat from "../../utility/internal/getTextureDataTypesForTextureFormat.js";
import isTextureFormatSized from "../../utility/internal/isTextureDataFormatSized.js";

/**
 * A randomly-accessible array of data.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture | WebGLTexture}
 * @public
 */
export default abstract class Texture extends ContextDependent {
	/**
	 * The currently-bound texture cache.
	 * @internal
	 */
	private static readonly bindingsCache = new Map<
		WebGL2RenderingContext,
		Map<TextureTarget, WebGLTexture | null>[]
	>();

	/**
	 * The order that texture units should be overwritten in if necessary.
	 * @internal
	 */
	private static readonly bindingOverwriteOrder = new Map<
		WebGL2RenderingContext,
		Map<TextureTarget, number[]>
	>();

	/**
	 * The API interface of this texture.
	 * @internal
	 */
	public readonly internal: WebGLTexture;

	/**
	 * The binding point of this texture.
	 * @internal
	 */
	public readonly target: TextureTarget;

	/**
	 * The width, height (if applicable), and depth (if applicable) of this texture, respectively.
	 * @internal
	 */
	protected readonly dims: number[];

	/**
	 * The mipmaps in this texture. Most textures will have only one mipmap, but cubemaps have six (one for each face). Each mipmap is a map of mip levels to boolean values representing whether or not the corresponding mip has been given texture data.
	 * @internal
	 */
	private readonly mipmaps: Map<MipmapTarget, Map<number, boolean>>;

	/**
	 * The format of this texture.
	 * @internal
	 */
	private formatCache?: TextureFormat;

	/**
	 * Whether or not this is an immutable-format texture.
	 * @internal
	 */
	private isImmutableFormatCache: boolean;

	/**
	 * The magnification filter of this texture.
	 * @internal
	 */
	private magFilterCache?: TextureFilter.LINEAR | TextureFilter.NEAREST;

	/**
	 * The minification filter of this texture.
	 * @internal
	 */
	private minFilterCache?: TextureFilter;

	/**
	 * The wrapping function on the S-axis of this texture.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private wrapSFunctionCache?: WrapMode;

	/**
	 * The wrapping function on the T-axis of this texture.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private wrapTFunctionCache?: WrapMode;

	/**
	 * The desired maximum anisotropy of this texture.
	 * @internal
	 */
	private maxAnisotropyCache?: number;

	/**
	 * The base mipmap level of this texture.
	 * @internal
	 */
	private baseLevelCache?: number;

	/**
	 * The comparison function of this texture.
	 * @internal
	 */
	private comparisonFunctionCache?: TestFunction;

	/**
	 * The comparison mode of this texture.
	 * @internal
	 */
	private comparisonModeCache?: TextureCompareMode;

	/**
	 * The maximum mipmap level of this texture.
	 * @internal
	 */
	private maxLevelCache?: number;

	/**
	 * The maximum level of detail of this texture.
	 * @internal
	 */
	private maxLodCache?: number;

	/**
	 * The minimum level of detail of this texture.
	 * @internal
	 */
	private minLodCache?: number;

	/**
	 * The wrapping function on the R-axis of this texture.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private wrapRFunctionCache?: WrapMode;

	/**
	 * Whether or not this texture is texture complete.
	 * @internal
	 */
	private isTextureCompleteCache?: boolean;

	/**
	 * Create a texture.
	 * @param context - The rendering context.
	 * @param target - The target binding point of the texture.
	 * @throws {@link UnsupportedOperationError} if a texture cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture | createTexture}
	 * @internal
	 */
	protected constructor(context: Context, target: TextureTarget);

	/**
	 * Create an immutable-format texture.
	 * @param context - The rendering context.
	 * @param target - The target binding point of the texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @throws {@link TextureFormatError} if the given format is unsized.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture | createTexture}
	 * @internal
	 */
	protected constructor(
		context: Context,
		target: TextureTarget,
		levels: number,
		format: TextureFormat,
		dims: number[]
	);

	protected constructor(
		context: Context,
		target: TextureTarget,
		levels?: number,
		format?: TextureFormat,
		dims?: number[]
	) {
		super(context);

		this.internal = this.gl.createTexture();
		this.target = target;
		this.mipmaps = new Map();
		this.dims = [];
		this.isImmutableFormatCache = false;
		if (typeof levels === "number" && format && dims) {
			this.makeImmutableFormat(levels, format, dims);
		}
	}

	/** The width of this texture. */
	public get width(): number {
		return this.dims[0] ?? 0;
	}

	/** The height of this texture. */
	public get height(): number {
		return this.dims[1] ?? 0;
	}

	/** The depth of this texture. */
	public get depth(): number {
		return this.dims[2] ?? 0;
	}

	/** Whether or not this is an immutable-format texture. */
	public get isImmutableFormat(): boolean {
		return this.isImmutableFormatCache;
	}

	/** Whether or not this texture is texture complete. */
	public get isTextureComplete(): boolean {
		if (typeof this.isTextureCompleteCache === "boolean") {
			return this.isTextureCompleteCache;
		}

		if (this.isImmutableFormat) {
			this.isTextureCompleteCache = true;
			return true;
		}

		if (
			this.minFilter === TextureFilter.LINEAR ||
			this.minFilter === TextureFilter.NEAREST
		) {
			this.isTextureCompleteCache = true;
			return true;
		}

		// Return `false` if any mip doesn't have data.
		let i = 0;
		let mipDims = this.getSizeOfMip(i);
		while (
			(mipDims[0] ?? 0) > 0 ||
			(mipDims[1] ?? 0) > 0 ||
			(mipDims[2] ?? 0) > 0
		) {
			for (const mipmap of this.mipmaps.values()) {
				if (!mipmap.get(i)) {
					this.isTextureCompleteCache = false;
					return false;
				}
			}

			mipDims = this.getSizeOfMip(++i);
		}

		// Return `true` if all mips have data.
		this.isTextureCompleteCache = true;
		return true;
	}

	/**
	 * The format of this texture.
	 * @throws {@link ImmutableError} if the format of an immutable-format texture is changed.
	 */
	public get format(): TextureFormat {
		// We don't have to worry about defaulting to an unsized internal format since the format is always set for immutable-format textures.
		this.formatCache ??= TextureFormat.RGBA;

		return this.formatCache;
	}

	public set format(value: TextureFormat) {
		if (value === this.format) {
			return;
		}

		// Immutable-format textures cannot have their format changed (duh).
		if (this.isImmutableFormat) {
			throw new ImmutableError(
				"Cannot set the format of an immutable-format texture."
			);
		}

		// Enable the extension that is required for the given format, if any.
		const extension = getExtensionForTextureFormat(value);
		if (extension) {
			this.context.enableExtension(extension);
		}

		this.formatCache = value;
	}

	/** The magnification filter of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get magFilter(): TextureFilter.LINEAR | TextureFilter.NEAREST {
		if (!this.magFilterCache) {
			if (this.context.doPrefillCache) {
				this.magFilterCache = TextureFilter.LINEAR;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.magFilterCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MAG_FILTER
				) as TextureFilter.LINEAR | TextureFilter.NEAREST;
			}
		}

		return this.magFilterCache;
	}

	public set magFilter(value: TextureFilter.LINEAR | TextureFilter.NEAREST) {
		if (this.magFilter === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
		this.magFilterCache = value;
	}

	/** The minification filter of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get minFilter(): TextureFilter {
		if (!this.minFilterCache) {
			if (this.context.doPrefillCache) {
				this.minFilterCache = TextureFilter.NEAREST_MIPMAP_LINEAR;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.minFilterCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MIN_FILTER
				) as TextureFilter;
			}
		}

		return this.minFilterCache;
	}

	public set minFilter(value: TextureFilter) {
		if (this.minFilter === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
		this.minFilterCache = value;
	}

	/** The wrapping function on the S-axis of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
	public get wrapSFunction(): WrapMode {
		if (!this.wrapSFunctionCache) {
			if (this.context.doPrefillCache) {
				this.wrapSFunctionCache = WrapMode.REPEAT;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.wrapSFunctionCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_WRAP_S
				) as WrapMode;
			}
		}

		return this.wrapSFunctionCache;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public set wrapSFunction(value: WrapMode) {
		if (this.wrapSFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
		this.wrapSFunctionCache = value;
	}

	/** The wrapping function on the T-axis of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
	public get wrapTFunction(): WrapMode {
		if (!this.wrapTFunctionCache) {
			if (this.context.doPrefillCache) {
				this.wrapTFunctionCache = WrapMode.REPEAT;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.wrapTFunctionCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_WRAP_T
				) as WrapMode;
			}
		}

		return this.wrapTFunctionCache;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public set wrapTFunction(value: WrapMode) {
		if (this.wrapTFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
		this.wrapTFunctionCache = value;
	}

	/**
	 * The desired maximum anisotropy of this texture.
	 * @throws {@link UnsupportedOperationError} if the anisotropic filtering extension is not available.
	 * @throws {@link BadValueError} if set to a higher value than the current system supports.
	 */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get maxAnisotropy(): number {
		if (!this.context.enableExtension(Extension.TEXTURE_FILTER_ANISOTROPIC)) {
			throw new UnsupportedOperationError(
				"The environment does not support anisotropic filtering."
			);
		}

		if (!this.maxAnisotropyCache) {
			if (this.context.doPrefillCache) {
				this.maxAnisotropyCache = 1;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.maxAnisotropyCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MAX_ANISOTROPY_EXT
				) as number;
			}
		}

		return this.maxAnisotropyCache;
	}

	public set maxAnisotropy(value: number) {
		if (this.maxAnisotropy === value) {
			return;
		}

		// Also checks that the current environment supports anisotropic filtering.
		if (value > this.context.maxTextureMaxAnisotropy) {
			throw new BadValueError(
				`The texture max anisotropy may not exceed ${this.context.maxTextureMaxAnisotropy.toString()}.`
			);
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_ANISOTROPY_EXT, value);
		this.maxAnisotropyCache = value;
	}

	/** The base mipmap level of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get baseLevel(): number {
		if (!this.baseLevelCache) {
			if (this.context.doPrefillCache) {
				this.baseLevelCache = 0;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.baseLevelCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_BASE_LEVEL
				) as number;
			}
		}

		return this.baseLevelCache;
	}

	public set baseLevel(value: number) {
		if (this.baseLevel === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_BASE_LEVEL, value);
		this.baseLevelCache = value;
	}

	/** The comparison function of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get comparisonFunction(): TestFunction {
		if (!this.comparisonFunctionCache) {
			if (this.context.doPrefillCache) {
				this.comparisonFunctionCache = TestFunction.LEQUAL;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.comparisonFunctionCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_COMPARE_FUNC
				) as TestFunction;
			}
		}

		return this.comparisonFunctionCache;
	}

	public set comparisonFunction(value: TestFunction) {
		if (this.comparisonFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_FUNC, value);
		this.comparisonFunctionCache = value;
	}

	/** The comparison mode of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get comparisonMode(): TextureCompareMode {
		if (!this.comparisonModeCache) {
			if (this.context.doPrefillCache) {
				this.comparisonModeCache = TextureCompareMode.NONE;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.comparisonModeCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_COMPARE_MODE
				) as TextureCompareMode;
			}
		}

		return this.comparisonModeCache;
	}

	public set comparisonMode(value: TextureCompareMode) {
		if (this.comparisonMode === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_MODE, value);
		this.comparisonModeCache = value;
	}

	/** The maximum mipmap level of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get maxLevel(): number {
		if (!this.maxLevelCache) {
			if (this.context.doPrefillCache) {
				this.maxLevelCache = 1000;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.maxLevelCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MAX_LEVEL
				) as number;
			}
		}

		return this.maxLevelCache;
	}

	public set maxLevel(value: number) {
		if (this.maxLevel === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAX_LEVEL, value);
		this.maxLevelCache = value;
	}

	/** The maximum level of detail of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get maxLod(): number {
		if (!this.maxLodCache) {
			if (this.context.doPrefillCache) {
				this.maxLodCache = 1000;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.maxLodCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MAX_LOD
				) as number;
			}
		}

		return this.maxLodCache;
	}

	public set maxLod(value: number) {
		if (this.maxLod === value) {
			return;
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_LOD, value);
		this.maxLodCache = value;
	}

	/** The minimum level of detail of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get minLod(): number {
		if (!this.minLodCache) {
			if (this.context.doPrefillCache) {
				this.minLodCache = -1000;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.minLodCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_MIN_LOD
				) as number;
			}
		}

		return this.minLodCache;
	}

	public set minLod(value: number) {
		if (this.minLod === value) {
			return;
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MIN_LOD, value);
		this.minLodCache = value;
	}

	/** The wrapping function on the R-axis of this texture. */
	// eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/naming-convention
	public get wrapRFunction(): WrapMode {
		if (!this.wrapRFunctionCache) {
			if (this.context.doPrefillCache) {
				this.wrapRFunctionCache = WrapMode.REPEAT;
			} else {
				this.bind();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				this.wrapRFunctionCache = this.gl.getTexParameter(
					this.target,
					TEXTURE_WRAP_R
				) as WrapMode;
			}
		}

		return this.wrapRFunctionCache;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public set wrapRFunction(value: WrapMode) {
		if (this.wrapRFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_R, value);
		this.wrapRFunctionCache = value;
	}

	/**
	 * Get the currently-bound texture for a binding point.
	 * @param context - The rendering context.
	 * @param requestedTextureUnit - The texture unit, or `undefined` for the least-recently used texture unit.
	 * @param target - The binding point.
	 * @returns The texture.
	 * @throws {@link BadValueError} if the texture unit is set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public static getBound(
		context: Context,
		requestedTextureUnit: number | undefined,
		target: TextureTarget
	): WebGLTexture | null {
		// Default to the most desirable texture unit.
		const textureUnit =
			requestedTextureUnit ?? Texture.getBestTextureUnit(context, target);

		// Get the texture unit bindings cache.
		const textureUnitBindingsCache = Texture.getTextureUnitBindingsCache(
			context.gl,
			textureUnit
		);

		// Get the bound texture.
		let boundTexture = textureUnitBindingsCache.get(target);
		if (typeof boundTexture === "undefined") {
			if (context.doPrefillCache) {
				boundTexture = null;
			} else {
				context.activeTexture = textureUnit;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				boundTexture = context.gl.getParameter(
					getParameterForTextureTarget(target)
				) as WebGLTexture | null;
			}

			textureUnitBindingsCache.set(target, boundTexture);
		}

		return boundTexture;
	}

	/**
	 * Bind a texture to a binding point.
	 * @param context - The rendering context.
	 * @param requestedTextureUnit - The texture unit, or `undefined` for the least-recently used texture unit.
	 * @param target - The binding point.
	 * @param texture - The texture.
	 * @param queryOnly - Indicates that the this method is being called to query for a texture unit and that the active texture unit does not need to be updated if the texture already has a texture unit. This is usually used for setting the value of a sampler uniform.
	 * @returns The used texture unit.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture | bindTexture}
	 * @throws {@link BadValueError} if the texture unit is set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public static bindGl(
		context: Context,
		requestedTextureUnit: number | undefined,
		target: TextureTarget,
		texture: WebGLTexture | null,
		queryOnly = false
	): number {
		// Default to the most desirable texture unit.
		const textureUnit =
			requestedTextureUnit ??
			Texture.getBestTextureUnit(context, target, texture);

		// Update the texture overwrite order.
		const targetBindingOverwriteOrder = Texture.getTargetBindingOverwriteOrder(
			context.gl,
			target
		);
		if (targetBindingOverwriteOrder.includes(textureUnit)) {
			targetBindingOverwriteOrder.splice(
				targetBindingOverwriteOrder.indexOf(textureUnit),
				1
			);
		}

		targetBindingOverwriteOrder.push(textureUnit);

		// Do nothing if the binding is already correct.
		if (Texture.getBound(context, textureUnit, target) === texture) {
			if (!queryOnly) {
				context.activeTexture = textureUnit;
			}

			return textureUnit;
		}

		// Bind the texture to the target.
		context.activeTexture = textureUnit;
		context.gl.bindTexture(target, texture);
		Texture.getTextureUnitBindingsCache(context.gl, textureUnit).set(
			target,
			texture
		);

		return textureUnit;
	}

	/**
	 * Unbinds the given texture from the given binding point.
	 * @param context - The rendering context.
	 * @param textureUnit - The texture unit, or `undefined` for all texture units.
	 * @param target - The binding point.
	 * @param texture - The texture, or `undefined` for any texture.
	 * @throws {@link BadValueError} if the texture unit is set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture?: WebGLTexture
	): void {
		// If a specific texture unit is given, unbind the texture from only that texture unit.
		if (typeof textureUnit === "number") {
			// If a specific texture is given, only unbind that texture.
			if (
				texture &&
				Texture.getBound(context, textureUnit, target) !== texture
			) {
				return;
			}

			// Unbind the texture.
			Texture.bindGl(context, textureUnit, target, null);
			return;
		}

		// Otherwise, unbind the texture from every texture unit.
		for (const otherTextureUnit of Texture.getContextBindingsCache(
			context.gl
		).keys()) {
			Texture.unbindGl(context, otherTextureUnit, target, texture);
		}
	}

	/**
	 * Get the texture bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		gl: WebGL2RenderingContext
	): Map<TextureTarget, WebGLTexture | null>[] {
		// Get the context bindings cache.
		let contextBindingsCache = Texture.bindingsCache.get(gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = [];
			Texture.bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the texture bindings cache for a texture unit.
	 * @param gl - The rendering context.
	 * @param textureUnit - The texture unit.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getTextureUnitBindingsCache(
		gl: WebGL2RenderingContext,
		textureUnit: number
	): Map<TextureTarget, WebGLTexture | null> {
		// Get the context bindings cache.
		const contextBindingsCache = Texture.getContextBindingsCache(gl);

		// Get the texture unit bindings cache.
		let textureUnitBindingsCache = contextBindingsCache[textureUnit];
		if (!textureUnitBindingsCache) {
			textureUnitBindingsCache = new Map();
			contextBindingsCache[textureUnit] = textureUnitBindingsCache;
		}

		return textureUnitBindingsCache;
	}

	/**
	 * Get the texture binding overwrite order for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getContextBindingOverwriteOrder(
		gl: WebGL2RenderingContext
	): Map<TextureTarget, number[]> {
		// Get the context binding overwrite order.
		let contextBindingOverwriteOrder = Texture.bindingOverwriteOrder.get(gl);
		if (!contextBindingOverwriteOrder) {
			contextBindingOverwriteOrder = new Map();
			Texture.bindingOverwriteOrder.set(gl, contextBindingOverwriteOrder);
		}

		return contextBindingOverwriteOrder;
	}

	/**
	 * Get the texture binding overwrite order for a binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getTargetBindingOverwriteOrder(
		gl: WebGL2RenderingContext,
		target: TextureTarget
	): number[] {
		// Get the context binding overwrite order.
		const contextBindingOverwriteOrder =
			Texture.getContextBindingOverwriteOrder(gl);

		// Get the binding point binding overwrite order.
		let targetBindingOverwriteOrder = contextBindingOverwriteOrder.get(target);
		if (typeof targetBindingOverwriteOrder === "undefined") {
			targetBindingOverwriteOrder = [];
			contextBindingOverwriteOrder.set(target, targetBindingOverwriteOrder);
		}

		return targetBindingOverwriteOrder;
	}

	/**
	 * Determine the most desirable (least-recently used) texture unit to bind to.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param texture - The texture to be bound.
	 * @returns The most desirable texture unit to bind to.
	 * @internal
	 */
	private static getBestTextureUnit(
		context: Context,
		target: TextureTarget,
		texture?: WebGLTexture | null
	): number {
		// Check if the texture is already bound.
		if (texture) {
			for (let i = 0; i < context.maxCombinedTextureImageUnits; i++) {
				if (Texture.getBound(context, i, target) === texture) {
					return i;
				}
			}
		}

		// Get the texture target binding overwrite order.
		const targetBindingOverwriteOrder = Texture.getTargetBindingOverwriteOrder(
			context.gl,
			target
		);

		// Check for any unused texture units.
		for (let i = 0; i < context.maxCombinedTextureImageUnits; i++) {
			if (!targetBindingOverwriteOrder.includes(i)) {
				return i;
			}
		}

		// Return the least recently used texture unit. Apparent typescript-eslint bug since version 8.29.0.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return (targetBindingOverwriteOrder[0] ??= 0);
	}

	/**
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture, or `undefined` for one level.
	 * @param format - The internal format of the texture, or `undefined` to keep the current format (defaults to `RGBA`).
	 * @param dims - The dimensions of the texture, or `undefined` to keep the current dimensions.
	 * @throws {@link TextureFormatError} if the given format is unsized.
	 * @throws {@link BadValueError} if the given dimensions are too small for the given number of levels.
	 */
	public makeImmutableFormat(
		levels?: number,
		format?: TextureFormat,
		dims?: readonly number[]
	): void {
		if (this.isImmutableFormat) {
			return;
		}

		const actualLevels = levels ?? 1;
		const actualFormat = format ?? this.format;
		const actualDims = dims ?? this.dims;

		// Immutable-format textures must use a sized format.
		if (!isTextureFormatSized(actualFormat)) {
			throw new TextureFormatError(
				"Cannot use an unsized format for immutable-format textures."
			);
		}

		// The requested number of levels must not be higher than the automatic number of levels.
		const requiredDim = 2 ** (actualLevels - 1);
		let largeEnough = false;
		for (const dim of actualDims) {
			if (dim >= requiredDim) {
				largeEnough = true;
				break;
			}
		}

		if (!largeEnough) {
			throw new BadValueError(
				"Too many levels were requested for the given texture size."
			);
		}

		this.bind();
		this.makeImmutableFormatInternal(actualLevels, actualFormat, actualDims);
		this.format = actualFormat;
		for (let i = 0; i < actualDims.length; i++) {
			this.dims[i] = actualDims[i] ?? 0;
		}

		this.isImmutableFormatCache = true;
		this.maxLevel = actualLevels - 1;
	}

	/**
	 * Copy the data in a framebuffer into one of this texture's mips.
	 * @param framebuffer - The framebuffer to copy into the mip, or `null` for the default framebuffer.
	 * @param level - The level of the mip within its mipmap. Defaults to the top mip.
	 * @param face - The mipmap that the mip belongs to. Ignored by non-cubemap textures.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param type - The type of the given data. Must be compatible with the format of the given data.
	 * @param unpackAlignment - The alignment to use when unpacking the data, or `undefined` to let this be automatically determined.
	 * @param area - The area of the framebuffer to copy into the mip.
	 * @throws {@link TextureFormatError} if the given data type is incompatible with this texture's format.
	 */
	public setMip(
		framebuffer: Framebuffer | null,
		level?: number,
		face?: CubeFace,
		bounds?: Prism | Rectangle,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		area?: Prism | Rectangle
	): void;

	/**
	 * Copy the data in a buffer into one of this texture's mips.
	 * @param buffer - The buffer to copy into the mip.
	 * @param level - The level of the mip within its mipmap. Defaults to the top mip.
	 * @param face - The mipmap that the mip belongs to. Ignored by non-cubemap textures.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param type - The type of the given data. Must be compatible with the format of the given data.
	 * @param unpackAlignment - The alignment to use when unpacking the data, or `undefined` to let this be automatically determined.
	 * @param size - The number of bytes of data to copy from the buffer.
	 * @param offset - The offset in bytes from the start of the buffer to start copying at.
	 * @throws {@link TextureFormatError} if the given data type is incompatible with this texture's format.
	 */
	public setMip(
		buffer: VertexBuffer,
		level: number | undefined,
		face: CubeFace | undefined,
		bounds: Prism | Rectangle | undefined,
		type: TextureDataType | undefined,
		unpackAlignment: 1 | 2 | 4 | 8 | undefined,
		size: number,
		offset: number
	): void;

	/**
	 * Copy data into one of this texture's mips.
	 * @param data - The data to copy into the mip.
	 * @param level - The level of the mip within its mipmap. Defaults to the top mip.
	 * @param face - The mipmap that the mip belongs to. Ignored by non-cubemap textures.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param type - The type of the given data. Must be compatible with the format of the given data.
	 * @param unpackAlignment - The alignment to use when unpacking the data, or `undefined` to let this be automatically determined.
	 * @throws {@link TextureFormatError} if the given data type is incompatible with this texture's format.
	 */
	public setMip(
		data?: TexImageSource,
		level?: number,
		face?: CubeFace,
		bounds?: Prism | Rectangle,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8
	): void;

	/**
	 * Copy the data in an array into one of this texture's mips.
	 * @param array - The array to copy into the mip.
	 * @param level - The level of the mip within its mipmap. Defaults to the top mip.
	 * @param face - The mipmap that the mip belongs to. Ignored by non-cubemap textures.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param type - The type of the given data. Must be compatible with the format of the given data.
	 * @param unpackAlignment - The alignment to use when unpacking the data, or `undefined` to let this be automatically determined.
	 * @param offset - The offset from the start of the array to start copying at, or `undefined` for the start of the array.
	 * @param length - The number of elements to copy from the array, or `undefined` for the entire array.
	 * @throws {@link TextureFormatError} if the given data type is incompatible with this texture's format.
	 */
	public setMip(
		array: ArrayBufferView,
		level?: number,
		face?: CubeFace,
		bounds?: Prism | Rectangle,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		offset?: number,
		length?: number
	): void;

	public setMip(
		data?: Framebuffer | null | VertexBuffer | TexImageSource | ArrayBufferView,
		requestedLevel?: number,
		face?: CubeFace,
		requestedBounds?: Prism | Rectangle,
		requestedType?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		shape1?: Prism | Rectangle | number, // Meaning depends on data type; see overloads.
		shape2?: number | boolean // Meaning depends on data type; see overloads.
	): void {
		const level = requestedLevel ?? 0;

		// Ensure that the data type and internal format are compatible.
		const expectedDataTypes = getTextureDataTypesForTextureFormat(this.format);
		const type =
			requestedType ?? expectedDataTypes[0] ?? TextureDataType.UNSIGNED_BYTE;
		if (expectedDataTypes.length && !expectedDataTypes.includes(type)) {
			throw new TextureFormatError(
				`Data type \`${type.toString()}\` is not compatible with format \`${this.format.toString()}\`.`
			);
		}

		// Ensure that the specified bounds (if any) are no bigger than the mip.
		const mipDims = this.getSizeOfMip(level);
		let bounds = requestedBounds;
		if (!bounds) {
			// Default to the entire mip for immutable-format textures. For mutable-format textures, `texImage[23]D` can be used (no bounds needed).
			if (this.isImmutableFormat || level > 0) {
				bounds = [0, 0, mipDims[0] ?? 0, mipDims[1] ?? 0, 0, mipDims[2] ?? 0];
			}
		} else if (this.isImmutableFormat || level > 0) {
			// Throw an error if the specified bounding box (if any) is larger than the specified mip. For mutable-format textures, resizing the largest mip is okay.
			if (
				bounds[0] + bounds[2] > (mipDims[0] ?? 0) ||
				bounds[1] + bounds[3] > (mipDims[1] ?? 0) ||
				(4 in bounds && bounds[4] + bounds[5] > (mipDims[2] ?? 0))
			) {
				throw new RangeError(
					"The specified bounding box is larger than the specified mip."
				);
			}
		}

		// Update the unpack alignment.
		if (unpackAlignment) {
			this.context.unpackAlignment = unpackAlignment;
		} else if (!bounds) {
			this.context.unpackAlignment = 1; // Most likely value to be able to unpack data with an unknown size.
		} else if (bounds[3] > 1 || (4 in bounds && bounds[5] > 1)) {
			// Unpack alignment doesn't matter if there is only one row of data.
			for (const alignment of [8, 4, 2, 1] as const) {
				if (bounds[2] % alignment === 0) {
					this.context.unpackAlignment = alignment;
					break;
				}
			}
		}

		// Determine the compatible data format.
		const format = getTextureDataFormatForTextureFormat(this.format);

		// Determine the proper mipmap target.
		const target = getMipmapTargetForCubeFace(face, this.target);

		// Bind this texture.
		this.bind();

		// Update the mip data.
		if (data === null || data instanceof Framebuffer) {
			if (typeof shape1 === "number") {
				// Not possible if TypeScript is obeyed.
				throw new TypeError(
					"Must specify an area to set a mip from a framebuffer."
				);
			}

			this.setMipFromFramebuffer(target, level, bounds, data, shape1);
		} else if (data instanceof VertexBuffer) {
			if (typeof shape1 !== "number" || typeof shape2 !== "number") {
				// Not possible if TypeScript is obeyed.
				throw new TypeError(
					"Must specify a size and an offset to set a mip from a buffer."
				);
			}

			// Automatically set bounds to entire mip if they don't exist.
			bounds ??= [0, 0, mipDims[0] ?? 0, mipDims[1] ?? 0, 0, mipDims[2] ?? 0];

			this.setMipFromBuffer(
				target,
				level,
				bounds,
				format,
				type,
				data,
				shape1,
				shape2
			);
		} else if (data && "buffer" in data) {
			if (
				(shape1 && typeof shape1 !== "number") ||
				typeof shape2 === "boolean"
			) {
				// Not possible if TypeScript is obeyed.
				throw new TypeError(
					"Array size and offset must be numbers if defined."
				);
			}

			// Automatically set bounds to entire mip if they don't exist.
			bounds ??= [0, 0, mipDims[0] ?? 0, mipDims[1] ?? 0, 0, mipDims[2] ?? 0];

			this.setMipFromArray(
				target,
				level,
				bounds,
				format,
				type,
				data,
				shape1,
				shape2
			);
		} else {
			this.setMipFromData(target, level, bounds, format, type, data);
		}

		// Mark the mip as having data.
		let mipmap = this.mipmaps.get(target);
		if (!mipmap) {
			mipmap = new Map();
			this.mipmaps.set(target, mipmap);
		}

		mipmap.set(level, true);

		// Unmark this texture as being texture complete.
		delete this.isTextureCompleteCache;
	}

	/**
	 * Get the dimensions of the mip at the given level.
	 * @param level - The level of the mip.
	 * @returns The width, height (if applicable), and depth (if applicable) of the mip, in that order.
	 */
	public getSizeOfMip(level: number): readonly number[] {
		const dims = [...this.dims];
		for (let i = 0; i < level; i++) {
			for (let dim = 0; dim < dims.length; dim++) {
				dims[dim] = Math.floor((dims[dim] ?? 0) / 2);
			}
		}

		return dims;
	}

	/**
	 * Generate a mipmap for this texture. Overwrites all mips except those at the top level. Does nothing for immutable-format textures.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap | generateMipmap}
	 */
	public generateMipmap(): void {
		// Does nothing for immutable-format textures anyway.
		if (this.isImmutableFormat) {
			return;
		}

		this.bind();
		this.gl.generateMipmap(this.target);

		// Overwrite cached mip data.
		let level = -1;
		while (Math.min(...this.getSizeOfMip(++level)) > 0) {
			for (const mipmap of this.mipmaps.values()) {
				mipmap.set(level, true);
			}
		}

		this.isTextureCompleteCache = true;
	}

	/**
	 * Delete this texture.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteTexture | deleteTexture}
	 */
	public delete(): void {
		this.gl.deleteTexture(this.internal);
	}

	/**
	 * Bind this texture to its binding point.
	 * @param textureUnit - The texture unit, or `undefined` for the least-recently used texture unit.
	 * @param queryOnly - Indicates that the this method is being called to query for a texture unit and that the active texture unit does not need to be updated is the texture already has a texture unit. This is usually used for setting the value of a sampler uniform.
	 * @returns The used texture unit.
	 * @throws {@link BadValueError} if the texture unit is set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public bind(textureUnit?: number, queryOnly = false): number {
		return Texture.bindGl(
			this.context,
			textureUnit,
			this.target,
			this.internal,
			queryOnly
		);
	}

	/**
	 * Unbind this texture from its binding point.
	 * @param textureUnit - The texture unit, or `undefined` for all texture units.
	 * @throws {@link BadValueError} if the texture unit is set to a value outside of the range `[0, MAX_COMBINED_TEXTURE_IMAGE_UNITS)`.
	 * @internal
	 */
	public unbind(textureUnit?: number): void {
		Texture.unbindGl(this.context, textureUnit, this.target, this.internal);
	}

	/**
	 * Set the width of this texture.
	 * @param value - The new width of the texture.
	 * @throws {@link ImmutableError} if this texture is immutable-format.
	 * @internal
	 */
	protected setWidth(value: number): void {
		if (this.isImmutableFormat) {
			throw new ImmutableError(
				"Cannot update the width of an immutable-format texture."
			);
		}

		this.dims[0] = value;
	}

	/**
	 * Set the height of this texture.
	 * @param value - The new height of the texture.
	 * @throws {@link ImmutableError} if this texture is immutable-format.
	 * @internal
	 */
	protected setHeight(value: number): void {
		if (this.isImmutableFormat) {
			throw new ImmutableError(
				"Cannot update the height of an immutable-format texture."
			);
		}

		this.dims[1] = value;
	}

	/**
	 * Set the depth of this texture.
	 * @param value - The new width of the texture.
	 * @throws {@link ImmutableError} if this texture is immutable-format.
	 * @internal
	 */
	protected setDepth(value: number): void {
		if (this.isImmutableFormat) {
			throw new ImmutableError(
				"Cannot update the depth of an immutable-format texture."
			);
		}

		this.dims[2] = value;
	}

	/**
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @internal
	 */
	protected abstract makeImmutableFormatInternal(
		levels: number,
		format: TextureFormat,
		dims: readonly number[]
	): void;

	/**
	 * Copy the data in a framebuffer into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param framebuffer - The framebuffer to copy into the mip, or `null` for the default framebuffer.
	 * @param area - The area of the framebuffer to copy into the mip.
	 * @internal
	 */
	protected abstract setMipFromFramebuffer(
		target: MipmapTarget,
		level: number,
		bounds?: Prism | Rectangle,
		framebuffer?: Framebuffer | null,
		area?: Rectangle
	): void;

	/**
	 * Copy the data in a buffer into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated.
	 * @param format - The format of the data in the buffer.
	 * @param type - The type of the data in the buffer.
	 * @param buffer - The buffer to copy into the mip.
	 * @param size - The number of bytes of data to copy from the buffer.
	 * @param offset - The offset in bytes from the start of the buffer to start copying at.
	 * @internal
	 */
	protected abstract setMipFromBuffer(
		target: MipmapTarget,
		level: number,
		bounds: Prism | Rectangle,
		format: TextureDataFormat,
		type: TextureDataType,
		buffer: VertexBuffer,
		size: number,
		offset: number
	): void;

	/**
	 * Copy data into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param format - The format of the data.
	 * @param type - The type of the data.
	 * @param data - The data to copy into the mip.
	 * @internal
	 */
	protected abstract setMipFromData(
		target: MipmapTarget,
		level: number,
		bounds: Prism | Rectangle | undefined,
		format: TextureDataFormat,
		type: TextureDataType,
		data?: TexImageSource
	): void;

	/**
	 * Copy the data in an array into one of this texture's mips.
	 * @param target - The mipmap that the mip belongs to.
	 * @param level - The level of the mip within its mipmap.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param format - The format of the data in the array.
	 * @param type - The type of the data in the array.
	 * @param array - The array to copy into the mip.
	 * @param offset - The offset from the start of the array to start copying at, or `undefined` for the start of the array.
	 * @param length - The number of elements to copy from the array, or `undefined` for the entire array.
	 * @internal
	 */
	protected abstract setMipFromArray(
		target: MipmapTarget,
		level: number,
		bounds: Prism | Rectangle,
		format: TextureDataFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	): void;
}
