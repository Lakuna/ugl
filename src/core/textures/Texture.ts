import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import type TextureTarget from "#TextureTarget";
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
import type { TextureSizedInternalFormat } from "#TextureSizedInternalFormat";
import type MipmapTarget from "#MipmapTarget";
import type Box from "#Box";
import TextureDataType from "#TextureDataType";
import TextureFormat from "#TextureFormat";
import type { TextureInternalFormat } from "#TextureInternalFormat";
import TextureUncompressedUnsizedInternalFormat from "#TextureUncompressedUnsizedInternalFormat";
import ImmutableError from "#ImmutableError";
import getTextureFormatForTextureInternalFormat from "#getTextureFormatForTextureInternalFormat";
import TextureFormatError from "#TextureFormatError";
import getTextureDataTypesForTextureInternalFormat from "#getTextureDataTypesForTextureInternalFormat";
import Framebuffer from "#Framebuffer";
import Buffer from "#Buffer";

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
	private static bindingsCache:
		| Map<WebGL2RenderingContext, Map<TextureTarget, WebGLTexture | null>[]>
		| undefined;

	/**
	 * Gets the texture bindings cache.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getBindingsCache(): Map<
		WebGL2RenderingContext,
		Map<TextureTarget, WebGLTexture | null>[]
	> {
		return (Texture.bindingsCache ??= new Map() as Map<
			WebGL2RenderingContext,
			Map<TextureTarget, WebGLTexture | null>[]
		>);
	}

	/**
	 * Gets the texture bindings cache for a rendering context.
	 * @param context The rendering context.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		context: Context
	): Map<TextureTarget, WebGLTexture | null>[] {
		// Get the full bindings cache.
		const bindingsCache: Map<
			WebGL2RenderingContext,
			Map<TextureTarget, WebGLTexture | null>[]
		> = Texture.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache:
			| Map<TextureTarget, WebGLTexture | null>[]
			| undefined = bindingsCache.get(context.gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = [];
			bindingsCache.set(context.gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Gets the texture bindings cache for a texture unit.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getTextureUnitBindingsCache(
		context: Context,
		textureUnit: number
	): Map<TextureTarget, WebGLTexture | null> {
		// Get the context bindings cache.
		const contextBindingsCache: Map<TextureTarget, WebGLTexture | null>[] =
			Texture.getContextBindingsCache(context);

		// Get the texture unit bindings cache.
		let textureUnitBindingsCache:
			| Map<TextureTarget, WebGLTexture | null>
			| undefined = contextBindingsCache[textureUnit];
		if (typeof textureUnitBindingsCache === "undefined") {
			textureUnitBindingsCache = new Map();
			contextBindingsCache[textureUnit] = textureUnitBindingsCache;
		}

		return textureUnitBindingsCache;
	}

	/**
	 * The order that texture units should be overwritten in if necessary.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	private static bindingOverwriteOrder:
		| Map<WebGL2RenderingContext, Map<TextureTarget, number[]>>
		| undefined;

	/**
	 * Gets the texture binding overwrite order.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getBindingOverwriteOrder(): Map<
		WebGL2RenderingContext,
		Map<TextureTarget, number[]>
	> {
		return (Texture.bindingOverwriteOrder ??= new Map() as Map<
			WebGL2RenderingContext,
			Map<TextureTarget, number[]>
		>);
	}

	/**
	 * Gets the texture binding overwrite order for a rendering context.
	 * @param context The rendering context.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getContextBindingOverwriteOrder(
		context: Context
	): Map<TextureTarget, number[]> {
		// Get the full texture binding overwrite order.
		const bindingOverwriteOrder: Map<
			WebGL2RenderingContext,
			Map<TextureTarget, number[]>
		> = Texture.getBindingOverwriteOrder();

		// Get the context binding overwrite order.
		let contextBindingOverwriteOrder: Map<TextureTarget, number[]> | undefined =
			bindingOverwriteOrder.get(context.gl);
		if (typeof contextBindingOverwriteOrder === "undefined") {
			contextBindingOverwriteOrder = new Map();
			bindingOverwriteOrder.set(context.gl, contextBindingOverwriteOrder);
		}

		return contextBindingOverwriteOrder;
	}

	/**
	 * Gets the texture binding overwrite order for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getTargetBindingOverwriteOrder(
		context: Context,
		target: TextureTarget
	): number[] {
		// Get the context binding overwrite order.
		const contextBindingOverwriteOrder:
			| Map<TextureTarget, number[]>
			| undefined = Texture.getContextBindingOverwriteOrder(context);

		// Get the binding point binding overwrite order.
		let targetBindingOverwriteOrder: number[] | undefined =
			contextBindingOverwriteOrder.get(target);
		if (typeof targetBindingOverwriteOrder === "undefined") {
			targetBindingOverwriteOrder = [];
			contextBindingOverwriteOrder.set(target, targetBindingOverwriteOrder);
		}

		return targetBindingOverwriteOrder;
	}

	/**
	 * Determines the most desirable texture unit to bind to.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param texture The texture to be bound.
	 * @returns The most desirable texture unit to bind to.
	 * @internal
	 */
	private static getBestTextureUnit(
		context: Context,
		target: TextureTarget,
		texture?: WebGLTexture | null
	): number {
		// Check if the texture is already bound.
		if (typeof texture !== "undefined" && texture !== null) {
			for (let i = 0; i < context.maxCombinedTextureImageUnits; i++) {
				if (Texture.getBound(context, i, target) === texture) {
					return i;
				}
			}
		}

		// Get the texture target binding overwrite order.
		const targetBindingOverwriteOrder: number[] =
			Texture.getTargetBindingOverwriteOrder(context, target);

		// Check for any unused texture units.
		for (let i = 0; i < context.maxCombinedTextureImageUnits; i++) {
			if (!targetBindingOverwriteOrder.includes(i)) {
				return i;
			}
		}

		// Return the least recently used texture unit.
		return (targetBindingOverwriteOrder[0] ??= 0);
	}

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
	public static getBound(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget
	): WebGLTexture | null {
		// Default to the most desirable texture unit.
		textureUnit ??= Texture.getBestTextureUnit(context, target);

		// Get the texture unit bindings cache.
		const textureUnitBindingsCache: Map<TextureTarget, WebGLTexture | null> =
			Texture.getTextureUnitBindingsCache(context, textureUnit);

		// Get the bound texture.
		let boundTexture: WebGLTexture | null | undefined =
			textureUnitBindingsCache.get(target);
		if (typeof boundTexture === "undefined") {
			boundTexture = context.gl.getParameter(
				getParameterForTextureTarget(target)
			) as WebGLTexture | null;
			textureUnitBindingsCache.set(target, boundTexture);
		}

		return boundTexture;
	}

	/**
	 * Binds a texture to a binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit, or `undefined` for the current
	 * texture unit.
	 * @param target The binding point.
	 * @param texture The texture.
	 * @returns The used texture unit.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	public static override bind(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture: WebGLTexture | null
	): number {
		// Default to the most desirable texture unit.
		textureUnit ??= Texture.getBestTextureUnit(context, target, texture);

		// Update the texture overwrite order.
		const targetBindingOverwriteOrder: number[] =
			Texture.getTargetBindingOverwriteOrder(context, target);
		if (targetBindingOverwriteOrder.includes(textureUnit)) {
			targetBindingOverwriteOrder.splice(
				targetBindingOverwriteOrder.indexOf(textureUnit),
				1
			);
		}
		targetBindingOverwriteOrder.push(textureUnit);

		// Do nothing if the binding is already correct.
		if (Texture.getBound(context, textureUnit, target) === texture) {
			return textureUnit;
		}

		// Bind the texture to the target.
		context.activeTexture = textureUnit;
		context.gl.bindTexture(target, texture);
		Texture.getTextureUnitBindingsCache(context, textureUnit).set(
			target,
			texture
		);

		return textureUnit;
	}

	/**
	 * Unbinds the given texture from the given binding point.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit, or `undefined` for all texture units.
	 * @param target The binding point.
	 * @param texture The texture, or `undefined` for any texture.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	public static unbind(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture?: WebGLTexture
	): void {
		// If a specific texture unit is given, unbind the texture from only that texture unit.
		if (typeof textureUnit === "number") {
			// If a specific texture is given, only unbind that texture.
			if (
				typeof texture !== "undefined" &&
				Texture.getBound(context, textureUnit, target) !== texture
			) {
				return;
			}

			// Unbind the texture.
			Texture.bind(context, textureUnit, target, null);
			return;
		}

		// Otherwise, unbind the texture from every texture unit.
		for (const textureUnit of Texture.getContextBindingsCache(context).keys()) {
			Texture.unbind(context, textureUnit, target, texture);
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
		dims: number[]
	);

	protected constructor(
		context: Context,
		target: TextureTarget,
		levels?: number,
		format?: TextureSizedInternalFormat,
		dims?: number[]
	) {
		super(context);

		const texture: WebGLTexture | null = this.gl.createTexture();
		if (texture === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = texture;
		this.target = target;
		this.mipmaps = new Map();
		this.dims = [];
		this.isImmutableFormatCache = false;
		if (
			typeof levels !== "undefined" &&
			typeof format !== "undefined" &&
			typeof dims !== "undefined"
		) {
			this.makeImmutableFormat(levels, format, dims);
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
	public readonly target: TextureTarget;

	/**
	 * The mipmaps in this texture. Most textures will have only one mipmap,
	 * but cubemaps have six (one for each face). Each mipmap is a map of mip
	 * levels to boolean values representing whether the corresponding mip has
	 * been given texture data.
	 */
	private readonly mipmaps: Map<MipmapTarget, Map<number, boolean>>;

	/** The format of this texture. */
	private formatCache?: TextureInternalFormat;

	/** The format of this texture. */
	public get format(): TextureInternalFormat {
		// We don't have to worry about defaulting to an unsized internal format since the format is always set for immutable-format textures.
		if (typeof this.formatCache === "undefined") {
			this.formatCache = TextureUncompressedUnsizedInternalFormat.RGBA;
		}

		return this.formatCache;
	}

	/**
	 * The format of this texture.
	 * @throws {@link ImmutableError} if this is an immutable-format texture.
	 */
	public set format(value: TextureInternalFormat) {
		if (this.isImmutableFormat) {
			throw new ImmutableError();
		}

		this.formatCache = value;
	}

	/**
	 * The width, height (if applicable), and depth (if applicable) of this
	 * texture, respectively.
	 */
	protected readonly dims: number[];

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
		dims: number[]
	): void {
		if (this.isImmutableFormat) {
			return;
		}

		this.makeImmutableFormatInternal(levels, format, dims);
		this.format = format;
		for (let i = 0; i < dims.length; i++) {
			this.dims[i] = dims[i] ?? 0;
		}
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
		dims: number[]
	): void;

	/**
	 * Copies the data in a framebuffer into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param framebuffer The framebuffer to copy into the mip, or `undefined`
	 * for the default framebuffer.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param type The type of the given data. Must be compatible with the
	 * format of the given data.
	 * @param unpackAlignment The alignment to use when unpacking the data, or
	 * `undefined` to let this be automatically determined.
	 * @param area The area of the framebuffer to copy into the mip.
	 * @throws {@link TextureFormatError}
	 */
	public setMip(
		target: MipmapTarget,
		level: number,
		framebuffer: Framebuffer | undefined,
		bounds?: Box,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		area?: Box
	): void;

	/**
	 * Copies the data in a buffer into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param buffer The buffer to copy into the mip.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param type The type of the given data. Must be compatible with the
	 * format of the given data.
	 * @param unpackAlignment The alignment to use when unpacking the data, or
	 * `undefined` to let this be automatically determined.
	 * @param size The number of bytes of data to copy from the buffer.
	 * @param offset The offset in bytes from the start of the buffer to start
	 * copying at.
	 * @throws {@link TextureFormatError}
	 */
	public setMip(
		target: MipmapTarget,
		level: number,
		buffer: Buffer,
		bounds: Box | undefined,
		type: TextureDataType | undefined,
		unpackAlignment: 1 | 2 | 4 | 8 | undefined,
		size: number,
		offset: number
	): void;

	/**
	 * Copies data into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param data The data to copy into the mip.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param type The type of the given data. Must be compatible with the
	 * format of the given data.
	 * @param unpackAlignment The alignment to use when unpacking the data, or
	 * `undefined` to let this be automatically determined.
	 * @throws {@link TextureFormatError}
	 */
	public setMip(
		target: MipmapTarget,
		level: number,
		data: TexImageSource,
		bounds?: Box,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8
	): void;

	/**
	 * Copies the data in an array into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param array The array to copy into the mip.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param type The type of the given data. Must be compatible with the
	 * format of the given data.
	 * @param unpackAlignment The alignment to use when unpacking the data, or
	 * `undefined` to let this be automatically determined.
	 * @param offset The offset from the start of the array to start copying
	 * at, or `undefined` for the start of the array.
	 * @param length The number of elements to copy from the array, or
	 * `undefined` for the entire array.
	 * @throws {@link TextureFormatError}
	 */
	public setMip(
		target: MipmapTarget,
		level: number,
		array: ArrayBufferView,
		bounds?: Box,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		offset?: number,
		length?: number
	): void;

	public setMip(
		target: MipmapTarget,
		level: number,
		data: Framebuffer | undefined | Buffer | TexImageSource | ArrayBufferView,
		bounds?: Box,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		shape1?: Box | number, // Meaning depends on data type; see overloads.
		shape2?: number // Meaning depends on data type; see overloads.
	): void {
		// Ensure that the data type and internal format are compatible.
		const expectedDataTypes: TextureDataType[] | null =
			getTextureDataTypesForTextureInternalFormat(this.format);
		type ??= expectedDataTypes?.[0] ?? TextureDataType.UNSIGNED_BYTE;
		if (expectedDataTypes !== null && !expectedDataTypes.includes(type)) {
			throw new TextureFormatError();
		}

		// Ensure that the specified bounds (if any) are no bigger than the mip.
		const mipDims: number[] = this.getSizeOfMip(level);
		if (typeof bounds === "undefined") {
			// Default to the entire mip for immutable-format textures.
			// For mutable-format textures, `texImage[23]D` can be used (no bounds needed).
			if (this.isImmutableFormat) {
				bounds = {
					x: 0,
					y: 0,
					z: 0,
					width: mipDims[0] ?? 0,
					height: mipDims[1] ?? 0,
					depth: mipDims[2] ?? 0
				};
			}
		} else if (this.isImmutableFormat || level > 0) {
			// Throw an error if the specified bounding box (if any) is larger than the specified mip.
			// For mutable-format textures, resizing the largest mip is okay.
			if (
				bounds.x + bounds.width > (mipDims[0] ?? 0) ||
				bounds.y + bounds.height > (mipDims[1] ?? 0) ||
				(bounds.z ?? 0) + (bounds.depth ?? 1) > (mipDims[2] ?? 1)
			) {
				throw new RangeError(
					"The specified bounding box is larger than the specified mip."
				);
			}
		}

		// Update the unpack alignment.
		if (typeof unpackAlignment == "number") {
			this.context.unpackAlignment = unpackAlignment;
		} else if (typeof bounds === "undefined") {
			this.context.unpackAlignment = 1; // Most likely value to be able to unpack data with an unknown size.
		} else if (bounds.height > 1 || (bounds.depth ?? 1) > 1) {
			// Unpack alignment doesn't matter if there is only one row of data.
			for (const alignment of [8, 4, 2, 1] as const) {
				if (bounds.width % alignment == 0) {
					this.context.unpackAlignment = alignment;
					break;
				}
			}
		}

		// Determine the compatible data format.
		const format: TextureFormat = getTextureFormatForTextureInternalFormat(
			this.format
		);

		// Update the mip data.
		if (typeof data === "undefined" || data instanceof Framebuffer) {
			if (typeof shape1 === "number") {
				throw new TypeError();
			}

			this.setMipFromFramebuffer(target, level, bounds, data, shape1);
		} else if (data instanceof Buffer) {
			if (typeof shape1 !== "number" || typeof shape2 !== "number") {
				throw new TypeError();
			}

			// Automatically set bounds to entire mip if they don't exist.
			bounds ??= {
				x: 0,
				y: 0,
				z: 0,
				width: mipDims[0] ?? 0,
				height: mipDims[1] ?? 0,
				depth: mipDims[2] ?? 0
			};

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
		} else if ("buffer" in data) {
			if (typeof shape1 !== "number" && typeof shape1 !== "undefined") {
				throw new TypeError();
			}

			// Automatically set bounds to entire mip if they don't exist.
			bounds ??= {
				x: 0,
				y: 0,
				z: 0,
				width: mipDims[0] ?? 0,
				height: mipDims[1] ?? 0,
				depth: mipDims[2] ?? 0
			};

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
		let mipmap: Map<number, boolean> | undefined = this.mipmaps.get(target);
		if (typeof mipmap === "undefined") {
			mipmap = new Map();
			this.mipmaps.set(target, mipmap);
		}
		mipmap.set(level, true);

		// Clear cached values.
		// TODO: Determine which of these cached values actually need to be cleared.
		this.baseLevelCache = undefined;
		this.comparisonFunctionCache = undefined;
		this.comparisonModeCache = undefined;
		delete this.formatCache;
		this.magFilterCache = undefined;
		this.maxAnisotropyCache = undefined;
		this.maxLevelCache = undefined;
		this.maxLodCache = undefined;
		this.minFilterCache = undefined;
		this.minLodCache = undefined;
		this.wrapRFunctionCache = undefined;
		this.wrapSFunctionCache = undefined;
		this.wrapTFunctionCache = undefined;
	}

	/**
	 * Copies the data in a framebuffer into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param framebuffer The framebuffer to copy into the mip, or `undefined`
	 * for the default framebuffer.
	 * @param area The area of the framebuffer to copy into the mip.
	 * @internal
	 */
	protected abstract setMipFromFramebuffer(
		target: MipmapTarget,
		level: number,
		bounds: Box | undefined,
		framebuffer: Framebuffer | undefined,
		area: Box | undefined
	): void;

	/**
	 * Copies the data in a buffer into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param bounds The bounds of the mip to be updated.
	 * @param format The format of the data in the buffer.
	 * @param type The type of the data in the buffer.
	 * @param buffer The buffer to copy into the mip.
	 * @param size The number of bytes of data to copy from the buffer.
	 * @param offset The offset in bytes from the start of the buffer to start
	 * copying at.
	 * @internal
	 */
	protected abstract setMipFromBuffer(
		target: MipmapTarget,
		level: number,
		bounds: Box,
		format: TextureFormat,
		type: TextureDataType,
		buffer: Buffer,
		size: number,
		offset: number
	): void;

	/**
	 * Copies data into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param format The format of the data.
	 * @param type The type of the data.
	 * @param data The data to copy into the mip.
	 * @internal
	 */
	protected abstract setMipFromData(
		target: MipmapTarget,
		level: number,
		bounds: Box | undefined,
		format: TextureFormat,
		type: TextureDataType,
		data: TexImageSource
	): void;

	/**
	 * Copies the data in an array into a mip.
	 * @param target The mipmap that the mip belongs to.
	 * @param level The level of the mip within its mipmap.
	 * @param bounds The bounds of the mip to be updated. Defaults to the
	 * entire mip if not set.
	 * @param format The format of the data in the array.
	 * @param type The type of the data in the array.
	 * @param array The array to copy into the mip.
	 * @param offset The offset from the start of the array to start copying
	 * at, or `undefined` for the start of the array.
	 * @param length The number of elements to copy from the array, or
	 * `undefined` for the entire array.
	 * @internal
	 */
	protected abstract setMipFromArray(
		target: MipmapTarget,
		level: number,
		bounds: Box,
		format: TextureFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	): void;

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private magFilterCache: TextureMagFilter | undefined;

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get magFilter(): TextureMagFilter {
		this.bind();
		return (this.magFilterCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAG_FILTER
		) as TextureMagFilter);
	}

	/**
	 * The magnification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set magFilter(value: TextureMagFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
		this.magFilterCache = value;
	}

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private minFilterCache: TextureMinFilter | undefined;

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get minFilter(): TextureMinFilter {
		this.bind();
		return (this.minFilterCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MIN_FILTER
		) as TextureMinFilter);
	}

	/**
	 * The minification filter of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minFilter(value: TextureMinFilter) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
		this.minFilterCache = value;
	}

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapSFunctionCache: TextureWrapFunction | undefined;

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapSFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_S
		) as TextureWrapFunction);
	}

	/**
	 * The wrap function on the S-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapSFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
		this.wrapSFunctionCache = value;
	}

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapTFunctionCache: TextureWrapFunction | undefined;

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapTFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapTFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_T
		) as TextureWrapFunction);
	}

	/**
	 * The wrap function on the T-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapTFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
		this.wrapTFunctionCache = value;
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxAnisotropyCache: number | undefined;

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxAnisotropy(): number {
		// TODO: Automatically enable the `EXT_texture_filter_anisotropic` extension.
		this.bind();
		return (this.maxAnisotropyCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_ANISOTROPY_EXT
		) as number);
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxAnisotropy(value: number) {
		// TODO: Automatically enable the `EXT_texture_filter_anisotropic` extension.
		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_ANISOTROPY_EXT, value);
		this.maxAnisotropyCache = value;
	}

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private baseLevelCache: number | undefined;

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get baseLevel(): number {
		this.bind();
		return (this.baseLevelCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_BASE_LEVEL
		) as number);
	}

	/**
	 * The base mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set baseLevel(value: number) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_BASE_LEVEL, value);
		this.baseLevelCache = value;
	}

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private comparisonFunctionCache: TestFunction | undefined;

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get comparisonFunction(): TestFunction {
		this.bind();
		return (this.comparisonFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_COMPARE_FUNC
		) as TestFunction);
	}

	/**
	 * The comparison function of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonFunction(value: TestFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_FUNC, value);
		this.comparisonFunctionCache = value;
	}

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private comparisonModeCache: TextureCompareMode | undefined;

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get comparisonMode(): TextureCompareMode {
		this.bind();
		return (this.comparisonModeCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_COMPARE_MODE
		) as TextureCompareMode);
	}

	/**
	 * The comparison mode of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set comparisonMode(value: TextureCompareMode) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_MODE, value);
		this.comparisonModeCache = value;
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxLevelCache: number | undefined;

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxLevel(): number {
		this.bind();
		return (this.maxLevelCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_LEVEL
		) as number);
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLevel(value: number) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAX_LEVEL, value);
		this.maxLevelCache = value;
	}

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private maxLodCache: number | undefined;

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get maxLod(): number {
		this.bind();
		return (this.maxLodCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_LOD
		) as number);
	}

	/**
	 * The maximum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set maxLod(value: number) {
		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_LOD, value);
		this.maxLodCache = value;
	}

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private minLodCache: number | undefined;

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get minLod(): number {
		this.bind();
		return (this.minLodCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MIN_LOD
		) as number);
	}

	/**
	 * The minimum level of detail of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set minLod(value: number) {
		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MIN_LOD, value);
		this.minLodCache = value;
	}

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 * @internal
	 */
	private wrapRFunctionCache: TextureWrapFunction | undefined;

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public get wrapRFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapRFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_R
		) as TextureWrapFunction);
	}

	/**
	 * The wrap function on the R-axis of this texture.
	 * @see [`texParameter[fi]`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter)
	 * @see [`getTexParameter`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter)
	 */
	public set wrapRFunction(value: TextureWrapFunction) {
		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_R, value);
		this.wrapRFunctionCache = value;
	}

	/** Whether this texture is texture complete. */
	public get isTextureComplete(): boolean {
		if (this.isImmutableFormat) {
			return true;
		}

		if (
			this.minFilter === TextureMinFilter.LINEAR ||
			this.minFilter === TextureMinFilter.NEAREST
		) {
			return true;
		}

		// Return `false` if any mip doesn't have data.
		let i = 0;
		let mipDims: number[] = this.getSizeOfMip(i);
		while (
			(mipDims[0] ?? 0) > 0 ||
			(mipDims[1] ?? 0) > 0 ||
			(mipDims[2] ?? 0) > 0
		) {
			for (const mipmap of this.mipmaps.values()) {
				if (!mipmap.get(i)) {
					return false;
				}
			}
			mipDims = this.getSizeOfMip(++i);
		}

		// Return `true` if all mips have data.
		return true;
	}

	/**
	 * Get the dimensions of the mip at the given level.
	 * @param level The level of the mip.
	 * @returns The width, height (if applicable), and depth (if applicable) of the mip, in that order.
	 */
	public getSizeOfMip(level: number): number[] {
		const dims = [...this.dims];
		for (let i = 0; i < level; i++) {
			for (let dim = 0; dim < dims.length; dim++) {
				dims[dim] = Math.floor((dims[dim] ?? 0) / 2);
			}
		}
		return dims;
	}

	/**
	 * Generates a mipmap for this texture. Overwrites all mips except those at
	 * the top level. Does nothing for immutable-format textures.
	 * @see [`generateMipmap`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap)
	 * @internal
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
	 * @param textureUnit The texture unit, or `undefined` for the default
	 * texture unit.
	 * @returns The used texture unit.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	public bind(textureUnit?: number): number {
		return Texture.bind(this.context, textureUnit, this.target, this.internal);
	}

	/**
	 * Unbinds this texture from its binding point.
	 * @param textureUnit The texture unit, or `undefined` for all texture
	 * units.
	 * @see [`bindTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture)
	 * @internal
	 */
	public unbind(textureUnit?: number): void {
		Texture.unbind(this.context, textureUnit, this.target, this.internal);
	}
}
