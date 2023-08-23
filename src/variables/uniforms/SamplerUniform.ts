import SingleValuedUniform from "#SingleValuedUniform";
import type Program from "#Program";
import type MeasuredIterable from "#MeasuredIterable";
import type Texture from "#Texture";
import type Mip from "#Mip";

/** A sampler global variable in a WebGL shader program. */
export default class SamplerUniform extends SingleValuedUniform {
	/**
	 * Creates a sampler uniform.
	 * @param program The shader program that this uniform belongs to.
	 * @param index The index of this uniform.
	 * @param textureUnit The texture unit to use.
	 */
	public constructor(program: Program, index: number, textureUnit: number) {
		super(program, index);
		this.textureUnit = textureUnit;
	}

	/** The texture unit of this uniform. */
	public readonly textureUnit: number;

	/** The setter method for this uniform if the value is an array. */
	public arraySetter(value: MeasuredIterable<Texture<Mip>>): void {
		// TODO: Optional caching.
		const textureUnits: Int32Array = new Int32Array(value.length);
		for (let i = 0; i < value.length; i++) {
			textureUnits[i] = this.textureUnit + i;
		}
		for (let i = 0; i < value.length; i++) {
			(value[i] as Texture<Mip>).update();
			(value[i] as Texture<Mip>).assign(textureUnits[i] as number);
		}
		this.context.internal.uniform1iv(
			this.location,
			textureUnits,
			this.sourceOffset,
			this.sourceLength
		);
	}

	/** The setter method for this uniform. */
	public setter(value: Texture<Mip>): void {
		// TODO: Optional caching.
		this.context.internal.uniform1i(this.location, this.textureUnit);
		value.assign(this.textureUnit);
		value.update();
	}

	/** The value of this uniform. */
	public override get value(): Texture<Mip> | MeasuredIterable<Texture<Mip>> {
		// TODO: Optional caching.
		return this.valuePrivate as Texture<Mip> | MeasuredIterable<Texture<Mip>>;
	}

	/** The value of this uniform. */
	public override set value(
		value: Texture<Mip> | MeasuredIterable<Texture<Mip>>
	) {
		// TODO: Optional caching.
		if (typeof value != "number" && "length" in value) {
			this.arraySetter(value);
		} else {
			this.setter(value);
		}

		this.valuePrivate = value;
	}
}
