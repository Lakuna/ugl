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
import Buffer from "../buffers/Buffer.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import type CubemapFace from "../../constants/CubemapFace.js";
import Extension from "../../constants/Extension.js";
import Framebuffer from "../Framebuffer.js";
import ImmutableError from "../../utility/ImmutableError.js";
import type MipmapTarget from "../../constants/MipmapTarget.js";
import type Prism from "../../types/Prism.js";
import type Rectangle from "../../types/Rectangle.js";
import type TestFunction from "../../constants/TestFunction.js";
import type TextureCompareMode from "../../constants/TextureCompareMode.js";
import TextureDataType from "../../constants/TextureDataType.js";
import TextureFilter from "../../constants/TextureFilter.js";
import type TextureFormat from "../../constants/TextureFormat.js";
import TextureFormatError from "../../utility/TextureFormatError.js";
import type { TextureInternalFormat } from "../../types/TextureInternalFormat.js";
import type { TextureSizedInternalFormat } from "../../types/TextureSizedInternalFormat.js";
import type TextureTarget from "../../constants/TextureTarget.js";
import TextureUncompressedUnsizedInternalFormat from "../../constants/TextureUncompressedUnsizedInternalFormat.js";
import type TextureWrapFunction from "../../constants/TextureWrapFunction.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import getExtensionForTextureInternalFormat from "../../utility/internal/getExtensionForTextureInternalFormat.js";
import getMipmapTargetForCubemapFace from "../../utility/internal/getMipmapTargetForCubemapFace.js";
import getParameterForTextureTarget from "../../utility/internal/getParameterForTextureTarget.js";
import getTextureDataTypesForTextureInternalFormat from "../../utility/internal/getTextureDataTypesForTextureInternalFormat.js";
import getTextureFormatForTextureInternalFormat from "../../utility/internal/getTextureFormatForTextureInternalFormat.js";

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
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<TextureTarget, WebGLTexture | null>[]
	>;

	/**
	 * Get the texture bindings cache.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Texture.bindingsCache ??= new Map());
	}

	/**
	 * Get the texture bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The texture bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = Texture.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache = bindingsCache.get(gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = [];
			bindingsCache.set(gl, contextBindingsCache);
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
	) {
		// Get the context bindings cache.
		const contextBindingsCache = Texture.getContextBindingsCache(gl);

		// Get the texture unit bindings cache.
		let textureUnitBindingsCache = contextBindingsCache[textureUnit];
		if (typeof textureUnitBindingsCache === "undefined") {
			textureUnitBindingsCache = new Map();
			contextBindingsCache[textureUnit] = textureUnitBindingsCache;
		}

		return textureUnitBindingsCache;
	}

	/**
	 * The order that texture units should be overwritten in if necessary.
	 * @internal
	 */
	private static bindingOverwriteOrder?: Map<
		WebGL2RenderingContext,
		Map<TextureTarget, number[]>
	>;

	/**
	 * Get the texture binding overwrite order.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getBindingOverwriteOrder() {
		return (Texture.bindingOverwriteOrder ??= new Map());
	}

	/**
	 * Get the texture binding overwrite order for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The texture binding overwrite order.
	 * @internal
	 */
	private static getContextBindingOverwriteOrder(gl: WebGL2RenderingContext) {
		// Get the full texture binding overwrite order.
		const bindingOverwriteOrder = Texture.getBindingOverwriteOrder();

		// Get the context binding overwrite order.
		let contextBindingOverwriteOrder = bindingOverwriteOrder.get(gl);
		if (typeof contextBindingOverwriteOrder === "undefined") {
			contextBindingOverwriteOrder = new Map();
			bindingOverwriteOrder.set(gl, contextBindingOverwriteOrder);
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
	) {
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
	) {
		// Check if the texture is already bound.
		if (typeof texture !== "undefined" && texture !== null) {
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

		// Return the least recently used texture unit.
		return (targetBindingOverwriteOrder[0] ??= 0);
	}

	/**
	 * Get the currently-bound texture for a binding point.
	 * @param context - The rendering context.
	 * @param requestedTextureUnit - The texture unit, or `undefined` for the least-recently used texture unit.
	 * @param target - The binding point.
	 * @returns The texture.
	 * @internal
	 */
	public static getBound(
		context: Context,
		requestedTextureUnit: number | undefined,
		target: TextureTarget
	) {
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
			context.activeTexture = textureUnit;
			boundTexture = context.gl.getParameter(
				getParameterForTextureTarget(target)
			) as WebGLTexture | null;
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
	 * @returns The used texture unit.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindTexture | bindTexture}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		requestedTextureUnit: number | undefined,
		target: TextureTarget,
		texture: WebGLTexture | null
	) {
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
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		textureUnit: number | undefined,
		target: TextureTarget,
		texture?: WebGLTexture
	) {
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
	 * Create a texture.
	 * @param context - The rendering context.
	 * @param target - The target binding point of the texture.
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createTexture | createTexture}
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

		const texture = this.gl.createTexture();
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
	 * @internal
	 */
	public readonly internal;

	/**
	 * The binding point of this texture.
	 * @internal
	 */
	public readonly target;

	/**
	 * The mipmaps in this texture. Most textures will have only one mipmap, but cubemaps have six (one for each face). Each mipmap is a map of mip levels to boolean values representing whether or not the corresponding mip has been given texture data.
	 * @internal
	 */
	private readonly mipmaps: Map<MipmapTarget, Map<number, boolean>>;

	/**
	 * The format of this texture.
	 * @internal
	 */
	private formatCache?: TextureInternalFormat;

	/** The format of this texture. */
	public get format(): TextureInternalFormat {
		// We don't have to worry about defaulting to an unsized internal format since the format is always set for immutable-format textures.
		if (typeof this.formatCache === "undefined") {
			this.formatCache = TextureUncompressedUnsizedInternalFormat.RGBA;
		}

		return this.formatCache;
	}

	public set format(value) {
		if (value === this.format) {
			return;
		}

		// Immutable-format textures cannot have their format changed (duh).
		if (this.isImmutableFormat) {
			throw new ImmutableError();
		}

		// Enable the extension that is required for the given format, if any.
		const extension = getExtensionForTextureInternalFormat(value);
		if (extension !== null) {
			this.context.enableExtension(extension);
		}

		this.formatCache = value;
	}

	/**
	 * The width, height (if applicable), and depth (if applicable) of this texture, respectively.
	 * @internal
	 */
	protected readonly dims: number[];

	/** The width of this texture. */
	public get width(): number {
		return this.dims[0] ?? 0;
	}

	/**
	 * Set the width of this texture.
	 * @param value - The new width of the texture.
	 * @internal
	 */
	protected setWidth(value: number): void {
		this.dims[0] = value;
	}

	/** The height of this texture. */
	public get height(): number {
		return this.dims[1] ?? 0;
	}

	/**
	 * Set the height of this texture.
	 * @param value - The new height of the texture.
	 * @internal
	 */
	protected setHeight(value: number): void {
		this.dims[1] = value;
	}

	/** The depth of this texture. */
	public get depth(): number {
		return this.dims[2] ?? 0;
	}

	/**
	 * Set the depth of this texture.
	 * @param value - The new width of the texture.
	 * @internal
	 */
	protected setDepth(value: number): void {
		this.dims[2] = value;
	}

	/**
	 * Whether or not this is an immutable-format texture.
	 * @internal
	 */
	private isImmutableFormatCache;

	/** Whether or not this is an immutable-format texture. */
	public get isImmutableFormat(): boolean {
		return this.isImmutableFormatCache;
	}

	/**
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
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
	 * Make this texture into an immutable-format texture.
	 * @param levels - The number of levels in the texture.
	 * @param format - The internal format of the texture.
	 * @param dims - The dimensions of the texture.
	 * @internal
	 */
	protected abstract makeImmutableFormatInternal(
		levels: number,
		format: TextureSizedInternalFormat,
		dims: number[]
	): void;

	/**
	 * Copy the data in a framebuffer into one of this texture's mips.
	 * @param framebuffer - The framebuffer to copy into the mip, or `null` for the default framebuffer.
	 * @param level - The level of the mip within its mipmap. Defaults to the top mip.
	 * @param face - The mipmap that the mip belongs to. Ignored by non-cubemap textures.
	 * @param bounds - The bounds of the mip to be updated. Defaults to the entire mip if not set.
	 * @param type - The type of the given data. Must be compatible with the format of the given data.
	 * @param unpackAlignment - The alignment to use when unpacking the data, or `undefined` to let this be automatically determined.
	 * @param area - The area of the framebuffer to copy into the mip.
	 */
	public setMip(
		framebuffer: Framebuffer | null,
		level?: number,
		face?: CubemapFace,
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
	 */
	public setMip(
		buffer: Buffer,
		level: number | undefined,
		face: CubemapFace | undefined,
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
	 */
	public setMip(
		data?: TexImageSource,
		level?: number,
		face?: CubemapFace,
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
	 */
	public setMip(
		array: ArrayBufferView,
		level?: number,
		face?: CubemapFace,
		bounds?: Prism | Rectangle,
		type?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		offset?: number,
		length?: number
	): void;

	public setMip(
		data?: Framebuffer | null | Buffer | TexImageSource | ArrayBufferView,
		requestedLevel?: number,
		face?: CubemapFace,
		requestedBounds?: Prism | Rectangle,
		requestedType?: TextureDataType,
		unpackAlignment?: 1 | 2 | 4 | 8,
		shape1?: Prism | Rectangle | number, // Meaning depends on data type; see overloads.
		shape2?: number | boolean // Meaning depends on data type; see overloads.
	) {
		const level = requestedLevel ?? 0;

		// Ensure that the data type and internal format are compatible.
		const expectedDataTypes = getTextureDataTypesForTextureInternalFormat(
			this.format
		);
		const type =
			requestedType ?? expectedDataTypes?.[0] ?? TextureDataType.UNSIGNED_BYTE;
		if (expectedDataTypes !== null && !expectedDataTypes.includes(type)) {
			throw new TextureFormatError();
		}

		// Ensure that the specified bounds (if any) are no bigger than the mip.
		const mipDims = this.getSizeOfMip(level);
		let bounds = requestedBounds;
		if (typeof bounds === "undefined") {
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
		if (typeof unpackAlignment === "number") {
			this.context.unpackAlignment = unpackAlignment;
		} else if (typeof bounds === "undefined") {
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
		const format = getTextureFormatForTextureInternalFormat(this.format);

		// Determine the proper mipmap target.
		const target = getMipmapTargetForCubemapFace(face, this.target);

		// Bind this texture.
		this.bind();

		// Update the mip data.
		if (data === null || data instanceof Framebuffer) {
			if (typeof shape1 === "number") {
				throw new TypeError();
			}

			this.setMipFromFramebuffer(target, level, bounds, data, shape1);
		} else if (data instanceof Buffer) {
			if (typeof shape1 !== "number" || typeof shape2 !== "number") {
				throw new TypeError();
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
		} else if (typeof data !== "undefined" && "buffer" in data) {
			if (
				(typeof shape1 !== "number" && typeof shape1 !== "undefined") ||
				typeof shape2 === "boolean"
			) {
				throw new TypeError();
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
		if (typeof mipmap === "undefined") {
			mipmap = new Map();
			this.mipmaps.set(target, mipmap);
		}
		mipmap.set(level, true);

		// Clear cached values.
		delete this.baseLevelCache;
		delete this.comparisonFunctionCache;
		delete this.comparisonModeCache;
		delete this.formatCache;
		delete this.magFilterCache;
		delete this.maxAnisotropyCache;
		delete this.maxLevelCache;
		delete this.maxLodCache;
		delete this.minFilterCache;
		delete this.minLodCache;
		delete this.wrapRFunctionCache;
		delete this.wrapSFunctionCache;
		delete this.wrapTFunctionCache;
		delete this.isTextureCompleteCache;
	}

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
		format: TextureFormat,
		type: TextureDataType,
		buffer: Buffer,
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
		format: TextureFormat,
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
		format: TextureFormat,
		type: TextureDataType,
		array: ArrayBufferView,
		offset?: number,
		length?: number
	): void;

	/**
	 * The magnification filter of this texture.
	 * @internal
	 */
	private magFilterCache?: TextureFilter.LINEAR | TextureFilter.NEAREST;

	/** The magnification filter of this texture. */
	public get magFilter(): TextureFilter.LINEAR | TextureFilter.NEAREST {
		this.bind();
		return (this.magFilterCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAG_FILTER
		));
	}

	public set magFilter(value) {
		if (this.magFilter === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
		this.magFilterCache = value;
	}

	/**
	 * The minification filter of this texture.
	 * @internal
	 */
	private minFilterCache?: TextureFilter;

	/** The minification filter of this texture. */
	public get minFilter(): TextureFilter {
		this.bind();
		return (this.minFilterCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MIN_FILTER
		));
	}

	public set minFilter(value) {
		if (this.minFilter === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
		this.minFilterCache = value;
	}

	/**
	 * The wrapping function on the S-axis of this texture.
	 * @internal
	 */
	private wrapSFunctionCache?: TextureWrapFunction;

	/** The wrapping function on the S-axis of this texture. */
	public get wrapSFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapSFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_S
		) as TextureWrapFunction);
	}

	public set wrapSFunction(value) {
		if (this.wrapSFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
		this.wrapSFunctionCache = value;
	}

	/**
	 * The wrapping function on the T-axis of this texture.
	 * @internal
	 */
	private wrapTFunctionCache?: TextureWrapFunction;

	/** The wrapping function on the T-axis of this texture. */
	public get wrapTFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapTFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_T
		) as TextureWrapFunction);
	}

	public set wrapTFunction(value) {
		if (this.wrapTFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
		this.wrapTFunctionCache = value;
	}

	/**
	 * The preferred anisotropy of this texture.
	 * @internal
	 */
	private maxAnisotropyCache?: number;

	/** The preferred anisotropy of this texture. */
	public get maxAnisotropy(): number {
		if (
			this.context.enableExtension(Extension.TextureFilterAnisotropic) === null
		) {
			throw new UnsupportedOperationError();
		}

		this.bind();
		return (this.maxAnisotropyCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_ANISOTROPY_EXT
		));
	}

	public set maxAnisotropy(value) {
		if (this.maxAnisotropy === value) {
			return;
		}

		if (
			this.context.enableExtension(Extension.TextureFilterAnisotropic) === null
		) {
			throw new UnsupportedOperationError();
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_ANISOTROPY_EXT, value);
		this.maxAnisotropyCache = value;
	}

	/**
	 * The base mipmap level of this texture.
	 * @internal
	 */
	private baseLevelCache?: number;

	/** The base mipmap level of this texture. */
	public get baseLevel(): number {
		this.bind();
		return (this.baseLevelCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_BASE_LEVEL
		));
	}

	public set baseLevel(value) {
		if (this.baseLevel === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_BASE_LEVEL, value);
		this.baseLevelCache = value;
	}

	/**
	 * The comparison function of this texture.
	 * @internal
	 */
	private comparisonFunctionCache?: TestFunction;

	/** The comparison function of this texture. */
	public get comparisonFunction(): TestFunction {
		this.bind();
		return (this.comparisonFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_COMPARE_FUNC
		) as TestFunction);
	}

	public set comparisonFunction(value) {
		if (this.comparisonFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_FUNC, value);
		this.comparisonFunctionCache = value;
	}

	/**
	 * The comparison mode of this texture.
	 * @internal
	 */
	private comparisonModeCache?: TextureCompareMode;

	/** The comparison mode of this texture. */
	public get comparisonMode(): TextureCompareMode {
		this.bind();
		return (this.comparisonModeCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_COMPARE_MODE
		) as TextureCompareMode);
	}

	public set comparisonMode(value) {
		if (this.comparisonMode === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_COMPARE_MODE, value);
		this.comparisonModeCache = value;
	}

	/**
	 * The maximum mipmap level of this texture.
	 * @internal
	 */
	private maxLevelCache?: number;

	/** The maximum mipmap level of this texture. */
	public get maxLevel(): number {
		this.bind();
		return (this.maxLevelCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_LEVEL
		));
	}

	public set maxLevel(value) {
		if (this.maxLevel === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_MAX_LEVEL, value);
		this.maxLevelCache = value;
	}

	/**
	 * The maximum level of detail of this texture.
	 * @internal
	 */
	private maxLodCache?: number;

	/** The maximum level of detail of this texture. */
	public get maxLod(): number {
		this.bind();
		return (this.maxLodCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MAX_LOD
		));
	}

	public set maxLod(value) {
		if (this.maxLod === value) {
			return;
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MAX_LOD, value);
		this.maxLodCache = value;
	}

	/**
	 * The minimum level of detail of this texture.
	 * @internal
	 */
	private minLodCache?: number;

	/** The minimum level of detail of this texture. */
	public get minLod(): number {
		this.bind();
		return (this.minLodCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_MIN_LOD
		));
	}

	public set minLod(value) {
		if (this.minLod === value) {
			return;
		}

		this.bind();
		this.gl.texParameterf(this.target, TEXTURE_MIN_LOD, value);
		this.minLodCache = value;
	}

	/**
	 * The wrapping function on the R-axis of this texture.
	 * @internal
	 */
	private wrapRFunctionCache?: TextureWrapFunction;

	/** The wrapping function on the R-axis of this texture. */
	public get wrapRFunction(): TextureWrapFunction {
		this.bind();
		return (this.wrapRFunctionCache ??= this.gl.getTexParameter(
			this.target,
			TEXTURE_WRAP_R
		));
	}

	public set wrapRFunction(value) {
		if (this.wrapRFunction === value) {
			return;
		}

		this.bind();
		this.gl.texParameteri(this.target, TEXTURE_WRAP_R, value);
		this.wrapRFunctionCache = value;
	}

	/**
	 * Whether or not this texture is texture complete.
	 * @internal
	 */
	private isTextureCompleteCache?: boolean;

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
		let mipDims: number[] = this.getSizeOfMip(i);
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
	 * Get the dimensions of the mip at the given level.
	 * @param level - The level of the mip.
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
	 * @returns The used texture unit.
	 * @internal
	 */
	public bind(textureUnit?: number) {
		return Texture.bindGl(
			this.context,
			textureUnit,
			this.target,
			this.internal
		);
	}

	/**
	 * Unbind this texture from its binding point.
	 * @param textureUnit - The texture unit, or `undefined` for all texture units.
	 * @internal
	 */
	public unbind(textureUnit?: number) {
		Texture.unbindGl(this.context, textureUnit, this.target, this.internal);
	}
}
