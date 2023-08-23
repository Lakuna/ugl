import type Mip from "#Mip";
import type Context from "#Context";
import TextureTarget from "#TextureTarget";
import {
	TEXTURE0,
	TEXTURE_BINDING_2D,
	TEXTURE_BINDING_2D_ARRAY,
	TEXTURE_BINDING_3D,
	TEXTURE_BINDING_CUBE_MAP,
	TEXTURE_MAG_FILTER,
	TEXTURE_MIN_FILTER,
	TEXTURE_WRAP_S,
	TEXTURE_WRAP_T
} from "#constants";
import type MipmapTarget from "#MipmapTarget";
import type Mipmap from "#Mipmap";
import TextureMagFilter from "#TextureMagFilter";
import TextureMinFilter from "#TextureMinFilter";
import TextureWrapFunction from "#TextureWrapFunction";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * An array of data that can be randomly accessed in a shader program.
 * @see [Textures](https://www.lakuna.pw/a/webgl/textures)
 */
export default class Texture<MipType extends Mip> {
	/**
	 * Unbinds the texture from the given binding point.
	 * @param context The rendering context.
	 * @param target The target.
	 */
	public static unbind(context: Context, target: TextureTarget): void {
		// TODO: Optional caching.
		Texture.bind(context, target, null);
	}

	/**
	 * Binds a framebuffer to a binding point.
	 * @param context The rendering context of the framebuffer.
	 * @param target The target binding point.
	 * @param framebuffer The framebuffer.
	 */
	private static bind(
		context: Context,
		target: TextureTarget,
		framebuffer: WebGLTexture | null
	): void {
		// TODO: Optional caching.
		context.internal.bindTexture(target, framebuffer);
	}

	/**
	 * Assigns a texture unit as active.
	 * @param context The rendering context.
	 * @param textureUnit The texture unit.
	 */
	private static assign(context: Context, textureUnit: number): void {
		// TODO: Optional caching.
		context.internal.activeTexture(TEXTURE0 + textureUnit);
	}

	/**
	 * Gets the internal representation of the currently-bound texture.
	 * @param context The context that the texture is bound to.
	 * @param target The target that the texture is bound to.
	 * @returns The currently-bound texture.
	 */
	private static getBoundTexture(
		context: Context,
		target: TextureTarget
	): WebGLTexture | null {
		// TODO: Optional caching.
		switch (target) {
			case TextureTarget.TEXTURE_2D:
				return context.internal.getParameter(TEXTURE_BINDING_2D);
			case TextureTarget.TEXTURE_2D_ARRAY:
				return context.internal.getParameter(TEXTURE_BINDING_2D_ARRAY);
			case TextureTarget.TEXTURE_3D:
				return context.internal.getParameter(TEXTURE_BINDING_3D);
			case TextureTarget.TEXTURE_CUBE_MAP:
				return context.internal.getParameter(TEXTURE_BINDING_CUBE_MAP);
		}
	}

	/**
	 * Creates a texture.
	 * @param context The WebGL2 rendering context of the texture.
	 * @param target The binding point of the texture.
	 * @param faces The faces of the texture.
	 * @param minFilter The minification filter to use on the texture.
	 * @param magFilter The magnification filter to use on the texture.
	 * @param wrapSFunction The function to use when wrapping the texture
	 * across the S-axis.
	 * @param wrapTFunction The function to use when wrapping the texture
	 * across the T-axis.
	 */
	public constructor(
		context: Context,
		target: TextureTarget,
		faces: Map<MipmapTarget, Mipmap<MipType>> = new Map(),
		magFilter: TextureMagFilter = TextureMagFilter.NEAREST,
		minFilter: TextureMinFilter = TextureMinFilter.NEAREST,
		wrapSFunction: TextureWrapFunction = TextureWrapFunction.REPEAT,
		wrapTFunction: TextureWrapFunction = TextureWrapFunction.REPEAT
	) {
		this.context = context;
		this.target = target;

		const texture: WebGLTexture | null = context.internal.createTexture();
		if (!texture) {
			throw new UnsupportedOperationError();
		}
		this.internal = texture;

		this.faces = faces;

		this.magFilter = magFilter;
		this.minFilter = minFilter;
		this.wrapSFunction = wrapSFunction;
		this.wrapTFunction = wrapTFunction;

		this.setAllNeedsUpdate();
		this.update();
	}

	/** The rendering context of this texture. */
	public readonly context: Context;

	/** The binding point of this texture. */
	public readonly target: TextureTarget;

	/** The WebGL texture represented by this object. */
	public readonly internal: WebGLTexture;

	/** The faces of this texture. */
	private readonly faces: Map<MipmapTarget, Mipmap<MipType>>;

	/**
	 * Gets a face of this texture.
	 * @param target The target of the face.
	 * @returns The face.
	 */
	public getFace(target: MipmapTarget): Mipmap<MipType> | undefined {
		return this.faces.get(target);
	}

	/**
	 * Sets a face of this texture.
	 * @param target The target of the face.
	 * @param face The face.
	 */
	public setFace(target: MipmapTarget, face: Mipmap<MipType>): void {
		this.faces.set(target, face);
		face.setAllNeedsUpdate();
	}

	/** The magnification filter for this texture. */
	public get magFilter(): TextureMagFilter {
		// TODO: Optional caching.
		return this.with(
			(texture: this): TextureMagFilter =>
				texture.context.internal.getTexParameter(
					texture.target,
					TEXTURE_MAG_FILTER
				)
		);
	}

	/** The magnification filter for this texture. */
	public set magFilter(value: TextureMagFilter) {
		// TODO: Optional caching.
		this.with((framebuffer: this): void =>
			framebuffer.context.internal.texParameteri(
				framebuffer.target,
				TEXTURE_MAG_FILTER,
				value
			)
		);
		this.setAllNeedsUpdate();
	}

	/** The minification filter for this texture. */
	public get minFilter(): TextureMinFilter {
		// TODO: Optional caching.
		return this.with(
			(texture: this): TextureMinFilter =>
				texture.context.internal.getTexParameter(
					texture.target,
					TEXTURE_MIN_FILTER
				)
		);
	}

	/** The minification filter for this texture. */
	public set minFilter(value: TextureMinFilter) {
		// TODO: Optional caching.
		this.with((texture: this): void =>
			texture.context.internal.texParameteri(
				texture.target,
				TEXTURE_MIN_FILTER,
				value
			)
		);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the S direction. */
	public get wrapSFunction(): TextureWrapFunction {
		// TODO: Optional caching.
		return this.with(
			(texture: this): TextureWrapFunction =>
				texture.context.internal.getTexParameter(texture.target, TEXTURE_WRAP_S)
		);
	}

	/** The wrapping function of this texture in the S direction. */
	public set wrapSFunction(value: TextureWrapFunction) {
		// TODO: Optional caching.
		this.with((texture: this): void =>
			texture.context.internal.texParameteri(
				texture.target,
				TEXTURE_WRAP_S,
				value
			)
		);
		this.setAllNeedsUpdate();
	}

	/** The wrapping function of this texture in the T direction. */
	public get wrapTFunction(): TextureWrapFunction {
		// TODO: Optional caching.
		return this.with(
			(texture: this): TextureWrapFunction =>
				texture.context.internal.getTexParameter(texture.target, TEXTURE_WRAP_T)
		);
	}

	/** The wrapping function of this texture in the T direction. */
	public set wrapTFunction(value: TextureWrapFunction) {
		// TODO: Optional caching.
		this.with((texture: this): void =>
			texture.context.internal.texParameteri(
				texture.target,
				TEXTURE_WRAP_T,
				value
			)
		);
		this.setAllNeedsUpdate();
	}

	/** Binds this texture to its target binding point. */
	public bind(): void {
		// TODO: Optional caching.
		Texture.bind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this texture bound, then re-binds the
	 * previously-bound texture.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (texture: this) => T): T {
		// TODO: Optional caching.
		const previousBinding: WebGLTexture | null = Texture.getBoundTexture(
			this.context,
			this.target
		);
		this.bind();
		const out: T = f(this);
		Texture.bind(this.context, this.target, previousBinding);
		return out;
	}

	/**
	 * Assigns this texture to a texture unit and binds it to its binding point.
	 * @param textureUnit The texture unit.
	 */
	public assign(textureUnit: number): void {
		// TODO: Optional caching.
		Texture.assign(this.context, textureUnit);
		this.bind();
	}

	/** Generates a mipmap for this texture. */
	public generateMipmap(): void {
		return this.with((texture: this): void =>
			texture.context.internal.generateMipmap(texture.target)
		);
	}

	/**
	 * Updates the texels of this texture.
	 * @returns Whether any updates were performed.
	 */
	public update(): boolean {
		// TODO: Optional caching.
		return this.with((texture: this): boolean => {
			let anyDidUpdate = false;
			for (const [target, face] of this.faces) {
				if (face.update(this, target)) {
					anyDidUpdate = true;
				}
			}

			if (
				anyDidUpdate &&
				texture.minFilter != TextureMinFilter.LINEAR &&
				texture.minFilter != TextureMinFilter.NEAREST
			) {
				for (const face of texture.faces.values()) {
					if (!face.isTextureComplete) {
						texture.generateMipmap();
						break;
					}
				}
			}

			return anyDidUpdate;
		});
	}

	/** Sets all of the faces of this texture as outdated. */
	public setAllNeedsUpdate(): void {
		// TODO: Optional caching.
		for (const face of this.faces.values()) {
			face.setAllNeedsUpdate();
		}
	}

	/** Deletes this texture. */
	public delete(): void {
		this.context.internal.deleteTexture(this.internal);
	}
}
