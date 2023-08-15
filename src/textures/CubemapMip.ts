import Mip from "#Mip";
import type { MipSource } from "#MipSource";
import TextureInternalFormat from "#TextureInternalFormat";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";
import { UNPACK_ALIGNMENT } from "#constants";

/** A mip of a cubemap. */
export default class CubemapMip extends Mip {
    /**
     * Creates a mip of a cubemap.
     * @param source The pixel source of the mip.
     * @param internalFormat The format of the color components in the mip.
     * @param dim The width and height of the mip.
     */
    public constructor(
        source: MipSource,
        internalFormat: TextureInternalFormat = TextureInternalFormat.RGBA,
        dim?: number,
    ) {
        super(source, internalFormat, [dim]);
    }

    /** The width and height of this mip. */
    public get dim(): number | undefined {
        return this.dims[0];
    }

    /** The width and height of this mip. */
    public set dim(value: number | undefined) {
        this.dims = [value];
    }

    /**
     * Updates this mip.
     * @param texture The texture of this mip.
     * @param target The target of this mip.
     * @param lod The level of detail of this texture face level.
     */
    protected override updateInternal(texture: Texture<CubemapMip>, target: MipmapTarget, lod: number): void {
        if (this.dim) {
            if (!this.unpackAlignment && this.dim > 1) { // Unpack alignment doesn't apply to the last row.
                for (const alignment of [8, 4, 2, 1]) {
                    if (this.dim % alignment == 0) {
                        texture.context.internal.pixelStorei(UNPACK_ALIGNMENT, alignment);
                        break;
                    }
                }
            }

            texture.context.internal.texImage2D(target, lod, this.internalFormat, this.dim, this.dim, 0, this.format, this.type, this.source as ArrayBufferView);
        } else {
            texture.context.internal.texImage2D(target, lod, this.internalFormat, this.format, this.type, this.source as ImageData);
        }
    }
}
