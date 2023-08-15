import type Mip from "#Mip";
import type Texture from "#Texture";
import type MipmapTarget from "#MipmapTarget";

/** A mipmap. */
export default class Mipmap<MipType extends Mip> {
    /**
     * Creates a mipmap.
     * @param mips A map of the mips to their level of detail.
     */
    public constructor(...mips: Array<MipType>) {
        this.mips = mips;
    }

    /** A map of the mips to their level of detail. */
    private readonly mips: Array<MipType>;

    /** The texture of this mipmap. */
    private texturePrivate?: Texture<MipType>;

    /** The texture of this mipmap. */
    public get texture(): Texture<MipType> | undefined {
        return this.texturePrivate;
    }

    /** The target of this mipmap. */
    private targetPrivate?: MipmapTarget;

    /** The target of this mipmap. */
    public get target(): MipmapTarget | undefined {
        return this.targetPrivate;
    }

    /** The top (most detailed) mip in this mipmap. */
    public get top(): MipType {
        return this.getMip(0) as MipType;
    }

    /** The top (most detailed) mip in this mipmap. */
    public set top(value: MipType) {
        this.setMip(0, value);
    }

    /**
     * Gets a mip.
     * @param level The level of the mip.
     * @returns The mip.
     */
    public getMip(level: number): MipType | undefined {
        return this.mips[level];
    }

    /**
     * Sets a mip.
     * @param level The level of the mip.
     * @param mip The mip.
     */
    public setMip(level: number, mip: MipType): void {
        this.mips[level] = mip;
        mip.setNeedsUpdate();
    }

    /** Whether this mipmap is texture complete. */
    public get isTextureComplete(): boolean {
        const baseMip: MipType | undefined = this.getMip(0);
        if (!baseMip) {
            return false;
        }

        const dims: Array<number> = [];
        for (const dim of baseMip.dims) {
            if (typeof dim == "undefined") {
                return false;
            }

            dims.push(dim);
        }

        let lod = 1;
        while (dims.some((dim: number) => dim > 1)) {
            const mip: MipType | undefined = this.getMip(lod);
            if (!mip) {
                return false;
            }

            for (let i = 0; i < dims.length; i++) {
                if (typeof mip.dims[i] == "number" && Math.floor((dims[i] as number) / 2) == mip.dims[i]) {
                    dims[i] = mip.dims[i] as number;
                } else {
                    return false;
                }
            }

            lod++;
        }

        return true;
    }

    /**
     * Updates this mipmap.
     * @param texture The texture of this mipmap.
     * @param target The target of this this mipmap.
     * @returns Whether any updates were performed.
     */
    public update(texture: Texture<MipType>, target: MipmapTarget): boolean {
        let anyDidUpdate = false;
        for (let lod = 0; lod < this.mips.length; lod++) {
            const level: MipType | undefined = this.mips[lod];
            if (level && level.update(texture, target, lod)) {
                anyDidUpdate = true;
            }
        }

        this.texturePrivate = texture;
        this.targetPrivate = target;

        return anyDidUpdate;
    }

    /** Sets all of the mips as outdated. */
    public setAllNeedsUpdate(): void {
        for (const level of this.mips.values()) {
            level.setNeedsUpdate();
        }
    }
}
