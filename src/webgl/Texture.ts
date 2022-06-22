import { TextureTarget, TextureFormat, TextureDataType, TextureFilter, TextureWrapFunction, TEXTURE0, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, TEXTURE_WRAP_S, TEXTURE_WRAP_T } from "./WebGLConstant.js";

/** An array of data that can be randomly accessed in a shader program. */
export abstract class Texture {
  /**
   * Creates a texture.
   * @param gl The rendering context of the texture.
   * @param target The target binding point of the texture.
   */
  public constructor(gl: WebGL2RenderingContext, target: TextureTarget) {
    this.gl = gl;
    this.target = target;

    const texture: WebGLTexture | null = gl.createTexture();
    if (!texture) { throw new Error("Failed to create a texture."); }
    this.texture = texture;
  }

  /** The rendering context of this texture. */
  public readonly gl: WebGL2RenderingContext;

  /** The target binding point of this texture. */
  public target: TextureTarget;

  /** The WebGL API interface of this texture. */
  public readonly texture: WebGLTexture;

  /** Binds this texture to its target. */
  public bind(): void {
    this.gl.bindTexture(this.target, this.texture);
  }

  /**
   * Updates the texture parameters of this texture.
   * @param textureUnit - The texture unit of this texture in the current shader program.
   */
  public abstract update(textureUnit: number): void;

  /** Generates a mipmap for this texture. */
  public generateMipmap(): void {
    this.gl.generateMipmap(this.target);
  }
}

/** Pixel sources for 2D textures. */
export type Texture2DPixelSource =
  ArrayBufferView
  | ImageData
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | ImageBitmap;

/** A two-dimensional texture. */
export class Texture2D extends Texture {
  /**
   * Creates a two-dimensional texture.
   * @param gl The rendering context of the texture.
   * @param pixels The pixel source for the texture.
   */
  public constructor(gl: WebGL2RenderingContext, pixels: Texture2DPixelSource) {
    super(gl, TextureTarget.TEXTURE_2D);
    this.lod = 0;
    this.internalFormat = TextureFormat.RGBA;
    this.pixels = pixels;
  }

  /** The level of detail of this texture. */
  public lod: number;

  /** The color components in the texture. */
  public internalFormat: TextureFormat;

  /** The data type of the components in the texture. */
  private typePrivate?: TextureDataType;

  /** The data type of the components in the texture. */
  public get type(): TextureDataType {
    if (this.typePrivate) { return this.typePrivate; }

    switch (this.internalFormat) {
      case TextureFormat.RGB:
      case TextureFormat.RGBA:
      case TextureFormat.LUMINANCE_ALPHA:
      case TextureFormat.LUMINANCE:
      case TextureFormat.ALPHA:
      case TextureFormat.R8:
      case TextureFormat.R8UI:
      case TextureFormat.RG8:
      case TextureFormat.RG8UI:
      case TextureFormat.RGB8:
      case TextureFormat.SRGB8:
      case TextureFormat.RGB565:
      case TextureFormat.RGB8UI:
      case TextureFormat.RGBA8:
      case TextureFormat.SRGB8_ALPHA8:
      case TextureFormat.RGB5_A1:
      case TextureFormat.RGBA4:
      case TextureFormat.RGBA8UI:
        return TextureDataType.UNSIGNED_BYTE;
      case TextureFormat.R16F:
      case TextureFormat.R32F:
      case TextureFormat.RG16F:
      case TextureFormat.RG32F:
      case TextureFormat.R11F_G11F_B10F:
      case TextureFormat.RGB9_E5:
      case TextureFormat.RGB16F:
      case TextureFormat.RGB32F:
      case TextureFormat.RGBA16F:
      case TextureFormat.RGBA32F:
        return TextureDataType.FLOAT;
      case TextureFormat.RGB10_A2:
        return TextureDataType.UNSIGNED_INT_2_10_10_10_REV;
      default:
        throw new Error("Unset data type without default for selected format.");
    }
  }

  public set type(value: TextureDataType) {
    this.typePrivate = value;
  }

  /** The format of the texel data. */
  private formatPrivate?: TextureFormat;

  /** The format of the texel data. */
  public get format(): TextureFormat {
    if (this.formatPrivate) { return this.formatPrivate; }

    switch (this.internalFormat) {
      case TextureFormat.RGB:
      case TextureFormat.RGB8:
      case TextureFormat.SRGB8:
      case TextureFormat.RGB565:
      case TextureFormat.R11F_G11F_B10F:
      case TextureFormat.RGB9_E5:
      case TextureFormat.RGB16F:
      case TextureFormat.RGB32F:
        return TextureFormat.RGB;
      case TextureFormat.RGBA:
      case TextureFormat.RGBA8:
      case TextureFormat.SRGB8_ALPHA8:
      case TextureFormat.RGB5_A1:
      case TextureFormat.RGB10_A2:
      case TextureFormat.RGBA4:
      case TextureFormat.RGBA16F:
      case TextureFormat.RGBA32F:
        return TextureFormat.RGBA;
      case TextureFormat.LUMINANCE_ALPHA:
        return TextureFormat.LUMINANCE_ALPHA;
      case TextureFormat.LUMINANCE:
        return TextureFormat.LUMINANCE;
      case TextureFormat.ALPHA:
        return TextureFormat.ALPHA;
      case TextureFormat.R8:
      case TextureFormat.R16F:
      case TextureFormat.R32F:
        return TextureFormat.RED;
      case TextureFormat.R8UI:
        return TextureFormat.RED_INTEGER;
      case TextureFormat.RG8:
      case TextureFormat.RG16F:
      case TextureFormat.RG32F:
        return TextureFormat.RG;
      case TextureFormat.RG8UI:
        return TextureFormat.RG_INTEGER;
      case TextureFormat.RGB8UI:
        return TextureFormat.RGB_INTEGER;
      case TextureFormat.RGBA8UI:
        return TextureFormat.RGBA_INTEGER;
      default:
        return this.internalFormat;
    }
  }

  /** The width of this texture. */
  public width?: number;

  /** The height of this texture. */
  public height?: number;

  /** The pixel source for this texture. */
  public pixels: Texture2DPixelSource;

  /** The magnification filter for this texture. */
  public get magFilter(): TextureFilter {
    this.bind();
    return this.gl.getTexParameter(this.target, TEXTURE_MAG_FILTER);
  }

  public set magFilter(value: TextureFilter) {
    this.bind();
    this.gl.texParameteri(this.target, TEXTURE_MAG_FILTER, value);
  }

  /** The minification filter for this texture. */
  public get minFilter(): TextureFilter {
    this.bind();
    return this.gl.getTexParameter(this.target, TEXTURE_MIN_FILTER);
  }

  public set minFilter(value: TextureFilter) {
    this.bind();
    this.gl.texParameteri(this.target, TEXTURE_MIN_FILTER, value);
  }

  /** The wrapping function for the S coordinate. */
  public get wrapSFunction(): TextureWrapFunction {
    this.bind();
    return this.gl.getTexParameter(this.target, TEXTURE_WRAP_S);
  }

  public set wrapSFunction(value: TextureWrapFunction) {
    this.bind();
    this.gl.texParameteri(this.target, TEXTURE_WRAP_S, value);
  }

  /** The wrapping function for the T coordinate. */
  public get wrapTFunction(): TextureWrapFunction {
    this.bind();
    return this.gl.getTexParameter(this.target, TEXTURE_WRAP_T);
  }

  public set wrapTFunction(value: TextureWrapFunction) {
    this.bind();
    this.gl.texParameteri(this.target, TEXTURE_WRAP_T, value);
  }

  /**
   * Updates the texture parameters of this texture.
   * @param textureUnit The texture unit of this texture in the current shader program.
   */
  public update(textureUnit: number): void {
    this.gl.activeTexture(TEXTURE0 + textureUnit);
    this.bind();

    if (typeof this.width == "number" && typeof this.height == "number") {
      this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.pixels as ArrayBufferView);
    } else {
      this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.format, this.type, this.pixels as ImageData);
    }
  }
}
